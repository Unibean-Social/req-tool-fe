"use client";

import React from "react";
import { motion } from "framer-motion";

import { OrgOnboardingIntro } from "./orgOnboardingIntro";

type OrgOnboardingFlowProps = {
  onComplete: () => void;
};

export function OrgOnboardingFlow({ onComplete }: OrgOnboardingFlowProps) {
  const finish = () => onComplete();

  return (
    <motion.div
      className="fixed inset-0 z-100 flex min-h-screen flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(12px)" }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="absolute inset-0 bg-background/50 backdrop-blur-2xl dark:bg-zinc-950/55"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
      />
      <div className="relative z-10 flex min-h-screen w-full flex-1 flex-col">
        <OrgOnboardingIntro onSkip={finish} onComplete={finish} />
      </div>
    </motion.div>
  );
}
