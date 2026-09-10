import RadialPulseLoader from "@/components/ui/loading-animation";

// Usada em dois momentos do funil: enquanto a busca real na Apify está em
// andamento (estado `loading` de verdade do useInstagram, sem timer
// inventado) e como transição curta depois que o usuário confirma o
// preview, antes de cair no feed.
export function OnboardingLoadingScreen({ text }: { text: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 py-10 text-center">
      <RadialPulseLoader color="#a855f7" text={text} />
    </div>
  );
}
