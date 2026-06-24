import {
  SITE_ADDRESS,
  SITE_FULL_NAME,
  SITE_URL_DEFAULT,
  SITE_WEBSITE,
} from "@/lib/brand";
import {
  CONTACT_EMAIL,
  PHONE_DISPLAY,
  PHONE_NUMBER,
  WHATSAPP_NUMBER,
} from "@/lib/products";

function MaterialIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

type FooterContactProps = {
  title?: string;
  showSocial?: boolean;
};

export default function FooterContact({
  title = "Contact",
  showSocial = true,
}: FooterContactProps) {
  return (
    <div>
      <h4 className="font-heading mb-3 text-sm font-bold uppercase tracking-wider text-primary sm:mb-4">
        {title}
      </h4>
      <p className="mb-2 text-sm font-semibold text-on-surface sm:text-base">
        {SITE_FULL_NAME}
      </p>
      <p className="mb-2 text-sm leading-relaxed text-on-surface-variant sm:text-base">
        {SITE_ADDRESS}
      </p>
      <a
        href={`tel:${PHONE_NUMBER}`}
        className="mb-1 block text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
      >
        {PHONE_DISPLAY}
      </a>
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="mb-1 block text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
      >
        {CONTACT_EMAIL}
      </a>
      <a
        href={SITE_URL_DEFAULT}
        className="mb-1 block text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
      >
        {SITE_WEBSITE}
      </a>
      {showSocial ? (
        <div className="mt-4 flex gap-3">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            aria-label="Contacter sur WhatsApp"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary transition-transform hover:scale-110"
          >
            <MaterialIcon name="chat" />
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            aria-label="Envoyer un email"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary transition-transform hover:scale-110"
          >
            <MaterialIcon name="mail" />
          </a>
        </div>
      ) : null}
    </div>
  );
}

export function FooterCopyright() {
  return (
    <div className="border-t border-outline-variant pt-6 text-center text-xs text-on-surface-variant sm:text-sm md:col-span-4">
      © 2026 {SITE_FULL_NAME}. Tous droits réservés.
    </div>
  );
}
