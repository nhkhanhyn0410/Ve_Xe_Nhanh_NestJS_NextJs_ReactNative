import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Quản lý stop point | VXN Operator',
  description:
    'Trang quản lý stop point cho operator, bao gồm điểm đón, điểm trả, bến xe và trạm dừng chân.',
};

export default function LegacyOperatorStopPointsPage() {
  redirect('/operator/stop-points');
}
