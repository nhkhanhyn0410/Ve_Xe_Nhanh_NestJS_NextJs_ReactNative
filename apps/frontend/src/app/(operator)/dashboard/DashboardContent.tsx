'use client';

import React from 'react';

const mockStats = {
  revenue: { total: 1250000000, growth: 12.5 },
  bookings: { total: 850, confirmed: 720 },
  trips: { total: 120, ongoing: 15 },
  occupancyRate: 82,
};

export default function OperatorDashboardContent() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="m-0 text-2xl font-bold text-gray-800">Tổng quan kinh doanh</h2>
          <p className="text-gray-500">Cập nhật theo thời gian thực</p>
        </div>
        <select className="rounded-lg border border-gray-200 bg-white px-4 py-2 outline-none">
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border-l-4 border-blue-500 bg-white p-6 shadow-sm">
          <h3 className="mb-2 font-medium text-gray-500">Tổng doanh thu</h3>
          <p className="text-2xl font-bold text-gray-800">
            {formatCurrency(mockStats.revenue.total)}
          </p>
          <p className="mt-2 text-sm font-medium text-green-500">
            +{mockStats.revenue.growth}% so với kỳ trước
          </p>
        </div>

        <div className="rounded-xl border-l-4 border-green-500 bg-white p-6 shadow-sm">
          <h3 className="mb-2 font-medium text-gray-500">Tổng đơn hàng</h3>
          <p className="text-2xl font-bold text-gray-800">{mockStats.bookings.total}</p>
          <p className="mt-2 text-sm text-gray-500">Thành công: {mockStats.bookings.confirmed}</p>
        </div>

        <div className="rounded-xl border-l-4 border-orange-500 bg-white p-6 shadow-sm">
          <h3 className="mb-2 font-medium text-gray-500">Chuyến xe</h3>
          <p className="text-2xl font-bold text-gray-800">{mockStats.trips.total}</p>
          <p className="mt-2 text-sm text-gray-500">Đang chạy: {mockStats.trips.ongoing}</p>
        </div>

        <div className="rounded-xl border-l-4 border-purple-500 bg-white p-6 shadow-sm">
          <h3 className="mb-2 font-medium text-gray-500">Tỷ lệ lấp đầy</h3>
          <p className="text-2xl font-bold text-gray-800">{mockStats.occupancyRate}%</p>
          <p className="mt-2 text-sm text-gray-500">Đánh giá trung bình: 4.8/5</p>
        </div>
      </div>
    </div>
  );
}
