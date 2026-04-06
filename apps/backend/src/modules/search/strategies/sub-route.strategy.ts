import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Route,
  RouteDocument,
  RouteStop,
} from '../../routes/schemas/route.schema';
import { Trip, TripDocument } from '../../trips/schemas/trip.schema';
import {
  Booking,
  BookingDocument,
} from '../../bookings/schemas/booking.schema';
import {
  TripStatus,
  BookingStatus,
  RouteStopRole,
} from '@ve_xe_nhanh_ts/shared-types';
import { SearchSegment } from '../interfaces/search-result.interface';

/**
 * Thông tin vị trí của 1 StopPoint trong 1 Route.
 * Dùng để tính departure/arrival time và giá cho sub-route.
 */
interface StopPosition {
  order: number;
  arrivalMinutes: number;
  name: string;
}

/**
 * Route hợp lệ cho cặp origin-destination, kèm thông tin sub-route.
 */
interface ValidRoute {
  route: RouteDocument;
  originPos: StopPosition;
  destPos: StopPosition;
  durationRatio: number;
  isExactMatch: boolean;
}

/**
 * Tầng 2: Sub-route Matcher (Cắt chặng nội tuyến)
 *
 * Tìm các chuyến xe "đi ngang qua" cả điểm đi lẫn điểm đến của khách,
 * kể cả khi tuyến chính dài hơn yêu cầu.
 *
 * Unified model: origin, stops, destination đều nằm trong mảng stops[]
 * với role field phân biệt. Chỉ cần 1 query duy nhất.
 */
