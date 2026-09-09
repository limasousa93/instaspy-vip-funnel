import Image from "next/image";

// Safari (WebKit) has a long-standing bug: `border-radius` + `filter: blur()`
// on the same element sometimes renders with square corners instead of
// clipping to the circle. The fix is to never put both on one element —
// round + clip on this wrapper, blur only on the child <Image>.
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
    <span
      className={`inline-block shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`h-full w-full object-cover blur-sm ${imgClassName}`}
      />
    </span>
  );
}
