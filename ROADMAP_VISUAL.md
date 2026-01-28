# 🗺️ ROADMAP VISUELLE - Transporteur Pro Transwave

## 📊 ARCHITECTURE GLOBALE

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRANSPORTEUR PROFESSIONNEL                     │
│                         (Nouvelle Suite)                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ 1. ENREGISTREMENT PRO (6 ÉTAPES)                              │
│    └─ Infos base → RIB → ID → Kbis → Infos pro → Confirmation │
│       Crée: ProTransporterProfile                              │
└──────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────┐
│ 2. GESTION VÉHICULES (CRUD)                                   │
│    ├─ Ajouter véhicule (marque, type, capacité)               │
│    ├─ Éditer véhicule                                         │
│    ├─ Supprimer véhicule                                      │
│    └─ Voir liste + charge                                     │
│       Crée: Vehicle[]                                         │
└──────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────┐
│ 3. CONFIGURATION PICKUP (Points + Rayon)                      │
│    ├─ Ajouter point fixe (adresse + horaires)                 │
│    ├─ Définir rayon de service (km)                           │
│    ├─ Voir sur carte interactive                              │
│    └─ Éditer/Supprimer points                                 │
│       Crée: PickupLocation[]                                  │
└──────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────┐
│ 4. PUBLICATION DE DÉPART (3 ÉTAPES)                           │
│    ├─ Step 1: Route & Dates                                   │
│    ├─ Step 2: Véhicules & Tarif                               │
│    ├─ Step 3: Configuration Pickup (FIXED/PICKUP/BOTH)        │
│    └─ Résumé & Publication                                    │
│       Crée: DepartureOffer                                    │
└──────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────┐
│ 5. MATCHING AUTOMATIQUE                                        │
│    ├─ Client publie colis                                     │
│    ├─ Système cherche offreS compatibles                      │
│    │  (route, date, capacité, type pickup)                    │
│    ├─ Score chaque offre (proximité, capacité, etc.)          │
│    └─ Affiche top 3 offres                                    │
└──────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────┐
│ 6. SÉLECTION PICKUP (CAS 1 & 2)                               │
│                                                               │
│    CAS 1: BOTH (Ramassage + Fixed)                           │
│    Client voit 2 options:                                     │
│    ├─ Option A: Point fixe (adresse + horaires)              │
│    └─ Option B: À domicile (si < rayon)                      │
│                                                               │
│    CAS 2: FIXED Uniquement                                    │
│    Client voit 1 option:                                      │
│    └─ UNIQUEMENT le point fixe (pas d'at-home)               │
│                                                               │
│    CAS 2b: PICKUP Uniquement                                  │
│    Client voit 1 option:                                      │
│    └─ UNIQUEMENT à domicile (pas de points)                  │
└──────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────┐
│ 7. GESTION DE LA LIVRAISON                                    │
│    ├─ Colis ramassé (fixed ou at-home)                        │
│    ├─ Suivi en transit                                        │
│    ├─ Livraison complétée                                     │
│    └─ Paiement releasé                                        │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎯 FLUX CLIENT (CAS 1: BOTH)

```
┌─────────────────────────────────────┐
│ TRANSPORTEUR PRO                    │
└─────────────────────────────────────┘
       ↓
  S'enregistre
  (RIB, ID, Kbis)
       ↓
  Ajoute véhicule
  (Mercedes 1000kg)
       ↓
  Ajoute point pickup
  (Agence Centre + Entrepôt)
       ↓
  Publie départ
  (Lyon→Casablanca, BOTH)
       ↓
  ✅ Offre publiée

       ↓↓↓ MATCHING AUTOMATIQUE ↓↓↓

┌─────────────────────────────────────┐
│ CLIENT EXPÉDITEUR                   │
└─────────────────────────────────────┘
       ↓
  Publie colis
  (Paris→Casablanca, 5kg)
       ↓
  Système trouve:
  "Lyon→Casablanca offre" ✓
       ↓
  Client voit OPTIONS:
  ┌──────────────────────┐
  │ Option A: Fixed      │
  │ Agence Centre        │
  │ (8h-18h)             │
  │ ✓ Choisir            │
  └──────────────────────┘
  ┌──────────────────────┐
  │ Option B: At-home    │
  │ Pickup 50km rayon    │
  │ Créneaux: ...        │
  │ ✓ Choisir            │
  └──────────────────────┘
       ↓
  Client choisit: "Option A (Fixed)"
       ↓
  Colis ramassé à Agence Centre
  Date: 17 juin, 14h
       ↓
  Livraison effectuée
       ↓
  Paiement releasé au transporteur
```

---

## 🎯 FLUX CLIENT (CAS 2: FIXED)

```
┌─────────────────────────────────────┐
│ TRANSPORTEUR PRO                    │
└─────────────────────────────────────┘
       ↓
  ...enregistrement, véhicule...
       ↓
  Ajoute point
  (Port d'Alger)
       ↓
  Publie départ
  (Marseille→Alger, FIXED UNIQUEMENT)
       ↓
  ✅ Offre publiée

       ↓↓↓ MATCHING ↓↓↓

┌─────────────────────────────────────┐
│ CLIENT EXPÉDITEUR                   │
└─────────────────────────────────────┘
       ↓
  Publie colis
  (Marseille→Alger)
       ↓
  Système trouve l'offre
       ↓
  Client voit OPTIONS:
  ┌──────────────────────┐
  │ ❌ Option A: Fixed   │ MASQUÉE
  ├──────────────────────┤
  │ ✓ Option Unique:     │
  │ Port d'Alger         │
  │ (Quai Principal)     │
  │ ✓ Choisir            │
  └──────────────────────┘
       ↓
  Client DOIT livrer au port
  (pas d'autre choix)
       ↓
  Colis livré au port avant deadline
       ↓
  Paiement releasé
```

---

## 📁 STRUCTURE DES FICHIERS

```
src/
│
├── types/
│   └── index.ts
│       ├── ProTransporterProfile (NEW)
│       ├── Vehicle (NEW)
│       ├── PickupLocation (NEW)
│       ├── DepartureOffer (NEW)
│       ├── + 4 types
│       └── Existing types ...
│
├── context/
│   └── AppContext.tsx
│       ├── [vehicles CRUD] (NEW)
│       ├── [departures CRUD] (NEW)
│       ├── matchShipmentToOffers() (NEW)
│       ├── registerProTransporter() (NEW)
│       └── Existing functions ...
│
├── pages/
│   ├── RegisterPage.tsx (MODIFY)
│   │   ├── Step 1: Select profile
│   │   ├── Step 2: Basic info
│   │   ├── Step 3: RIB
│   │   ├── Step 4: ID document
│   │   ├── Step 5: Kbis (optional)
│   │   └── Step 6: Pro info
│   │
│   ├── DashboardPro.tsx (MODIFY)
│   │   ├── + Vehicles section
│   │   ├── + Pickup section
│   │   ├── + Departures section
│   │   └── + Shipment offers section
│   │
│   └── ProTransporter/ (NEW)
│       ├── AddVehiclePage.tsx
│       ├── EditVehiclePage.tsx
│       ├── PublishDeparturePage.tsx
│       └── DepartureDetailPage.tsx
│
├── components/
│   │
│   ├── vehicles/ (NEW)
│   │   ├── VehicleList.tsx
│   │   └── VehicleForm.tsx
│   │
│   ├── map/ (NEW)
│   │   └── PickupMap.tsx
│   │
│   ├── offers/ (NEW)
│   │   └── SimulatedOffersPanel.tsx
│   │
│   └── [existing components...]
│
├── utils/
│   ├── transporterUtils.ts (NEW)
│   │   ├── validateIBAN()
│   │   ├── validateIDDocument()
│   │   └── calculateVehicleCapacity()
│   │
│   ├── matchingAlgorithm.ts (NEW)
│   │   ├── findMatchingOffers()
│   │   ├── calculateMatchScore()
│   │   └── simulateOffers()
│   │
│   └── [existing utils...]
│
├── data/
│   └── mockData.ts (MODIFY)
│       ├── + MOCK_PRO_USERS (3)
│       ├── + MOCK_VEHICLES (5)
│       ├── + MOCK_PICKUP_LOCATIONS (4)
│       ├── + MOCK_DEPARTURE_OFFERS (4)
│       └── Existing mocks...
│
└── [existing folders...]
```

---

## 🔄 CYCLE D'IMPLÉMENTATION

```
SEMAINE 1: FONDATIONS
├─ Day 1-2: Types + AppContext
├─ Day 3-4: Utils + validation
└─ Day 5: Tests compilation
   Livrable: Context fonctionnel

SEMAINE 2: ENREGISTREMENT
├─ Day 6-8: RegisterPage (6 steps)
├─ Day 9-10: Validation + upload
└─ Day 11: Tests enregistrement
   Livrable: Pro users créés

SEMAINE 3: INFRASTRUCTURE
├─ Day 12-14: VehicleList + VehicleForm
├─ Day 15-17: PickupMap + gestion
└─ Day 18: Tests CRUD
   Livrable: Véhicules + Pickup

SEMAINE 4: PUBLICATIONS
├─ Day 19-22: PublishDeparturePage
├─ Day 23-24: Validation complex
└─ Day 25: Tests publications
   Livrable: Départs publiés

SEMAINE 5: MATCHING
├─ Day 26-28: Algorithme matching
├─ Day 29-30: SimulatedOffersPanel
└─ Day 31: Dashboard intégration
   Livrable: Matching fonctionne

SEMAINE 6: FINITION
├─ Day 32: Cas 1 (BOTH) test
├─ Day 33: Cas 2 (FIXED) test
├─ Day 34: Polish + optimisation
└─ Day 35-36: QA + fixes
   Livrable: Prêt pour production
```

---

## 🧪 MATRICE DE TEST

```
                  Enregistr. | Véhicules | Pickup | Départ | Match.
Jour 1 (Entreg)      ✓                                       
Jour 2 (Entreg)      ✓                                       
Jour 3 (Véhicul.)             ✓                              
Jour 4 (Véhicul.)             ✓                              
Jour 5 (Pickup)                         ✓                    
Jour 6 (Pickup)                         ✓                    
Jour 7 (Départ)                                  ✓           
Jour 8 (Départ)                                  ✓           
Jour 9 (Match)                                          ✓    
Jour 10 (Cas 1)      ✓        ✓        ✓        ✓        ✓   
Jour 11 (Cas 2)      ✓        ✓        ✓        ✓        ✓   
Jour 12 (Intégr)     ✓        ✓        ✓        ✓        ✓   
```

---

## 📊 SCORING DE COMPLEXITÉ

```
Task                          Complexité      Durée
────────────────────────────────────────────────────
Types + Interfaces            ⭐☆☆☆☆         2-3j
AppContext methods            ⭐⭐☆☆☆        3-4j
Formulaire enregistrement      ⭐⭐⭐☆☆        4-5j
CRUD Véhicules               ⭐⭐☆☆☆        3-4j
PickupMap (Leaflet)          ⭐⭐⭐☆☆        3-4j
PublishDeparture multi-step  ⭐⭐⭐⭐☆        5-6j
Matching algorithm           ⭐⭐☆☆☆        3-4j
Dashboard intégration        ⭐⭐☆☆☆        3-4j
Cas de figure 1 & 2          ⭐⭐⭐☆☆        2-3j
Tests QA complets            ⭐⭐⭐☆☆        2-3j
────────────────────────────────────────────────────
                        TOTAL:          ~33-48 jours
```

---

## ⚡ DÉPENDANCES ENTRE PHASES

```
Phase 1: Types
    ↓
Phase 2: AppContext ←── dépend de Phase 1
    ↓
Phase 3: RegisterPage ←── dépend de Phase 2
    ↓
Phase 4: VehicleManager ←── dépend de Phase 2
    ↓
Phase 5: PickupManager ←── dépend de Phase 4
    ↓
Phase 6: PublishDeparture ←── dépend de Phase 4 & 5
    ↓
Phase 7: Matching ←── dépend de Phase 2 & 6
    ↓
Phase 8: Dashboard ←── dépend de Phase 3, 4, 5, 6, 7
    ↓
Phase 9: Tests Cas 1 & 2 ←── dépend de Phase 8
    ↓
Phase 10: QA & Fixes ←── dépend de Phase 9
    ↓
Phase 11: Production Ready
```

---

## 🚀 GO/NO-GO CHECKLIST

Avant de démarrer:

```
Architecture
├─ [ ] Scope bien compris
├─ [ ] Cas 1 & 2 expliqués
├─ [ ] Dépendances identifiées
└─ [ ] Pas de conflits with existing

Technical
├─ [ ] TypeScript compiler config OK
├─ [ ] React/vite setup OK
├─ [ ] CI/CD pipeline OK
└─ [ ] Database schema OK (if any)

Resources
├─ [ ] Dev(s) assigné(s)
├─ [ ] PM/PO identifié(s)
├─ [ ] QA engagé(e)
└─ [ ] Documentation OK (✓ vous lisez ça!)

Timeline
├─ [ ] 6 weeks planifiées
├─ [ ] Milestones hebdos définis
├─ [ ] Buffer de 20% prévu
└─ [ ] Stakeholders alignés

GO! ✓ Tous les checkboxes cochées
```

---

## 🎉 SUCCESS CRITERIA

```
Enregistrement Pro
├─ [x] 6 étapes fonctionnelles
├─ [x] RIB validé
├─ [x] ID document stocké
└─ [x] Kbis optionnel OK

Véhicules
├─ [x] CRUD complet
├─ [x] Capacité auto-calculée
├─ [x] Vue liste avec détails
└─ [x] Statut visible

Pickup
├─ [x] Carte interactive
├─ [x] Points + rayon configurables
├─ [x] Horaires éditables
└─ [x] Géolocalisation OK

Départ
├─ [x] 3 étapes formulaire
├─ [x] Validation dates
├─ [x] Tarification calculée
└─ [x] Type pickup flexible

Matching
├─ [x] Algo fonctionne
├─ [x] 5+ offres trouvées (test)
├─ [x] Score pertinent
└─ [x] Panel affichage OK

Cas 1 (BOTH)
├─ [x] 2 options visibles
├─ [x] Fixed et At-home OK
└─ [x] Sélection persiste

Cas 2 (FIXED)
├─ [x] 1 seule option
├─ [x] At-home masquée
└─ [x] Client doit choisir fixed

Integration
├─ [x] DashboardPro complet
├─ [x] Tous les composants
├─ [x] Navigation fluide
└─ [x] Pas d'erreurs

====================================
✅ PRODUCTION READY
====================================
```

---

**Créé le: 24 janvier 2026**

**Pour:** Équipe Transwave

**Scope:** Extension Transporteur Professionnel

**Status:** ✅ Prêt pour implémentation

