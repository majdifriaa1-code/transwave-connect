# 🎯 LOGIQUE MÉTIER - Transporteur Pro Transwave

## VUE D'ENSEMBLE DE LA LOGIQUE MÉTIER

```
CRÉER COMPTE PRO
    ↓
AJOUTER VÉHICULES
    ↓
DÉFINIR POINTS DE PICKUP
    ↓
PUBLIER UN DÉPART
    ↓
COLIS MATCHÉS AUTOMATIQUEMENT
    ↓
ACCEPTER/REJETER OFFRES
    ↓
GÉRER LA LIVRAISON
```

---

## 1. CAS DE FIGURE 1: RAMASSAGE + PICKUP FIXE

### Scénario
```
Transporteur Pro crée une offre:
  Route: LYON → CASABLANCA
  Véhicules: Camion 1000kg
  Pickup type: "both" (LES DEUX)

Points de pickup FIXES:
  - Agence Centre: 2 Rue de la Paix, Lyon (8h-18h)
  - Entrepôt Banlieue: Z.I. Nord (7h-19h)

Rayon de pickup À DOMICILE: 50 km autour de Lyon
```

### Flux client
```
Client 1: Veut utiliser un point FIXE
  ✓ Voir liste des 2 agences
  ✓ Choisir "Agence Centre"
  ✓ Livrer colis le 12 juin entre 9h-17h
  ✓ Colis ramassé automatiquement

Client 2: Veut pickup À DOMICILE
  ✓ Donner son adresse (35 Avenue, Lyon)
  ✓ Système vérifie: 15km < 50km ✓ OK
  ✓ Choisir date/heure (13 juin 14h)
  ✓ Transporteur vient chercher
```

### Code implémentation

```typescript
/**
 * Cas 1: Transporteur propose BOTH
 * buildPickupOptions() retourne:
 * [
 *   { type: 'fixed', name: 'Agence Centre', address: '...' },
 *   { type: 'fixed', name: 'Entrepôt Banlieue', address: '...' },
 *   { type: 'at_home', radius: 50km, slots: [...] }
 * ]
 */

function handlePickupSelection(shipment: Shipment, offer: DepartureOffer) {
  const options = buildPickupOptions(offer, shipment);
  
  if (clientSelectsFixed) {
    // Option 1: Point fixe
    shipment.selectedPickupLocation = selectedFixedLocation;
    // Afficher horaires
    displayOperatingHours(selectedFixedLocation.operatingHours);
    // Créer amencement auto pour date deadline
    scheduleAutoPickup(shipment, selectedFixedLocation, offer.pickupDeadline);
  } else if (clientSelectsAtHome) {
    // Option 2: Domicile
    // Vérifier géolocalisation
    const distance = calculateDistance(clientCoords, departureCoords);
    if (distance > offer.maxPickupDistance) {
      return ERROR("Trop loin");
    }
    
    // Proposer créneaux disponibles
    const slots = generatePickupTimeSlots(Date.now(), offer.pickupDeadline);
    displayTimeSlots(slots);
    
    shipment.estimatedPickupDate = selectedSlot;
    shipment.preferredPickupType = 'at_home';
  }
}
```

### Matching automatique

```typescript
/**
 * Quand colis publié, système cherche des départs:
 * - Route LYON → CASABLANCA OK
 * - Poids 2kg < 1000kg OK
 * - Date préférence (12 juin) < deadline (15 juin) OK
 * - Pickup type: BOTH → flexible OK
 * → MATCH !
 */

const matching = findMatchingOffers(shipment, departureOffers);
// Returns: DepartureOffer avec pickupType='both'
```

---

## 2. CAS DE FIGURE 2: PICKUP FIXE UNIQUEMENT

