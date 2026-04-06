import { JourneyType } from '@ve_xe_nhanh_ts/shared-types';

// ─── Tầng 1: Kết quả tìm StopPoint gần nhất ────────────────────────

export interface NearbyStopResult {
  readonly stopPointId: string;
  readonly name: string;
  readonly address: string;
  readonly city: string;
  readonly type: string;

  /** Khoảng cách đường chim bay (km) */
  readonly straightLineKm: number;

  /** Khoảng cách đường bộ thực tế (km) — null nếu OSRM không khả dụng */
  readonly roadDistanceKm: number | null;

  /** Thời gian lái xe đến (phút) — null nếu OSRM không khả dụng */
  readonly roadDurationMinutes: number | null;

  readonly coordinates: { readonly lat: number; readonly lng: number };

  /** Điểm đón trung chuyển gần khách nhất (nếu có) */
  readonly transitPickup?: TransitPickupInfo;
}

export interface TransitPickupInfo {
  readonly pickupPointName: string;
  readonly pickupPointAddress: string;
  readonly pickupCoordinates: { readonly lat: number; readonly lng: number };

  /** Khoảng cách đường bộ từ khách đến điểm đón trung chuyển (km) */
  readonly distanceToPickupKm: number | null;

  /** Thời gian từ khách đến điểm đón (phút) */
  readonly durationToPickupMinutes: number | null;

  /** Route IDs hỗ trợ trung chuyển tại điểm này */
  readonly routeIds: readonly string[];
}

// ─── Tầng 2+3: Kết quả 1 chặng (segment) ───────────────────────────

export interface SearchSegment {
  readonly tripId: string;
  readonly routeId: string;
  readonly operatorId: string;
  readonly operatorName: string;
  readonly busType: string;
  readonly busNumber: string;

  readonly pickupPointId: string;
  readonly pickupPointName: string;
  readonly dropoffPointId: string;
  readonly dropoffPointName: string;

  readonly departureTime: Date;
  readonly arrivalTime: Date;

  readonly price: number;
  readonly availableSeats: number;

  /** true nếu đây là sub-route (cắt chặng), false nếu là toàn tuyến */
  readonly isSubRoute: boolean;
}

// ─── Kết quả đầy đủ 1 hành trình ────────────────────────────────────

export interface SearchItinerary {
  readonly journeyType: JourneyType;
  readonly segments: readonly SearchSegment[];

  readonly totalPrice: number;
  readonly totalDurationMinutes: number;
  readonly transferCount: number;

  /** Thông báo trung chuyển / đổi xe nếu có */
  readonly transitNote?: string;

  /** Thời gian chờ đổi xe tại Hub (phút) */
  readonly transferWaitMinutes?: number;

  /** Thông tin trung chuyển đưa đón (WITH_TRANSIT) */
  readonly transitInfo?: {
    readonly pickupPointName: string;
    readonly pickupCoordinates: { readonly lat: number; readonly lng: number };
    readonly hubStopPointId: string;
    readonly hubStopPointName: string;
  };
}

// ─── Response trả về cho Frontend ────────────────────────────────────

export interface SearchResponse {
  readonly directTrips: readonly SearchItinerary[];
  readonly transferTrips: readonly SearchItinerary[];
  readonly totalResults: number;
}
