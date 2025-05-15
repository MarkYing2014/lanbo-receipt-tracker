"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-8 w-[100px] mb-2" />
            <Skeleton className="h-6 w-[60px]" />
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-2">
          <Card className="p-6">
            <Skeleton className="h-8 w-[120px] mb-6" />
            <div className="space-y-2">
              <Skeleton className="h-[200px]" />
            </div>
          </Card>
        </div>
        <div>
          <Card className="p-6">
            <Skeleton className="h-8 w-[140px] mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
