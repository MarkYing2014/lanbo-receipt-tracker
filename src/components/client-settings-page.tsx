"use client";

import { useUser } from "@clerk/nextjs";
import { SubscriptionPlanSettings } from "@/components/subscription-plan-settings";
import { AccountSettings } from "@/components/account-settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ClientSettingsPage() {
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
          <p className="text-md text-muted-foreground font-medium">Loading settings...</p>
        </div>
      </div>
    );
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
        <Card className="shadow-sm border-gray-200 dark:border-gray-800">
          <CardHeader className="bg-gray-50/50 dark:bg-gray-900/20 border-b">
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Update your account preferences and personal information.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <AccountSettings userId={userId} />
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-gray-200 dark:border-gray-800">
          <CardHeader className="bg-gray-50/50 dark:bg-gray-900/20 border-b">
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              Manage your subscription plan and billing details.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <SubscriptionPlanSettings userId={userId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