### Scénario
```
Transporteur Pro crée une offre:
  Route: MARSEILLE → ALGER
  Véhicules: Bateau conteneur 500kg
  Pickup type: "fixed" (UNIQUEMENT POINTS FIXES)

Points de pickup FIXES obligatoires:
  - Port Marseille: Quai Principal (lun-ven 6h-20h)
  - AUCUNE option à domicile
```

### Flux client
```
Client 1: Veut utiliser un point FIXE
  ✓ Voir UNIQUEMENT "Port Marseille"
  ✓ Choisir
  ✓ Livrer colis avant 15 juin
  ✓ OK

Client 2: Veut pickup À DOMICILE
  ✗ Option MASQUÉE (pas disponible)
  ✗ Message: "Uniquement point fixe disponible"
  ✗ Doit utiliser Port Marseille ou chercher autre offre
```

### Code implémentation

```typescript
/**
 * Cas 2: Transporteur propose FIXED
 * buildPickupOptions() retourne UNIQUEMENT points fixes
 */

function renderPickupForm(offer: DepartureOffer) {
  if (offer.pickupType === 'fixed') {
    // Option 1: Afficher UNIQUEMENT les points fixes
    return (
      <div className="pickup-options">
        <h3>Lieux de collecte disponibles</h3>
        
        {offer.pickupLocations?.map(location => (
          <FixedPickupCard
            key={location.id}
            location={location}
            onSelect={() => selectPickupLocation(location)}
          />
        ))}
        
        {/* MASQUER complètement l'option À DOMICILE */}
      </div>
    );
  } else if (offer.pickupType === 'pickup') {
    // Option 2: UNIQUEMENT à domicile
    return <AtHomePickupForm />;
  } else if (offer.pickupType === 'both') {
    // Option 3: LES DEUX
    return <BothPickupOptionsForm />;
  }
}
```

### Matching automatique

```typescript
/**
 * Quand colis publié:
 * - Route MARSEILLE → ALGER OK
 * - Poids OK
 * - Pickup type: FIXED
 * 
 * CONDITION: Client DOIT livrer à Port Marseille
 *            (pas d'autre choix)
 */
```

---

## 3. LOGIQUE DE PRICING (Tarification)

### Calcul du prix final

```typescript
/**
 * Exemple:
 * Transporteur publie départ avec: basePricePerKg = 3€
 * Client envoie colis de: 5kg
 * 
 * Calcul:
 * - Prix transporteur: 5kg × 3€ = 15€
 * - Frais plateforme: 15€ × 15% = 2.25€ (min 2€)
 * - Prix total: 15€ + 2.25€ = 17.25€
 */

function calculateShipmentPrice(
  shipmentWeightKg: number,
  departureOffer: DepartureOffer
): PricingResult {
  const baseCost = shipmentWeightKg * departureOffer.basePricePerKg;
  const platformFee = Math.max(2, baseCost * 0.15);
  const totalPrice = baseCost + platformFee;
  
  return {
    transporterReceives: baseCost,
    platformFee: platformFee,
    clientPays: totalPrice,
  };
}

/**
 * Tarifs spécialisés (optionnel):
 * Transporteur peut proposer des prix différents par catégorie
 * 
 * Exemple:
 * - Électronique: 5€/kg (au lieu de 3€)
 * - Pharma: 4€/kg (au lieu de 3€)
 * - Général: 3€/kg
 */
```

### Capacité résiduelle

```typescript
/**
 * Chaque colis accepté réduit la capacité
 * 
 * Départ initial:
 * - Capacité totale: 1000kg
 * - Capacité disponible: 1000kg
 * 
 * Colis 1 accepté: 500kg
 * - Capacité disponible: 500kg
 * 
 * Colis 2 accepté: 400kg
 * - Capacité disponible: 100kg
 * 
 * Colis 3 demande: 200kg
 * - IMPOSSIBLE (100kg < 200kg)
 * - Proposer à prochains transporteurs
 */

function updateAvailableCapacity(
  departureId: string,
  acceptedShipmentWeightKg: number
) {
  const offer = departureOffers.find(o => o.id === departureId);
  if (offer) {
    offer.availableCapacityKg -= acceptedShipmentWeightKg;
    
    if (offer.availableCapacityKg <= 0) {
      offer.status = 'full';  // Plus de place
    }
  }
}
```

