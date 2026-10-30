
# evently-next
Next app on Creating event

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Evently is an event discovery and management app built with Next.js. Browse events, filter by category, and create and manage events after signing in.

**Live demo:** [evently-next-rosy.vercel.app](https://evently-next-rosy.vercel.app/)

## Features

- Browse events and search by title or category
- View event details and related events
- Sign in and manage events
- Upload event images
- Browse event checkout and ticket flows

## Tech stack

- Next.js 14 and React 18
- TypeScript and Tailwind CSS
- Clerk authentication
- MongoDB with Mongoose
- UploadThing for image uploads

## Run locally

Use Node.js 18.17 or newer and npm.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root and configure:

   ```env
   MONGODB_URI=
   WEBHOOK_SECRET=
   ```

   `MONGODB_URI` is the MongoDB connection string. `WEBHOOK_SECRET` is the signing secret for the Clerk webhook at `/api/webhooks/clerk`. Configure the Clerk credentials and UploadThing credentials required by their SDKs in the same file.

3. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Production

Run the production build and server with:

```bash
npm run build
npm run start
```

Set the same environment variables in your deployment provider. The Clerk webhook endpoint must also be configured to deliver user events to `/api/webhooks/clerk`.
