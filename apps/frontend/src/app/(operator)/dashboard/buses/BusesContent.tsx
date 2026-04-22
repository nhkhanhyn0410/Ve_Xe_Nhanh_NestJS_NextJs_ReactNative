'use client';

import React from 'react';
import { IBus, BusType, BusStatus, BusAmenity } from '@ve_xe_nhanh_ts/shared-types';

const initialBuses: IBus[] = [
  {
    id: '1',
    operatorId: 'op1',
    busNumber: '51B-12345',
    busType: BusType.SLEEPER,
    seatLayout: {
      floors: 2,
      rows: 6,
      columns: 3,
      layout: [],
      totalSeats: 36,
    },
    status: BusStatus.ACTIVE,
    amenities: [BusAmenity.WIFI, BusAmenity.AC, BusAmenity.CHARGING],
    description: 'Thaco Mobihome 2023',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function BusesManagementContent() {
  const buses = initialBuses;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="m-0 text-xl font-bold text-gray-800">Đội xe của tôi</h3>
          <p className="text-gray-500">Quản lý và theo dõi trạng thái các xe trong hệ thống</p>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
          Thêm xe mới
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex gap-4 border-b border-gray-100 p-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo biển số..."
            className="max-w-md grow rounded-lg border border-gray-200 px-4 py-2 outline-none focus:border-blue-500"
          />
          <select className="rounded-lg border border-gray-200 bg-white px-4 py-2 outline-none">
            <option value="all">Tất cả loại xe</option>
            <option value={BusType.SEATER}>Ghế ngồi</option>
            <option value={BusType.SLEEPER}>Giường nằm</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-medium">Biển số xe</th>
                <th className="px-6 py-4 font-medium">Loại xe</th>
                <th className="px-6 py-4 font-medium">Thông tin thêm</th>
                <th className="px-6 py-4 font-medium">Số ghế</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {buses.map((bus) => (
                <tr key={bus.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-800">{bus.busNumber}</td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
                      {bus.busType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{bus.description}</td>
                  <td className="px-6 py-4 font-medium">{bus.seatLayout.totalSeats}</td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                      {bus.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="mr-3 font-medium text-blue-600 hover:text-blue-800">
                      Sửa
                    </button>
                    <button className="font-medium text-red-600 hover:text-red-800">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
