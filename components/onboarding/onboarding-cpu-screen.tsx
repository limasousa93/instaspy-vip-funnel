import { CpuArchitecture } from "@/components/ui/cpu-architecture";

// Tela final do funil (pós-confirmação da preview), antes de cair no feed —
// não há mais nenhuma busca real pendente nesse ponto, é só uma transição.
export function OnboardingCpuScreen({ text }: { text: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black px-6 py-10 text-center">
      <div className="w-full max-w-sm rounded-xl bg-white/5 p-4">
        <CpuArchitecture text="IG" />
      </div>
      <p className="animate-pulse text-sm text-white/70">{text}</p>
    </div>
  );
}
