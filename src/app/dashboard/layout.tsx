"use client";

import { ReactNode } from 'react';
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isLoaded } = useUser();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <div className="flex items-center">
                <div className="bg-blue-600 rounded-md p-1 mr-1">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <span className="font-semibold text-xl">蓝博</span>
              </div>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:text-blue-600"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/receipts"
              className="text-sm font-medium transition-colors hover:text-blue-600"
            >
              Receipts
            </Link>
            <Link
              href="/dashboard/upload"
              className="text-sm font-medium transition-colors hover:text-blue-600"
            >
              Upload
            </Link>
            <Link
              href="/dashboard/settings"
              className="text-sm font-medium transition-colors hover:text-blue-600"
            >
              Settings
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            {isLoaded && <UserButton afterSignOutUrl="/" />}
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <div className="bg-white rounded-full shadow-lg p-3">
          <nav className="flex gap-4">
            <Link href="/dashboard" className="p-2 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
            </Link>
            <Link href="/dashboard/receipts" className="p-2 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
                <path d="M10 9H8" />
              </svg>
            </Link>
            <Link href="/dashboard/upload" className="p-2 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
            </Link>
            <Link href="/dashboard/settings" className="p-2 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container py-6">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-white py-6">
        <div className="container text-center text-sm text-gray-600">
          © 2025 Lanbo 蓝博. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
