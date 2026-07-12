import { CONTACT_EMAIL } from "@/lib/products";
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
  const cityContacts =
    context.cityContacts ??
    (context.phone && context.phoneDisplay && context.phoneHref
      ? [
          {
            name: context.city?.name ?? "Contact",
            phoneDisplay: context.phoneDisplay,
            phoneHref: context.phoneHref,
            whatsappHref: context.whatsappHref,
          },
        ]
      : []);

  const showPhone = cityContacts.length > 0;
  const whatsappContacts =
    context.whatsappContacts ??
    (context.whatsappHref
      ? [
          {
            name: context.city?.name ?? "WhatsApp",
            phoneDisplay: "",
            phoneHref: "",
            whatsappHref: context.whatsappHref,
          },
        ]
      : []);
  const showWhatsapp = whatsappContacts.some((contact) => contact.whatsappHref);

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
        <div className="mb-2 space-y-1">
          {cityContacts.map((contact) => (
            <a
              key={contact.name}
              href={contact.phoneHref}
              className="block text-sm text-on-surface-variant transition-colors hover:text-primary sm:text-base"
            >
              <span className="font-medium text-on-surface">{contact.name}</span>
              {" · "}
              {contact.phoneDisplay}
            </a>
          ))}
        </div>
      ) : context.variant === "city" ? (
        <p className="mb-1 text-sm text-on-surface-variant/80 sm:text-base">
          Téléphone local bientôt disponible
        </p>
      ) : null}

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

      {showSocial && showWhatsapp ? (
        <div className="mt-4 flex flex-wrap gap-3">
          {whatsappContacts.map((contact) =>
            contact.whatsappHref ? (
              <a
                key={contact.name}
                href={contact.whatsappHref}
                aria-label={`Contacter SOS Santé ${contact.name} sur WhatsApp`}
                title={`WhatsApp ${contact.name}`}
                className="inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full bg-primary px-3 text-on-primary transition-transform hover:scale-110"
              >
                <WhatsAppIcon className="h-5 w-5 shrink-0" />
                {context.variant === "national" ? (
                  <span className="text-xs font-semibold">{contact.name}</span>
                ) : null}
              </a>
            ) : null
          )}
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
