import Link from "next/link";
import { legalPages } from "@/lib/legal-routes";

type FooterLegalLinksProps = {
  heading?: string;
  contactHref?: string;
  onContactClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

export default function FooterLegalLinks({
  heading = "Support",
  contactHref = "/contact",
  onContactClick,
}: FooterLegalLinksProps) {
  return (
    <div>
      <h4 className="font-heading mb-3 text-sm font-bold uppercase tracking-wider text-primary sm:mb-4">
        {heading}
      </h4>
      <ul className="space-y-2">
        {legalPages.map((page) => (
          <li key={page.href}>
            <Link
              href={page.href}
              className="text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
            >
              {page.label}
            </Link>
          </li>
        ))}
        <li>
          {onContactClick ? (
            <a
              href={contactHref}
              onClick={onContactClick}
              className="text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
            >
              Contact
            </a>
          ) : (
            <Link
              href={contactHref}
              className="text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
            >
              Contact
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
}
