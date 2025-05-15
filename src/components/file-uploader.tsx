"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, File, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function FileUploader({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  
  // Convex mutations
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createReceipt = useMutation(api.receipts.createReceipt);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file is a PDF
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    // Validate file is a PDF
    if (droppedFile.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setFile(droppedFile);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const uploadFile = async () => {
    if (!file || isUploading) return;

    try {
      setIsUploading(true);
      setError(null);
      
      // Step 1: Get a signed upload URL from Convex
      const uploadUrl = await generateUploadUrl({ userId });
      
      // Step 2: Upload the file to the storage provider directly
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener("loadend", async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const fileId = JSON.parse(xhr.responseText).storageId;
          
          // Step 3: Create a receipt record in the database
          await createReceipt({
            userId,
            fileId,
            fileName: file.name,
          });
          
          toast({
            title: "Receipt uploaded successfully",
            description: "Your receipt is being processed",
          });
          
          // Navigate to dashboard after successful upload
          router.push("/dashboard");
        } else {
          setError("Upload failed");
        }
        setIsUploading(false);
      });

      xhr.addEventListener("error", () => {
        setError("Upload failed");
        setIsUploading(false);
      });

      xhr.open("POST", uploadUrl, true);
      xhr.send(file);

    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
      setIsUploading(false);
    }
  };

  const resetFileInput = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="p-6">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          error ? "border-destructive" : "border-border"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {!file ? (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload Receipt</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your PDF receipt or click to browse
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              Select PDF File
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="hidden"
            />
          </>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <File className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">{file.name}</h3>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024).toFixed(2)} KB
            </p>
            
            {isUploading ? (
              <div className="space-y-2">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            ) : (
              <div className="flex justify-center gap-2">
                <Button onClick={uploadFile}>
                  Upload Receipt
                </Button>
                <Button
                  variant="outline"
                  onClick={resetFileInput}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}
        
        {error && (
          <div className="mt-4 flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-sm text-muted-foreground">
        <p>
          <strong>Supported formats:</strong> PDF files only
        </p>
        <p className="mt-1">
          <strong>Max file size:</strong> 10MB
        </p>
      </div>
    </Card>
  );
}
