"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Check, AlertCircle, FileText, ArrowRight, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { inngest } from "@/lib/inngest/client";

export function FileUploader({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  
  // Convex mutations
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createReceipt = useMutation(api.receipts.createReceipt);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setUploadSuccess(false);
    setUploadError("");
    setUploadProgress(0);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
      setUploadSuccess(false);
      setUploadError("");
      setUploadProgress(0);
    } else {
      setUploadError("Please upload a PDF file");
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const simulateProgress = () => {
    // Simulate upload progress since fetch doesn't provide progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);
    
    return interval;
  };
  
  const handleUpload = async () => {
    if (!file || !userId) return;
    
    try {
      setUploading(true);
      setUploadError("");
      setUploadProgress(0);
      
      // Start progress simulation
      const progressInterval = simulateProgress();
      
      // 1. Get a temporary upload URL from Convex
      const uploadUrl = await generateUploadUrl({ userId });
      
      // 2. Upload the file to the storage provider
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!result.ok) {
        clearInterval(progressInterval);
        throw new Error(`Upload failed: ${result.statusText}`);
      }
      
      // 3. Get the file ID from the upload response
      const { storageId } = await result.json();
      
      // 4. Create a new receipt record in the database
      const receiptId = await createReceipt({
        userId,
        fileId: storageId,
        fileName: file.name,
      });
      
      // Upload complete
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadSuccess(true);
      setUploading(false);
      
      // Send the receipt/uploaded event to Inngest to trigger processing
      try {
        await inngest.send({
          name: "receipt/uploaded",
          data: {
            userId,
            receiptId,
            fileId: storageId,
          },
        });
        
        console.log("Inngest event sent: receipt/uploaded");
      } catch (inngestError) {
        console.error("Failed to send Inngest event:", inngestError);
        // We don't want to show an error to the user if Inngest fails
        // The receipt was still uploaded successfully
      }
      
      toast({
        title: "Receipt uploaded successfully",
        description: "Your receipt is being processed.",
      });
      
      // Navigate to the receipt details page
      setTimeout(() => {
        router.push(`/dashboard/receipts/${receiptId}`);
      }, 2000);
      
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error instanceof Error ? error.message : "An unknown error occurred");
      setUploading(false);
      setUploadProgress(0);
      
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Upload Receipt</CardTitle>
        <CardDescription>
          Upload a PDF receipt to extract data using our AI-powered system
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* File upload area */}
          <div
            className={`
              border-2 border-dashed rounded-xl p-10 transition-all
              ${file ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-950/10'}
            `}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input 
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            
            <div className="flex flex-col items-center justify-center text-center">
              {file ? (
                <>
                  <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{file.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                  </p>
                  {!uploading && !uploadSuccess && (
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Ready to upload
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Drag & Drop or Click to Upload</h3>
                  <p className="text-sm text-muted-foreground">
                    Supports PDF files up to 10MB
                  </p>
                </>
              )}
            </div>
          </div>
          
          {/* Progress bar when uploading */}
          {(uploading || uploadSuccess) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {uploadSuccess ? "Upload complete" : "Uploading..."}
                </span>
                <span className="text-sm text-muted-foreground">
                  {uploadProgress}%
                </span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              {uploadSuccess && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Receipt uploaded successfully! Redirecting to details...
                </p>
              )}
            </div>
          )}
          
          {/* Error message */}
          {uploadError && (
            <div className="bg-destructive/10 p-4 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-destructive mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Upload failed</p>
                <p className="text-sm text-destructive/90 mt-1">{uploadError}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setFile(null);
            setUploadError("");
            setUploadProgress(0);
            setUploadSuccess(false);
          }}
          disabled={!file || uploading}
          className="sm:w-auto w-full"
        >
          Clear
        </Button>
        
        <Button
          className="sm:w-auto w-full flex items-center gap-2"
          onClick={handleUpload}
          disabled={!file || uploading || uploadSuccess}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : uploadSuccess ? (
            <>
              <Check className="h-4 w-4" />
              Uploaded Successfully
            </>
          ) : (
            <>
              Upload Receipt
              <ArrowRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