---

## 4. STATUTS ET TRANSITIONS

### Statuts transporteur

```
Enregistrement
    ↓
'registered' (documents en attente de vérification)
    ↓
KYC complété
    ↓
'verified' (KYC approuvé, peut publier)
    ↓
'suspended' (violation de règles)
    ↓
'inactive' (compte désactivé volontairement)
```

### Statuts véhicule

```
'active' → utilisable pour départs
'maintenance' → indisponible temporairement
'inactive' → hors service
```

### Statuts départ

```
'draft' → crée mais pas publié
    ↓
'published' → visible pour clients
    ↓
'full' → capacité atteinte
    ↓
'completed' → livraison faite
ou
'cancelled' → annulé par transporteur
```

---

## 5. VALIDATION DES DOCUMENTS

### RIB/IBAN
```
Formats acceptés: FR, MA, DZ, TN, BE, CH
Validation: Regex + checksum (optionnel pour v1)

Exemples valides:
- FR1420041010050500013M02606
- MA64011519000500001M9842
- DZ58000100000000000000009
```

### Pièce d'Identité
```
Infos requises:
- Type (Passeport, CNI, Permis)
- Numéro
- Date émission
- Date expiration (DOIT ÊTRE FUTURE)
- Photo scannée

Validation:
- Expiration > aujourd'hui ✓
- Numéro format correct ✓
- Tous les champs remplis ✓
```

### Kbis
```
Infos requises (si applicable):
- Numéro Kbis
- Date d'enregistrement
- Nom entreprise
- Scan du Kbis

État: OPTIONNEL
(Les indépendants peuvent l'ignorer)
```

---

## 6. MATCHING AUTOMATIQUE - ALGORITHME

```typescript
/**
 * Quand client publie un colis:
 * Le système cherche automatiquement les départs compatibles
 */

function matchShipmentToDepartures(shipment: Shipment): MatchResult {
  return departures
    .filter(dep => {
      // 1. Route match
      if (!routeMatches(shipment.origin, dep.origin)) return false;
      if (!routeMatches(shipment.destination, dep.destination)) return false;
      
      // 2. Capacité suffisante
      if (dep.availableCapacityKg < shipment.weightKg) return false;
      
      // 3. Date compatible (pref < deadline)
      if (new Date(shipment.preferredDate) > new Date(dep.pickupDeadline)) {
        return false;
      }
      
      // 4. Statut actif
      if (dep.status === 'full' || dep.status === 'cancelled') return false;
      
      return true;
    })
    .map(dep => ({
      departure: dep,
      score: calculateScore(shipment, dep),
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * Score de matching (100 points max)
 * 
 * - Date proximale: +30 (plus proche, mieux c'est)
 * - Utilisation capacité: +40 (70-100% = ideal)
 * - Flexibilité pickup: +20 (BOTH > pickup > fixed)
 * - Rating transporteur: +10 (bonus si rating > 4.5)
 */
```

---

## 7. RÈGLES MÉTIER - CONTRAINTES

```typescript
/**
 * VALIDATION PRO-TRANSPORTER
 */

// 1. Documents obligatoires
if (!proUser.ribVerified || !proUser.idDocument.verified) {
  return ERROR("Documents non vérifiés");
}

// 2. Pas de publication sans KYC
if (proUser.kycStatus !== 'verified') {
  return ERROR("KYC en attente");
}

// 3. Au moins 1 véhicule actif
if (getTransporterVehicles(userId).every(v => v.status !== 'active')) {
  return ERROR("Aucun véhicule actif");
}

// 4. Assurance valide
if (new Date(proUser.insuranceExpiryDate) < new Date()) {
  return ERROR("Assurance expirée");
}

// 5. Tarif réaliste (min 1€/kg, max 50€/kg)
if (offer.basePricePerKg < 1 || offer.basePricePerKg > 50) {
  return ERROR("Tarif hors limites");
}

// 6. Deadline < Departure
if (offer.pickupDeadline >= offer.departureDate) {
  return ERROR("Dates invalides");
}

// 7. Véhicules sélectionnés doivent être actifs
if (offer.vehicleIds.some(id => {
  const v = vehicles.find(v => v.id === id);
  return v?.status !== 'active';
})) {
  return ERROR("Véhicule(s) inactif(s)");
}
```

