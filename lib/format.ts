// Mantém as 4 primeiras letras e troca o resto por asteriscos, ex.: "juli****".
// Nomes que já vêm pré-mascarados (contêm "*") são exibidos como estão, sem
// mascarar de novo — permite overrides com um padrão de asteriscos específico.
// A quantidade de asteriscos varia entre 4 e 7, definida de forma determinística
// a partir do próprio nome (mesmo nome sempre gera a mesma quantidade, evitando
// mismatch entre servidor e cliente).
export function maskUsername(name: string): string {
  if (name.includes("*")) return name;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  const starCount = 4 + (Math.abs(hash) % 4);
  return `${name.slice(0, 4)}${"*".repeat(starCount)}`;
}

export function formatCount(value: number): string {
  return value.toLocaleString("pt-BR");
}

export function formatCompactCount(value: number): string {
  if (value < 1000) return value.toLocaleString("pt-BR");
  const [divisor, suffix] = value < 1_000_000 ? [1000, "mil"] : [1_000_000, "mi"];
  return `${(value / divisor).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} ${suffix}`;
}

const TIME_UNIT_LABELS: Record<string, [string, string]> = {
  min: ["minuto", "minutos"],
  h: ["hora", "horas"],
  d: ["dia", "dias"],
  sem: ["semana", "semanas"],
  mês: ["mês", "meses"],
};

export function formatTimeAgo(timeAgo: string): string {
  const match = timeAgo.match(/^(\d+)\s*(min|h|d|sem|mês)$/);
  if (!match) return `Há ${timeAgo}`;
  const [, amountStr, unit] = match;
  const amount = Number(amountStr);
  const [singular, plural] = TIME_UNIT_LABELS[unit];
  return `Há ${amount} ${amount === 1 ? singular : plural}`;
}
