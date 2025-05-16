"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

interface TestReceiptItem {
  name: string;
  price: number;
  quantity: number;
}

export function TestReceiptForm() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [merchant, setMerchant] = useState("Test Shop");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [total, setTotal] = useState("48.99");
  const [items, setItems] = useState<string>(`[
  {
    "name": "Test Item 1",
    "price": 19.99,
    "quantity": 1
  },
  {
    "name": "Test Item 2",
    "price": 29.00,
    "quantity": 1
  }
]`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('⏳ Form submitted, creating test receipt...');
    
    try {
      // Parse the items JSON
      let parsedItems: TestReceiptItem[];
      try {
        parsedItems = JSON.parse(items);
        console.log('✅ Successfully parsed items JSON:', parsedItems);
      } catch (error) {
        toast.error("Invalid items JSON format");
        console.error("❌ Failed to parse items JSON:", error);
        setIsLoading(false);
        return;
      }
      
      // Log the data we're about to send
      const requestData = {
        userId: user?.id || "test-user-123",
        merchant,
        date,
        total,
        items: parsedItems,
      };
      console.log('📤 Sending test receipt data:', requestData);
      
      // Send the test data to the API with full error capture
      console.log('📡 Sending request to /api/test-receipt');
      const response = await fetch("/api/test-receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      
      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📥 Response data:', data);
      
      if (!response.ok) {
        console.error('❌ Server returned error:', data);
        throw new Error(data.details || data.error || "Failed to create test receipt");
      }
      
      toast.success("Test receipt created successfully!");
      console.log("✅ Receipt created with ID:", data.receiptId);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Failed to create test receipt: ${errorMessage}`);
      console.error("❌ Error creating test receipt:", error);
      
      // Display full detailed error to help debugging
      console.error('📌 DETAILED ERROR INFO:');
      console.error('- Message:', errorMessage);
      console.error('- Stack:', error instanceof Error ? error.stack : 'No stack available');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Test Receipt Data</CardTitle>
        <CardDescription>
          Create a test receipt with custom data to test Inngest workflow
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="merchant">Merchant</Label>
            <Input
              id="merchant"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="Walmart, Target, etc."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="total">Total Amount</Label>
            <Input
              id="total"
              type="number"
              step="0.01"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              placeholder="48.99"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="items">Items (JSON format)</Label>
            <Textarea
              id="items"
              value={items}
              onChange={(e) => setItems(e.target.value)}
              rows={8}
              placeholder="[{name, price, quantity}]"
            />
            <p className="text-xs text-muted-foreground">
              JSON array with items: each must have name, price, and quantity
            </p>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Test Receipt"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
