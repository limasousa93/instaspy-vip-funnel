const STANDBY_URL = "https://api-factory--whatsapp-profile-scraper.apify.actor/profile";

export interface WhatsAppLookupData {
  number: string;
  displayName: string;
  about: string;
  profilePicture: string;
  isActive: boolean;
  isBusiness: boolean;
}

// Resposta do endpoint Standby do actor `api_factory/whatsapp-profile-scraper`
// (Actor ID: Ed1OZHSSjOge3VpE1). Standby é uma chamada HTTP direta que já
// devolve o resultado no corpo da resposta — sem run assíncrono, sem
// dataset, sem polling (diferente do `apify/instagram-scraper`, que usa
// `client.actor(...).call()`).
interface WhatsAppStandbyResponse {
  picture?: string;
  success?: boolean;
  contactId?: string;
  businessProfile?: boolean;
  businessAddress?: string;
  businessDescription?: string;
  businessWebsite?: string;
  businessEmail?: string;
  businessCategory?: string;
  businessTimezone?: string;
  businessHours?: string;
}

/** Remove tudo que não for dígito: "+", espaços, traços, parênteses etc. */
function sanitizePhoneNumber(raw: string): string {
  return raw.replace(/\D/g, "");
}

function toWhatsAppData(raw: WhatsAppStandbyResponse, number: string): WhatsAppLookupData {
  return {
    number,
    displayName: "",
    about: raw.businessDescription ?? "",
    profilePicture: raw.picture ?? "",
    isActive: raw.success ?? false,
    isBusiness: raw.businessProfile ?? false,
  };
}

/**
 * Busca dados públicos de um número via Standby do actor
 * `api_factory/whatsapp-profile-scraper`. Retorna `null` quando `success` é
 * `false` (número não existe/sem WhatsApp ativo) — mesmo contrato usado por
 * `fetchInstagramData`.
 */
export async function fetchWhatsAppData(number: string): Promise<WhatsAppLookupData | null> {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) throw new Error("APIFY_API_TOKEN não configurado");

  // Sanitiza de novo aqui (defesa em profundidade): mesmo que quem chamou
  // `fetchWhatsAppData` já tenha limpado o número, o body que vai pro Standby
  // nunca deve depender só da sanitização feita lá fora.
  const sanitizedNumber = sanitizePhoneNumber(number);
  const requestBody = JSON.stringify({ phone_number: sanitizedNumber });

  // TODO: log temporário pra validar o payload real enviado ao actor — remover depois.
  console.log("[whatsapp/apify-client] body enviado ao Standby:", requestBody);

  const response = await fetch(STANDBY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: requestBody,
  });

  if (!response.ok) {
    throw new Error(`Apify Standby respondeu ${response.status} para o número ${sanitizedNumber}`);
  }

  const raw = (await response.json()) as WhatsAppStandbyResponse;

  if (!raw.success) return null;

  return toWhatsAppData(raw, sanitizedNumber);
}
