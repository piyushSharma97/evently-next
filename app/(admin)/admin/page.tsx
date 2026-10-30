import { getAdminStats } from "@/lib/actions/admin.actions";
import { getAllUsers } from "@/lib/actions/user.actions";
import UserManagementTable from "@/components/admin/UserManagementTable";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [stats, users] = await Promise.all([
    getAdminStats(),
    getAllUsers(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="h2-bold text-grey-900">Platform Overview</h1>
        <p className="p-regular-16 text-grey-500">
          Monitor system metrics, manage user roles, and enforce platform governance.
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-grey-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase text-grey-500">Total Users</p>
            <p className="h3-bold mt-1 text-grey-900">{stats.totalUsers}</p>
            <p className="mt-2 text-xs text-grey-400">
              {stats.roleBreakdown.admin} admins · {stats.roleBreakdown.creator} creators
            </p>
          </div>

          <div className="rounded-xl border border-grey-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase text-grey-500">Total Events</p>
            <p className="h3-bold mt-1 text-grey-900">{stats.totalEvents}</p>
            <p className="mt-2 text-xs text-grey-400">Published across platform</p>
          </div>

          <div className="rounded-xl border border-grey-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase text-grey-500">Tickets Ordered</p>
            <p className="h3-bold mt-1 text-grey-900">{stats.totalOrders}</p>
            <p className="mt-2 text-xs text-grey-400">Completed checkouts</p>
          </div>

          <div className="rounded-xl border border-grey-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase text-grey-500">Categories</p>
            <p className="h3-bold mt-1 text-grey-900">{stats.totalCategories}</p>
            <p className="mt-2 text-xs text-grey-400">Active event classifications</p>
          </div>
        </div>
      )}

      <UserManagementTable initialUsers={users} />
    </div>
  );
}
