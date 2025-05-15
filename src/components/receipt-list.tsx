"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  ShoppingBag, 
  Calendar, 
  DollarSign,
  Tag,
  Clock,
  AlertCircle,
  Search,
  SlidersHorizontal,
  FileText,
  ArrowUpDown,
  Trash2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Id } from "../../convex/_generated/dataModel";

type Receipt = {
  _id: Id<"receipts">;
  _creationTime: number;
  merchant?: string;
  date?: string;
  total?: number;
  category?: string;
  status?: string;
  userId: string;
};

export function ReceiptList({ userId }: { userId: string }) {
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  // Fetch receipts from Convex backend
  const receipts = useQuery(api.receipts.getAllReceipts, { userId });
  const deleteReceipt = useMutation(api.receipts.deleteReceipt);

  // Filter receipts based on search query
  const filteredReceipts = receipts?.filter((receipt: Receipt) => {
    if (!search) return true;
    
    const searchLower = search.toLowerCase();
    return (
      (receipt.merchant?.toLowerCase().includes(searchLower) ?? false) ||
      (receipt.category?.toLowerCase().includes(searchLower) ?? false) ||
      (receipt.total?.toString().includes(searchLower) ?? false)
    );
  });

  // Handle delete receipt function
  const handleDeleteReceipt = async (receiptId: Id<"receipts">) => {
    try {
      // Show a toast notification that this is coming soon
      toast({
        title: "Coming Soon",
        description: "Delete functionality will be available soon",
      });

      // In the future, this will call the actual delete mutation
      // await deleteReceipt({ id: receiptId });
    } catch (error) {
      console.error("Failed to delete receipt:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete receipt",
      });
    }
  };

  // Function to get status badge style based on receipt status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-800/20 dark:text-green-400">
            <Clock className="mr-1 h-3 w-3" /> Processed
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-600 dark:text-amber-400">
            <Clock className="mr-1 h-3 w-3 animate-pulse" /> Processing
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-800/20 dark:text-red-400">
            <AlertCircle className="mr-1 h-3 w-3" /> Error
          </Badge>
        );
      case "manual_edit":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600 dark:text-blue-400">
            <Tag className="mr-1 h-3 w-3" /> Edited
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-600 dark:text-gray-400">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
    }
  };

  return (
    <Card className="w-full shadow-sm border-gray-200 dark:border-gray-800">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">Your Receipts</CardTitle>
            <CardDescription>
              View and manage all your uploaded receipts
            </CardDescription>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard/upload">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Upload Receipt
            </Link>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Search and filter controls */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between rounded-lg border p-4 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by merchant or category..."
                className="pl-9 bg-white dark:bg-gray-950"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Showing {filteredReceipts?.length || 0} receipts</span>
            </div>
          </div>

          {!receipts || receipts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 border border-dashed rounded-lg">
              <div className="h-16 w-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium mb-1">No receipts found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {search
                  ? "Try a different search term or clear the search to see all receipts"
                  : "Upload your first receipt to start tracking your expenses"}
              </p>
              {search && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearch("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-900">
                    <TableHead className="font-medium">Merchant</TableHead>
                    <TableHead className="font-medium">Date</TableHead>
                    <TableHead className="font-medium">Amount</TableHead>
                    <TableHead className="font-medium">Category</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="text-right font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReceipts?.map((receipt: Receipt) => (
                    <TableRow key={receipt._id} className="hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <ShoppingBag className="h-4 w-4 text-gray-500" />
                          <span>{receipt.merchant || "Unknown Merchant"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>
                            {receipt.date
                              ? format(new Date(receipt.date), "MMM d, yyyy")
                              : format(new Date(receipt._creationTime), "MMM d, yyyy")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            ${receipt.total?.toFixed(2) || "0.00"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Tag className="h-4 w-4 text-gray-500" />
                          <span>{receipt.category || "Uncategorized"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(receipt.status || "pending")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="h-8 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/50"
                          >
                            <Link href={`/dashboard/receipts/${receipt._id}`}>
                              <FileText className="h-3.5 w-3.5 mr-1" />
                              Details
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50"
                            onClick={() => handleDeleteReceipt(receipt._id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between border-t p-4 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredReceipts?.length || 0}</span> of <span className="font-medium">{receipts?.length || 0}</span> receipts
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/analytics">
            View Analytics
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
