import { auth } from "@clerk/nextjs";
import { Suspense } from "react";
import { UsageStats } from "@/components/usage-stats";
import { RecentReceipts } from "@/components/recent-receipts";
import { ExpenseSummary } from "@/components/expense-summary";
import { DashboardSkeleton } from "@/components/skeletons";

export default function Dashboard() {
  const { userId } = auth();
  
  if (!userId) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          View your receipt stats and recent uploads.
        </p>
      </div>
      
      <Suspense fallback={<DashboardSkeleton />}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <UsageStats userId={userId} />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2">
            <ExpenseSummary userId={userId} />
          </div>
          <div>
            <RecentReceipts userId={userId} />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
