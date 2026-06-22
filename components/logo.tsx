import Image from "next/image";
import Link from "next/link";
import { LOGO, LOGO_ALT, logoDimensions } from "@/lib/brand";

type LogoProps = {
  variant?: keyof typeof LOGO;
  size?: "sm" | "md" | "lg";
  href?: string;
  priority?: boolean;
  className?: string;
};

const sizeMap = {
  sm: { height: 32, className: "h-8" },
  md: { height: 40, className: "h-9 sm:h-10" },
  lg: { height: 48, className: "h-11 sm:h-12" },
} as const;

export default function Logo({
  variant = "default",
  size = "md",
  href = "/",
  priority = false,
  className = "",
}: LogoProps) {
  const { height, className: heightClass } = sizeMap[size];
  const { width } = logoDimensions(height);

  const image = (
    <Image
      src={LOGO[variant]}
      alt={LOGO_ALT}
      width={width}
      height={height}
      priority={priority}
      className={`w-auto object-contain ${heightClass} ${className}`}
    />
  );

  if (!href) {
    return image;
  }

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center transition-opacity hover:opacity-90"
      aria-label="SOS Santé — Accueil"
    >
      {image}
    </Link>
  );
}
