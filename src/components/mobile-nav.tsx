"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden block">
        <Button
          variant="ghost"
          size="sm"
          className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 shadow-lg"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="md:hidden">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <nav className="flex flex-col gap-4 py-4">
          <Link
            href="/dashboard"
            className="text-md font-medium transition-colors hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/receipts"
            className="text-md font-medium transition-colors hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Receipts
          </Link>
          <Link
            href="/dashboard/upload"
            className="text-md font-medium transition-colors hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Upload
          </Link>
          <Link
            href="/dashboard/settings"
            className="text-md font-medium transition-colors hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
