"use client";

import { FileUploader } from "@/components/file-uploader";
import { useUser } from "@clerk/nextjs";

export function ClientUploadPage() {
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
          <p className="text-md text-muted-foreground font-medium">Loading upload page...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Upload Receipt</h2>
        <p className="text-muted-foreground">
          Upload a PDF receipt to extract data using our AI-powered system
        </p>
      </div>
      
      <FileUploader userId={userId} />
    </div>
  );
}
