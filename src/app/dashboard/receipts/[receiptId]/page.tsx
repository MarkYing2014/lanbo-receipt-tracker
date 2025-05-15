import { auth } from "@clerk/nextjs";
import { ReceiptDetails } from "@/components/receipt-details";

export default function ReceiptDetailsPage({
  params
}: {
  params: { receiptId: string }
}) {
  const { userId } = auth();
  
  if (!userId) {
    return null;
  }

  return <ReceiptDetails receiptId={params.receiptId} userId={userId} />;
}
