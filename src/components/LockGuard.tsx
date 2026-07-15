"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function LockGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    const unlocked = localStorage.getItem("dradix_unlocked") === "true";

    if (!unlocked && pathname !== "/coming-soon") {
      router.replace("/coming-soon");
    } else if (unlocked && pathname === "/coming-soon") {
      router.replace("/dashboard");
    }

    const timer = setTimeout(() => {
      setIsUnlocked(unlocked);
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname, router]);

  if (isUnlocked === null) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 font-sans text-sm tracking-wider">
        Loading...
      </div>
    );
  }

  if (!isUnlocked && pathname !== "/coming-soon") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 font-sans text-sm tracking-wider">
        Redirecting to Private Preview...
      </div>
    );
  }

  return <>{children}</>;
}
