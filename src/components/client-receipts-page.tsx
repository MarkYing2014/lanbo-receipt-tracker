"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ReceiptList } from "@/components/receipt-list";
import { TestReceiptForm } from "@/components/test-receipt-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ClientReceiptsPage() {
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
          <p className="text-md text-muted-foreground font-medium">Loading receipts...</p>
        </div>
      </div>
    );
  }
  
  const [activeTab, setActiveTab] = useState("receipts");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Receipts</h2>
        <p className="text-muted-foreground">
          View and manage all your uploaded receipts. 
          Use the test tab for generating sample data.
        </p>
      </div>
      
      <Tabs defaultValue="receipts" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="receipts">My Receipts</TabsTrigger>
          <TabsTrigger value="test">Test Receipt Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="receipts">
          <ReceiptList userId={userId} />
        </TabsContent>
        
        <TabsContent value="test">
          <div className="max-w-2xl mx-auto">
            <TestReceiptForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
