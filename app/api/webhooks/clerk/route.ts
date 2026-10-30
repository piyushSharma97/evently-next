import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent, clerkClient } from '@clerk/nextjs/server'
import { createUser, updateUser, deleteUser } from '@/lib/actions/user.actions'
import { NextResponse } from 'next/server'
import { UserRole } from '@/lib/auth/roles'

export async function GET(req: Request) {
  console.log('req: ', req);
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
  console.log('WEBHOOK_SECRET:GET ', WEBHOOK_SECRET);
  return NextResponse.json({ message: 'OK' })
}

export async function POST(req: Request) {
  console.log('req:POST ', req);
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
  console.log('WEBHOOK_SECRET: ', WEBHOOK_SECRET);

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  const { id } = evt.data;
  const eventType = evt.type;
  console.log('eventType: ', eventType);

  if (eventType === 'user.created') {
    const { id, image_url, first_name, last_name, username } = evt.data;
    const userRole = (((evt.data as any).public_metadata?.role as string) || 'user') as UserRole;
    const user = {
      clerkId: id,
      username: username!,
      firstName: first_name ?? '',
      lastName: last_name ?? '',
      photo: image_url,
      role: userRole,
    }
    const newUser = await createUser(user);
    if (newUser) {
      const client = await clerkClient();
      await client.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
          role: userRole,
        }
      })
    }
    return NextResponse.json({ message: 'OK', user: newUser })
  }

  if (eventType === 'user.updated') {
    const { id, image_url, first_name, last_name, username } = evt.data

    const user = {
      firstName: first_name ?? '',
      lastName: last_name ?? '',
      username: username!,
      photo: image_url,
    }
    const updatedUser = await updateUser(id, user)
    return NextResponse.json({ message: 'OK', user: updatedUser })
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data
    const deletedUser = await deleteUser(id!)

    return NextResponse.json({ message: 'OK', user: deletedUser })
  }

  return new Response('', { status: 200 })
}
