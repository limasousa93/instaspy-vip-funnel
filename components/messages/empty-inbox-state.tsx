import { Send } from "lucide-react";

export function EmptyInboxState() {
  return (
    <div className="hidden flex-1 flex-col items-center justify-center gap-4 lg:flex">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-foreground">
        <Send className="h-10 w-10 -rotate-12 text-foreground" />
      </div>
      <p className="text-xl font-semibold text-foreground">Suas mensagens</p>
      <p className="max-w-xs text-center text-sm text-muted-foreground">
        Envie fotos e mensagens privadas para um amigo ou grupo
      </p>
      <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
        Enviar mensagem
      </button>
    </div>
  );
}
