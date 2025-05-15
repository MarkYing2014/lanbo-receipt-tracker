"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, FileText, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Id } from "@/convex/_generated/dataModel";

export function ReceiptList({ userId }: { userId: string }) {
  const { toast } = useToast();
  const receipts = useQuery(api.receipts.getAllReceipts, { userId });
  const [search, setSearch] = useState("");

  // Filter receipts based on search term
  const filteredReceipts = receipts?.filter((receipt) => {
    if (!search) return true;
    
    const searchLower = search.toLowerCase();
    const merchantMatches = receipt.merchant?.toLowerCase().includes(searchLower) ?? false;
    const dateMatches = receipt.date?.toLowerCase().includes(searchLower) ?? false;
    const totalMatches = receipt.total?.toString().includes(searchLower) ?? false;
    
    return merchantMatches || dateMatches || totalMatches;
  });

  if (!receipts || receipts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Receipts Found</CardTitle>
          <CardDescription>
            You haven't uploaded any receipts yet.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/dashboard/upload">
            <Button>Upload Receipt</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Receipts</CardTitle>
          <Link href="/dashboard/upload">
            <Button>Upload New</Button>
          </Link>
        </div>
        <div className="flex w-full max-w-sm items-center space-x-2 mt-2">
          <Input
            placeholder="Search receipts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
          <Button variant="outline" size="sm" className="px-3 h-9">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReceipts?.map((receipt) => (
                <TableRow key={receipt._id}>
                  <TableCell className="font-medium">
                    {receipt.merchant || "Unknown"}
                  </TableCell>
                  <TableCell>
                    {receipt.date 
                      ? format(new Date(receipt.date), "MMM d, yyyy")
                      : format(new Date(receipt._creationTime), "MMM d, yyyy")
                    }
                  </TableCell>
                  <TableCell>
                    ${receipt.total?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={receipt.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/receipts/${receipt._id}`}>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getColorClass = () => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "manual_edit":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getColorClass()}`}>
      {status === "processing" ? "Processing" :
       status === "completed" ? "Completed" :
       status === "failed" ? "Failed" :
       status === "manual_edit" ? "Manual Edit" :
       status}
    </span>
  );
}
