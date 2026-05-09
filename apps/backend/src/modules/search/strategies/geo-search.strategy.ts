import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  StopPoint,
  StopPointDocument,
} from '../../stop-points/schemas/stop-point.schema';
import { Route, RouteDocument } from '../../routes/schemas/route.schema';
import { OsrmService } from '../../osrm/osrm.service';
import { OsrmCoordinate } from '../../osrm/osrm.interfaces';
import {
  NearbyStopResult,
  TransitPickupInfo,
} from '../interfaces/search-result.interface';

/**
 * Tầng 1: Geospatial Nearest-Stop + OSRM Road Distance
 *
 * Luồng xử lý:
 * 1. MongoDB `$geoNear` → lọc nhanh ứng viên bằng đường chim bay.
 * 2. OSRM `/table`      → tính khoảng cách/thời gian đường bộ thực tế cho batch.
 * 3. Lọc lại + sort theo road distance.
 * 4. Với mỗi StopPoint, kiểm tra Route nào có transitPickupIds gần khách
 *    → gợi ý điểm đón trung chuyển (transit pickup).
 *
 * FIX Bài toán 11: transitPickupIds gắn trực tiếp vào từng stop trong Route,
 * không còn dùng mảng pickupPoints phẳng.
 */
@Injectable()
export class GeoSearchStrategy {
  constructor(
    @InjectModel(StopPoint.name)
    private stopPointModel: Model<StopPointDocument>,
    @InjectModel(Route.name) private routeModel: Model<RouteDocument>,
    private readonly osrm: OsrmService,
  ) {}

