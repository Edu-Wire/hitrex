"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAdminAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    // Check if user has admin role
    if (session.user?.role !== "admin") {
      setIsAdmin(false);
      setLoading(false);
      router.push("/");
      return;
    }

    setIsAdmin(true);
    setLoading(false);
  }, [session, status, router]);

  return { isAdmin, loading, session };
}
