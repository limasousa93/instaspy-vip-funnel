import Image from "next/image";

// WebKit/Chromium mobile has a real bug: `border-radius` fails to clip an
// element that also carries `filter: blur()` on itself — the corners render
// square instead of round. The fix is to never combine the two on one
// element: round + clip on this wrapper (a <div>, not <span> — block-level
// so width/height are never ambiguous), blur only on the child <Image>.
//
// Blur scales with avatar size instead of a fixed px value: a flat 2px blur
// looks moderate on a small 24px bubble but barely noticeable on a 72px one
// — same absolute radius, very different proportion of the image. Scaling
// by size keeps the *visual strength* consistent everywhere (2px @ 24px is
// the calibrated reference point).
const BLUR_RATIO = 2 / 24;

export function BlurredAvatar({
  src,
  alt,
  size,
  className = "",
  imgClassName = "",
  onClick,
}: {
  src: string;
  alt: string;
  size: number;
  className?: string;
  imgClassName?: string;
  onClick?: () => void;
}) {
  const blurPx = Math.round(size * BLUR_RATIO * 10) / 10;

  return (
    <div
      onClick={onClick}
      className={`isolate shrink-0 overflow-hidden rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        // Ainda "quadrado" no Safari/iOS mesmo com o blur isolado na
        // <Image> filha — o WebKit às vezes só respeita o clip de
        // overflow-hidden + border-radius se o elemento estiver na sua
        // própria camada de composição. translateZ(0) força essa camada
        // sem mover nada (Android/Chrome já funcionavam e continuam iguais).
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        style={{ filter: `blur(${blurPx}px)` }}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
