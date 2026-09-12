"use client";

import { useEffect, useRef, useState } from "react";
import ProcessingCard from "@/components/ui/processing-card";

type Status = "queued" | "running" | "succeeded" | "failed";
type ProcessingStage = { key: string; label: string; minProgress: number };

// Tela de transição usada entre a tela 2 (@ do perfil) e a tela 3 (preview),
// sem `onDone` — o ciclo de 8s só repete em loop enquanto o componente pai
// mantiver a tela montada (ou seja, enquanto a busca real na Apify ainda
// estiver em andamento — nunca avança sozinha antes dos dados chegarem).
export function OnboardingProcessingScreen({
  name,
  durationMs = 5000,
  onDone,
  stages,
  stickyLastStage,
}: {
  name: string;
  durationMs?: number;
  onDone?: () => void;
  stages?: ProcessingStage[];
  stickyLastStage?: boolean;
}) {
  const [status, setStatus] = useState<Status>("queued");
  const [progress, setProgress] = useState(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    let cancelled = false;
    const timeouts: number[] = [];
    let progressInterval: number;

    function runCycle() {
      if (cancelled) return;
      setStatus("queued");
      setProgress(0);
      timeouts.push(window.setTimeout(() => !cancelled && setStatus("running"), 200));
      progressInterval = window.setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 15 + 8, 92));
      }, durationMs / 8);
      timeouts.push(
        window.setTimeout(() => {
          window.clearInterval(progressInterval);
          if (cancelled) return;
          setStatus("succeeded");
          setProgress(100);
          if (onDoneRef.current) {
            timeouts.push(window.setTimeout(() => onDoneRef.current?.(), 300));
          } else {
            timeouts.push(window.setTimeout(runCycle, 500));
          }
        }, durationMs),
      );
    }

    runCycle();
    return () => {
      cancelled = true;
      timeouts.forEach((id) => window.clearTimeout(id));
      window.clearInterval(progressInterval);
    };
  }, [durationMs]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <div className="w-full max-w-lg">
        <ProcessingCard
          name={name}
          status={status}
          progress={progress}
          stages={stages}
          stickyLastStage={stickyLastStage}
        />
      </div>
    </div>
  );
}
