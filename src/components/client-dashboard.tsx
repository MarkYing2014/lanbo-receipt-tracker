"use client";

import { useUser } from "@clerk/nextjs";
import { Suspense } from "react";
import { UsageStats } from "@/components/usage-stats";
import { RecentReceipts } from "@/components/recent-receipts";
import { ExpenseSummary } from "@/components/expense-summary";
import { DashboardSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, TrendingUp, Settings } from "lucide-react";
import Link from "next/link";

export function ClientDashboard() {
  // Get the user from Clerk's client-side hook
  const { user, isLoaded } = useUser();
  // Use 'anonymous' as userId for our development with auth disabled
  const userId = user?.id || "anonymous";
  
  // Show loading state when Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <p className="text-md text-muted-foreground font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Render the dashboard content
  return (
    <div className="space-y-8">
      {/* Welcome section with quick action buttons */}
      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome{user ? `, ${user.firstName || 'User'}` : ' to Lanbo'}</h1>
            <p className="text-muted-foreground mt-1">
              Track your receipts and manage your expenses effortlessly.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard/upload">
                <PlusCircle className="mr-2 h-4 w-4" />
                Upload Receipt
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/receipts">
                <FileText className="mr-2 h-4 w-4" />
                View All Receipts
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <Suspense fallback={<DashboardSkeleton />}>
        {/* Usage stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <UsageStats userId={userId} />
        </div>
        
        {/* Expense summary and recent receipts */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2">
            <ExpenseSummary userId={userId} />
          </div>
          <div>
            <RecentReceipts userId={userId} />
          </div>
        </div>
        
        {/* Quick links section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Link href="/dashboard/receipts" className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow group">
            <div className="flex flex-col items-center text-center gap-2">
              <FileText className="h-8 w-8 text-blue-500 group-hover:text-blue-600" />
              <h3 className="font-semibold">All Receipts</h3>
              <p className="text-sm text-muted-foreground">Browse and manage all your receipts</p>
            </div>
          </Link>
          
          <Link href="/dashboard/upload" className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow group">
            <div className="flex flex-col items-center text-center gap-2">
              <PlusCircle className="h-8 w-8 text-green-500 group-hover:text-green-600" />
              <h3 className="font-semibold">Upload</h3>
              <p className="text-sm text-muted-foreground">Add a new receipt to your collection</p>
            </div>
          </Link>
          
          <Link href="/dashboard/analytics" className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow group">
            <div className="flex flex-col items-center text-center gap-2">
              <TrendingUp className="h-8 w-8 text-purple-500 group-hover:text-purple-600" />
              <h3 className="font-semibold">Analytics</h3>
              <p className="text-sm text-muted-foreground">View spending insights and trends</p>
            </div>
          </Link>
          
          <Link href="/dashboard/settings" className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow group">
            <div className="flex flex-col items-center text-center gap-2">
              <Settings className="h-8 w-8 text-gray-500 group-hover:text-gray-600" />
              <h3 className="font-semibold">Settings</h3>
              <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
            </div>
          </Link>
        </div>
      </Suspense>
    </div>
  );
}
