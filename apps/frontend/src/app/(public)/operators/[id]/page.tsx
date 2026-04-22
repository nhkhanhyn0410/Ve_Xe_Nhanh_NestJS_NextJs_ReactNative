import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  StarFilled,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CheckCircleFilled,
  GlobalOutlined,
} from '@ant-design/icons';
import { IBusOperator } from '@ve_xe_nhanh_ts/shared-types';

/**
 * Interface cho API response chuẩn của NestJS
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Fetch dữ liệu nhà xe từ Backend NestJS
 * Đây là Server Side Fetching (mặc định cache trong Next.js)
 */
async function getOperator(id: string): Promise<IBusOperator | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500';
    const res = await fetch(`${apiUrl}/operators/${id}`, {
      next: { revalidate: 3600 }, // Revalidate mỗi giờ
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch operator');
    }

    const result: ApiResponse<IBusOperator> = await res.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Error fetching operator:', error);
    return null;
  }
}

/**
 * Tạo Metadata động cho SEO
 */
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const operator = await getOperator(params.id);

  if (!operator) {
    return {
      title: 'Không tìm thấy nhà xe | VeXeNhanh',
    };
  }

  return {
    title: `${operator.companyName} - Thông tin & Đánh giá | VeXeNhanh`,
    description:
      operator.description ||
      `Thông tin chi tiết về nhà xe ${operator.companyName}, đánh giá từ khách hàng và các tuyến đường phục vụ.`,
    openGraph: {
      title: operator.companyName,
      description: operator.description,
      images: operator.logo ? [operator.logo] : [],
    },
  };
}

/**
 * Trang chi tiết nhà xe (Server Component)
 */
export default async function OperatorDetailPage({ params }: { params: { id: string } }) {
  const operator = await getOperator(params.id);

  if (!operator) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb - Mock */}
      <nav className="mb-6 flex text-sm text-gray-500">
        <ol className="inline-flex list-none p-0">
          <li className="flex items-center">
            <Link href="/" className="hover:text-blue-600">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
          </li>
          <li className="flex items-center">
            <Link href="/operators" className="hover:text-blue-600">
              Nhà xe
            </Link>
            <span className="mx-2">/</span>
          </li>
          <li className="font-medium text-gray-800">{operator.companyName}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Operator Info Card */}
        <div className="lg:col-span-2">
          <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="p-6 sm:p-8">
              <div className="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                {/* Logo */}
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
                  {operator.logo ? (
                    <Image
                      src={operator.logo}
                      alt={operator.companyName}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="text-3xl font-bold text-gray-400">
                      {operator.companyName.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="grow">
                  <div className="mb-2 flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-gray-900">{operator.companyName}</h1>
                    <CheckCircleFilled className="text-xl text-blue-500" title="Đã xác thực" />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center font-bold text-amber-500">
                      <StarFilled className="mr-1" />
                      <span className="text-lg">{operator.averageRating.toFixed(1)}</span>
                      <span className="ml-1 font-normal text-gray-400">
                        ({operator.totalReviews} đánh giá)
                      </span>
                    </div>
                    <div className="hidden h-4 w-px bg-gray-200 sm:block"></div>
                    <div className="text-gray-500">
                      <strong className="text-gray-700">{operator.totalTrips}</strong> Chuyến đã
                      chạy
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h2 className="mb-4 text-xl font-bold text-gray-900">Giới thiệu về nhà xe</h2>
                <div className="prose prose-blue max-w-none leading-relaxed text-gray-600">
                  {operator.description ||
                    `Nhà xe ${operator.companyName} là đơn vị vận tải hành khách uy tín, cam kết mang lại trải nghiệm an toàn và thoải mái nhất cho khách hàng trên mọi hành trình.`}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-center">
                  <div className="mb-1 text-2xl font-bold text-blue-600">
                    {operator.totalRoutes}
                  </div>
                  <div className="text-xs font-medium tracking-wider text-blue-800 uppercase">
                    Tuyến đường
                  </div>
                </div>
                <div className="rounded-xl border border-green-100 bg-green-50 p-4 text-center">
                  <div className="mb-1 text-2xl font-bold text-green-600">
                    {operator.totalBuses}
                  </div>
                  <div className="text-xs font-medium tracking-wider text-green-800 uppercase">
                    Đội xe
                  </div>
                </div>
                <div className="rounded-xl border border-purple-100 bg-purple-50 p-4 text-center">
                  <div className="mb-1 text-2xl font-bold text-purple-600">
                    {operator.averageRating.toFixed(1)}
                  </div>
                  <div className="text-xs font-medium tracking-wider text-purple-800 uppercase">
                    Đánh giá
                  </div>
                </div>
                <div className="rounded-xl border border-orange-100 bg-orange-50 p-4 text-center">
                  <div className="mb-1 text-2xl font-bold text-orange-600">98%</div>
                  <div className="text-xs font-medium tracking-wider text-orange-800 uppercase">
                    Đúng giờ
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder for Routes and Reviews */}
          <div className="space-y-8">
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Các tuyến đường phổ biến</h2>
              <div className="flex items-center justify-center rounded-xl border border-gray-100 bg-white p-6 text-gray-400 italic shadow-sm">
                (Đang tải danh sách tuyến đường...)
              </div>
            </section>
          </div>
        </div>

        {/* Right Column: Contact & Quick Links */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Thông tin liên hệ</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <PhoneOutlined className="mt-1 text-blue-600" />
                <div>
                  <div className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                    Số điện thoại
                  </div>
                  <div className="font-medium text-gray-700">{operator.phone}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MailOutlined className="mt-1 text-blue-600" />
                <div>
                  <div className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                    Email liên hệ
                  </div>
                  <div className="font-medium text-gray-700">{operator.email}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <EnvironmentOutlined className="mt-1 text-blue-600" />
                <div>
                  <div className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                    Địa chỉ văn phòng
                  </div>
                  <div className="font-medium text-gray-700">{operator.address}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GlobalOutlined className="mt-1 text-blue-600" />
                <div>
                  <div className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                    Mã số thuế
                  </div>
                  <div className="font-medium text-gray-700">{operator.taxCode}</div>
                </div>
              </div>
            </div>

            <button className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-bold text-white shadow-lg shadow-blue-100 transition-colors hover:bg-blue-700">
              Đặt vé nhà xe ngay
            </button>
          </div>

          <div className="rounded-2xl bg-linear-to-br from-blue-600 to-blue-800 p-6 text-white shadow-lg">
            <h3 className="mb-2 text-lg font-bold">Bạn có thắc mắc?</h3>
            <p className="mb-6 text-sm text-blue-100">
              Liên hệ với bộ phận CSKH của VeXeNhanh để được hỗ trợ tốt nhất về nhà xe{' '}
              {operator.companyName}.
            </p>
            <button className="w-full rounded-xl bg-white py-3 font-bold text-blue-600 transition-colors hover:bg-blue-50">
              Chat hỗ trợ ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
