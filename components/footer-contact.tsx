import {
  CONTACT_EMAIL,
  PHONE_DISPLAY,
  PHONE_NUMBER,
  whatsAppHref,
} from "@/lib/products";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import type { FooterContext } from "@/lib/footer-context";

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
  context: FooterContext;
  title?: string;
  showSocial?: boolean;
};

export default function FooterContact({
  context,
  title = "Contact",
  showSocial = true,
}: FooterContactProps) {
  const showPhone = Boolean(context.phone && context.phoneDisplay && context.phoneHref);
  const showWhatsapp = Boolean(context.whatsappHref);

  return (
    <div>
      <h4 className="font-heading mb-3 text-sm font-bold uppercase tracking-wider text-primary sm:mb-4">
        {title}
      </h4>
      <p className="mb-2 text-sm font-semibold text-on-surface sm:text-base">
        {context.brandTitle}
      </p>

      {context.showAddress && context.address ? (
        <p className="mb-2 text-sm leading-relaxed text-on-surface-variant sm:text-base">
          {context.address}
        </p>
      ) : null}

      {context.zones && context.zones.length > 0 ? (
        <div className="mb-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Zone desservie
          </p>
          <p className="text-sm leading-relaxed text-on-surface-variant sm:text-base">
            {context.zones.join(", ")}, ...
          </p>
        </div>
      ) : null}

      {showPhone ? (
        <a
          href={context.phoneHref}
          className="mb-1 block text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
        >
          {context.phoneDisplay}
        </a>
      ) : context.variant === "city" ? (
        <p className="mb-1 text-sm text-on-surface-variant/80 sm:text-base">
          Téléphone local bientôt disponible
        </p>
      ) : (
        <a
          href={`tel:${PHONE_NUMBER}`}
          className="mb-1 block text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
        >
          {PHONE_DISPLAY}
        </a>
      )}

      <a
        href={`mailto:${context.email || CONTACT_EMAIL}`}
        className="mb-1 block text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
      >
        {context.email || CONTACT_EMAIL}
      </a>
      <a
        href={context.websiteHref}
        className="mb-1 block text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
      >
        {context.websiteLabel}
      </a>

      {showSocial && (showWhatsapp || context.variant === "national") ? (
        <div className="mt-4 flex gap-3">
          {showWhatsapp ? (
            <a
              href={context.whatsappHref}
              aria-label="Contacter sur WhatsApp"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary transition-transform hover:scale-110"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
          ) : null}
          <a
            href={`mailto:${context.email || CONTACT_EMAIL}`}
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

export function FooterCopyright({ context }: { context: FooterContext }) {
  return (
    <div className="border-t border-outline-variant pt-6 text-center text-xs text-on-surface-variant sm:text-sm md:col-span-4">
      <p>© 2026 {context.copyrightName}. Tous droits réservés.</p>
      <p className="mt-2">
        Créé par{" "}
        <a
          href="https://www.itagroupe.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary transition-colors hover:text-primary-container"
        >
          ITA GROUPE
        </a>
      </p>
    </div>
  );
}
