export function trackPixelEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const fbq = (window as any).fbq;
  if (!fbq) return;
  fbq('track', event, params ?? {});
}
