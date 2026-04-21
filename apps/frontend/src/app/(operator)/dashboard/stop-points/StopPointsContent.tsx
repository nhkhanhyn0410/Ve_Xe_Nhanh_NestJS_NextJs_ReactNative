'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { StopPointType, type IStopPoint } from '@ve_xe_nhanh_ts/shared-types';

import {
  getMockStopPointsResponse,
  stopPointTypeDescriptions,
  stopPointTypeLabels,
} from './mockStopPoints';

type StatusFilter = 'all' | 'active' | 'inactive';
type StopPointTypeFilter = 'all' | StopPointType;

interface StopPointFormState {
  id?: string;
  name: string;
  type: StopPointType;
  city: string;
  province: string;
  address: string;
  lat: string;
  lng: string;
  isActive: boolean;
}

const stopPointTypes = Object.values(StopPointType);

function createEmptyFormState(): StopPointFormState {
  return {
    name: '',
    type: StopPointType.POINT,
    city: '',
    province: '',
    address: '',
    lat: '',
    lng: '',
    isActive: true,
  };
}

function buildFormState(stopPoint?: IStopPoint): StopPointFormState {
  if (!stopPoint) {
    return createEmptyFormState();
  }

  return {
    id: stopPoint.id,
    name: stopPoint.name,
    type: stopPoint.type,
    city: stopPoint.city,
    province: stopPoint.province,
    address: stopPoint.address,
    lat: String(stopPoint.coordinates.lat),
    lng: String(stopPoint.coordinates.lng),
    isActive: stopPoint.isActive,
  };
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function matchesStatus(stopPoint: IStopPoint, selectedStatus: StatusFilter): boolean {
  if (selectedStatus === 'all') {
    return true;
  }

  return selectedStatus === 'active' ? stopPoint.isActive : !stopPoint.isActive;
}

function validateForm(formState: StopPointFormState): string | null {
  if (!formState.name.trim()) {
    return 'Tên stop point là bắt buộc.';
  }
  if (!formState.city.trim() || !formState.province.trim()) {
    return 'Vui lòng nhập đầy đủ thành phố và tỉnh.';
  }
  if (!formState.address.trim()) {
    return 'Địa chỉ chi tiết là bắt buộc.';
  }

  const lat = Number(formState.lat);
  const lng = Number(formState.lng);

  if (Number.isNaN(lat) || lat < -90 || lat > 90) {
    return 'Vĩ độ phải nằm trong khoảng từ -90 đến 90.';
  }
  if (Number.isNaN(lng) || lng < -180 || lng > 180) {
    return 'Kinh độ phải nằm trong khoảng từ -180 đến 180.';
  }

  return null;
}

export default function StopPointsContent() {
  const response = getMockStopPointsResponse();
  const [stopPoints, setStopPoints] = useState<IStopPoint[]>(() => response.data);
  const [keyword, setKeyword] = useState('');
  const [selectedType, setSelectedType] = useState<StopPointTypeFilter>('all');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [formState, setFormState] = useState<StopPointFormState>(() => createEmptyFormState());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<'success' | 'error'>('success');

  // Client Component giữ toàn bộ state tương tác CRUD; dữ liệu được map từ envelope kiểu NestJS.
  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredStopPoints = stopPoints.filter((stopPoint) => {
    const matchesKeyword =
      normalizedKeyword.length === 0 ||
      [
        stopPoint.name,
        stopPoint.city,
        stopPoint.province,
        stopPoint.address,
        stopPointTypeLabels[stopPoint.type],
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedKeyword);

    const matchesType = selectedType === 'all' || stopPoint.type === selectedType;

    return matchesKeyword && matchesType && matchesStatus(stopPoint, selectedStatus);
  });

  const summary = {
    total: stopPoints.length,
    active: stopPoints.filter((item) => item.isActive).length,
    inactive: stopPoints.filter((item) => !item.isActive).length,
    transit: stopPoints.filter(
      (item) => item.type === StopPointType.PICKUP || item.type === StopPointType.DROPOFF,
    ).length,
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setFormState(createEmptyFormState());
  };

  const openCreateEditor = () => {
    setFeedback(null);
    setFormState(createEmptyFormState());
    setIsEditorOpen(true);
  };

  const openEditEditor = (stopPoint: IStopPoint) => {
    setFeedback(null);
    setFormState(buildFormState(stopPoint));
    setIsEditorOpen(true);
  };

  const handleFormChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type, checked } = event.target as HTMLInputElement;
    setFormState((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errorMessage = validateForm(formState);

    if (errorMessage) {
      setFeedbackTone('error');
      setFeedback(errorMessage);
      return;
    }

    const now = new Date().toISOString();
    const nextStopPoint: IStopPoint = {
      id: formState.id ?? `sp-${Date.now()}`,
      name: formState.name.trim(),
      type: formState.type,
      city: formState.city.trim(),
      province: formState.province.trim(),
      address: formState.address.trim(),
      coordinates: {
        lat: Number(formState.lat),
        lng: Number(formState.lng),
      },
      isActive: formState.isActive,
      createdAt:
        stopPoints.find((item) => item.id === formState.id)?.createdAt ?? now,
      updatedAt: now,
    };

    setStopPoints((current) => {
      if (formState.id) {
        return current.map((item) => (item.id === formState.id ? nextStopPoint : item));
      }

      return [nextStopPoint, ...current];
    });

    setFeedbackTone('success');
    setFeedback(formState.id ? 'Cập nhật stop point thành công.' : 'Tạo stop point thành công.');
    closeEditor();
  };

  const handleDelete = (id: string) => {
    setStopPoints((current) => current.filter((item) => item.id !== id));
    setFeedbackTone('success');
    setFeedback('Đã xóa stop point khỏi danh sách mock.');
  };

  const handleToggleStatus = (id: string) => {
    setStopPoints((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              isActive: !item.isActive,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
    setFeedbackTone('success');
    setFeedback('Đã cập nhật trạng thái hoạt động.');
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_45%,#dbeafe_100%)] px-6 py-7 text-white shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-50">
              Operator Module
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight">Quản lý stop point</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50/90">
              Module này được rebuild riêng cho dự án Next.js để quản lý tập trung bến xe,
              điểm đón/trả và trạm dừng chân. Hiện tại dữ liệu dùng mock nội bộ theo cấu
              trúc response NestJS, nên có thể phát triển UI độc lập trước khi nối API thật.
            </p>
          </div>

          <div className="grid min-w-full gap-3 sm:grid-cols-2 xl:min-w-[420px]">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-blue-100">Tổng stop point</p>
              <p className="mt-2 text-3xl font-bold">{summary.total}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-blue-100">Đang hoạt động</p>
              <p className="mt-2 text-3xl font-bold">{summary.active}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Điểm ngưng hoạt động</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{summary.inactive}</p>
          <p className="mt-2 text-sm text-slate-500">Thuận tiện để rà soát và kích hoạt lại.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Điểm trung chuyển</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{summary.transit}</p>
          <p className="mt-2 text-sm text-slate-500">Bao gồm pickup và dropoff shuttle.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Meta mock</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{response.meta.total}</p>
          <p className="mt-2 text-sm text-slate-500">Mapping trực tiếp từ `data` và `meta`.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Thông điệp service</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">{response.message}</p>
          <p className="mt-2 text-sm text-slate-500">Sẵn khung để thay bằng API NestJS thật.</p>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Danh sách stop point</h2>
            <p className="mt-1 text-sm text-slate-500">
              Lọc theo loại điểm, trạng thái và tìm nhanh theo tên hoặc địa chỉ.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateEditor}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Tạo stop point mới
          </button>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-[2fr_1fr_1fr]">
          <input
            type="text"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm theo tên, tỉnh/thành hoặc địa chỉ..."
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
          />
          <select
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value as StopPointTypeFilter)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
          >
            <option value="all">Tất cả loại stop point</option>
            {stopPointTypes.map((type) => (
              <option key={type} value={type}>
                {stopPointTypeLabels[type]}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value as StatusFilter)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngưng hoạt động</option>
          </select>
        </div>

        {feedback ? (
          <div
            className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
              feedbackTone === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            {feedback}
          </div>
        ) : null}

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Stop point</th>
                  <th className="px-5 py-4 font-semibold">Loại</th>
                  <th className="px-5 py-4 font-semibold">Khu vực</th>
                  <th className="px-5 py-4 font-semibold">Tọa độ</th>
                  <th className="px-5 py-4 font-semibold">Cập nhật</th>
                  <th className="px-5 py-4 font-semibold">Trạng thái</th>
                  <th className="px-5 py-4 font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredStopPoints.map((stopPoint) => (
                  <tr key={stopPoint.id} className="align-top">
                    <td className="px-5 py-4">
                      <div className="max-w-xs">
                        <p className="font-semibold text-slate-900">{stopPoint.name}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">{stopPoint.address}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {stopPointTypeLabels[stopPoint.type]}
                      </span>
                      <p className="mt-2 max-w-44 text-xs leading-5 text-slate-500">
                        {stopPointTypeDescriptions[stopPoint.type]}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <p>{stopPoint.city}</p>
                      <p className="text-xs text-slate-500">{stopPoint.province}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <p>Lat: {stopPoint.coordinates.lat}</p>
                      <p className="text-xs text-slate-500">Lng: {stopPoint.coordinates.lng}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <p>{formatDateTime(stopPoint.updatedAt)}</p>
                      <p className="text-xs text-slate-500">Tạo: {formatDateTime(stopPoint.createdAt)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          stopPoint.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {stopPoint.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openEditEditor(stopPoint)}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-700"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(stopPoint.id)}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
                        >
                          {stopPoint.isActive ? 'Ngưng' : 'Kích hoạt'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(stopPoint.id)}
                          className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredStopPoints.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-500">
                      Không có stop point nào khớp bộ lọc hiện tại.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {isEditorOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {formState.id ? 'Chỉnh sửa stop point' : 'Tạo stop point mới'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Dữ liệu đang lưu cục bộ để mô phỏng quy trình operator trước khi nối backend.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeEditor}
                  className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                >
                  Đóng
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Tên stop point</span>
                  <input
                    name="name"
                    value={formState.name}
                    onChange={handleFormChange}
                    placeholder="Ví dụ: Bến xe Miền Đông mới"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Loại điểm</span>
                  <select
                    name="type"
                    value={formState.type}
                    onChange={handleFormChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                  >
                    {stopPointTypes.map((type) => (
                      <option key={type} value={type}>
                        {stopPointTypeLabels[type]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Thành phố / quận</span>
                  <input
                    name="city"
                    value={formState.city}
                    onChange={handleFormChange}
                    placeholder="Ví dụ: Thủ Đức"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Tỉnh / thành</span>
                  <input
                    name="province"
                    value={formState.province}
                    onChange={handleFormChange}
                    placeholder="Ví dụ: TP. Hồ Chí Minh"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Địa chỉ chi tiết</span>
                <textarea
                  name="address"
                  value={formState.address}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Ví dụ: 501 Hoàng Hữu Nam, Long Bình, Thủ Đức"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Vĩ độ (lat)</span>
                  <input
                    name="lat"
                    value={formState.lat}
                    onChange={handleFormChange}
                    placeholder="10.880611"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Kinh độ (lng)</span>
                  <input
                    name="lng"
                    value={formState.lng}
                    onChange={handleFormChange}
                    placeholder="106.810361"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                  />
                </label>
              </div>

              <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formState.isActive}
                  onChange={handleFormChange}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Kích hoạt stop point ngay sau khi lưu
              </label>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  DTO UI đang bám trực tiếp `IStopPoint` từ package shared types.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeEditor}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    {formState.id ? 'Lưu thay đổi' : 'Tạo stop point'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
