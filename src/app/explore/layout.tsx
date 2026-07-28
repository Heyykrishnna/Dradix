"use client";

import MainLayout from "@/components/MainLayout";
import AuthGuard from "@/components/AuthGuard";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
}
