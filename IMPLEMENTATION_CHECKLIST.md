# ✅ CHECKLIST D'IMPLÉMENTATION - Transporteur Pro

Document de suivi pour implémenter l'extension Transporteur Professionnel de Transwave.

---

## PHASE 1: PRÉPARATION & TYPES (2-3 jours)

- [ ] **1.1** Lire l'architecture existante
  - [ ] Comprendre types/index.ts
  - [ ] Comprendre AppContext.tsx
  - [ ] Comprendre DashboardPro.tsx

- [ ] **1.2** Étendre types/index.ts
  - [ ] Ajouter `ProTransporterProfile` interface
  - [ ] Ajouter `Vehicle` interface
  - [ ] Ajouter `PickupLocation` interface
  - [ ] Ajouter `DepartureOffer` interface
  - [ ] Ajouter `TransportSpecialization` type
  - [ ] Ajouter `VehicleType` type
  - [ ] Ajouter `VehicleFeature` type

- [ ] **1.3** Ajouter données mock
  - [ ] Ajouter MOCK_PRO_USERS
  - [ ] Ajouter MOCK_VEHICLES
  - [ ] Ajouter MOCK_PICKUP_LOCATIONS
  - [ ] Ajouter MOCK_DEPARTURE_OFFERS
  - [ ] Tester les imports

---

## PHASE 2: CONTEXTE & LOGIQUE (3-4 jours)

- [ ] **2.1** Étendre AppContext.tsx - Interface
  - [ ] Ajouter `vehicles: Vehicle[]`
  - [ ] Ajouter `departureOffers: DepartureOffer[]`
  - [ ] Ajouter méthodes vehicles (add, update, delete, get)
  - [ ] Ajouter méthodes departures (add, update, delete, get)
  - [ ] Ajouter `matchShipmentToOffers()`
  - [ ] Ajouter `registerProTransporter()`

- [ ] **2.2** Étendre AppContext.tsx - Implémentation
  - [ ] Implémenter `addVehicle()`
  - [ ] Implémenter `updateVehicle()`
  - [ ] Implémenter `deleteVehicle()`
  - [ ] Implémenter `getTransporterVehicles()`
  - [ ] Implémenter `updateVehicleLoad()`
  - [ ] Implémenter `addDepartureOffer()`
  - [ ] Implémenter `updateDepartureOffer()`
  - [ ] Implémenter `deleteDepartureOffer()`
  - [ ] Implémenter `getTransporterOffers()`
  - [ ] Implémenter `matchShipmentToOffers()`
  - [ ] Implémenter `registerProTransporter()`

- [ ] **2.3** Créer src/utils/matchingAlgorithm.ts
  - [ ] Implémenter `findMatchingOffers()`
  - [ ] Implémenter `calculateMatchScore()`
  - [ ] Implémenter `simulateOffers()`

- [ ] **2.4** Créer src/utils/transporterUtils.ts
  - [ ] Implémenter `validateIBAN()`
  - [ ] Implémenter `validateIDDocument()`
  - [ ] Implémenter `calculateVehicleCapacity()`

- [ ] **2.5** Tests
  - [ ] Vérifier que le contexte se compile
  - [ ] Tester matchShipmentToOffers avec données mock
  - [ ] Tester validateIBAN()
  - [ ] Tester validateIDDocument()

---

## PHASE 3: FORMULAIRE D'ENREGISTREMENT (4-5 jours)

- [ ] **3.1** Modifier RegisterPage.tsx - Structure
  - [ ] Ajouter sélection de profil (citizen vs pro)
  - [ ] Ajouter state multiétape (step 1-6)
  - [ ] Ajouter formulaire de base

- [ ] **3.2** RegisterPage.tsx - Étape 2 (Infos de base)
  - [ ] Créer form state pour basic info
  - [ ] Ajouter champs firstName, lastName, email, address, password
  - [ ] Ajouter validations
  - [ ] Ajouter navigation vers prochaine étape

