import { StopPointType, type IStopPoint } from '@ve_xe_nhanh_ts/shared-types';

export interface NestListMeta {
  total: number;
  page: number;
  limit: number;
}

export interface NestListResponse<T> {
  data: T[];
  meta: NestListMeta;
  message: string;
}

export const stopPointTypeLabels: Record<StopPointType, string> = {
  [StopPointType.STATION]: 'Bến xe',
  [StopPointType.POINT]: 'Điểm đón/trả',
  [StopPointType.REST_STOP]: 'Trạm dừng chân',
  [StopPointType.PICKUP]: 'Điểm đón trung chuyển',
  [StopPointType.DROPOFF]: 'Điểm trả trung chuyển',
};

export const stopPointTypeDescriptions: Record<StopPointType, string> = {
  [StopPointType.STATION]: 'Điểm đầu cuối hoặc bến trung tâm trên tuyến.',
  [StopPointType.POINT]: 'Điểm đón trả dọc đường hoặc văn phòng phụ.',
  [StopPointType.REST_STOP]: 'Điểm dừng kỹ thuật cho tài xế và hành khách.',
  [StopPointType.PICKUP]: 'Điểm gom khách bằng xe trung chuyển.',
  [StopPointType.DROPOFF]: 'Điểm trả khách bằng xe trung chuyển.',
};

const mockStopPoints: IStopPoint[] = [
  {
    id: 'sp-station-001',
    name: 'Bến xe Miền Đông mới',
    type: StopPointType.STATION,
    city: 'Thủ Đức',
    province: 'TP. Hồ Chí Minh',
    address: '501 Hoàng Hữu Nam, Long Bình, Thủ Đức',
    coordinates: { lat: 10.880611, lng: 106.810361 },
    isActive: true,
    createdAt: '2026-04-01T08:00:00.000Z',
    updatedAt: '2026-04-15T03:20:00.000Z',
  },
  {
    id: 'sp-point-002',
    name: 'Văn phòng Lê Hồng Phong',
    type: StopPointType.POINT,
    city: 'Quận 10',
    province: 'TP. Hồ Chí Minh',
    address: '273 Lê Hồng Phong, Phường 4, Quận 10',
    coordinates: { lat: 10.767523, lng: 106.667465 },
    isActive: true,
    createdAt: '2026-03-21T02:00:00.000Z',
    updatedAt: '2026-04-18T11:05:00.000Z',
  },
  {
    id: 'sp-rest-003',
    name: 'Trạm dừng chân Dầu Giây',
    type: StopPointType.REST_STOP,
    city: 'Thống Nhất',
    province: 'Đồng Nai',
    address: 'QL1A, Xuân Thạnh, Thống Nhất, Đồng Nai',
    coordinates: { lat: 10.955837, lng: 107.24898 },
    isActive: true,
    createdAt: '2026-02-10T10:15:00.000Z',
    updatedAt: '2026-04-09T06:30:00.000Z',
  },
  {
    id: 'sp-pickup-004',
    name: 'Điểm trung chuyển Cộng Hòa',
    type: StopPointType.PICKUP,
    city: 'Tân Bình',
    province: 'TP. Hồ Chí Minh',
    address: '18 Cộng Hòa, Phường 4, Tân Bình',
    coordinates: { lat: 10.801987, lng: 106.653021 },
    isActive: true,
    createdAt: '2026-03-05T07:10:00.000Z',
    updatedAt: '2026-04-12T08:40:00.000Z',
  },
  {
    id: 'sp-dropoff-005',
    name: 'Điểm trả Liên Khương',
    type: StopPointType.DROPOFF,
    city: 'Đức Trọng',
    province: 'Lâm Đồng',
    address: 'QL20, Liên Nghĩa, Đức Trọng, Lâm Đồng',
    coordinates: { lat: 11.748857, lng: 108.373615 },
    isActive: false,
    createdAt: '2026-01-29T05:45:00.000Z',
    updatedAt: '2026-04-02T12:20:00.000Z',
  },
  {
    id: 'sp-station-006',
    name: 'Bến xe Liên tỉnh Đà Lạt',
    type: StopPointType.STATION,
    city: 'Đà Lạt',
    province: 'Lâm Đồng',
    address: '1 Tô Hiến Thành, Phường 3, Đà Lạt',
    coordinates: { lat: 11.930611, lng: 108.449392 },
    isActive: true,
    createdAt: '2026-02-26T04:30:00.000Z',
    updatedAt: '2026-04-16T02:10:00.000Z',
  },
];

export function getMockStopPointsResponse(): NestListResponse<IStopPoint> {
  return {
    data: mockStopPoints,
    meta: {
      total: mockStopPoints.length,
      page: 1,
      limit: mockStopPoints.length,
    },
    message: 'Mock stop points loaded successfully.',
  };
}
