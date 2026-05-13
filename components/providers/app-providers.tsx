"use client";

import * as React from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { DataStoresProvider } from "@/lib/providers";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <DataStoresProvider>
      <TooltipProvider delay={0}>
        {children}
        <Toaster position="bottom-center" closeButton richColors />
      </TooltipProvider>
    </DataStoresProvider>
  );
}
