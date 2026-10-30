"use client";

import { useState } from "react";
import Image from "next/image";
import { UserRole } from "@/lib/auth/roles";
import { updateUserRole } from "@/lib/actions/user.actions";

type UserItem = {
  _id: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
  role: UserRole;
  createdAt?: string;
};

export default function UserManagementTable({ initialUsers }: { initialUsers: UserItem[] }) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<string>("all");

  const handleRoleChange = async (clerkId: string, newRole: UserRole) => {
    setUpdatingId(clerkId);
    try {
      await updateUserRole(clerkId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.clerkId === clerkId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Role update failed. Please verify your admin credentials.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filterRole === "all") return true;
    return u.role === filterRole;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="p-bold-20 text-grey-900">User Directory ({filteredUsers.length})</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="filter" className="text-sm text-grey-500">Filter:</label>
          <select
            id="filter"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="rounded-lg border border-grey-300 bg-white px-3 py-1.5 text-sm"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="creator">Creators</option>
            <option value="user">Users</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-grey-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-grey-200 bg-grey-50 text-xs font-semibold uppercase text-grey-500">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Username</th>
              <th className="px-6 py-4">Current Role</th>
              <th className="px-6 py-4">Change Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-grey-500">
                  No users found matching filter.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-grey-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={user.photo || "/assets/icons/user.svg"}
                        alt={user.firstName}
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-grey-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-grey-400 font-mono truncate max-w-[150px]">{user.clerkId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-grey-600">@{user.username}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "creator"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-grey-100 text-grey-600"
                      }`}
                    >
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role || "user"}
                      disabled={updatingId === user.clerkId}
                      onChange={(e) =>
                        handleRoleChange(user.clerkId, e.target.value as UserRole)
                      }
                      className="rounded-lg border border-grey-300 bg-white px-3 py-1 text-sm transition focus:border-primary-500 focus:outline-none disabled:opacity-50"
                    >
                      <option value="user">User</option>
                      <option value="creator">Creator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

