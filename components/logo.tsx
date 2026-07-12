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
  sm: { height: 44, className: "h-11" },
  md: { height: 60, className: "h-14 sm:h-16" },
  lg: { height: 72, className: "h-16 sm:h-20" },
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
      aria-label="SOS Santé - Accueil"
    >
      {image}
    </Link>
  );
}
