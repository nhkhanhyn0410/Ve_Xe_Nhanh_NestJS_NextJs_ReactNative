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
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800 m-0">Đội xe của tôi</h3>
          <p className="text-gray-500">Quản lý và theo dõi trạng thái các xe trong hệ thống</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
          Thêm xe mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo biển số..."
            className="flex-grow max-w-md px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
          />
          <select className="px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white">
            <option value="all">Tất cả loại xe</option>
            <option value={BusType.SEATER}>Ghế ngồi</option>
            <option value={BusType.SLEEPER}>Giường nằm</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
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
                <tr key={bus.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-800">{bus.busNumber}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                      {bus.busType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{bus.description}</td>
                  <td className="px-6 py-4 font-medium">{bus.seatLayout.totalSeats}</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                      {bus.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 font-medium mr-3">
                      Sửa
                    </button>
                    <button className="text-red-600 hover:text-red-800 font-medium">Xóa</button>
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
