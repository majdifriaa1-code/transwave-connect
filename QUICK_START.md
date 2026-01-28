# 🚀 QUICK START - Transporteur Pro Transwave

**TL;DR** - Résumé rapide avant de commencer

---

## 📌 EN 30 SECONDES

Vous devez étendre Transwave pour permettre aux **transporteurs professionnels** de:

1. **S'enregistrer** avec documents (RIB, ID, Kbis)
2. **Gérer des véhicules** (camions, camionnettes, etc.)
3. **Configurer des points de pickup** (enlèvement fixe ou à domicile)
4. **Publier des départs** (trajets avec capacité disponible)
5. **Matcher automatiquement** les colis aux départs

**Cas 1:** Client peut choisir pickup FIXE ou À DOMICILE
**Cas 2:** Client DOIT utiliser UNIQUEMENT point FIXE

---

## 📚 DOCUMENTS CLÉS

| Document | Durée | Usage |
|----------|-------|-------|
| **README_DOCUMENTATION.md** | 5 min | Guide de navigation |
| **EXTENSION_PLAN_PRO_TRANSPORTER.md** | 30 min | Vue d'ensemble complète |
| **IMPLEMENTATION_PSEUDOCODE.md** | 1-2h | Code à implémenter |
| **BUSINESS_LOGIC.md** | 20 min | Comprendre la logique |
| **MOCK_DATA_EXAMPLES.md** | 15 min | Données de test |
| **IMPLEMENTATION_CHECKLIST.md** | 10 min | Tracker progression |

---

## 🎯 CE QUE VOUS ALLEZ CRÉER

### Fichiers À CRÉER (nouveaux)
```
src/pages/ProTransporter/
  ├── AddVehiclePage.tsx
  ├── EditVehiclePage.tsx
  ├── PublishDeparturePage.tsx
  └── DepartureDetailPage.tsx

src/components/vehicles/
  ├── VehicleList.tsx
  └── VehicleForm.tsx

src/components/map/
  └── PickupMap.tsx

src/components/offers/
  └── SimulatedOffersPanel.tsx

src/utils/
  ├── matchingAlgorithm.ts
  └── transporterUtils.ts
```

### Fichiers À MODIFIER (étendre)
```
src/types/index.ts
  + ProTransporterProfile
  + Vehicle
  + PickupLocation
  + DepartureOffer

src/context/AppContext.tsx
  + vehicles management
  + departures management
  + matching logic

src/pages/RegisterPage.tsx
  + Sélection profil
  + 6 étapes d'enregistrement pro

src/pages/DashboardPro.tsx
  + Section véhicules
  + Section pickup
  + Section départs

src/data/mockData.ts
  + Utilisateurs pro
  + Véhicules
  + Points de pickup
  + Offres de départ
```

---

## ⚡ DÉMARRAGE RAPIDE

### Jour 1-2: Fondations
```bash
# 1. Étendre types/index.ts
# Ajouter ProTransporterProfile, Vehicle, DepartureOffer, PickupLocation

# 2. Étendre AppContext.tsx  
# Ajouter methods: addVehicle, addDepartureOffer, matchShipmentToOffers

# 3. Créer utilitaires
# matchingAlgorithm.ts, transporterUtils.ts

# Tester: npm run dev → pas d'erreurs TypeScript
```

### Jour 3-4: Formulaire d'enregistrement
```bash
# 1. Modifier RegisterPage.tsx
# Ajouter sélection de profil (citizen vs pro)
# Ajouter 6 étapes pour pro (RIB, ID, Kbis, infos)

# 2. Valider IBAN et ID

# 3. Tester: Enregistrer un utilisateur pro
```

### Jour 5-6: Infrastructure (véhicules + pickup)
```bash
# 1. Créer VehicleList.tsx + VehicleForm.tsx
# 2. Créer PickupMap.tsx
# 3. Tester: Ajouter véhicule et point de pickup
```

### Jour 7-8: Publication
```bash
# 1. Créer PublishDeparturePage.tsx
# 2. 3 étapes: Route&Dates → Véhicules&Tarif → Pickup
# 3. Tester: Publier un départ complet
```

### Jour 9: Matching & Dashboard
```bash
# 1. Intégrer matchingAlgorithm
# 2. Créer SimulatedOffersPanel
# 3. Mettre à jour DashboardPro avec toutes les sections
# 4. Tester: Publier colis et voir les offres
```

---

## 🔑 CONCEPTS IMPORTANTS

### ProTransporterProfile
```typescript
interface ProTransporterProfile extends UserProfile {
  rib: string;                    // Compte bancaire
  idDocument: {...};              // Pièce d'identité
  kbisDocument?: {...};           // Optionnel
  vehicleIds: string[];           // Liste de véhicules
  pickupLocations?: PickupLocation[];  // Points de collecte
  specializations: string[];      // Spécialités (général, pharma, etc.)
}
```

### Vehicle
```typescript
interface Vehicle {
  id: string;
  transporterId: string;
  brand: string;  // Mercedes, Renault, etc.
  model: string;
  type: 'van' | 'truck' | 'trailer' | 'cargo_bike' | 'car';
  maxCapacityKg: number;
  maxVolumeCbm: number;
  status: 'active' | 'maintenance' | 'inactive';
}
```

### DepartureOffer
```typescript
interface DepartureOffer {
  id: string;
  origin: string;          // Lyon
  destination: string;     // Casablanca
  departureDate: string;   // 2025-06-20
  pickupDeadline: string;  // Date limite ramassage
  
  totalCapacityKg: number;
  basePricePerKg: number;
  
  pickupType: 'fixed' | 'pickup' | 'both';  // ← CAS DIFFÉRENTS
  pickupLocations?: PickupLocation[];
  maxPickupDistance?: number;
  
  status: 'draft' | 'published' | 'full' | 'completed';
}
```

