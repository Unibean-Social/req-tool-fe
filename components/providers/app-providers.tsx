"use client";

import * as React from "react";

import { NavigationProgress } from "@/components/ui/navigation-progress";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { DataStoresProvider } from "@/lib/providers";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <DataStoresProvider>
      <TooltipProvider delay={0}>
        <NavigationProgress />
        {children}
        <Toaster position="bottom-center" closeButton richColors />
      </TooltipProvider>
    </DataStoresProvider>
  );
}
