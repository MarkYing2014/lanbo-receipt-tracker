"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export function DashboardHeader() {
  const { isLoaded } = useUser();
  
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <div className="flex items-center">
              <div className="bg-primary rounded-md p-1 mr-1">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="font-semibold text-xl">蓝博</span>
            </div>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/receipts"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Receipts
          </Link>
          <Link
            href="/dashboard/upload"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Upload
          </Link>
          <Link
            href="/dashboard/settings"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Settings
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {isLoaded ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