  async findNearbyStops(
    lat: number,
    lng: number,
    radiusKm: number = 10,
    limit: number = 5,
  ): Promise<readonly NearbyStopResult[]> {
    const customerCoord: OsrmCoordinate = { lat, lng };

    // ── Bước 1: $geoNear lấy ứng viên (radius × 1.5 vì đường bộ luôn dài hơn đường chim bay)
    const candidateRadius = radiusKm * 1.5 * 1000; // meters
    const candidateLimit = limit * 3;

    const candidates = await this.stopPointModel
      .aggregate<{
        _id: unknown;
        name: string;
        address: string;
        wardName: string;
        provinceName: string;
        type: string;
        coordinates: { lat: number; lng: number };
        distanceMeters: number;
      }>([
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [lng, lat] },
            distanceField: 'distanceMeters',
            maxDistance: candidateRadius,
            spherical: true,
            query: { isActive: true },
          },
        },
        { $limit: candidateLimit },
        {
          $project: {
            name: 1,
            address: 1,
            wardName: 1,
            provinceName: 1,
            type: 1,
            coordinates: 1,
            distanceMeters: 1,
          },
        },
      ])
      .exec();

    if (candidates.length === 0) return [];

    // ── Bước 2: OSRM distance matrix (1 source → N destinations)
    const destinations: OsrmCoordinate[] = candidates.map((c) => ({
      lat: c.coordinates.lat,
      lng: c.coordinates.lng,
    }));

    const matrix = await this.osrm.getDistanceMatrix(
      [customerCoord],
      destinations,
    );

    // ── Bước 3: Merge kết quả, sort theo road distance
    const merged = candidates.map((c, i) => {
      const straightLineKm = Math.round((c.distanceMeters / 1000) * 100) / 100;

      const roadEntry = matrix?.[0]?.[i];
      const roadDistanceKm =
        roadEntry?.distanceMeters != null
          ? Math.round((roadEntry.distanceMeters / 1000) * 100) / 100
          : null;
      const roadDurationMinutes =
        roadEntry?.durationSeconds != null
          ? Math.round((roadEntry.durationSeconds / 60) * 10) / 10
          : null;

      return {
        stopPointId: String(c._id),
        name: c.name,
        address: c.address,
        wardName: c.wardName,
        provinceName: c.provinceName,
        type: c.type,
        straightLineKm,
        roadDistanceKm,
        roadDurationMinutes,
        coordinates: c.coordinates,
      };
    });

    // Lọc theo road distance thực tế (hoặc đường chim bay nếu OSRM không có)
    const filtered = merged.filter((r) => {
      const effectiveKm = r.roadDistanceKm ?? r.straightLineKm;
      return effectiveKm <= radiusKm;
    });

    // Sort: ưu tiên road distance, fallback straight-line
    filtered.sort((a, b) => {
      const da = a.roadDistanceKm ?? a.straightLineKm;
      const db = b.roadDistanceKm ?? b.straightLineKm;
      return da - db;
    });

    const topResults = filtered.slice(0, limit);

    // ── Bước 4: Tìm điểm đón trung chuyển cho mỗi StopPoint
    const stopPointIds = topResults.map((r) => r.stopPointId);
    const transitMap = await this.findTransitPickups(
      customerCoord,
      stopPointIds,
    );

    return topResults.map((r) => ({
      ...r,
      transitPickup: transitMap.get(r.stopPointId) ?? undefined,
    }));
  }

  /**
   * Tìm điểm đón trung chuyển (transitPickupIds) gần khách hàng
   * cho từng StopPoint.
   *
   * Unified model: mỗi stop trong Route có transitPickupIds[] gắn trực tiếp.
   * Không còn giới hạn chỉ cho origin — BẤT KỲ stop nào có transit đều được xét.
   */
  private async findTransitPickups(
    customer: OsrmCoordinate,
    stopPointIds: readonly string[],
  ): Promise<Map<string, TransitPickupInfo>> {
    const result = new Map<string, TransitPickupInfo>();

    // Tìm Routes có stops match với stopPointIds VÀ stops đó có transitPickupIds
    const routes = await this.routeModel
      .find({
        isActive: true,
        stops: {
          $elemMatch: {
            stopPointId: {
              $in: stopPointIds.map((id) => new Types.ObjectId(id)),
            },
            'transitPickupIds.0': { $exists: true },
          },
        },
      })
      .exec();

    if (routes.length === 0) return result;

    // Thu thập tất cả transitPickup StopPoint IDs cần lookup
    const allPickupIds = new Set<string>();
    interface PickupCandidate {
      pickupStopPointId: string;
      forStopPointId: string;
      routeId: string;
    }
    const pickupCandidates: PickupCandidate[] = [];

    for (const route of routes) {
      const routeId = String(route._id);

      for (const stop of route.stops) {
        const stopId = stop.stopPointId?.toString();
        if (!stopId || !stopPointIds.includes(stopId)) continue;
        if (!stop.transitPickupIds || stop.transitPickupIds.length === 0)
          continue;

        for (const pickupId of stop.transitPickupIds) {
          const pid = pickupId.toString();
          allPickupIds.add(pid);
          pickupCandidates.push({
            pickupStopPointId: pid,
            forStopPointId: stopId,
            routeId,
          });
        }
      }
    }

    if (pickupCandidates.length === 0) return result;

    // Batch lookup StopPoint documents cho tất cả pickup points
    const pickupStopPoints = await this.stopPointModel
      .find({
        _id: {
          $in: Array.from(allPickupIds).map((id) => new Types.ObjectId(id)),
        },
        isActive: true,
      })
      .exec();

    const pickupMap = new Map(
      pickupStopPoints.map((sp) => [String(sp._id), sp]),
    );

    // OSRM matrix: 1 customer → N pickupPoints
    const validCandidates = pickupCandidates.filter((pc) =>
      pickupMap.has(pc.pickupStopPointId),
    );

    if (validCandidates.length === 0) return result;

    const ppCoords: OsrmCoordinate[] = validCandidates.map((pc) => {
      const sp = pickupMap.get(pc.pickupStopPointId)!;
      return { lat: sp.coordinates.lat, lng: sp.coordinates.lng };
    });

    const matrix = await this.osrm.getDistanceMatrix([customer], ppCoords);

    // Tìm pickupPoint gần nhất cho mỗi StopPoint
    const bestPerStop = new Map<
      string,
      {
        candidate: PickupCandidate;
        stopPoint: StopPointDocument;
        distKm: number;
        durMin: number;
        routeIds: string[];
      }
    >();

    for (let i = 0; i < validCandidates.length; i++) {
      const pc = validCandidates[i];
      const sp = pickupMap.get(pc.pickupStopPointId)!;
      const entry = matrix?.[0]?.[i];

      const distKm =
        entry?.distanceMeters != null
          ? entry.distanceMeters / 1000
          : OsrmService.haversineKm(customer, ppCoords[i]);
      const durMin =
        entry?.durationSeconds != null
          ? entry.durationSeconds / 60
          : distKm * 2; // ~30km/h fallback

      const existing = bestPerStop.get(pc.forStopPointId);
      if (!existing || distKm < existing.distKm) {
        bestPerStop.set(pc.forStopPointId, {
          candidate: pc,
          stopPoint: sp,
          distKm,
          durMin,
          routeIds: [pc.routeId],
        });
      } else if (
        existing &&
        Math.abs(distKm - existing.distKm) < 0.1 &&
        !existing.routeIds.includes(pc.routeId)
      ) {
        existing.routeIds.push(pc.routeId);
      }
    }

    for (const [stopId, best] of bestPerStop) {
      result.set(stopId, {
        pickupPointName: best.stopPoint.name,
        pickupPointAddress: best.stopPoint.address ?? '',
        pickupCoordinates: best.stopPoint.coordinates,
        distanceToPickupKm: Math.round(best.distKm * 100) / 100,
        durationToPickupMinutes: Math.round(best.durMin * 10) / 10,
        routeIds: best.routeIds,
      });
    }

    return result;
  }
}
