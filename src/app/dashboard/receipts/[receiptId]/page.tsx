import { ClientReceiptDetailsPage } from "@/components/client-receipt-details-page";
import { Metadata } from "next";

type Props = {
  params: { receiptId: string }
  searchParams: Record<string, string | string[] | undefined>
}

// Server component that renders a client component for receipt details
export default function ReceiptDetailsPage({ params }: Props) {
  return <ClientReceiptDetailsPage receiptId={params.receiptId} />;
}