---

## 8. ÉQUATIONS CLÉS

### Calcul de distance (pour pickup à domicile)

```typescript
/**
 * Haversine formula (simplifié)
 * Calcule distance entre 2 coordonnées GPS
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Rayon terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Vérifier si point dans rayon
 */
function isWithinRadius(
  clientCoords: { lat: number; lon: number },
  centerCoords: { lat: number; lon: number },
  radiusKm: number
): boolean {
  return calculateDistance(
    clientCoords.lat,
    clientCoords.lon,
    centerCoords.lat,
    centerCoords.lon
  ) <= radiusKm;
}
```

### Disponibilité créneaux

```typescript
/**
 * Générer créneaux disponibles pour pickup à domicile
 */
function generatePickupTimeSlots(
  from: Date,
  to: Date,
  slotDurationMinutes: number = 30
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  let current = new Date(from);
  
  while (current < to) {
    const nextSlot = new Date(current.getTime() + slotDurationMinutes * 60000);
    
    // Vérifier disponibilité
    const isAvailable = !isBookedSlot(current, nextSlot);
    
    slots.push({
      start: current.toISOString(),
      end: nextSlot.toISOString(),
      available: isAvailable,
    });
    
    current = nextSlot;
  }
  
  return slots;
}
```

---

## 9. CHECKLIST AVANT PUBLICATION

```
⬜ Transporteur a au moins 1 véhicule actif
⬜ Documents vérifiés (RIB, ID)
⬜ KYC approuvé
⬜ Assurance valide
⬜ Origine ≠ Destination
⬜ Pickup deadline < Departure date
⬜ Au moins 1 point de pickup configuré (si fixed/both)
⬜ Tarif entre 1€ et 50€/kg
⬜ Description route complète
```

---

## 10. ÉVÉNEMENTS MÉTIER

```typescript
/**
 * Événements à tracker (pour notifications, logs, analytics)
 */

enum TransporterEvents {
  // Profil
  PRO_REGISTERED = 'pro_registered',
  DOCUMENTS_SUBMITTED = 'documents_submitted',
  KYC_APPROVED = 'kyc_approved',
  KYC_REJECTED = 'kyc_rejected',
  
  // Véhicules
  VEHICLE_ADDED = 'vehicle_added',
  VEHICLE_UPDATED = 'vehicle_updated',
  VEHICLE_DELETED = 'vehicle_deleted',
  
  // Départs
  DEPARTURE_PUBLISHED = 'departure_published',
  DEPARTURE_CANCELLED = 'departure_cancelled',
  DEPARTURE_COMPLETED = 'departure_completed',
  DEPARTURE_FULL = 'departure_full',
  
  // Shipments
  SHIPMENT_MATCHED = 'shipment_matched',
  SHIPMENT_ACCEPTED = 'shipment_accepted',
  SHIPMENT_REJECTED = 'shipment_rejected',
  
  // Paiements
  PAYMENT_RECEIVED = 'payment_received',
  PAYOUT_PROCESSED = 'payout_processed',
}

// Log
logEvent(TransporterEvents.DEPARTURE_PUBLISHED, {
  transporterId: 'user_1',
  departureId: 'departure_123',
  timestamp: Date.now(),
  capacity: 1000,
  price: 3,
});
```

