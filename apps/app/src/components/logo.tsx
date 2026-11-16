import { PRODUCT } from "@/lib/config";

/**
 * Mark: an open book with a bookmark ribbon. The pages take the text colour and the ribbon the accent,
 * so `color` lets the partner portal use the founder's brand. Same shapes as public/favicon.svg.
 */
export function LogoMark({ size = 22, color = "var(--accent)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path d="M30 30h8v16l-4-3.5-4 3.5z" fill={color} />
      <path d="M22.6 12.2C17.6 8.4 10.8 7.6 3.5 9.2v28.4c7.3-1.4 14.1-.6 19.1 3.2z" fill="currentColor" />
      <path d="M25.4 12.2c5-3.8 11.8-4.6 19.1-3V37.6c-7.3-1.4-14.1-.6-19.1 3.2z" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[15px] font-medium tracking-[-0.02em] text-fg ${className ?? ""}`}
    >
      <LogoMark />
      {PRODUCT.name}
    </span>
  );
}
