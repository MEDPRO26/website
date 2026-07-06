# SEO & JSON-LD — Checklist de progression

Suivi de l’implémentation structured data et SEO technique pour [sossante.ma](https://www.sossante.ma).

**Légende :** `[x]` fait · `[ ]` à faire · `[-]` partiel

---

## Phase 1 — Nettoyage (fondations)

Objectif : corriger les erreurs qui bloquent ou polluent Google Search Console avant d’ajouter du markup.

- [x] Supprimer le JSON-LD dupliqué dans `components/breadcrumb.tsx` (garder uniquement `breadcrumbSchema()` côté pages)
- [x] Ajouter **Organization** + **WebSite** globaux dans `app/layout.tsx` (un seul `@graph` site-wide)
- [x] Retirer Organization/WebSite dupliqués de la homepage
- [x] `@id` **LocalBusiness** unique par ville (`#localbusiness-agadir`, `#localbusiness-rabat`, etc.)
- [x] Lier LocalBusiness à Organization via `parentOrganization`
- [x] Corriger **Product** : pas de bloc `Offer` (devis sur demande — évite les erreurs Merchant dans GSC)
- [x] Retirer **OfferCatalog** inutilisé (plus de prix dans le schema)
- [x] Retirer WhatsApp de `sameAs` (réservé aux profils sociaux / GBP)
- [x] Étendre `areaServed` Organization à toutes les villes actives
- [x] Vérifier dans GSC → URL Inspection : homepage, `/agadir`, 1 produit, `/contact`
- [x] Vérifier Enhancements : Breadcrumbs, FAQ (Product sans Offer — pas d'alertes Merchant)

---

## Phase 2 — Couverture complète

Objectif : chaque type de page a le bon schéma, sans duplication.

### Templates

| Page | WebPage | Breadcrumb | LocalBusiness | FAQ | ItemList | Product | Service | BlogPosting |
|------|---------|------------|---------------|-----|----------|---------|---------|-------------|
| Homepage | [x] | [x] | [x] | [x] | [x] | [-] | [-] | [-] |
| City hub (`/agadir`) | [x] | [x] | [x] | [x] | [x] | [-] | [-] | [-] |
| Vente city | [x] | [x] | [x] | [x] | [x] | [-] | [-] | [-] |
| Category vente | [x] | [x] | [x] | [x] | [x] | [-] | [-] | [-] |
| Product | [x] | [x] | [-] | [-] | [x] | [-] | [-] | [-] |
| Care service | [x] | [x] | [x] | [x] | [-] | [-] | [x] | [-] |
| Services hub | [x] | [x] | [x] | [-] | [-] | [-] | [x] | [-] |
| Blog index | [x] | [x] | [-] | [-] | [x] | [-] | [-] | [-] |
| Blog post | [x] | [x] | [-] | [-] | [-] | [-] | [-] | [x] |
| Contact | [x] | [x] | [x] | [ ] | [-] | [-] | [-] | [-] |
| Legal | [x] | [x] | [-] | [-] | [-] | [-] | [-] | [-] |

### Tâches Phase 2

- [x] **ItemList** sur city hubs (6 derniers produits affichés)
- [x] Schéma sur **toutes** les pages vente city (Agadir + Rabat)
- [x] Schéma sur **toutes** les catégories vente par ville
- [x] **ContactPage** unifié via `lib/schema.ts` (plus de JSON inline)
- [x] **Service** sur chaque page care service (déjà partiel)
- [x] **ItemList** blog index
- [x] **WebPage CollectionPage** sur catalogues vente
- [x] **WebPage** minimal sur pages légales
- [x] Relier produits `related` pour maillage schema (curated + fallback catégorie)

---

## Phase 3 — Autorité & contenu

- [ ] Google Business Profile Agadir aligné NAP = schema (nom, adresse, tel, site) → voir `docs/GBP-NAP-AGADIR.md`
- [ ] GBP Rabat quand `contactReady`
- [-] 2–4 articles blog / mois (3 articles publiés — continuer le rythme)
- [x] FAQ sur catalogues vente (Agadir + Rabat)
- [ ] Avis clients réels → **AggregateRating** (uniquement avec données vérifiables)
- [x] Maillage interne code : hub → catégorie → produit → article (fil d'Ariane, guides, blog hub)

---

## Phase 4 — Avancé (optionnel)

- [ ] `MedicalBusiness` au lieu de `LocalBusiness` où pertinent
- [ ] `MedicalDevice` sur CPAP, concentrateurs, lits
- [ ] `HowTo` sur guides blog
- [ ] `VideoObject` si vidéos produits
- [ ] `WebSite` → `SearchAction` si recherche catalogue
- [ ] Profils sociaux dans `sameAs` (Facebook, Instagram)

---

## Infra SEO (hors JSON-LD)

- [x] Sitemap index (`/sitemap.xml` + sections)
- [x] `robots.txt` avec sitemap + blocage `/admin`, `/supplier`
- [x] `NEXT_PUBLIC_ALLOW_INDEXING` via Vercel Production
- [x] Canonical `https://www.sossante.ma`
- [x] Soumettre sitemap dans Google Search Console
- [ ] Soumettre sitemap dans Bing Webmaster Tools
- [ ] Monitoring 404 / couverture index hebdomadaire

---

## Notes

- **Devis sur demande** : pas de schema Product sur les fiches produit (GSC exige offers, review ou aggregateRating). On garde WebPage + fil d'Ariane + ItemList associés. Réactiver productSchema() quand les prix seront connus.
- **Un seul `<script type="application/ld+json">` par page** (+ le global layout pour Organization/WebSite est acceptable ; les pages ne redéclarent pas Organization).
- Dernière mise à jour : 2026-07-06 (Product schema désactivé)
