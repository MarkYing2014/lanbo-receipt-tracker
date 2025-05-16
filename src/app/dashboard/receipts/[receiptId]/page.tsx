import { ClientReceiptDetailsPage } from "@/components/client-receipt-details-page";

// Server component that renders a client component for receipt details
export default function ReceiptDetailsPage({ params }: any) {
  return <ClientReceiptDetailsPage receiptId={params.receiptId} />;
}
