"use client";

import MainLayout from "@/components/MainLayout";
import AuthGuard from "@/components/AuthGuard";

export default function ProfileLayout({
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