@Injectable()
export class SubRouteStrategy {
  constructor(
    @InjectModel(Route.name) private routeModel: Model<RouteDocument>,
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  /**
   * Tìm tất cả chuyến xe (trực tiếp + sub-route) cho cặp origin-destination.
   */
  async findDirectAndSubRoutes(
    originId: string,
    destinationId: string,
    date: string,
    minSeats: number = 1,
  ): Promise<readonly SearchSegment[]> {
    const validRoutes = await this.findMatchingRoutes(originId, destinationId);
    if (validRoutes.length === 0) return [];

    // Tìm Trips trong ngày
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const routeIds = validRoutes.map((vr) => vr.route._id);

    const trips = await this.tripModel
      .find({
        routeId: { $in: routeIds },
        departureTime: { $gte: startOfDay, $lte: endOfDay },
        status: TripStatus.SCHEDULED,
      })
      .populate('operatorId', 'businessName')
      .populate('busId', 'busNumber busType')
      .exec();

    if (trips.length === 0) return [];

    // Map thành SearchSegment
    const segments: SearchSegment[] = [];
    const routeMap = new Map(
      validRoutes.map((vr) => [String(vr.route._id), vr]),
    );

    for (const trip of trips) {
      const vr = routeMap.get(String(trip.routeId));
      if (!vr) continue;

      const segDeparture = new Date(
        trip.departureTime.getTime() + vr.originPos.arrivalMinutes * 60_000,
      );
      const segArrival = new Date(
        trip.departureTime.getTime() + vr.destPos.arrivalMinutes * 60_000,
      );

      const price = Math.round(trip.finalPrice * vr.durationRatio);

      const available = await this.getSegmentAvailableSeats(
        trip,
        vr.originPos.order,
        vr.destPos.order,
        minSeats,
      );
      if (available < minSeats) continue;

      const operator = trip.operatorId as unknown as { businessName?: string };
      const bus = trip.busId as unknown as {
        busNumber?: string;
        busType?: string;
      };

      segments.push({
        tripId: String(trip._id),
        routeId: String(trip.routeId),
        operatorId: String(trip.operatorId),
        operatorName: operator?.businessName ?? 'N/A',
        busType: bus?.busType ?? 'N/A',
        busNumber: bus?.busNumber ?? 'N/A',
        pickupPointId: originId,
        pickupPointName: vr.originPos.name,
        dropoffPointId: destinationId,
        dropoffPointName: vr.destPos.name,
        departureTime: segDeparture,
        arrivalTime: segArrival,
        price,
        availableSeats: available,
        isSubRoute: !vr.isExactMatch,
      });
    }

    return segments;
  }

  // ─── Private methods ───────────────────────────────────────────────

  /**
   * Tìm Routes chứa CẢ originId VÀ destinationId trong stops[],
   * đảm bảo thứ tự (origin phải đứng trước destination).
   */
  private async findMatchingRoutes(
    originId: string,
    destinationId: string,
  ): Promise<readonly ValidRoute[]> {
    const oid = new Types.ObjectId(originId);
    const did = new Types.ObjectId(destinationId);

    // Unified query: cả origin/destination/stops đều nằm trong stops[]
    const routes = await this.routeModel
      .find({
        isActive: true,
        'stops.stopPointId': { $all: [oid, did] },
      })
      .exec();

    const results: ValidRoute[] = [];

    for (const route of routes) {
      const originPos = this.findStopPosition(route, originId);
      const destPos = this.findStopPosition(route, destinationId);

      if (!originPos || !destPos) continue;
      if (originPos.order >= destPos.order) continue;

      const segmentDuration = destPos.arrivalMinutes - originPos.arrivalMinutes;
      const totalDuration = route.estimatedDuration;
      const durationRatio =
        totalDuration > 0 ? segmentDuration / totalDuration : 1;

      // Exact match: origin là role=origin VÀ destination là role=destination
      const originStop = route.stops.find(
        (s: RouteStop) => s.stopPointId?.toString() === originId,
      );
      const destStop = route.stops.find(
        (s: RouteStop) => s.stopPointId?.toString() === destinationId,
      );
      const isExactMatch =
        originStop?.role === RouteStopRole.ORIGIN &&
        destStop?.role === RouteStopRole.DESTINATION;

      results.push({ route, originPos, destPos, durationRatio, isExactMatch });
    }

    return results;
  }

  /**
   * Tìm vị trí (order + arrivalMinutes) của 1 StopPoint ID trong Route.
   * Unified: chỉ cần 1 lookup trong stops[] (bao gồm origin/destination).
   */
  private findStopPosition(
    route: RouteDocument,
    stopPointId: string,
  ): StopPosition | null {
    const stop = route.stops.find(
      (s: RouteStop) =>
        s.stopPointId && s.stopPointId.toString() === stopPointId,
    );
    if (!stop) return null;

    return {
      order: stop.order,
      arrivalMinutes: stop.estimatedArrivalMinutes,
      name: stop.name,
    };
  }

  /**
   * Tính ghế trống thực tế cho 1 đoạn sub-route trên 1 Trip.
   *
   * Ghế bị chiếm nếu booking có pickup order < destOrder
   * VÀ dropoff order > originOrder (2 đoạn overlap trên trục order).
   */
  private async getSegmentAvailableSeats(
    trip: TripDocument,
    originOrder: number,
    destOrder: number,
    _minSeats: number,
  ): Promise<number> {
    const bookings = await this.bookingModel
      .find({
        'tickets.tripId': trip._id,
        status: { $nin: [BookingStatus.CANCELLED, BookingStatus.EXPIRED] },
      })
      .exec();

    if (bookings.length === 0) return trip.totalSeats;

    const route = await this.routeModel.findById(trip.routeId).exec();
    if (!route) return trip.availableSeats;

    const occupiedSeats = new Set<string>();

    for (const booking of bookings) {
      for (const ticket of booking.tickets) {
        if (String(ticket.tripId) !== String(trip._id)) continue;

        const pickupPos = this.findStopPosition(
          route,
          String(ticket.pickupPointId),
        );
        const dropoffPos = this.findStopPosition(
          route,
          String(ticket.dropoffPointId),
        );

        if (!pickupPos || !dropoffPos) {
          occupiedSeats.add(ticket.seatNumber);
          continue;
        }

        // Overlap: [A, B) và [C, D) overlap khi A < D và C < B
        if (pickupPos.order < destOrder && dropoffPos.order > originOrder) {
          occupiedSeats.add(ticket.seatNumber);
        }
      }
    }

    return trip.totalSeats - occupiedSeats.size;
  }
}
