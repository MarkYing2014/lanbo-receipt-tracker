import { FileUploader } from "@/components/file-uploader";
import { auth } from "@clerk/nextjs";

export default function UploadPage() {
  const { userId } = auth();
  
  if (!userId) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Upload Receipt</h2>
        <p className="text-muted-foreground">
          Upload a PDF receipt to extract data automatically
        </p>
      </div>
      
      <FileUploader userId={userId} />
    </div>
  );
}
