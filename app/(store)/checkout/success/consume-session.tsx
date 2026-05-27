'use client';

import { useEffect } from "react";
import { deleteCheckoutSession } from "@/app/actions/checkout";

export function ConsumeSession({ userId }: { userId: string }) {
  useEffect(() => {
    deleteCheckoutSession(userId);
  }, [userId]);

  return null;
}