"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Define plan features
const planFeatures = {
  free: {
    name: "Free Plan",
    price: "$0",
    features: [
      "10 receipts per month",
      "Basic receipt extraction",
      "Dashboard analytics",
    ],
  },
  starter: {
    name: "Starter Plan",
    price: "$9.99",
    features: [
      "50 receipts per month",
      "Advanced receipt extraction",
      "Dashboard analytics",
      "CSV export",
      "Email support",
    ],
  },
  pro: {
    name: "Pro Plan",
    price: "$19.99",
    features: [
      "200 receipts per month",
      "Premium receipt extraction",
      "Dashboard analytics",
      "CSV & PDF export",
      "AI receipt summaries",
      "Priority support",
      "Custom categories",
    ],
  },
};

export function SubscriptionPlanSettings({ userId }: { userId: string }) {
  const { toast } = useToast();
  const userPlan = useQuery(api.users.getUserPlan, { userId });
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // When user data is loaded, set the selected plan
  if (userPlan && selectedPlan === null) {
    setSelectedPlan(userPlan.planTier);
  }

  const handleUpgrade = async () => {
    if (!selectedPlan || selectedPlan === userPlan?.planTier) return;

    setIsLoading(true);

    // In a real app, this would redirect to Stripe/Schematic
    // checkout or call a backend API to handle the subscription
    toast({
      title: "Redirecting to checkout",
      description: "You will be redirected to complete your subscription",
    });

    // Simulate a delay for demo purposes
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Since this is a demo, simulate subscription success
    toast({
      title: "Plan upgraded successfully!",
      description: `You are now on the ${planFeatures[selectedPlan as keyof typeof planFeatures].name}`,
    });
    
    setIsLoading(false);
  };

  if (!userPlan) {
    // Loading state
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 w-full bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Current Plan: {planFeatures[userPlan.planTier as keyof typeof planFeatures].name}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {userPlan.billingPeriodStart && userPlan.billingPeriodEnd
            ? `Your billing period is from ${new Date(userPlan.billingPeriodStart).toLocaleDateString()} to ${new Date(userPlan.billingPeriodEnd).toLocaleDateString()}`
            : "Choose a plan that suits your needs"}
        </p>
      </div>

      <RadioGroup 
        value={selectedPlan || userPlan.planTier} 
        onValueChange={setSelectedPlan}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {Object.entries(planFeatures).map(([key, plan]) => (
          <PlanOption
            key={key}
            id={key}
            name={plan.name}
            price={plan.price}
            features={plan.features}
            isCurrentPlan={userPlan.planTier === key}
          />
        ))}
      </RadioGroup>

      <div className="flex justify-end">
        <Button
          onClick={handleUpgrade}
          disabled={isLoading || selectedPlan === userPlan.planTier}
        >
          {isLoading ? "Processing..." : "Update Subscription"}
        </Button>
      </div>
    </div>
  );
}

interface PlanOptionProps {
  id: string;
  name: string;
  price: string;
  features: string[];
  isCurrentPlan: boolean;
}

function PlanOption({ id, name, price, features, isCurrentPlan }: PlanOptionProps) {
  return (
    <div className="relative">
      <RadioGroupItem
        value={id}
        id={`plan-${id}`}
        className="peer sr-only"
      />
      <Label
        htmlFor={`plan-${id}`}
        className={`flex flex-col p-4 rounded-lg border-2 h-full cursor-pointer transition-colors
          ${isCurrentPlan ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/25'}
          peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5`}
      >
        {isCurrentPlan && (
          <span className="absolute -right-2 -top-2 bg-primary rounded-full p-1">
            <Check className="h-4 w-4 text-white" />
          </span>
        )}
        <span className="font-semibold">{name}</span>
        <span className="text-xl font-bold mt-2 mb-4">{price}<span className="text-sm font-normal text-muted-foreground">/month</span></span>
        <ul className="space-y-2 text-sm flex-grow">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center">
              <Check className="h-4 w-4 mr-2 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </Label>
    </div>
  );
}
