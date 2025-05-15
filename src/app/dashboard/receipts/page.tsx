import { auth } from "@clerk/nextjs";
import { ReceiptList } from "@/components/receipt-list";

export default function ReceiptsPage() {
  const { userId } = auth();
  
  if (!userId) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Receipts</h2>
        <p className="text-muted-foreground">
          View and manage all your uploaded receipts.
        </p>
      </div>
      
      <ReceiptList userId={userId} />
    </div>
  );
}
