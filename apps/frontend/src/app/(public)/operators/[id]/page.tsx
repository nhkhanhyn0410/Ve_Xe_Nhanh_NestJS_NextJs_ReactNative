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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb - Mock */}
      <nav className="flex mb-6 text-sm text-gray-500">
        <ol className="list-none p-0 inline-flex">
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
          <li className="text-gray-800 font-medium">{operator.companyName}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Operator Info Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                {/* Logo */}
                <div className="relative w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0">
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

                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{operator.companyName}</h1>
                    <CheckCircleFilled className="text-blue-500 text-xl" title="Đã xác thực" />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center text-amber-500 font-bold">
                      <StarFilled className="mr-1" />
                      <span className="text-lg">{operator.averageRating.toFixed(1)}</span>
                      <span className="text-gray-400 font-normal ml-1">
                        ({operator.totalReviews} đánh giá)
                      </span>
                    </div>
                    <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
                    <div className="text-gray-500">
                      <strong className="text-gray-700">{operator.totalTrips}</strong> Chuyến đã
                      chạy
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Giới thiệu về nhà xe</h2>
                <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
                  {operator.description ||
                    `Nhà xe ${operator.companyName} là đơn vị vận tải hành khách uy tín, cam kết mang lại trải nghiệm an toàn và thoải mái nhất cho khách hàng trên mọi hành trình.`}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                  <div className="text-blue-600 font-bold text-2xl mb-1">
                    {operator.totalRoutes}
                  </div>
                  <div className="text-blue-800 text-xs font-medium uppercase tracking-wider">
                    Tuyến đường
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
                  <div className="text-green-600 font-bold text-2xl mb-1">
                    {operator.totalBuses}
                  </div>
                  <div className="text-green-800 text-xs font-medium uppercase tracking-wider">
                    Đội xe
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl text-center border border-purple-100">
                  <div className="text-purple-600 font-bold text-2xl mb-1">
                    {operator.averageRating.toFixed(1)}
                  </div>
                  <div className="text-purple-800 text-xs font-medium uppercase tracking-wider">
                    Đánh giá
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl text-center border border-orange-100">
                  <div className="text-orange-600 font-bold text-2xl mb-1">98%</div>
                  <div className="text-orange-800 text-xs font-medium uppercase tracking-wider">
                    Đúng giờ
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder for Routes and Reviews */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Các tuyến đường phổ biến</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-center text-gray-400 italic">
                (Đang tải danh sách tuyến đường...)
              </div>
            </section>
          </div>
        </div>

        {/* Right Column: Contact & Quick Links */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin liên hệ</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <PhoneOutlined className="text-blue-600 mt-1" />
                <div>
                  <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                    Số điện thoại
                  </div>
                  <div className="text-gray-700 font-medium">{operator.phone}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MailOutlined className="text-blue-600 mt-1" />
                <div>
                  <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                    Email liên hệ
                  </div>
                  <div className="text-gray-700 font-medium">{operator.email}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <EnvironmentOutlined className="text-blue-600 mt-1" />
                <div>
                  <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                    Địa chỉ văn phòng
                  </div>
                  <div className="text-gray-700 font-medium">{operator.address}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GlobalOutlined className="text-blue-600 mt-1" />
                <div>
                  <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                    Mã số thuế
                  </div>
                  <div className="text-gray-700 font-medium">{operator.taxCode}</div>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
              Đặt vé nhà xe ngay
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Bạn có thắc mắc?</h3>
            <p className="text-blue-100 text-sm mb-6">
              Liên hệ với bộ phận CSKH của VeXeNhanh để được hỗ trợ tốt nhất về nhà xe{' '}
              {operator.companyName}.
            </p>
            <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">
              Chat hỗ trợ ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
