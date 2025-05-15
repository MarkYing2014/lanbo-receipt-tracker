"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, FileText, Calendar, Store, DollarSign, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function ReceiptDetails({ receiptId, userId }: { receiptId: string; userId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch receipt data
  const receipt = useQuery(api.receipts.getReceipt, { 
    id: receiptId as any
  });

  const userPlan = useQuery(api.users.getUserPlan, { userId });
  
  // Get receipt file
  const file = receipt?.fileId ? useQuery(api.files.getFile, { 
    fileId: receipt.fileId 
  }) : null;
  
  // Mutations
  const updateReceipt = useMutation(api.receipts.updateReceiptData);
  const deleteReceipt = useMutation(api.receipts.deleteReceipt);
  
  // Form state
  const [formData, setFormData] = useState({
    merchant: "",
    date: "",
    total: "",
    category: "",
    items: [] as Array<{ 
      name: string; 
      quantity?: number; 
      unitPrice?: number;
      totalPrice?: number;
    }>,
  });
  
  // Initialize form data when receipt is loaded
  if (receipt && !formData.merchant) {
    setFormData({
      merchant: receipt.merchant || "",
      date: receipt.date || "",
      total: receipt.total?.toString() || "",
      category: receipt.category || "",
      items: receipt.items || [],
    });
  }
  
  if (!receipt) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading receipt...</p>
        </div>
      </div>
    );
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...formData.items];
    
    if (field === "name") {
      updatedItems[index] = {
        ...updatedItems[index],
        name: value,
      };
    } else if (field === "quantity" || field === "unitPrice" || field === "totalPrice") {
      const numValue = value === "" ? undefined : parseFloat(value);
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: numValue,
      };
    }
    
    setFormData({
      ...formData,
      items: updatedItems,
    });
  };
  
  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { name: "" },
      ],
    });
  };
  
  const removeItem = (index: number) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData({
      ...formData,
      items: updatedItems,
    });
  };
  
  const saveChanges = async () => {
    try {
      // Convert form data to appropriate types
      const parsedTotal = formData.total ? parseFloat(formData.total) : undefined;
      
      // Update receipt data
      if (receipt?._id) {
        await updateReceipt({
          receiptId: receipt._id,
          merchant: formData.merchant || "",
          date: formData.date || "",
          total: parsedTotal,
          category: formData.category || "",
          items: formData.items,
          status: "manual_edit"
        });
      }
      
      toast({
        title: "Receipt updated",
        description: "The receipt information has been updated successfully.",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating receipt:", error);
      toast({
        title: "Error",
        description: "Failed to update receipt information.",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteReceipt({ receiptId: receipt._id as any });
      
      toast({
        title: "Receipt deleted",
        description: "The receipt has been permanently deleted.",
      });
      
      // Navigate back to receipts page
      router.push("/dashboard/receipts");
    } catch (error) {
      console.error("Error deleting receipt:", error);
      setIsDeleting(false);
      toast({
        title: "Error",
        description: "Failed to delete the receipt.",
        variant: "destructive",
      });
    }
  };
  
  const receiptDate = receipt.date 
    ? new Date(receipt.date) 
    : receipt._creationTime 
      ? new Date(receipt._creationTime) 
      : new Date();
  
  const formattedDate = format(receiptDate, "MMMM d, yyyy");
  const formattedTime = format(receiptDate, "h:mm a");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            asChild
          >
            <Link href="/dashboard/receipts">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to receipts</span>
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Receipt Details</h2>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={saveChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          {userPlan?.planTier === "pro" && <TabsTrigger value="summary">AI Summary</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="details" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-primary" />
                  <CardTitle className="text-lg">Merchant</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-2">
                    <Label htmlFor="merchant">Merchant Name</Label>
                    <Input
                      id="merchant"
                      name="merchant"
                      value={formData.merchant}
                      onChange={handleInputChange}
                      placeholder="Enter merchant name"
                    />
                  </div>
                ) : (
                  <p className="text-xl font-semibold">
                    {receipt.merchant || "Unknown Merchant"}
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <CardTitle className="text-lg">Date</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-2">
                    <Label htmlFor="date">Receipt Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date ? formData.date.split('T')[0] : ""}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-xl font-semibold">{formattedDate}</p>
                    <p className="text-sm text-muted-foreground">{formattedTime}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <CardTitle className="text-lg">Total</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-2">
                    <Label htmlFor="total">Total Amount</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      <Input
                        id="total"
                        name="total"
                        type="number"
                        step="0.01"
                        value={formData.total}
                        onChange={handleInputChange}
                        className="pl-7"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-2xl font-semibold">
                    ${receipt.total?.toFixed(2) || "0.00"}
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <CardTitle className="text-lg">Category</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-2">
                    <Label htmlFor="category">Receipt Category</Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="E.g., Groceries, Utilities, etc."
                    />
                  </div>
                ) : (
                  <Badge variant="outline">
                    {receipt.category || "Uncategorized"}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>
          
          {file && (
            <Card>
              <CardHeader>
                <CardTitle>Receipt PDF</CardTitle>
                <CardDescription>
                  Original uploaded receipt document
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-[3/4] relative bg-muted rounded-md overflow-hidden">
                  <iframe
                    src={file.url}
                    className="absolute inset-0 w-full h-full"
                    title="Receipt PDF"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <a 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Open PDF in new tab
                </a>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="items" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
              <CardDescription>
                Individual items from this receipt
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  {formData.items.length > 0 ? (
                    <div className="space-y-4">
                      {formData.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-5">
                            <Input
                              value={item.name}
                              onChange={(e) => handleItemChange(index, "name", e.target.value)}
                              placeholder="Item name"
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              type="number"
                              step="1"
                              min="1"
                              value={item.quantity !== undefined ? item.quantity : ""}
                              onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                              placeholder="Qty"
                            />
                          </div>
                          <div className="col-span-2">
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={item.unitPrice !== undefined ? item.unitPrice : ""}
                                onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                                placeholder="Unit"
                                className="pl-7"
                              />
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={item.totalPrice !== undefined ? item.totalPrice : ""}
                                onChange={(e) => handleItemChange(index, "totalPrice", e.target.value)}
                                placeholder="Total"
                                className="pl-7"
                              />
                            </div>
                          </div>
                          <div className="col-span-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(index)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No items added yet</p>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addItem}
                    className="w-full"
                  >
                    Add Item
                  </Button>
                </div>
              ) : (
                <div>
                  {receipt.items && receipt.items.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Unit Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {receipt.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-right">{item.quantity || ""}</TableCell>
                            <TableCell className="text-right">{item.unitPrice ? `$${item.unitPrice.toFixed(2)}` : ""}</TableCell>
                            <TableCell className="text-right">{item.totalPrice ? `$${item.totalPrice.toFixed(2)}` : ""}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No items found for this receipt</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {userPlan?.planTier === "pro" && (
          <TabsContent value="summary" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Summary</CardTitle>
                <CardDescription>
                  AI-generated summary of your receipt
                </CardDescription>
              </CardHeader>
              <CardContent>
                {receipt.aiSummary ? (
                  <div className="prose max-w-none">
                    <p>{receipt.aiSummary}</p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">No AI summary available for this receipt</p>
                    <Button>Generate Summary</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
