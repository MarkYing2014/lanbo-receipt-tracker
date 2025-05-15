"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "./ui/button";

export function RecentReceipts({ userId }: { userId: string }) {
  // Fetch recent receipts
  const recentReceipts = useQuery(api.receipts.getRecentReceipts, {
    userId,
    limit: 5,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Receipts</CardTitle>
        <Link href="/dashboard/receipts">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {recentReceipts?.length ? (
          <div className="space-y-4">
            {recentReceipts.map((receipt) => (
              <Link 
                href={`/dashboard/receipts/${receipt._id}`}
                key={receipt._id}
                className="flex items-center justify-between rounded-md border p-2 hover:bg-muted transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-sm">
                    {receipt.merchant || "Unknown Merchant"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ${receipt.total?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {receipt.date 
                    ? format(new Date(receipt.date), "MMM d, yyyy")
                    : format(new Date(receipt._creationTime), "MMM d, yyyy")
                  }
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No receipts yet</p>
            <Link href="/dashboard/upload" className="mt-2 inline-block">
              <Button size="sm">Upload Receipt</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
