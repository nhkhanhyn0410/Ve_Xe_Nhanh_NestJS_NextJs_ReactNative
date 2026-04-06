import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  StopPoint,
  StopPointDocument,
} from '../../stop-points/schemas/stop-point.schema';
import { Route, RouteDocument } from '../../routes/schemas/route.schema';
import { StopPointType, JourneyType } from '@ve_xe_nhanh_ts/shared-types';
import { SearchItinerary } from '../interfaces/search-result.interface';
import { SubRouteStrategy } from './sub-route.strategy';

/** Thời gian chờ tối thiểu giữa 2 chuyến khi đổi xe (phút) */
const MIN_TRANSFER_BUFFER_MINUTES = 90;
/** Thời gian chờ tối đa (nếu chờ quá lâu thì không hợp lý) */
const MAX_TRANSFER_WAIT_MINUTES = 480; // 8 tiếng
/** Giới hạn kết quả */
const MAX_TRANSFER_RESULTS = 10;

/**
 * Tầng 3: Cross-Operator Transfer Matcher
 *
 * Tìm các tổ hợp 2 chuyến xe khác nhau để đưa khách từ A đến C
 * thông qua 1 Hub trung gian B (Bến Xe lớn).
 *
 * Unified model: tất cả stops (origin/stop/destination) nằm trong stops[].
 * Query chỉ cần check stops.stopPointId.
 */
@Injectable()
export class TransferMatchStrategy {
  constructor(
    @InjectModel(StopPoint.name)
    private stopPointModel: Model<StopPointDocument>,
    @InjectModel(Route.name) private routeModel: Model<RouteDocument>,
    private readonly subRoute: SubRouteStrategy,
  ) {}

  /**
   * Tìm các hành trình nối chuyến (Transfer) qua Hub trung gian.
   */
  async findTransferRoutes(
    originId: string,
    destinationId: string,
    date: string,
    minSeats: number = 1,
  ): Promise<readonly SearchItinerary[]> {
    const hubIds = await this.findPotentialHubs(originId, destinationId);
    if (hubIds.length === 0) return [];

    const hubs = await this.stopPointModel
      .find({ _id: { $in: hubIds.map((id) => new Types.ObjectId(id)) } })
      .exec();
    const hubMap = new Map(hubs.map((h) => [String(h._id), h]));

    const results: SearchItinerary[] = [];

    const hubSearches = hubIds.map(async (hubId) => {
      const [firstLegSegments, secondLegSegments] = await Promise.all([
        this.subRoute.findDirectAndSubRoutes(originId, hubId, date, minSeats),
        this.subRoute.findDirectAndSubRoutes(
          hubId,
          destinationId,
          date,
          minSeats,
        ),
      ]);

      if (firstLegSegments.length === 0 || secondLegSegments.length === 0)
        return [];

      const hub = hubMap.get(hubId);
      const hubName = hub?.name ?? 'Hub';

      const pairs: SearchItinerary[] = [];

      for (const seg1 of firstLegSegments) {
        for (const seg2 of secondLegSegments) {
          const waitMinutes =
            (seg2.departureTime.getTime() - seg1.arrivalTime.getTime()) /
            60_000;

          if (waitMinutes < MIN_TRANSFER_BUFFER_MINUTES) continue;
          if (waitMinutes > MAX_TRANSFER_WAIT_MINUTES) continue;

          const totalDuration =
            (seg2.arrivalTime.getTime() - seg1.departureTime.getTime()) /
            60_000;
          const isSameOperator = seg1.operatorId === seg2.operatorId;

          pairs.push({
            journeyType: JourneyType.TRANSFER,
            segments: [seg1, seg2],
            totalPrice: seg1.price + seg2.price,
            totalDurationMinutes: Math.round(totalDuration),
            transferCount: 1,
            transferWaitMinutes: Math.round(waitMinutes),
            transitNote: isSameOperator
              ? `Đổi xe tại ${hubName}. Cùng nhà xe ${seg1.operatorName}.`
              : `Đổi xe tại ${hubName}. Quý khách tự di chuyển hành lý giữa 2 nhà xe khác nhau.`,
          });
        }
      }

      return pairs;
    });

    const allPairs = await Promise.all(hubSearches);
    for (const pairs of allPairs) {
      results.push(...pairs);
    }

    results.sort((a, b) => a.totalDurationMinutes - b.totalDurationMinutes);
    return results.slice(0, MAX_TRANSFER_RESULTS);
  }

  // ─── Private ─────────────────────────────────────────────────────

  /**
   * Tìm Hub tiềm năng bằng set intersection.
   * Unified: chỉ query stops.stopPointId (bao gồm origin/destination).
   */
  private async findPotentialHubs(
    originId: string,
    destinationId: string,
  ): Promise<readonly string[]> {
    const oid = new Types.ObjectId(originId);
    const did = new Types.ObjectId(destinationId);

    // Routes chứa originId trong stops[]
    const [originRoutes, destRoutes] = await Promise.all([
      this.routeModel
        .find({ isActive: true, 'stops.stopPointId': oid })
        .select('stops.stopPointId')
        .exec(),
      this.routeModel
        .find({ isActive: true, 'stops.stopPointId': did })
        .select('stops.stopPointId')
        .exec(),
    ]);

    // Thu thập StopPoint IDs mà origin có thể đến được
    const reachableFromOrigin = new Set<string>();
    for (const route of originRoutes) {
      for (const stop of route.stops) {
        if (stop.stopPointId)
          reachableFromOrigin.add(stop.stopPointId.toString());
      }
    }

    // Thu thập StopPoint IDs mà có thể đến destination
    const canReachDest = new Set<string>();
    for (const route of destRoutes) {
      for (const stop of route.stops) {
        if (stop.stopPointId) canReachDest.add(stop.stopPointId.toString());
      }
    }

    // Giao 2 tập → Hub tiềm năng
    const hubCandidates: string[] = [];
    for (const id of reachableFromOrigin) {
      if (canReachDest.has(id) && id !== originId && id !== destinationId) {
        hubCandidates.push(id);
      }
    }

    if (hubCandidates.length === 0) return [];

    // Chỉ giữ lại STATION (bến xe lớn)
    const stations = await this.stopPointModel
      .find({
        _id: { $in: hubCandidates.map((id) => new Types.ObjectId(id)) },
        type: StopPointType.STATION,
        isActive: true,
      })
      .select('_id')
      .exec();

    return stations.map((s) => String(s._id));
  }
}
