import AdminDashboard from '@/views/admin.dashboard';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('/admin/dashboard', 'Admin Dashboard | Zapiboo', 'Manage vehicle bookings, availability and customer enquiries.', true);
export default function Page() {
  return <AdminDashboard />;
}
