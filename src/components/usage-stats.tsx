"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Activity, Upload, Clock } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function UsageStats({ userId }: { userId: string }) {
  // Fetching user plan and usage data
  const userPlan = useQuery(api.users.getUserPlan, { userId });
  const userStats = useQuery(api.receipts.getUserStats, { userId });
  
  const quota = userPlan?.quota ?? { receipts: 10 }; // Default to Free plan if not available
  const stats = userStats ?? {
    total: 0,
    thisMonth: 0,
    thisWeek: 0,
    lastUploaded: null,
  };
  
  // Calculate usage percentage
  const usagePercentage = Math.min(
    Math.round((stats.thisMonth / quota.receipts) * 100),
    100
  );

  return (
    <>
      <StatsCard
        title="Total Receipts"
        value={stats.total}
        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="This Month"
        value={stats.thisMonth}
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="This Week"
        value={stats.thisWeek}
        icon={<Upload className="h-4 w-4 text-muted-foreground" />}
      />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Quota</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.thisMonth}/{quota.receipts}
          </div>
          <Progress
            value={usagePercentage}
            className="h-2 mt-2"
          />
          <p className="pt-2 text-xs text-muted-foreground">
            {isNaN(usagePercentage) ? 0 : usagePercentage}% used
          </p>
        </CardContent>
      </Card>
    </>
  );
}

function StatsCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
