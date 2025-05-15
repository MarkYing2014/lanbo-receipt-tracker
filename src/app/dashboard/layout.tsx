import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";
import { MobileNav } from "@/components/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Desktop Header */}
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
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Main Content */}
      <main className="flex-1 container py-6">{children}</main>
    </div>
  );
}
