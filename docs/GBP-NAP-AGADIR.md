# Google Business Profile — Agadir (NAP aligné schema)

Utilisez **exactement** ces informations dans votre fiche Google Business Profile pour qu’elles correspondent au schema `LocalBusiness` du site.

## NAP à copier dans GBP

| Champ | Valeur |
|-------|--------|
| **Nom** | SOS Santé Agadir |
| **Site web** | https://www.sossante.ma |
| **Téléphone** | +212 700 975 888 |
| **Adresse** | Lerac, Avenue Abderrahim Bouabid, 8000, Agadir 80000 |
| **Pays** | Maroc |
| **Catégorie principale** | Magasin de matériel médical (ou équivalent) |
| **Zone desservie** | Agadir, Inezgane, Aït Melloul, Dcheira, Taghazout… |

## Cohérence schema ↔ GBP

- Schema `@id` : `https://www.sossante.ma/#localbusiness-agadir`
- Page hub : https://www.sossante.ma/agadir
- Email (site / contact) : contact@sossante.ma

## Checklist GBP (Phase 3)

- [ ] Nom identique partout (GBP, site, schema)
- [ ] Adresse identique (pas de variante « Lerac » vs « Lrark »)
- [ ] Téléphone au format international +212
- [ ] URL canonique `https://www.sossante.ma` (pas http, pas sans www)
- [ ] Horaires : 7j/7 si applicable (aligné schema `Mo-Su 00:00-23:59`)
- [ ] Photos : logo + équipements (CPAP, concentrateurs, lits)
- [ ] Description : location + vente matériel médical à Agadir
- [ ] Lien vers `/agadir` et `/vente-de-materiel-medical-agadir` dans les posts GBP

## Rabat (quand `contactReady`)

Attendre que le téléphone / adresse locale Rabat soient définis dans `lib/cities.ts`, puis créer la fiche avec le même modèle NAP.
