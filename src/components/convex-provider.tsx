"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

export function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const auth = useAuth();
  
  return (
    <ConvexProviderWithClerk client={convex} useAuth={auth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
