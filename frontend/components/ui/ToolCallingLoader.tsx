"use client";

import React, { useEffect, useState } from "react";
import { Search, BrainCircuit, BookOpen, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const steps = [
  { text: "Planner Agent is formulating a search strategy...", icon: BrainCircuit, duration: 4000 },
  { text: "Search Agent is querying OpenAlex database...", icon: Search, duration: 6000 },
  { text: "Reader Agent is extracting entities for Knowledge Graph...", icon: BookOpen, duration: 5000 },
];

export default function ToolCallingLoader() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    const advanceStep = (stepIdx: number) => {
      if (stepIdx >= steps.length) return;
      setCurrentStep(stepIdx);
      timeout = setTimeout(() => {
        advanceStep(stepIdx + 1);
      }, steps[stepIdx].duration);
    };

    advanceStep(0);
    return () => clearTimeout(timeout);
  }, []);

  const StepIcon = steps[currentStep < steps.length ? currentStep : steps.length - 1].icon;

  return (
    <div className="flex flex-col gap-2 p-3 bg-black/5 rounded-xl border border-black/5 w-fit">
      <div className="flex items-center gap-3">
        <Loader2 className="w-4 h-4 animate-spin text-accent" />
        <span className="text-[13px] font-medium text-primary flex items-center gap-2">
          <StepIcon className="w-4 h-4 text-muted" />
          <AnimatePresence mode="wait">
            <motion.span
              key={currentStep}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="inline-block"
            >
              {steps[currentStep]?.text || "Finalizing results..."}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
    </div>
  );
}
