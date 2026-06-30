"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminSession } from "@/lib/auth";

export default function AdminRoot() {
  const router = useRouter();
  useEffect(() => {
    const session = getAdminSession();
    router.push(session ? "/dashboard" : "/auth");
  }, [router]);
  return (
    <div className="min-h-screen bg-[#1b4332] flex items-center justify-center">
      <div className="h-8 w-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  );
}
