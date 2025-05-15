import { auth } from "@clerk/nextjs";
import { SubscriptionPlanSettings } from "@/components/subscription-plan-settings";
import { AccountSettings } from "@/components/account-settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  const { userId } = auth();
  
  if (!userId) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account and subscription settings.
        </p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Update your account preferences and personal information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccountSettings userId={userId} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              Manage your subscription plan and billing details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubscriptionPlanSettings userId={userId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
