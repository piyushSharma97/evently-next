'use server';
import { CreateUserParams, UpdateUserParams } from '@/types'
import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '../database';
import { handleError } from '@/lib/utils'
import User from '@/lib/database/models/user.model'
import Order from '@/lib/database/models/order.model'
import Event from '@/lib/database/models/event.model'
import { clerkClient, auth } from '@clerk/nextjs/server'
import { UserRole } from '@/lib/auth/roles'
import { requireAuth, requireRole } from '@/lib/auth/guard'

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase()

    const newUser = await User.create(user)
    return JSON.parse(JSON.stringify(newUser))
  } catch (error) {
    handleError(error)
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase()

    const user = await User.findById(userId)

    if (!user) throw new Error('User not found')
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    handleError(error)
  }
}

export async function getCurrentUser() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return null;

    await connectToDatabase();
    const user = await User.findOne({ clerkId });
    if (!user) return null;

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase()

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })

    if (!updatedUser) throw new Error('User update failed')
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    handleError(error)
  }
}

/**
 * Updates a user's role across both MongoDB and Clerk publicMetadata.
 * Enforces authorization: only admins can change other accounts' roles,
 * but users can change their own role during onboarding/testing.
 */
export async function updateUserRole(targetClerkId: string, newRole: UserRole) {
  try {
    const ctx = await requireAuth();

    const isSelf = ctx.clerkId === targetClerkId;
    const isAdmin = ctx.userRole === 'admin';

    if (!isSelf && !isAdmin) {
      throw new Error('FORBIDDEN: Only administrators can modify roles for other accounts.');
    }

    await connectToDatabase();
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: targetClerkId },
      { role: newRole },
      { new: true }
    );

    if (!updatedUser) throw new Error('User not found in database');

    // Sync directly into Clerk publicMetadata so JWT tokens reflect role
    const client = await clerkClient();
    await client.users.updateUserMetadata(targetClerkId, {
      publicMetadata: {
        userId: updatedUser._id.toString(),
        role: newRole,
      },
    });

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/profile');

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

/**
 * Convenience action for standard users to promote their own account to 'creator'.
 */
export async function becomeCreator() {
  try {
    const ctx = await requireAuth();
    return await updateUserRole(ctx.clerkId, 'creator');
  } catch (error) {
    handleError(error);
  }
}

/**
 * Lists all registered users for the Admin portal.
 * Guarded strictly by requireRole(['admin']).
 */
export async function getAllUsers() {
  try {
    await requireRole(['admin']);
    await connectToDatabase();
    const users = await User.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase()

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId })

    if (!userToDelete) {
      throw new Error('User not found')
    }

    // Unlink relationships
    await Promise.all([
      // Update the 'events' collection to remove references to the user
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),

      // Update the 'orders' collection to remove references to the user
      Order.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyer: 1 } }),
    ])

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id)
    revalidatePath('/')

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
  } catch (error) {
    handleError(error)
  }
}
