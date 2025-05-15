"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProvider } from "convex/react";
import { ReactNode } from "react";

// Create the Convex client
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

export function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Use the standard ConvexProvider without Clerk integration for now
  // This will use the anonymous access we configured
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}
