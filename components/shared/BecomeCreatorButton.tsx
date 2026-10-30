"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { becomeCreator } from "@/lib/actions/user.actions";

export default function BecomeCreatorButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      await becomeCreator();
      router.push("/events/create");
      router.refresh();
    } catch (err) {
      console.error("Failed to upgrade role:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleUpgrade}
      disabled={loading}
      size="lg"
      className="button rounded-full px-8 text-base"
    >
      {loading ? "Activating Creator Role..." : "Upgrade to Creator for Free"}
    </Button>
  );
}

