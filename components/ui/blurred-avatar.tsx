import Image from "next/image";

// WebKit/Chromium mobile has a real bug: `border-radius` fails to clip an
// element that also carries `filter: blur()` on itself — the corners render
// square instead of round. The fix is to never combine the two on one
// element: round + clip on this wrapper (a <div>, not <span> — block-level
// so width/height are never ambiguous), blur only on the child <Image>.
export function BlurredAvatar({
  src,
  alt,
  size,
  className = "",
  imgClassName = "",
}: {
  src: string;
  alt: string;
  size: number;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <div
      className={`shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`h-full w-full object-cover blur-[2px] ${imgClassName}`}
      />
    </div>
  );
}
