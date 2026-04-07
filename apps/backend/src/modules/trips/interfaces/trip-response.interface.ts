import { RefInfo, BusInfo } from '@common/interfaces/ref-info.interface';
import { TripStatus } from '@ve_xe_nhanh_ts/shared-types';

/**
 * Stop gọn trong response — chỉ giữ thông tin cần thiết cho UI.
 */
export interface TripRouteStopResponse {
  readonly stopPoint: RefInfo;
  readonly role: string;
  readonly order: number;
  readonly estimatedArrivalMinutes: number;
  readonly stopDuration: number;
}

/**
 * Route gọn trong response — không trả toàn bộ Route document.
 */
export interface TripRouteResponse {
  readonly id: string;
  readonly routeName: string;
  readonly routeCode: string;
  readonly stops: readonly TripRouteStopResponse[];
}

/**
 * Response cho danh sách chuyến xe (GET /trips).
 * Dùng cho operator/admin quản lý.
 */
export interface TripListResponse {
  readonly id: string;
  readonly route: TripRouteResponse;
  readonly operator: RefInfo;
  /** null khi chuyến ở trạng thái DRAFT (chưa gắn xe) */
  readonly bus: BusInfo | null;
  readonly crew: readonly string[];

  readonly departureTime: Date;
  readonly arrivalTime: Date;

  readonly pricing: {
    readonly basePrice: number;
    readonly discount: number;
    readonly finalPrice: number;
  };

  /** null khi chuyến ở trạng thái DRAFT (chưa gắn xe) */
  readonly capacity: {
    readonly totalSeats: number;
    readonly availableSeats: number;
  } | null;

  readonly status: TripStatus;
  readonly notes?: string;
}

/**
 * Response chi tiết chuyến xe (GET /trips/:id).
 * Thêm bookedSeats + seatLayout cho sơ đồ ghế.
 */
export interface TripDetailResponse extends TripListResponse {
  readonly bookedSeats: readonly {
    readonly seatNumber: string;
    readonly passengerName: string;
  }[];
  readonly seatLayout?: {
    readonly floors: number;
    readonly rows: number;
    readonly columns: number;
    readonly layout: readonly string[][];
    readonly totalSeats: number;
  };
}
