import {
  resolveId,
  resolveField,
} from '@common/interfaces/ref-info.interface';
import { TripDocument } from '../schemas/trip.schema';
import {
  TripListResponse,
  TripDetailResponse,
  TripRouteResponse,
  TripRouteStopResponse,
} from '../interfaces/trip-response.interface';

/**
 * Map populated TripDocument → clean response DTO.
 *
 * Yêu cầu trip đã được populate:
 *   .populate('routeId', 'routeName routeCode stops')
 *   .populate('operatorId', 'companyName')
 *   .populate('busId', 'busNumber busType')
 *   (+ 'seatLayout' cho detail)
 *
 * Sau populate, routeId.stops[].stopPointId vẫn là ObjectId (chưa populate sâu).
 * → cần populate path riêng: .populate('routeId.stops.stopPointId') — KHÔNG khả thi
 *   với Mongoose. Thay vào đó, service sẽ populate riêng route → stops.
 *   Hoặc nếu stops chưa populate, mapper trả id = objectId string, name = ''.
 */
export class TripMapper {
  static toList(doc: TripDocument): TripListResponse {
    const routeDoc = doc.routeId as unknown as Record<string, unknown>;
    const operatorDoc = doc.operatorId as unknown as Record<string, unknown>;
    const busDoc = doc.busId as unknown as Record<string, unknown>;

    return {
      id: String(doc._id),
      route: this.mapRoute(routeDoc),
      operator: {
        id: resolveId(doc.operatorId),
        name: resolveField<string>(operatorDoc, 'companyName') ?? 'N/A',
      },
      bus: {
        id: resolveId(doc.busId),
        type: resolveField<string>(busDoc, 'busType') ?? 'N/A',
        number: resolveField<string>(busDoc, 'busNumber') ?? 'N/A',
      },
      crew: (doc.crew ?? []).map(String),
      departureTime: doc.departureTime,
      arrivalTime: doc.arrivalTime,
      pricing: {
        basePrice: doc.basePrice,
        discount: doc.discount,
        finalPrice: doc.finalPrice,
      },
      capacity: {
        totalSeats: doc.totalSeats,
        availableSeats: doc.availableSeats,
      },
      status: doc.status,
      notes: doc.notes,
    };
  }

  static toDetail(doc: TripDocument): TripDetailResponse {
    const busDoc = doc.busId as unknown as Record<string, unknown>;
    const seatLayout = resolveField<Record<string, unknown>>(
      busDoc,
      'seatLayout',
    );

    return {
      ...this.toList(doc),
      bookedSeats: (doc.bookedSeats ?? []).map((s) => ({
        seatNumber: s.seatNumber,
        passengerName: s.passengerName,
      })),
      seatLayout: seatLayout
        ? {
            floors: seatLayout.floors as number,
            rows: seatLayout.rows as number,
            columns: seatLayout.columns as number,
            layout: seatLayout.layout as string[][],
            totalSeats: seatLayout.totalSeats as number,
          }
        : undefined,
    };
  }

  private static mapRoute(
    routeDoc: Record<string, unknown>,
  ): TripRouteResponse {
    if (!routeDoc || !('_id' in routeDoc)) {
      return { id: String(routeDoc), routeName: '', routeCode: '', stops: [] };
    }

    const stops = (routeDoc.stops as unknown[]) ?? [];

    return {
      id: String(routeDoc._id),
      routeName: (routeDoc.routeName as string) ?? '',
      routeCode: (routeDoc.routeCode as string) ?? '',
      stops: stops.map((s) => this.mapRouteStop(s as Record<string, unknown>)),
    };
  }

  private static mapRouteStop(
    stop: Record<string, unknown>,
  ): TripRouteStopResponse {
    return {
      stopPoint: {
        id: resolveId(stop.stopPointId),
        name: resolveField<string>(stop.stopPointId as unknown, 'name') ?? '',
      },
      role: (stop.role as string) ?? '',
      order: (stop.order as number) ?? 0,
      estimatedArrivalMinutes: (stop.estimatedArrivalMinutes as number) ?? 0,
      stopDuration: (stop.stopDuration as number) ?? 0,
    };
  }
}
