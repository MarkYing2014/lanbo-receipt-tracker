"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { startOfMonth, endOfMonth, format } from "date-fns";

export function ExpenseSummary({ userId }: { userId: string }) {
  const currentDate = new Date();
  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  
  // Fetch monthly expenses
  const monthlySummary = useQuery(api.receipts.getMonthlySummary, {
    userId,
    startDate: startOfCurrentMonth.toISOString(),
    endDate: endOfCurrentMonth.toISOString(),
  });
  
  const monthName = format(currentDate, "MMMM yyyy");
  
  // Format categories for display
  const categories = monthlySummary?.byCategory || [];
  const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount);
  
  // Calculate total spending
  const totalSpent = monthlySummary?.total || 0;
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Expense Summary - {monthName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-2xl font-bold">
            ${totalSpent.toFixed(2)}
          </div>
          
          {sortedCategories.length > 0 ? (
            <div className="space-y-2">
              {sortedCategories.map((category) => (
                <div key={category.name} className="grid grid-cols-3 items-center">
                  <span className="col-span-1 font-medium">
                    {category.name}
                  </span>
                  <div className="col-span-1 flex items-center">
                    <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(category.amount / totalSpent) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="col-span-1 text-right">
                    ${category.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No expense data for this month</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