---

## 🎬 CAS D'USAGE

### Cas 1: BOTH (Ramassage + Pickup Fixe)

**Scénario:**
```
Transporteur publie départ:
  Lyon → Casablanca
  Type: "BOTH" (LES DEUX OPTIONS)
  Points: [Agence Centre, Entrepôt Banlieue]
  Rayon: 50km

Client envoie colis:
  Peut CHOISIR entre:
  ✓ Livrer à "Agence Centre" (point fixe)
  ✓ Pickup à domicile (si < 50km)
```

**Code:**
```typescript
if (offer.pickupType === 'both') {
  // Afficher 2 options
  renderFixedPickupOption();   // Points
  renderAtHomePickupOption();  // Rayon
}
```

### Cas 2: FIXED Uniquement

**Scénario:**
```
Transporteur publie départ:
  Marseille → Alger
  Type: "FIXED" (UNIQUEMENT POINTS)
  Points: [Port d'Alger]

Client envoie colis:
  DOIT livrer au port
  ✗ Pas d'option à domicile
```

**Code:**
```typescript
if (offer.pickupType === 'fixed') {
  // Afficher UNIQUEMENT les points
  renderFixedPickupOption();
  // MASQUER l'option at-home
}
```

---

## ✅ CHECKLIST D'AVANT CODAGE

Avant de commencer, assurez-vous:

- [ ] Comprenez la différence Cas 1 vs Cas 2
- [ ] Savez où ajouter chaque interface TypeScript
- [ ] Avez lu le pseudo-code du formulaire d'enregistrement
- [ ] Connaissez la validation IBAN et ID
- [ ] Avez compris l'algorithme de matching
- [ ] Savez quels fichiers créer vs modifier
- [ ] Avez les données mock prêtes à tester

---

## 🧪 TESTER RAPIDEMENT

### Test Cas 1 (BOTH)
```
1. Enregistrer Ahmed (pro_user_1)
2. Ajouter véhicule (Camion Renault)
3. Ajouter point de pickup (Agence Centre)
4. Publier départ (Lyon → Casablanca, type: BOTH)
5. Publier colis (Paris → Casablanca)
6. Voir offre matchée
7. Vérifier client voit 2 options de pickup
```

### Test Cas 2 (FIXED)
```
1. Enregistrer Karim (pro_user_2)
2. Ajouter bateau
3. Ajouter point (Port Alger)
4. Publier départ (Marseille → Alger, type: FIXED)
5. Publier colis
6. Vérifier client voit UNIQUEMENT le port
```

---

## 🚨 PIÈGES À ÉVITER

❌ **NE PAS:**
- Recréer les modèles Trip/Shipment
- Modifier l'architecture globale
- Refondre l'interface utilisateur
- Supprimer le code existant
- Dupliquer des interfaces

✅ **À FAIRE:**
- Étendre les types (extends)
- Ajouter des méthodes (addVehicle, etc.)
- Créer de nouveaux composants
- Tester incrementalement
- Documenter votre code

---

## 💬 QUESTIONS RAPIDES?

### Q: Je dois utiliser Leaflet pour la carte?
**R:** Leaflet ou Google Maps, vous choisissez. C'est open source pour Leaflet.

### Q: Le RIB doit être réellement valide?
**R:** Pour v1, juste regex basique. En production: validation bancaire réelle.

### Q: Combien de temps ça prend?
**R:** ~6 semaines pour une équipe de 1-2 devs. Voir IMPLEMENTATION_CHECKLIST.md.

### Q: Je dois modifier le booking existant?
**R:** NON. Le matching alimentera les offres existantes. Pas de modification du booking.

### Q: Les données mock doivent être réalistes?
**R:** Oui, utiliser les données du MOCK_DATA_EXAMPLES.md pour tester correctement.

---

## 📞 RESSOURCES

| Besoin | Ressource |
|--------|-----------|
| Vue d'ensemble | EXTENSION_PLAN_PRO_TRANSPORTER.md |
| Logique métier | BUSINESS_LOGIC.md |
| Pseudo-code | IMPLEMENTATION_PSEUDOCODE.md |
| Données test | MOCK_DATA_EXAMPLES.md |
| Tracker | IMPLEMENTATION_CHECKLIST.md |
| Navigation | README_DOCUMENTATION.md |

---

## 🏁 SUCCÈS = QUAND?

✅ Vous avez réussi quand:

1. ✓ Enregistrement pro (6 étapes) fonctionne
2. ✓ CRUD véhicules opérationnel
3. ✓ Points de pickup configurables
4. ✓ Publication de départ complète
5. ✓ Matching automatique trouve 5+ offres
6. ✓ Cas 1 (BOTH) et Cas 2 (FIXED) testés
7. ✓ Dashboard pro intégré et complet
8. ✓ Pas d'erreurs TypeScript
9. ✓ Code cohérent avec existant
10. ✓ Documentation complète

---

## 🎉 BON COURAGE!

Consultez **README_DOCUMENTATION.md** pour plus de détails.

Commencez par **EXTENSION_PLAN_PRO_TRANSPORTER.md** si vous ne savez pas par où commencer.

Utilisez **IMPLEMENTATION_PSEUDOCODE.md** pendant le développement.

**Questions?** Relisez **BUSINESS_LOGIC.md**! 🚀

