"use client";

import { useState } from "react";
import Image from "next/image";
import { Lock } from "lucide-react";

export const VIP_CHECKOUT_URL = () => process.env.NEXT_PUBLIC_CAKTO_CHECKOUT_URL_VIP ?? "#";

/** Card escuro padrão usado em todas as seções da landing. */
export function ResultCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0f]/90 p-5 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  icon,
  title,
  subtitle,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 flex flex-col items-center gap-1 text-center">
      {icon && <div className="mb-1 text-violet-400">{icon}</div>}
      <h2 className="flex items-center gap-1.5 text-base font-bold text-white sm:text-lg">{title}</h2>
      {subtitle && <p className="max-w-sm text-xs text-white/60 sm:text-sm">{subtitle}</p>}
    </div>
  );
}

/** Miniatura borrada com cadeado — usada em mídias e stories bloqueados. */
export function LockedTile({
  src,
  label,
  className = "",
}: {
  src?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white/5 ${className}`}
    >
      {src && (
        <Image
          src={src}
          alt=""
          fill
          loading="lazy"
          sizes="(min-width: 640px) 200px, 33vw"
          className="scale-110 object-cover blur-md"
        />
      )}
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative flex flex-col items-center gap-1 text-white">
        <Lock className="h-4 w-4" />
        {label && <span className="px-2 text-center text-[10px] font-semibold leading-tight">{label}</span>}
      </div>
    </div>
  );
}

/** Avatar do perfil consultado: fica todo preto enquanto a foto carrega, só
 * pra então aparecer — mesmo comportamento da bolinha "Seu story" no feed.
 * Sem `src` (avatar real não disponível), fica preto e redondo permanentemente
 * — nunca busca uma foto de stock genérica como substituta. */
export function ProfileAvatar({
  src,
  alt,
  size,
  className = "",
}: {
  src: string | null | undefined;
  alt: string;
  size: number;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`shrink-0 overflow-hidden rounded-full bg-black ${className}`}
      style={{ width: size, height: size }}
    >
      {src && (
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <Image src="/logo22.png" alt="InstaSpy" width={230} height={200} className="h-12 w-auto sm:h-14" />
    </div>
  );
}

export function DownArrowDivider() {
  return (
    <div className="flex justify-center py-2 text-white/30">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
