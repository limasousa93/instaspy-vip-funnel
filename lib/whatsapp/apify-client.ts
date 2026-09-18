import { ApifyClient } from "apify-client";

const ACTOR_ID = "antonio_cesar~whatsapp-scraper-profile-bulk";
const RUN_TIMEOUT_SECS = 90;

export interface WhatsAppLookupData {
  number: string;
  displayName: string;
  about: string;
  profilePicture: string;
  isActive: boolean;
  isBusiness: boolean;
}

// Resposta do dataset do actor `antonio_cesar/whatsapp-scraper-profile-bulk`
// (Actor ID: antonio_cesar~whatsapp-scraper-profile-bulk). Diferente do
// Standby anterior, este actor roda um Run assíncrono normal — chamamos via
// `client.actor(...).call()` e lemos o item do dataset, mesmo padrão usado
// em `lib/instagram/apify-client.ts` para o `apify/instagram-scraper`.
interface WhatsAppBulkResultItem {
  number?: string;
  picture?: string;
  base64_image?: string;
  numberExists?: boolean;
  isBusiness?: boolean;
}

/** Remove tudo que não for dígito: "+", espaços, traços, parênteses etc. */
function sanitizePhoneNumber(raw: string): string {
  return raw.replace(/\D/g, "");
}

function toWhatsAppData(raw: WhatsAppBulkResultItem, number: string): WhatsAppLookupData {
  return {
    number,
    displayName: "",
    about: "",
    // `picture` é a URL direta; só cai pro base64 (data URI) quando a URL não vem.
    profilePicture: raw.picture || (raw.base64_image ? `data:image/jpeg;base64,${raw.base64_image}` : ""),
    isActive: raw.numberExists ?? false,
    isBusiness: raw.isBusiness ?? false,
  };
}

/**
 * Busca dados públicos de um número via o actor bulk
 * `antonio_cesar/whatsapp-scraper-profile-bulk`. Retorna `null` quando
 * `numberExists` é `false` (número não existe/sem WhatsApp ativo) — mesmo
 * contrato usado por `fetchInstagramData`.
 */
export async function fetchWhatsAppData(number: string): Promise<WhatsAppLookupData | null> {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) throw new Error("APIFY_API_TOKEN não configurado");

  // Sanitiza de novo aqui (defesa em profundidade): mesmo que quem chamou
  // `fetchWhatsAppData` já tenha limpado o número, o body que vai pro actor
  // nunca deve depender só da sanitização feita lá fora.
  const sanitizedNumber = sanitizePhoneNumber(number);

  const client = new ApifyClient({ token });

  const run = await client.actor(ACTOR_ID).call(
    { numbers: [sanitizedNumber] },
    { timeout: RUN_TIMEOUT_SECS }
  );

  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  const raw = items[0] as unknown as WhatsAppBulkResultItem | undefined;

  if (!raw || !raw.numberExists) return null;

  return toWhatsAppData(raw, sanitizedNumber);
}
