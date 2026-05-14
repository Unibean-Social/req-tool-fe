"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import SplitText from "@/components/ui/split-text";
import { Button } from "@/components/ui/button";

import { ORG_ONBOARDING_MESSAGES } from "./orgOnboardingMessages";

type OrgOnboardingIntroProps = {
  onSkip: () => void;
  onComplete: () => void;
};

const LINE_PAUSE_MS = 520;
const LAST_LINE_PAUSE_MS = 640;

export function OrgOnboardingIntro({ onSkip, onComplete }: OrgOnboardingIntroProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const lineIndexRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const onSkipRef = useRef(onSkip);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onSkipRef.current = onSkip;
  }, [onSkip]);

  useEffect(() => {
    lineIndexRef.current = lineIndex;
  }, [lineIndex]);

  const text = ORG_ONBOARDING_MESSAGES[lineIndex] ?? "";

  const handleLineComplete = useCallback(() => {
    const i = lineIndexRef.current;
    const last = ORG_ONBOARDING_MESSAGES.length - 1;
    if (i < last) {
      window.setTimeout(() => setLineIndex(i + 1), LINE_PAUSE_MS);
    } else {
      window.setTimeout(() => onCompleteRef.current(), LAST_LINE_PAUSE_MS);
    }
  }, []);

  return (
    <div className="flex min-h-full w-full flex-1 flex-col px-3 py-8 sm:px-8 sm:py-10 md:px-12 lg:px-16 xl:px-20">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
        <div className="relative w-full max-w-[min(100%,112rem)] min-h-[min(40vh,320px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={lineIndex}
              role="presentation"
              className="w-full"
              initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -22, filter: "blur(8px)" }}
              transition={{
                duration: 0.42,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <SplitText
                text={text}
                tag="h2"
                splitType="words"
                className="font-heading text-center text-pretty text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                delay={110}
                duration={2.05}
                ease="power2.out"
                from={{ opacity: 0, y: 26 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.05}
                rootMargin="160px 0px 50% 0px"
                textAlign="center"
                onLetterAnimationComplete={handleLineComplete}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex shrink-0 justify-center pb-8 pt-4 sm:pb-12 sm:pt-6">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="min-w-42 border-2 border-white/25 bg-background/40 px-8 text-base font-semibold backdrop-blur-md hover:bg-background/55 dark:border-white/15 dark:bg-zinc-900/50"
          onClick={() => onSkipRef.current()}
        >
          Bỏ qua
        </Button>
      </div>
    </div>
  );
}
