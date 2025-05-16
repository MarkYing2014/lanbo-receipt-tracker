import { ClientReceiptDetailsPage } from "@/components/client-receipt-details-page";

// Server component that renders a client component for receipt details
export default function ReceiptDetailsPage({
  params,
}: {
  params: { receiptId: string };
}) {
  return <ClientReceiptDetailsPage receiptId={params.receiptId} />;
}
