"use server";

import { requireRole } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import Event from "@/lib/database/models/event.model";
import Order from "@/lib/database/models/order.model";
import Category from "@/lib/database/models/category.model";

export type AdminDashboardStats = {
  totalUsers: number;
  totalEvents: number;
  totalOrders: number;
  totalCategories: number;
  roleBreakdown: {
    admin: number;
    creator: number;
    user: number;
  };
};

export async function getAdminStats(): Promise<AdminDashboardStats | null> {
  try {
    await requireRole(['admin']);
    await connectToDatabase();

    const [totalUsers, totalEvents, totalOrders, totalCategories, userRoleCounts] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Order.countDocuments(),
      Category.countDocuments(),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
    ]);

    const roleBreakdown = {
      admin: 0,
      creator: 0,
      user: 0,
    };

    userRoleCounts.forEach((r: { _id: string; count: number }) => {
      if (r._id && r._id in roleBreakdown) {
        roleBreakdown[r._id as keyof typeof roleBreakdown] = r.count;
      }
    });

    return {
      totalUsers,
      totalEvents,
      totalOrders,
      totalCategories,
      roleBreakdown,
    };
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return null;
  }
}

