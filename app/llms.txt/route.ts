import { NextResponse } from "next/server";
import {
  ABOUT_DEFINITION,
  ABOUT_OPERATIONS,
  ABOUT_PATH,
  ABOUT_ROLE,
} from "@/lib/about-content";
import { SITE_ADDRESS, SITE_NAME, SITE_URL_DEFAULT } from "@/lib/brand";
import { careServices } from "@/lib/care-services";
import { activeCities } from "@/lib/cities";
import { CONTACT_EMAIL, PHONE_DISPLAY } from "@/lib/products";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");

export function GET() {
  const cities = activeCities.map((city) => city.name).join(", ");
  const services = careServices.map((service) => service.title).join(", ");
  const locals = activeCities
    .filter((city) => city.address)
    .map((city) => `${city.name}: ${city.address}`)
    .join(" | ");

  const body = `# ${SITE_NAME}

> ${ABOUT_DEFINITION}

${ABOUT_OPERATIONS}

${ABOUT_ROLE}

- Site: ${siteUrl}
- Locaux: ${locals || SITE_ADDRESS}
- Email: ${CONTACT_EMAIL}
- Téléphone: ${PHONE_DISPLAY}
- Villes: ${cities}
- Services à domicile: ${services}
- Modèle: locaux opérationnels + livraison de matériel + coordination avec prestataires partenaires (pas un hôpital, pas un SAMU)

## Pages essentielles

- [À propos de nous](${siteUrl}${ABOUT_PATH})
- [Services de soins à domicile](${siteUrl}/services)
- [Contact](${siteUrl}/contact)
- [Mentions légales](${siteUrl}/mentions-legales)

${activeCities
  .map((city) => `- [${SITE_NAME} ${city.name}](${siteUrl}/${city.slug})`)
  .join("\n")}
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
