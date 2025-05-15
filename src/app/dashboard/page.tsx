export default function Dashboard() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Welcome to your receipt tracking dashboard. Here you can view your stats and manage your receipts.
      </p>
      
      {/* Load the client component */}
      <ClientDashboard />
    </div>
  );
}

// Import at the top level
import { ClientDashboard } from "@/components/client-dashboard";
