"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function ToolCallingLoader() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-muted text-[15px] font-sans px-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>Thought for {seconds}s</span>
    </div>
  );
}
