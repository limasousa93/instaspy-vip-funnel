export interface WhatsAppLookupData {
  number: string;
  displayName: string;
  about: string;
  profilePicture: string;
  isActive: boolean;
  isBusiness: boolean;
}

const REQUEST_TIMEOUT_MS = 30_000;

interface EvolutionNumberCheck {
  exists: boolean;
  jid?: string;
  number?: string;
}

interface EvolutionProfilePicture {
  profilePictureUrl: string | null;
}

/** Remove tudo que não for dígito: "+", espaços, traços, parênteses etc. */
function sanitizePhoneNumber(raw: string): string {
  return raw.replace(/\D/g, "");
}

function getConfig() {
  const baseUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instance = process.env.EVOLUTION_INSTANCE;
  if (!baseUrl || !apiKey || !instance) {
    throw new Error("EVOLUTION_API_URL, EVOLUTION_API_KEY e EVOLUTION_INSTANCE devem estar configurados");
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey, instance };
}

async function evolutionPost<T>(path: string, body: unknown): Promise<T> {
  const { baseUrl, apiKey, instance } = getConfig();
  const res = await fetch(`${baseUrl}${path}/${instance}`, {
    method: "POST",
    headers: { apikey: apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Evolution API ${path} respondeu ${res.status}`);
  return (await res.json()) as T;
}

/**
 * Busca dados públicos de um número via Evolution API. Retorna `null` quando o
 * número não existe no WhatsApp — mesmo contrato usado por `fetchInstagramData`.
 */
export async function fetchWhatsAppData(number: string): Promise<WhatsAppLookupData | null> {
  // Sanitiza de novo aqui (defesa em profundidade): a Evolution API espera só dígitos.
  const sanitizedNumber = sanitizePhoneNumber(number);

  // 1) Verifica se o número existe no WhatsApp.
  const checks = await evolutionPost<EvolutionNumberCheck[]>("/chat/whatsappNumbers", {
    numbers: [sanitizedNumber],
  });
  if (!checks[0]?.exists) return null;

  // 2) Busca a foto de perfil. Falha aqui não invalida o número: segue sem foto.
  let profilePictureUrl: string | null = null;
  try {
    const picture = await evolutionPost<EvolutionProfilePicture>("/chat/fetchProfilePictureUrl", {
      number: sanitizedNumber,
    });
    profilePictureUrl = picture.profilePictureUrl;
  } catch {
    profilePictureUrl = null;
  }

  return {
    number: sanitizedNumber,
    displayName: "",
    about: "",
    profilePicture: profilePictureUrl ?? "",
    isActive: true,
    isBusiness: false,
  };
}
