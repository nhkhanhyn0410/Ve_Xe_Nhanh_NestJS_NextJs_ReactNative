import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Quản lý stop point | VXN Operator',
  description:
    'Trang quản lý stop point cho operator, bao gồm điểm đón, điểm trả, bến xe và trạm dừng chân.',
};

// Giữ redirect ở route cũ để không làm gãy bookmark trong lúc chuyển sang /operator/stop-points.
export default function StopPointsManagementPage() {
  redirect('/operator/stop-points');
}
