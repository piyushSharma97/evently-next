import { auth } from "@clerk/nextjs/server";
import { UserRole, hasRole } from "./roles";
import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";

export type AuthContext = {
  isAuthenticated: boolean;
  userId: string | null;
  clerkId: string | null;
  userRole: UserRole | null;
};

export type AuthenticatedContext = {
  isAuthenticated: true;
  userId: string;
  clerkId: string;
  userRole: UserRole;
};

/**
 * Resolves current user authentication context.
 * Reads role from Clerk sessionClaims first (0ms latency),
 * falling back to MongoDB if metadata is not yet baked into JWT.
 */
export async function getCurrentUserContext(): Promise<AuthContext> {
  const { userId: clerkId, sessionClaims } = await auth();

  if (!clerkId) {
    return {
      isAuthenticated: false,
      userId: null,
      clerkId: null,
      userRole: null,
    };
  }

  // Check if role is present in sessionClaims (from Clerk publicMetadata)
  const claims = sessionClaims as Record<string, any> | undefined;
  const roleFromClaims = (claims?.metadata?.role || claims?.role) as UserRole | undefined;

  let dbUserId = claims?.userId as string | undefined;
  let userRole = roleFromClaims;

  // Fallback to database if role or dbUserId is not in session claims
  if (!userRole || !dbUserId) {
    await connectToDatabase();
    const dbUser = await User.findOne({ clerkId }).select('_id role');
    if (dbUser) {
      dbUserId = dbUser._id.toString();
      userRole = (dbUser.role as UserRole) || 'user';
    } else {
      userRole = 'user';
    }
  }

  return {
    isAuthenticated: true,
    userId: dbUserId || null,
    clerkId,
    userRole: userRole || 'user',
  };
}

/**
 * Ensures user is authenticated; throws if not.
 */
export async function requireAuth(): Promise<AuthenticatedContext> {
  const ctx = await getCurrentUserContext();
  if (!ctx.isAuthenticated || !ctx.userId || !ctx.clerkId || !ctx.userRole) {
    throw new Error("UNAUTHORIZED: You must be logged in to perform this action.");
  }
  return {
    isAuthenticated: true,
    userId: ctx.userId,
    clerkId: ctx.clerkId,
    userRole: ctx.userRole,
  };
}

/**
 * Enforces role-based permissions; throws if user lacks required role.
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<AuthenticatedContext> {
  const ctx = await requireAuth();

  if (!hasRole(ctx.userRole, allowedRoles)) {
    throw new Error(
      `FORBIDDEN: Requires one of [${allowedRoles.join(', ')}]. Current role: ${ctx.userRole}`
    );
  }

  return ctx;
}

/**
 * Higher-Order Function to protect Server Actions with RBAC.
 */
export function withRole<TArgs extends any[], TReturn>(
  allowedRoles: UserRole[],
  action: (ctx: AuthenticatedContext, ...args: TArgs) => Promise<TReturn>
) {
  return async (...args: TArgs): Promise<TReturn> => {
    const ctx = await requireRole(allowedRoles);
    return action(ctx, ...args);
  };
}
