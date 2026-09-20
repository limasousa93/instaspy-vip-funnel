import { NextResponse } from "next/server";
import { get as getCached, set as setCached } from "@/lib/whatsapp/cache";
import { fetchWhatsAppData, type WhatsAppLookupData } from "@/lib/whatsapp/apify-client";

export const dynamic = "force-dynamic";

/** Monta o número em E.164 com "+" na frente (ex: "+5588999519617"). */
function sanitizeNumber(raw: string): string {
  return `+${raw.replace(/\D/g, "")}`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ numero: string }> },
) {
  const { numero: rawNumero } = await params;
  const numero = sanitizeNumber(rawNumero);

  // "+" conta 1 caractere: 10 dígitos mínimos => length >= 11.
  if (numero.length < 11) {
    return NextResponse.json({ error: "Número inválido" }, { status: 400 });
  }

  const cached = getCached<WhatsAppLookupData>(numero);
  if (cached) return NextResponse.json(cached);

  const data = await fetchWhatsAppData(numero);
  if (!data) {
    return NextResponse.json(
      { error: "Número não encontrado ou sem WhatsApp ativo" },
      { status: 404 },
    );
  }

  setCached(numero, data);
  return NextResponse.json(data);
}
