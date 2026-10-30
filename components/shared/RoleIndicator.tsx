"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/lib/auth/roles";
import { updateUserRole } from "@/lib/actions/user.actions";

type RoleIndicatorProps = {
  clerkId: string;
  initialRole: UserRole;
};

export default function RoleIndicator({ clerkId, initialRole }: RoleIndicatorProps) {
  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole);
  const [isChanging, setIsChanging] = useState(false);
  const router = useRouter();

  const handleRoleSwitch = async (newRole: UserRole) => {
    if (newRole === currentRole) return;
    setIsChanging(true);
    try {
      await updateUserRole(clerkId, newRole);
      setCurrentRole(newRole);
      router.refresh();
    } catch (err) {
      console.error("Failed to switch role:", err);
    } finally {
      setIsChanging(false);
    }
  };

  const badgeStyle = {
    admin: "bg-purple-100 text-purple-700 border-purple-200",
    creator: "bg-blue-100 text-blue-700 border-blue-200",
    user: "bg-grey-100 text-grey-600 border-grey-200",
  }[currentRole] || "bg-grey-100 text-grey-600 border-grey-200";

  return (
    <div className="flex items-center gap-1.5">
      <div className="group relative">
        <button
          type="button"
          disabled={isChanging}
          className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition ${badgeStyle}`}
        >
          <span>{isChanging ? "..." : currentRole}</span>
          <span className="text-[10px] opacity-60">▼</span>
        </button>

        <div className="invisible absolute right-0 top-full z-50 mt-1 min-w-[130px] rounded-lg border border-grey-200 bg-white p-1 shadow-lg group-hover:visible">
          <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-grey-400">
            Switch Role (Dev)
          </p>
          {(["user", "creator", "admin"] as UserRole[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoleSwitch(r)}
              className={`w-full rounded px-2 py-1 text-left text-xs capitalize hover:bg-grey-100 ${
                r === currentRole ? "font-bold text-primary-500" : "text-grey-700"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

