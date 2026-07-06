# Google Business Profile — Agadir (NAP aligné schema)

Utilisez **exactement** ces informations dans votre fiche Google Business Profile pour qu’elles correspondent au schema `LocalBusiness` du site.

## NAP à copier dans GBP

| Champ | Valeur |
|-------|--------|
| **Nom** | SOS Santé Agadir - Matériel Médical & Aide à Domicile |
| **Site web** | https://www.sossante.ma/agadir |
| **Téléphone** | +212 700 975 888 (affichage : 07 00 97 58 88) |
| **Adresse** | Lerac, Avenue Abderrahim Bouabid, 8000, Agadir 80000 |
| **Pays** | Maroc |
| **Catégorie principale** | Magasin de matériel médical / Medical equipment supplier |
| **Zone desservie** | Agadir, Inezgane, Aït Melloul, Dcheira, Taghazout… |
| **Horaires** | Ouvert 24h/24 (aligné schema `Mo-Su 00:00-23:59`) |

## Cohérence schema ↔ GBP

- Schema `@id` : `https://www.sossante.ma/#localbusiness-agadir`
- Page hub (URL GBP) : https://www.sossante.ma/agadir
- Email (site / contact) : contact@sossante.ma
- Nom schema `LocalBusiness` : `SOS Santé Agadir - Matériel Médical & Aide à Domicile` (badge `/agadir`)

> **Pourquoi `/agadir` et pas la homepage ?**  
> La fiche Agadir doit pointer vers la page hub locale. Google associe ainsi la fiche à la bonne ville et au bon contenu.

## Checklist GBP (Phase 3)

- [x] Nom identique partout (GBP, site, schema)
- [x] Adresse identique
- [x] Téléphone identique
- [x] Site web ajouté : `https://www.sossante.ma/agadir` (en attente validation Google)
- [ ] Validation Google du site web terminée
- [x] Horaires 24h/24
- [ ] Photos : logo + équipements (CPAP, concentrateurs, lits)
- [ ] Description : location + vente matériel médical à Agadir
- [ ] Posts GBP avec liens vers `/vente-de-materiel-medical-agadir` et fiches produits

## Rabat (quand `contactReady`)

Attendre que le téléphone / adresse locale Rabat soient définis dans `lib/cities.ts`, puis créer la fiche avec le même modèle :

- Site web : `https://www.sossante.ma/rabat`
- Nom : `SOS Santé Rabat - Matériel Médical & Aide à Domicile`