- [ ] **3.3** RegisterPage.tsx - Étape 3 (RIB)
  - [ ] Créer form state pour RIB
  - [ ] Ajouter champs rib, accountHolder, bankName
  - [ ] Intégrer validateIBAN()
  - [ ] Afficher message d'erreur si IBAN invalide
  - [ ] Ajouter bouton "Suivant"

- [ ] **3.4** RegisterPage.tsx - Étape 4 (Pièce d'identité)
  - [ ] Créer form state pour ID
  - [ ] Ajouter sélecteur type (passport, national_id, driver_license)
  - [ ] Ajouter champs number, issueDate, expiryDate
  - [ ] Ajouter upload fichier photo
  - [ ] Intégrer validateIDDocument()
  - [ ] Convertir photo en base64

- [ ] **3.5** RegisterPage.tsx - Étape 5 (Kbis optionnel)
  - [ ] Créer form state pour Kbis
  - [ ] Ajouter checkbox "Passer cette étape"
  - [ ] Ajouter champs companyName, number, registrationDate
  - [ ] Ajouter upload photo
  - [ ] Convertir en base64 si non-skippé

- [ ] **3.6** RegisterPage.tsx - Étape 6 (Infos pro)
  - [ ] Créer form state pour pro info
  - [ ] Ajouter sélection spécialisations (checkboxes)
  - [ ] Ajouter champs insurance provider, policy number, expiry
  - [ ] Ajouter bouton "Créer mon compte pro"
  - [ ] Appeler registerProTransporter()

- [ ] **3.7** Tests
  - [ ] Tester flux complet enregistrement pro
  - [ ] Tester validation IBAN
  - [ ] Tester validation ID
  - [ ] Tester skipping Kbis
  - [ ] Vérifier que new user est créé dans context

---

## PHASE 4: GESTION DES VÉHICULES (3-4 jours)

- [ ] **4.1** Créer src/components/vehicles/VehicleList.tsx
  - [ ] Afficher liste des véhicules
  - [ ] Afficher détails (marque, type, plaque, capacité)
  - [ ] Afficher statut (active/maintenance/inactive)
  - [ ] Afficher charge actuelle vs max (progress bar)
  - [ ] Ajouter boutons Edit, Delete, Details
  - [ ] Ajouter bouton "+ Ajouter Véhicule"

- [ ] **4.2** Créer src/components/vehicles/VehicleForm.tsx
  - [ ] Form pour ajouter/éditer véhicule
  - [ ] Champs: licensePlate, brand, model, year, color
  - [ ] Champs: type, maxCapacityKg, maxVolumeCbm
  - [ ] Champs: features (checkboxes)
  - [ ] Validation
  - [ ] Submit appelle addVehicle() ou updateVehicle()

- [ ] **4.3** Créer src/pages/ProTransporter/AddVehiclePage.tsx
  - [ ] Utiliser VehicleForm
  - [ ] Créer nouveau véhicule
  - [ ] Redirect vers DashboardPro après

- [ ] **4.4** Créer src/pages/ProTransporter/EditVehiclePage.tsx
  - [ ] Charger véhicule par ID
  - [ ] Utiliser VehicleForm
  - [ ] Éditer véhicule existant
  - [ ] Redirect après

- [ ] **4.5** Tests
  - [ ] Ajouter un véhicule
  - [ ] Éditer un véhicule
  - [ ] Supprimer un véhicule
  - [ ] Voir la liste mise à jour

---

## PHASE 5: POINTS DE PICKUP (3-4 jours)

- [ ] **5.1** Créer src/components/map/PickupMap.tsx
  - [ ] Intégrer Leaflet ou Google Maps
  - [ ] Afficher points de pickup (marqueurs rouge)
  - [ ] Afficher rayon de service (cercle bleu)
  - [ ] Afficher horaires au clic
  - [ ] Permettre clic pour ajouter point
  - [ ] Permet drag-drop pour déplacer

- [ ] **5.2** Ajouter méthodes au context
  - [ ] `addPickupLocation()`
  - [ ] `updatePickupLocation()`
  - [ ] `deletePickupLocation()`

- [ ] **5.3** Créer modal pour ajouter point
  - [ ] Champs: name, address
  - [ ] Géolocalisation (lat/lon)
  - [ ] Horaires par jour (7 jours)
  - [ ] Toggle actif/inactif

- [ ] **5.4** Intégrer à DashboardPro
  - [ ] Ajouter section "Points de Pickup"
  - [ ] Afficher PickupMap
  - [ ] Bouton "Ajouter un point"
  - [ ] Afficher liste des points

- [ ] **5.5** Tests
  - [ ] Ajouter un point de pickup
  - [ ] Éditer horaires
  - [ ] Supprimer un point
  - [ ] Afficher sur carte

---

## PHASE 6: PUBLICATION DE DÉPART (5-6 jours)

- [ ] **6.1** Créer src/pages/ProTransporter/PublishDeparturePage.tsx
  - [ ] Multi-step form (3 étapes)

- [ ] **6.2** Étape 1: Route & Dates
  - [ ] Champs origin, destination
  - [ ] Champs departureDate, pickupDeadline
  - [ ] Validation: deadline < departure
  - [ ] Navigation suivant

- [ ] **6.3** Étape 2: Véhicules & Tarif
  - [ ] Multi-select véhicules
  - [ ] Afficher capacité totale auto-calculée
  - [ ] Champ basePricePerKg
  - [ ] Validation: au moins 1 véhicule, tarif > 0
  - [ ] Navigation suivant

- [ ] **6.4** Étape 3: Configuration Pickup
  - [ ] Radio buttons: fixed / pickup / both
  - [ ] Si fixed: afficher points de pickup (checkboxes)
  - [ ] Si pickup: afficher maxPickupDistance (input)
  - [ ] Si both: afficher les deux

- [ ] **6.5** Résum & Publication
  - [ ] Afficher récapitulatif complet
  - [ ] Vérifications: KYC, insurance, documents
  - [ ] Bouton "Publier le départ"
  - [ ] Appeler addDepartureOffer()
  - [ ] Toast de succès
  - [ ] Redirect vers DashboardPro

- [ ] **6.6** Tests
  - [ ] Tester flux complet publication
  - [ ] Tester validation dates
  - [ ] Tester capacité auto-calculée
  - [ ] Tester les 3 types de pickup
  - [ ] Vérifier départ visible dans DashboardPro

---

## PHASE 7: SIMULATION & MATCHING (3-4 jours)

- [ ] **7.1** Créer src/components/offers/SimulatedOffersPanel.tsx
  - [ ] Afficher nombre total d'offres
  - [ ] Afficher top 3 offres (meilleur score)
  - [ ] Pour chaque offre:
    - [ ] Nom transporteur + rating
    - [ ] Route + dates
    - [ ] Prix (poids × price/kg)
    - [ ] Type pickup supporté
    - [ ] Bouton "Réserver"
  - [ ] Afficher tarif moyen de marché
  - [ ] Afficher temps de livraison estimé

- [ ] **7.2** Intégrer matching dans DashboardCitizenSender
  - [ ] Quand colis est publié, appeler matchShipmentToOffers()
  - [ ] Afficher SimulatedOffersPanel
  - [ ] Permettre client de sélectionner une offre

- [ ] **7.3** Tests
  - [ ] Publier un colis
  - [ ] Voir les offres matchées
  - [ ] Vérifier le scoring
  - [ ] Sélectionner une offre

---

## PHASE 8: DASHBOARD PRO - INTÉGRATION (3-4 jours)

- [ ] **8.1** Ajouter section Véhicules
  - [ ] Importer VehicleList
  - [ ] Afficher vehicles du transporteur
  - [ ] Bouton "Ajouter véhicule" → AddVehiclePage
  - [ ] Boutons Edit/Delete

- [ ] **8.2** Ajouter section Pickup
  - [ ] Importer PickupMap
  - [ ] Afficher pickupLocations du transporteur
  - [ ] Bouton "Ajouter point"
  - [ ] Afficher horaires, adresse

- [ ] **8.3** Ajouter section Départs
  - [ ] Afficher offres du transporteur
  - [ ] Afficher statut (published, full, completed)
  - [ ] Afficher colis matchés / capacité
  - [ ] Bouton "Éditer", "Annuler"
  - [ ] Bouton "+ Publier un départ" → PublishDeparturePage

- [ ] **8.4** Ajouter section Offres d'expédition
  - [ ] Afficher shipments publiés
  - [ ] Proposer les meilleures offres
  - [ ] Bouton "Accepter"

- [ ] **8.5** Tests
  - [ ] Vérifier toutes les sections s'affichent
  - [ ] Tester navigation entre sections
  - [ ] Tester intégration composants

---

## PHASE 9: CAS DE FIGURE - LOGIQUE CONDITIONNELLE (2-3 jours)

- [ ] **9.1** Cas 1: BOTH (Ramassage + Fixed)
  - [ ] Quand client voit offre type BOTH
  - [ ] Afficher 2 options: Fixed + At-home
  - [ ] Si Fixed: afficher points, horaires
  - [ ] Si At-home: afficher rayon, slots
  - [ ] Tester avec données mock departure_1

- [ ] **9.2** Cas 2: FIXED uniquement
  - [ ] Quand client voit offre type FIXED
  - [ ] Afficher UNIQUEMENT points
  - [ ] MASQUER l'option at-home
  - [ ] Tester avec données mock departure_2

- [ ] **9.3** Cas 2b: PICKUP uniquement
  - [ ] Quand client voit offre type PICKUP
  - [ ] Afficher UNIQUEMENT at-home
  - [ ] MASQUER les points fixes
  - [ ] Tester avec données mock departure_3

- [ ] **9.4** Tests
  - [ ] Tester avec colis publié
  - [ ] Tester chaque cas indépendamment
  - [ ] Vérifier sélection pickup correcte

---

## PHASE 10: DONNÉES MOCK & TESTS (2-3 jours)

- [ ] **10.1** Ajouter données mock complètes
  - [ ] MOCK_PRO_USERS (3 transporteurs)
  - [ ] MOCK_VEHICLES (5 véhicules)
  - [ ] MOCK_PICKUP_LOCATIONS (4 points)
  - [ ] MOCK_DEPARTURE_OFFERS (4 offres)
  - [ ] Shipments matchés

- [ ] **10.2** Tests d'intégration
  - [ ] Enregistrer nouveau pro
  - [ ] Ajouter véhicule
  - [ ] Ajouter point de pickup
  - [ ] Publier départ
  - [ ] Publier colis
  - [ ] Voir matching automatique

- [ ] **10.3** Tests cas de figure
  - [ ] CAS 1: BOTH
  - [ ] CAS 2: FIXED
  - [ ] CAS 2b: PICKUP

- [ ] **10.4** Tests fonctionnels
  - [ ] Tarifs spécialisés
  - [ ] Dépassement capacité
  - [ ] Validation documents
  - [ ] Dates invalides

---

## PHASE 11: OPTIMISATION & POLISH (2-3 jours)

- [ ] **11.1** UI/UX
  - [ ] Vérifier design cohérent avec existant
  - [ ] Ajouter icônes appropriées
  - [ ] Vérifier responsive (mobile, tablet, desktop)
  - [ ] Tester accessibilité

- [ ] **11.2** Performance
  - [ ] Optimiser rendering VehicleList
  - [ ] Optimiser PickupMap
  - [ ] Vérifier pas de renders inutiles

- [ ] **11.3** Erreurs & Edge Cases
  - [ ] Gérer erreurs API (si applicable)
  - [ ] Gérer upload fichiers
  - [ ] Gérer formats différents de données

- [ ] **11.4** Documentation
  - [ ] Ajouter comments au code
  - [ ] Documenter nouvelles méthodes
  - [ ] Documenter types

---

## PHASE 12: DÉPLOIEMENT (1-2 jours)

- [ ] **12.1** Tests finaux
  - [ ] QA complet
  - [ ] Tester tous les flux
  - [ ] Tester sur différents navigateurs

- [ ] **12.2** Nettoyage
  - [ ] Supprimer console.log() inutiles
  - [ ] Supprimer code commenté
  - [ ] Vérifier imports inutilisés

- [ ] **12.3** Merge & Déploiement
  - [ ] Code review
  - [ ] Merge vers main
  - [ ] Déployer en production (si applicable)

---

## RÉSUMÉ ESTIMÉ

| Phase | Durée | Fichiers |
|-------|-------|----------|
| 1. Types | 2-3j | types/index.ts, mockData.ts |
| 2. Contexte | 3-4j | AppContext.tsx, utils/* |
| 3. Enregistrement | 4-5j | RegisterPage.tsx |
| 4. Véhicules | 3-4j | VehicleList.tsx, VehicleForm.tsx |
| 5. Pickup | 3-4j | PickupMap.tsx |
| 6. Publication | 5-6j | PublishDeparturePage.tsx |
| 7. Matching | 3-4j | SimulatedOffersPanel.tsx |
| 8. Dashboard | 3-4j | DashboardPro.tsx |
| 9. Cas de figure | 2-3j | Logique conditionnelle |
| 10. Mock & Tests | 2-3j | Tests complets |
| 11. Optimisation | 2-3j | Polish & optimisation |
| 12. Déploiement | 1-2j | Déploiement final |
| **TOTAL** | **~33-48 jours** | ~15 fichiers |

---

## NOTES IMPORTANTES

### ✅ À RESPECTER ABSOLUMENT
- Ne pas modifier l'architecture existante
- Ne pas dupliquer des modèles
- Rester compatible avec le code existant
- Tester incrementalement à chaque phase
- Ne pas supprimer de fonctionnalités existantes

### 🎯 ORDRE D'IMPLÉMENTATION CONSEILLÉ
1. **Commencer par Phase 1 & 2** - Fondations solides
2. **Puis Phase 3** - Enregistrement pro
3. **Puis Phase 4 & 5** - Infra (véhicules, pickup)
4. **Puis Phase 6** - Publication départ
5. **Puis Phase 7** - Matching
6. **Enfin Phase 8** - Intégration UI

### 🔄 POINTS DE VALIDATION
- ✅ Après Phase 2: Context fonctionne, pas d'erreurs
- ✅ Après Phase 3: Enregistrement pro complètement fonctionnel
- ✅ Après Phase 4-5: CRUD véhicules et pickup OK
- ✅ Après Phase 6: Publication départ OK
- ✅ Après Phase 7: Matching automatique OK
- ✅ Après Phase 8: Dashboard complet et intégré
- ✅ Après Phase 9: Cas de figure testés
- ✅ Après Phase 10: Données mock et tests OK

---

## FICHIERS À CRÉER (RÉSUMÉ)

```
src/
├── types/
│   └── index.ts (MODIFIER: +interfaces)
├── context/
│   └── AppContext.tsx (MODIFIER: +méthodes)
├── pages/
│   └── RegisterPage.tsx (MODIFIER: +steps pro)
│   └── ProTransporter/ (CRÉER)
│       ├── AddVehiclePage.tsx
│       ├── EditVehiclePage.tsx
│       ├── PublishDeparturePage.tsx
│       └── DepartureDetailPage.tsx
├── components/
│   └── vehicles/ (CRÉER)
│       ├── VehicleList.tsx
│       └── VehicleForm.tsx
│   └── map/ (CRÉER)
│       └── PickupMap.tsx
│   └── offers/ (CRÉER)
│       └── SimulatedOffersPanel.tsx
├── utils/
│   ├── matchingAlgorithm.ts (CRÉER)
│   ├── transporterUtils.ts (CRÉER)
│   └── utils.ts (MODIFIER: +helpers)
├── data/
│   └── mockData.ts (MODIFIER: +mock data pro)
└── DashboardPro.tsx (MODIFIER: +sections)
```

---

## CONTACT & SUPPORT

Pour toute question pendant l'implémentation:
1. Consulter les documents de référence (EXTENSION_PLAN_PRO_TRANSPORTER.md)
2. Vérifier la logique métier (BUSINESS_LOGIC.md)
3. Regarder les exemples mock (MOCK_DATA_EXAMPLES.md)
4. Tester avec le pseudo-code (IMPLEMENTATION_PSEUDOCODE.md)

