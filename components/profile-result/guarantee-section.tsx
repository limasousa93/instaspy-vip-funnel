import { ShieldCheck } from "lucide-react";

export function GuaranteeSection() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-left">
      <ShieldCheck className="h-5 w-5 shrink-0 text-green-400" />
      <div>
        <p className="text-sm font-bold text-green-300">Garantia de 30 Dias</p>
        <p className="mt-0.5 text-xs text-green-200/80">
          Teste sem risco. Se não gostar ou por algum motivo não se adaptar, devolvemos 100% do seu dinheiro.
        </p>
      </div>
    </div>
  );
}
