import { ClientReceiptDetailsPage } from "@/components/client-receipt-details-page";

export interface PageParams {
  receiptId: string;
}

// Server component that renders a client component for receipt details
export default function ReceiptDetailsPage({
  params,
}: {
  params: PageParams;
}) {
  const { receiptId } = params;
  return <ClientReceiptDetailsPage receiptId={receiptId} />;
}
