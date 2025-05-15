"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export function AccountSettings({ userId }: { userId: string }) {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

  if (!isLoaded) {
    return (
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const updateProfile = async () => {
    try {
      setIsUpdating(true);
      await user?.update({
        firstName: firstName,
        lastName: lastName,
      });

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile information.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={user?.primaryEmailAddress?.emailAddress || ""}
          disabled
          placeholder="Email address"
        />
      </div>

      <Button onClick={updateProfile} disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Save Changes"}
      </Button>
    </div>
  );
}
