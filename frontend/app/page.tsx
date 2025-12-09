"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import PublicHome from "@/components/HomePage";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();

  // useEffect(() => {
  //   if (!isLoading) {
  //     if (isAuthenticated) {
  //       if (user?.role === "ADMIN") {
  //         router.push("/admin/dashboard")
  //       } else {
  //         router.push("/dashboard")
  //       }
  //     } else {
  //       router.push("/login")
  //     }
  //   }
  // }, [isLoading, isAuthenticated, user, router])

  return (
    <>
      {/* <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div> */}
      <PublicHome />
    </>
  );
}
