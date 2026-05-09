import { IStopPoint } from './stop-point.types.js';
import { RouteStopRole } from './enums.js';

/**
 * Unified RouteStop — đại diện cho MỌI điểm trên tuyến.
 * name/address/coordinates lấy từ StopPoint qua populate — không lưu trùng.
 */
export interface IRouteStop {
  _id?: string;
  stopPointId: string | IStopPoint; // BẮT BUỘC — ref StopPoint (populate để lấy name, address, coordinates)
  role: RouteStopRole;
  order: number; // 0 = origin, N = destination
  estimatedArrivalMinutes: number; // Phút từ lúc khởi hành
  stopDuration: number; // Thời gian dừng (phút)
  transitPickupIds?: (string | IStopPoint)[]; // Điểm đón trung chuyển phục vụ stop này
  transitDropoffIds?: (string | IStopPoint)[]; // Điểm trả trung chuyển phục vụ stop này
}

export interface IRoute {
  id: string;
  operatorId: string;

  routeName: string;
  routeCode: string; // VD: PT-SGN-DL

  stops: IRouteStop[]; // Tất cả điểm trên tuyến (origin + stops + destination)

  distance: number; // Km
  estimatedDuration: number; // Phút

  isActive: boolean;

  createdAt: string;
  updatedAt: string;

  // Virtuals
  routeDescription?: string;
  estimatedDurationHours?: string | number;
}
