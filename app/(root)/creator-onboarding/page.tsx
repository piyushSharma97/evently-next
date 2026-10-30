import BecomeCreatorButton from "@/components/shared/BecomeCreatorButton";
import Link from "next/link";

export default function CreatorOnboardingPage() {
  return (
    <div className="wrapper py-12 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <span className="mb-4 inline-block rounded-full bg-primary-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-600">
          Creator Program
        </span>
        <h1 className="h1-bold mb-6">Start Hosting World-Class Events</h1>
        <p className="p-regular-20 mb-10 text-grey-600">
          Transform your passion into thriving events. Join thousands of organizers using Evently to build audiences, manage ticketing, and run door operations.
        </p>

        <div className="mb-12 grid gap-6 text-left sm:grid-cols-3">
          <div className="rounded-xl border border-grey-200 bg-white p-6 shadow-sm">
            <div className="mb-3 text-2xl">🎟️</div>
            <h3 className="p-bold-18 mb-2">Ticketing & Sales</h3>
            <p className="p-regular-14 text-grey-500">
              Set ticket pricing, manage inventory, and receive automated payouts via Stripe.
            </p>
          </div>

          <div className="rounded-xl border border-grey-200 bg-white p-6 shadow-sm">
            <div className="mb-3 text-2xl">📱</div>
            <h3 className="p-bold-18 mb-2">Door QR Scanner</h3>
            <p className="p-regular-14 text-grey-500">
              Validate attendee tickets in real-time with our mobile camera check-in tool.
            </p>
          </div>

          <div className="rounded-xl border border-grey-200 bg-white p-6 shadow-sm">
            <div className="mb-3 text-2xl">📊</div>
            <h3 className="p-bold-18 mb-2">Audience Analytics</h3>
            <p className="p-regular-14 text-grey-500">
              Track orders, sales volume, and attendee demographics in real-time.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <BecomeCreatorButton />
          <p className="text-xs text-grey-400">
            By activating, your account permissions will instantly unlock event creation.
          </p>
        </div>
      </div>
    </div>
  );
}

