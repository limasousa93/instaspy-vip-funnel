// Mesmo padrão de mascaramento usado nas notificações mock (ver spy-notifications.ts):
// mantém as 3 primeiras letras e troca o resto por asteriscos, ex.: "jul****".
export function maskUsername(name: string): string {
  return `${name.slice(0, 3)}****`;
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
