# 🚛 Plan d'Extension - Transporteur Professionnel Transwave

## 📋 Vue d'ensemble

Ce document détaille l'extension de la partie **Transporteur Professionnel** du projet Transwave sans modifier l'architecture existante.

**Respecté:**
- ✅ Architecture existante conservée
- ✅ Modèles de données existants étendus (pas de duplication)
- ✅ Composants UI compatibles avec le design en place
- ✅ Formulaires et validations cohérents

---

## 1️⃣ CRÉATION DE COMPTE TRANSPORTEUR PROFESSIONNEL

### 1.1 Extension du modèle `UserProfile`

**Fichier:** `src/types/index.ts`

```typescript
// AJOUTER aux interfaces existantes :

// Nouvelles interfaces pour les transporteurs pros
export interface ProTransporterProfile extends UserProfile {
  // Informations financières
  rib: string;           // Iban/RIB compte bancaire
  ribVerified: boolean;
  
  // Vérification d'identité
  idDocument: {
    type: 'passport' | 'national_id' | 'driver_license';
    number: string;
    issueDate: string;
    expiryDate: string;
    photoUrl?: string;
    verified: boolean;
  };
  
  // Optional: Kbis pour sociétés
  kbisDocument?: {
    number: string;
    registrationDate: string;
    companyName: string;
    photoUrl?: string;
    verified: boolean;
  };
  
  // Flotte de véhicules
  vehicleIds: string[];  // Référence à Vehicle[]
  
  // Statut professionnel
  professionalStatus: 'registered' | 'verified' | 'suspended' | 'inactive';
  registrationDate: Date;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: string;
  
  // Spécialités
  specializations: TransportSpecialization[];
  
  // Rayon de service
  serviceArea?: string[];  // Villes/régions couvertes
  pickupLocations?: PickupLocation[];
}

export type TransportSpecialization = 'general' | 'food' | 'pharmaceuticals' | 'electronics' | 'furniture' | 'hazmat';

export interface PickupLocation {
  id: string;
  name: string;
  address: string;
  coordinates: { latitude: number; longitude: number };
  isActive: boolean;
  operatingHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
}

export interface Vehicle {
  id: string;
  transporterId: string;
  
  // Informations véhicule
  licensePlate: string;
  brand: string;           // Marque: Mercedes, Renault, etc.
  model: string;
  year: number;
  color: string;
  
  // Capacités
  type: VehicleType;       // Camionnette, Camion, Remorque, etc.
  maxCapacityKg: number;
  maxVolumeCbm: number;    // Mètres cubes
  currentLoadKg: number;   // Pour suivi en temps réel
  
  // Documents
  registrationCertificate?: string;  // Carte grise URL
  technicalInspection?: {
    date: string;
    validUntil: string;
    documentUrl: string;
  };
  
  // Équipements spéciaux
  features: VehicleFeature[];  // GPS, Climatisation, Hayon, etc.
  
  // Statut
  status: 'active' | 'maintenance' | 'inactive';
  createdAt: Date;
  lastMaintenanceDate?: Date;
}

export type VehicleType = 'van' | 'truck' | 'trailer' | 'cargo_bike' | 'car';
export type VehicleFeature = 'gps' | 'refrigerated' | 'climate_control' | 'tail_lift' | 'pallets' | 'tracking';

export interface DepartureOffer {
  id: string;
  transporterId: string;
  
  // Route
  origin: string;
  destination: string;
  
  // Dates
  departureDate: string;
  pickupDeadline: string;  // Date limite pour ramasser les colis
  
  // Capacité
  totalCapacityKg: number;
  availableCapacityKg: number;
  totalCapacityCbm: number;
  availableCapacityCbm: number;
  
  // Tarification
  basePricePerKg: number;
  specializedPricing?: {
    category: TransportSpecialization;
    pricePerKg: number;
  }[];
  
  // Configuration du pickup
  pickupType: 'fixed' | 'pickup' | 'both';  // Fixed = enlèvement au point, Pickup = à domicile
  pickupLocations?: PickupLocation[];
  maxPickupDistance?: number;  // Km depuis point de départ
  
  // Véhicules affectés
  vehicleIds: string[];
  requiredVehicles: number;
  
  // Statut
  status: 'draft' | 'published' | 'full' | 'completed' | 'cancelled';
  matchedShipments: string[];  // Shipment IDs
  
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 1.2 Formulaire d'enregistrement pro - Étapes

**Fichier:** `src/pages/RegisterPage.tsx` - À modifier pour ajouter role selection

**Pseudo-code du flux :**

```typescript
// Ajouter après le formulaire de base existant dans RegisterPage

// ÉTAPE 1: Sélection du profil
const [userRole, setUserRole] = useState<'citizen' | 'pro_transporter'>('citizen');

// ÉTAPE 2: Informations de base (existant)
// - firstName, lastName, email, address, password

// ÉTAPE 3: Si rôle = 'pro_transporter'
const [proFormStep, setProFormStep] = useState(1);  // 1, 2, 3, 4

// Step 1: Documents bancaires
const [ribForm, setRibForm] = useState({
  rib: '',
  accountHolder: '',
  bankName: '',
  swiftCode: '',
});

// Step 2: Pièce d'identité
const [idForm, setIdForm] = useState({
  type: 'national_id' as 'passport' | 'national_id' | 'driver_license',
  number: '',
  issueDate: '',
  expiryDate: '',
  photoFile: null,
});

// Step 3: Kbis (optionnel)
const [kbisForm, setKbisForm] = useState({
  companyName: '',
  number: '',
  registrationDate: '',
  photoFile: null,
  skip: true,  // Permettre de passer
});

// Step 4: Informations professionnelles
const [proInfoForm, setProInfoForm] = useState({
  insuranceProvider: '',
  insurancePolicyNumber: '',
  insuranceExpiryDate: '',
  specializations: [] as TransportSpecialization[],
  hasVehicles: false,
});

// À intégrer:
/**
 * Validation RIB/IBAN
 * - Utiliser IBAN Checker
 * - Formats: FR, MA, DZ, TN, BE, CH
 * - Valider la longueur et checksum
 */

/**
 * Upload et stockage des documents
 * - Convertir en Base64 pour mock
 * - Stocker dans localStorage pour démo
 * - En production: AWS S3 / CloudStorage
 */

/**
 * Validation de la pièce d'identité
 * - Vérifier que la date d'expiration > aujourd'hui
 * - Vérifier format du numéro par type
 */
```

**Nouvelle fonction à ajouter:**

```typescript
// DANS: src/context/AppContext.tsx

/**
 * Enregistrer un nouveau transporteur professionnel
 * @param basicInfo: { firstName, lastName, email, password, address }
 * @param ribData: { rib, accountHolder, bankName, swiftCode }
 * @param idData: { type, number, issueDate, expiryDate, photoBase64 }
 * @param kbisData?: { companyName, number, registrationDate, photoBase64 }
 * @param proInfo: { insurance, specializations }
 */
const registerProTransporter = async (
  basicInfo: BasicUserInfo,
  ribData: RIBData,
  idData: IdentificationData,
  kbisData: KbisData | null,
  proInfo: ProInfoData
): Promise<UserProfile> => {
  // 1. Créer l'utilisateur de base
  const newUser: UserProfile = {
    id: `user_${Date.now()}`,
    email: basicInfo.email,
    fullName: `${basicInfo.firstName} ${basicInfo.lastName}`,
    role: 'pro_transporter',
    address: basicInfo.address,
    isVerified: false,
    kycStatus: 'pending',  // Passe en pending pour vérification
    trustScore: 0,
    memberSince: new Date(),
    badges: [],
  };

  // 2. Étendre avec données pro
  const proUser: ProTransporterProfile = {
    ...newUser,
    rib: ribData.rib,
    ribVerified: false,
    idDocument: {
      type: idData.type,
      number: idData.number,
      issueDate: idData.issueDate,
      expiryDate: idData.expiryDate,
      photoUrl: idData.photoBase64,  // Mock: base64
      verified: false,
    },
    kbisDocument: kbisData ? {
      number: kbisData.number,
      registrationDate: kbisData.registrationDate,
      companyName: kbisData.companyName,
      photoUrl: kbisData.photoBase64,
      verified: false,
    } : undefined,
    vehicleIds: [],
    professionalStatus: 'registered',
    registrationDate: new Date(),
    specializations: proInfo.specializations,
    serviceArea: proInfo.serviceArea,
    pickupLocations: [],
  };

  // 3. Sauvegarder dans le contexte
  setCurrentUser(proUser);
  
  // 4. Sauvegarder dans localStorage (pour démo)
  localStorage.setItem(`pro_user_${newUser.id}`, JSON.stringify(proUser));

  return proUser;
};
```

---

## 2️⃣ GESTION DES VÉHICULES

### 2.1 Fonctions CRUD dans AppContext

```typescript
// Ajouter au AppContext:

interface AppContextType {
  // ... existant ...
  
  // Vehicles management
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  getTransporterVehicles: (transporterId: string) => Vehicle[];
  updateVehicleLoad: (vehicleId: string, loadKg: number) => void;
}

// Implementation:
const [vehicles, setVehicles] = useState<Vehicle[]>([]);

const addVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
  const newVehicle: Vehicle = {
    ...vehicleData,
    id: `vehicle_${Date.now()}`,
  };
  setVehicles(prev => [newVehicle, ...prev]);
  // Ajouter à ProTransporterProfile.vehicleIds
  if (currentUser?.role === 'pro_transporter') {
    const proUser = currentUser as ProTransporterProfile;
    proUser.vehicleIds.push(newVehicle.id);
  }
};

const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
  setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
};

const deleteVehicle = (id: string) => {
  setVehicles(prev => prev.filter(v => v.id !== id));
  // Retirer du profil pro
  if (currentUser?.role === 'pro_transporter') {
    const proUser = currentUser as ProTransporterProfile;
    proUser.vehicleIds = proUser.vehicleIds.filter(vid => vid !== id);
  }
};

const getTransporterVehicles = (transporterId: string): Vehicle[] => {
  return vehicles.filter(v => v.transporterId === transporterId);
};

const updateVehicleLoad = (vehicleId: string, loadKg: number) => {
  setVehicles(prev => prev.map(v => 
    v.id === vehicleId ? { ...v, currentLoadKg: loadKg } : v
  ));
};
```

### 2.2 Composant VehicleList

**Fichier:** `src/components/vehicles/VehicleList.tsx` (CRÉER)

```typescript
interface VehicleListProps {
  vehicles: Vehicle[];
  transporterId: string;
  onAdd?: () => void;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicleId: string) => void;
}

/**
 * Afficher:
 * - Liste des véhicules avec détails (marque, type, plaque, capacité)
 * - Indicateur statut (actif, maintenance, inactif)
 * - Charge actuelle vs capacité max (progress bar)
 * - Boutons: Éditer, Supprimer, Détails
 * - Bouton "+ Ajouter Véhicule"
 * 
 * À réutiliser dans DashboardPro.tsx
 */
```

---

## 3️⃣ CARTE DE PICKUP

### 3.1 Configuration des points de pickup

```typescript
// Ajouter à ProTransporterProfile:

interface ProTransporterProfile extends UserProfile {
  pickupLocations?: PickupLocation[];
}

/**
 * Permettre au transporteur pro de définir:
 * 1. Points de pickup FIXES: Entrepos, agences, etc.
 * 2. Zones de PICKUP À DOMICILE: Rayon de service
 */

// Fonction à ajouter:
const addPickupLocation = (location: Omit<PickupLocation, 'id'>): PickupLocation => {
  const newLocation: PickupLocation = {
    ...location,
    id: `pickup_${Date.now()}`,
  };
  
  if (currentUser?.role === 'pro_transporter') {
    const proUser = currentUser as ProTransporterProfile;
    if (!proUser.pickupLocations) proUser.pickupLocations = [];
    proUser.pickupLocations.push(newLocation);
  }
  
  return newLocation;
};

const updatePickupLocation = (id: string, updates: Partial<PickupLocation>) => {
  if (currentUser?.role === 'pro_transporter') {
    const proUser = currentUser as ProTransporterProfile;
    if (proUser.pickupLocations) {
      proUser.pickupLocations = proUser.pickupLocations.map(l =>
        l.id === id ? { ...l, ...updates } : l
      );
    }
  }
};

const deletePickupLocation = (id: string) => {
  if (currentUser?.role === 'pro_transporter') {
    const proUser = currentUser as ProTransporterProfile;
    if (proUser.pickupLocations) {
      proUser.pickupLocations = proUser.pickupLocations.filter(l => l.id !== id);
    }
  }
};
```

### 3.2 Composant Map (Leaflet ou Google Maps)

**Fichier:** `src/components/map/PickupMap.tsx` (CRÉER)

```typescript
interface PickupMapProps {
  pickupLocations: PickupLocation[];
  onAddLocation?: (coords: { latitude: number; longitude: number }) => void;
  onSelectLocation?: (location: PickupLocation) => void;
  serviceRadius?: number;  // Rayon de service en km
}

/**
 * Afficher:
 * - Carte interactive Leaflet (open source) ou Google Maps
 * - Points de pickup FIXES en rouge
 * - Cercle de rayon pour pickup à domicile en bleu clair
 * - Clic sur carte pour ajouter point fixe
 * - Drag-and-drop pour déplacer points
 * - Info popup avec horaires d'ouverture
 * 
 * TODO: Intégrer avec osm ou google maps API
 */
```

---

## 4️⃣ PUBLICATION DE DÉPART (DEPARTURE OFFER)

### 4.1 Modèle `DepartureOffer`

Déjà défini ci-dessus dans l'extension de `types/index.ts`

### 4.2 Formulaire de publication

**Fichier:** `src/pages/PublishDepartureOffer.tsx` (CRÉER)

```typescript
/**
 * Formulaire structuré en 4 étapes:
 * 
 * ÉTAPE 1: Route & Dates
 * - Départ (ville/adresse)
 * - Destination (ville/adresse)
 * - Date de départ (date picker)
 * - Date limite de ramassage (date picker, < departure)
 * 
 * ÉTAPE 2: Capacité & Tarif
 * - Sélectionner véhicule(s) parmi la flotte
 * - Capacité totale auto-calculée
 * - Prix par kg (base)
 * - Tarifs spécialisés (optionnel): pharma, électronique, etc.
 * 
 * ÉTAPE 3: Configuration Pickup
 * - Type pickup: "Fixed", "At-home", "Both"
 * - Si Fixed: sélectionner points de pickup (map)
 * - Si At-home: définir rayon de service
 * - Horaires de collecte
 * 
 * ÉTAPE 4: Révision & Publication
 * - Résumé complet
 * - Vérifications (RIB, ID vérifiés?)
 * - Bouton "Publier le départ"
 * 
 * Validation:
 * - Date limite < Date départ
 * - Capacité > 0
 * - Au moins 1 véhicule
 * - Tarif > 0
 */

const [departureForm, setDepartureForm] = useState({
  origin: '',
  destination: '',
  departureDate: '',
  pickupDeadline: '',
  
  selectedVehicleIds: [],
  basePricePerKg: 0,
  
  pickupType: 'fixed' as 'fixed' | 'pickup' | 'both',
  selectedPickupLocations: [] as string[],
  maxPickupDistance: 50,  // km
  
  specializations: [] as TransportSpecialization[],
});

const handlePublishDeparture = async () => {
  // 1. Valider le formulaire
  if (!validateDepartureOffer(departureForm)) return;
  
  // 2. Créer DepartureOffer
  const offer: Omit<DepartureOffer, 'id'> = {
    transporterId: currentUser.id,
    origin: departureForm.origin,
    destination: departureForm.destination,
    departureDate: departureForm.departureDate,
    pickupDeadline: departureForm.pickupDeadline,
    
    totalCapacityKg: calculateTotalCapacity(departureForm.selectedVehicleIds),
    availableCapacityKg: calculateTotalCapacity(departureForm.selectedVehicleIds),
    totalCapacityCbm: calculateTotalVolume(departureForm.selectedVehicleIds),
    availableCapacityCbm: calculateTotalVolume(departureForm.selectedVehicleIds),
    
    basePricePerKg: departureForm.basePricePerKg,
    
    pickupType: departureForm.pickupType,
    pickupLocations: getSelectedLocations(departureForm.selectedPickupLocations),
    maxPickupDistance: departureForm.maxPickupDistance,
    
    vehicleIds: departureForm.selectedVehicleIds,
    requiredVehicles: departureForm.selectedVehicleIds.length,
    
    status: 'published',
    matchedShipments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  // 3. Ajouter au contexte
  addDepartureOffer(offer);
  
  // 4. Rediriger vers dashboard
  navigate('/dashboard/pro');
};
```

### 4.3 Fonctions utilitaires

```typescript
// À ajouter dans src/lib/utils.ts ou src/utils/transporterUtils.ts

/**
 * Calculer la capacité totale depuis une sélection de véhicules
 */
function calculateTotalCapacity(vehicleIds: string[], vehicles: Vehicle[]): number {
  return vehicleIds.reduce((total, id) => {
    const vehicle = vehicles.find(v => v.id === id);
    return total + (vehicle?.maxCapacityKg || 0);
  }, 0);
}

/**
 * Calculer le volume total depuis une sélection de véhicules
 */
function calculateTotalVolume(vehicleIds: string[], vehicles: Vehicle[]): number {
  return vehicleIds.reduce((total, id) => {
    const vehicle = vehicles.find(v => v.id === id);
    return total + (vehicle?.maxVolumeCbm || 0);
  }, 0);
}

/**
 * Valider un formulaire de départ
 */
function validateDepartureOffer(form: DepartureFormData): boolean {
  // 1. Vérifier dates
  const departure = new Date(form.departureDate);
  const deadline = new Date(form.pickupDeadline);
  
  if (deadline >= departure) {
    toast({ title: 'Erreur', description: 'Date limite < date départ' });
    return false;
  }
  
  // 2. Vérifier capacité
  if (form.selectedVehicleIds.length === 0) {
    toast({ title: 'Erreur', description: 'Sélectionner au moins 1 véhicule' });
    return false;
  }
  
  // 3. Vérifier tarif
  if (form.basePricePerKg <= 0) {
    toast({ title: 'Erreur', description: 'Tarif doit être > 0' });
    return false;
  }
  
  // 4. Vérifier vérifications KYC
  if (currentUser.kycStatus !== 'verified') {
    toast({ title: 'Attention', description: 'KYC non complété' });
    return false;
  }
  
  return true;
}

/**
 * Formater l'affichage d'un départ pour le dashboard
 */
function formatDepartureOffer(offer: DepartureOffer): DepartureOfferDisplay {
  return {
    ...offer,
    capacityDisplay: `${offer.availableCapacityKg}/${offer.totalCapacityKg} kg`,
    capacityPercent: Math.round((offer.availableCapacityKg / offer.totalCapacityKg) * 100),
    daysUntilDeparture: Math.ceil((new Date(offer.departureDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    matchedCount: offer.matchedShipments.length,
  };
}
```

---

## 5️⃣ SIMULATION DES OFFRES

### 5.1 Matching algorithmique

```typescript
// À ajouter dans src/utils/matchingAlgorithm.ts

/**
 * Matcher les colis (Shipment) avec les départs (DepartureOffer)
 * Basé sur:
 * - Origine/destination
 * - Poids et volume
 * - Date de préférence < deadline
 * - Type de catégorie (si spécialisée)
 */
function findMatchingOffers(
  shipment: Shipment,
  offers: DepartureOffer[]
): DepartureOffer[] {
  return offers.filter(offer => {
    // 1. Vérifier route (simpliste)
    const originMatch = shipment.origin.toLowerCase().includes(offer.origin.toLowerCase()) ||
                       offer.origin.toLowerCase().includes(shipment.origin.toLowerCase().split(' ')[0]);
    const destMatch = shipment.destination.toLowerCase().includes(offer.destination.toLowerCase()) ||
                     offer.destination.toLowerCase().includes(shipment.destination.toLowerCase().split(' ')[0]);
    
    if (!originMatch || !destMatch) return false;
    
    // 2. Vérifier capacité
    if (offer.availableCapacityKg < shipment.weightKg) return false;
    
    // 3. Vérifier date
    const preferredDate = new Date(shipment.preferredDate || Date.now());
    const deadline = new Date(offer.pickupDeadline);
    if (preferredDate > deadline) return false;
    
    // 4. Vérifier statut
    if (offer.status === 'full' || offer.status === 'cancelled') return false;
    
    return true;
  });
}

/**
 * Calculer un score de matching (pour tri futur)
 */
function calculateMatchScore(shipment: Shipment, offer: DepartureOffer): number {
  let score = 0;
  
  // Bonus: date proche
  const daysUntilDeadline = Math.ceil((new Date(offer.pickupDeadline).getTime() - new Date(shipment.preferredDate || Date.now()).getTime()) / (1000 * 60 * 60 * 24));
  score += Math.max(0, 50 - daysUntilDeadline * 2);
  
  // Bonus: capacité optimale (pas beaucoup d'espace libre)
  const capacityUsage = (shipment.weightKg / offer.totalCapacityKg) * 100;
  score += Math.min(50, capacityUsage);
  
  // Bonus: pickup possible
  if (offer.pickupType === 'both' || offer.pickupType === 'pickup') {
    score += 20;
  }
  
  return score;
}

/**
 * Simuler les offres pour une date et capacité donnée
 * Cas d'usage: afficher les départs possibles au client
 */
function simulateOffersForShipment(
  shipment: Shipment,
  allOffers: DepartureOffer[]
): SimulatedOfferResponse {
  const matching = findMatchingOffers(shipment, allOffers)
    .map(offer => ({
      offer,
      score: calculateMatchScore(shipment, offer),
    }))
    .sort((a, b) => b.score - a.score);
  
  return {
    totalMatches: matching.length,
    topMatches: matching.slice(0, 3),
    avgPrice: calculateAveragePrice(matching),
    estimatedDelivery: matching.length > 0 ? new Date(matching[0].offer.departureDate) : null,
  };
}
```

### 5.2 Affichage des offres simulées

**Fichier:** `src/components/offers/SimulatedOffersPanel.tsx` (CRÉER)

```typescript
interface SimulatedOffersPanelProps {
  shipment: Shipment;
  offers: DepartureOffer[];
  onSelectOffer?: (offer: DepartureOffer) => void;
}

/**
 * Afficher:
 * - Nombre total d'offres disponibles
 * - Top 3 offres avec meilleur score
 * - Pour chaque offre:
 *   - Transporteur (nom, rating)
 *   - Route + dates
 *   - Prix calculé (poids * prix/kg)
 *   - Type pickup supporté
 *   - Bouton "Réserver"
 * - Tarif moyen de marché
 * - Temps de livraison estimé
 */
```

---

## 6️⃣ CAS DE FIGURE - LOGIQUE CONDITIONNELLE

### Cas 1: Ramassage + Pickup Fixe

```typescript
/**
 * SCÉNARIO:
 * Le transporteur propose un départ LYON -> CASABLANCA
 * avec pickup type: 'both'
 * 
 * POINTS DE PICKUP FIXES: 
 * - Agence LYON Centre (2 Rue de la Paix)
 * - Entrepôt LYON Banlieue (Z.I. Nord)
 * 
 * RAYON DE PICKUP À DOMICILE:
 * - Max 50 km autour de LYON
 * 
 * COMPORTEMENT:
 * 1. Client voit les 2 options:
 *    - Livrer au point fixe (adresse prédéfinie)
 *    - Pickup à domicile (géolocalisation + rayon)
 * 
 * 2. Si choix point fixe:
 *    - Afficher horaires d'ouverture
 *    - Créer amencement automatique
 * 
 * 3. Si choix domicile:
 *    - Vérifier dans rayon
 *    - Afficher timestamp amencement proposé
 *    - Permettre au client de choisir la date/heure
 */

// Implémentation:
function buildPickupOptions(
  departureOffer: DepartureOffer,
  shipment: Shipment
): PickupOption[] {
  const options: PickupOption[] = [];
  
  // Option 1: Points fixes
  if ((departureOffer.pickupType === 'fixed' || departureOffer.pickupType === 'both') 
      && departureOffer.pickupLocations) {
    options.push(...departureOffer.pickupLocations.map(location => ({
      type: 'fixed' as const,
      location,
      address: location.address,
      operatingHours: location.operatingHours,
      availableTime: getTodayOperatingHours(location),
    })));
  }
  
  // Option 2: À domicile
  if (departureOffer.pickupType === 'pickup' || departureOffer.pickupType === 'both') {
    const clientCoords = getCoordinatesFromAddress(shipment.origin);
    const departureCoords = getCoordinatesFromAddress(departureOffer.origin);
    const distance = calculateDistance(clientCoords, departureCoords);
    
    if (distance <= (departureOffer.maxPickupDistance || 50)) {
      options.push({
        type: 'at_home' as const,
        address: shipment.origin,
        distance,
        availableTime: generatePickupTimeSlots(
          new Date(),
          new Date(departureOffer.pickupDeadline)
        ),
      });
    }
  }
  
  return options;
}

interface PickupOption {
  type: 'fixed' | 'at_home';
  address: string;
  location?: PickupLocation;
  operatingHours?: Record<string, { open: string; close: string }>;
  distance?: number;  // km (for at-home)
  availableTime: TimeSlot[];
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}
```

### Cas 2: Pickup Fixe Uniquement

```typescript
/**
 * SCÉNARIO:
 * Transporteur propose pickup FIXE UNIQUEMENT
 * 
 * COMPORTEMENT:
 * 1. Masquer l'option "À domicile" du formulaire
 * 2. Afficher uniquement les points fixes disponibles
 * 3. Client DOIT livrer au point fixe
 * 4. Afficher horaires clairement
 */

function renderPickupForm(departureOffer: DepartureOffer) {
  if (departureOffer.pickupType === 'fixed') {
    return (
      <div>
        <h3>Points de collecte (obligatoire)</h3>
        {departureOffer.pickupLocations?.map(location => (
          <div key={location.id} className="border rounded p-4">
            <h4>{location.name}</h4>
            <p>{location.address}</p>
            <OperatingHours hours={location.operatingHours} />
            <Button onClick={() => selectPickupLocation(location.id)}>
              Choisir ce point
            </Button>
          </div>
        ))}
      </div>
    );
  }
  
  // Sinon afficher les 2 options
  return renderBothOptions(departureOffer);
}
```

---

## 7️⃣ INTÉGRATION DANS LE DASHBOARD PRO

### 7.1 Extension DashboardPro.tsx

```typescript
/**
 * Ajouter les sections suivantes à DashboardPro.tsx:
 * 
 * 1. SECTION VÉHICULES
 *    - Liste des véhicules actifs
 *    - Statut de chaque véhicule
 *    - Charge actuelle
 *    - Bouton "Ajouter véhicule"
 *    - Bouton "Modifier" par véhicule
 * 
 * 2. SECTION POINTS DE PICKUP
 *    - Carte interactive avec points
 *    - Liste des points
 *    - Boutons "Ajouter", "Éditer", "Supprimer"
 * 
 * 3. SECTION MES DÉPARTS
 *    - Liste des départs publiés
 *    - Statut (draft, published, full, completed)
 *    - Colis matchés / capacité
 *    - Boutons "Éditer", "Annuler", "Voir détails"
 * 
 * 4. SECTION OFFRES D'EXPÉDITION
 *    - Shiipments en attente de pickup
 *    - Offres avec meilleur score
 * 
 * 5. STATISTIQUES PRO
 *    - Nombre de départs ce mois
 *    - Chiffre d'affaires
 *    - Taux d'acceptation
 *    - Rating moyen
 */

export default function DashboardPro() {
  const { currentUser, vehicles, getTransporterVehicles } = useApp();
  const proUser = currentUser as ProTransporterProfile;
  
  const transporterVehicles = getTransporterVehicles(currentUser?.id || '');
  
  return (
    <div className="space-y-8">
      {/* Existing Header */}
      
      {/* SECTION 1: Véhicules */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Mes Véhicules</h2>
          <Button onClick={() => navigate('/dashboard/pro/vehicles/add')}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter véhicule
          </Button>
        </div>
        
        {transporterVehicles.length > 0 ? (
          <VehicleList
            vehicles={transporterVehicles}
            transporterId={currentUser?.id || ''}
            onEdit={(vehicle) => navigate(`/dashboard/pro/vehicles/${vehicle.id}`)}
            onDelete={(vehicleId) => deleteVehicle(vehicleId)}
          />
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Aucun véhicule. Ajouter le premier!</p>
          </Card>
        )}
      </section>
      
      {/* SECTION 2: Points de Pickup */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Points de Pickup</h2>
          <Button onClick={() => openAddPickupModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un point
          </Button>
        </div>
        
        <PickupMap
          pickupLocations={proUser.pickupLocations || []}
          onAddLocation={(coords) => openAddPickupModal(coords)}
          onSelectLocation={(location) => openEditPickupModal(location)}
          serviceRadius={proUser.serviceArea?.length ? 50 : 0}
        />
      </section>
      
      {/* SECTION 3: Mes Départs */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Mes Départs Publiés</h2>
          <Button 
            variant="accent"
            onClick={() => navigate('/dashboard/pro/departures/new')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Publier un départ
          </Button>
        </div>
        
        {myDepartures.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myDepartures.map(offer => (
              <DepartureOfferCard
                key={offer.id}
                offer={offer}
                onEdit={() => navigate(`/dashboard/pro/departures/${offer.id}/edit`)}
                onCancel={() => cancelDeparture(offer.id)}
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Aucun départ. Créer le premier!</p>
          </Card>
        )}
      </section>
    </div>
  );
}
```

### 7.2 Nouvelles pages à créer

```
src/pages/
├── ProTransporter/
│   ├── AddVehiclePage.tsx
│   ├── EditVehiclePage.tsx
│   ├── PublishDeparturePage.tsx
│   └── DepartureDetailPage.tsx
```

---

## 8️⃣ MODIFICATION MINEURE DES TYPES EXISTANTS

### 8.1 Extension Trip

```typescript
// Dans src/types/index.ts, ajouter à Trip:

export interface Trip {
  // ... existant ...
  
  // Nouvelles propriétés (optionnelles, backward compatible)
  departurOfferId?: string;        // Lien vers DepartureOffer pour pro
  pickupType?: 'fixed' | 'pickup' | 'both';  // Pour les pros
  pickupDeadline?: string;         // Date limite de ramassage
  requiredVehicles?: number;
}
```

### 8.2 Extension Shipment

```typescript
export interface Shipment {
  // ... existant ...
  
  // Nouvelles propriétés
  preferredPickupType?: 'fixed' | 'at_home';  // Préférence du client
  selectedPickupLocation?: PickupLocation;    // Lieu de pickup choisi
  estimatedPickupDate?: string;              // Date ramassage proposée
  departureOfferId?: string;                  // Lien vers DepartureOffer
}
```

---

## 9️⃣ RÉSUMÉ DES MODIFICATIONS

### Fichiers À CRÉER:
```
✅ src/types/index.ts (extends with ProTransporterProfile, Vehicle, DepartureOffer, etc.)
✅ src/components/vehicles/VehicleList.tsx
✅ src/components/vehicles/VehicleForm.tsx
✅ src/components/map/PickupMap.tsx
✅ src/components/offers/SimulatedOffersPanel.tsx
✅ src/components/departures/DepartureOfferCard.tsx
✅ src/pages/ProTransporter/PublishDeparturePage.tsx
✅ src/pages/ProTransporter/AddVehiclePage.tsx
✅ src/pages/ProTransporter/EditVehiclePage.tsx
✅ src/utils/transporterUtils.ts (validation, formatting)
✅ src/utils/matchingAlgorithm.ts (matching logic)
```

### Fichiers À MODIFIER:
```
✅ src/context/AppContext.tsx (ajouter vehicles, departures, matching methods)
✅ src/types/index.ts (extensions)
✅ src/pages/DashboardPro.tsx (ajouter sections vehicles, vehicles, departures)
✅ src/pages/RegisterPage.tsx (ajouter sélection pro + formulaires pro)
✅ src/data/mockData.ts (mock vehicles, departure offers, pro users)
```

### Fichiers À LAISSER INTACTS:
```
❌ src/pages/BookingPage.tsx
❌ src/pages/Index.tsx
❌ src/components/ui/*
❌ src/components/layout/*
❌ src/pages/DashboardCitizenSender.tsx
❌ src/pages/DashboardCitizenTransport.tsx
```

---

## 🔟 VALIDATIONS ET RÈGLES MÉTIER

### Validation RIB/IBAN
```typescript
function validateIBAN(iban: string): boolean {
  // Champs supportés: FR, MA, DZ, TN, BE, CH
  const ibanRegex = {
    FR: /^FR\d{2}\d{5}\d{5}[\dA-Z]{11}\d{2}$/,
    MA: /^MA\d{2}\d{3}\d{1}\d{14}$/,
    DZ: /^DZ\d{2}\d{3}\d{17}$/,
    TN: /^TN\d{2}\d{3}\d{3}\d{13}\d{2}$/,
    BE: /^BE\d{2}\d{3}\d{7}\d{2}$/,
    CH: /^CH\d{2}\d{5}[\dA-Z]{12}$/,
  };
  
  const country = iban.substring(0, 2);
  const regex = ibanRegex[country as keyof typeof ibanRegex];
  
  return regex ? regex.test(iban) : false;
}
```

### Validation Pièce d'Identité
```typescript
function validateIDDocument(doc: IdentificationData): boolean {
  // 1. Date d'expiration doit être future
  if (new Date(doc.expiryDate) < new Date()) {
    return false;
  }
  
  // 2. Date d'émission doit être antérieure
  if (new Date(doc.issueDate) > new Date(doc.expiryDate)) {
    return false;
  }
  
  // 3. Numéro format par type
  const numberFormats: Record<string, RegExp> = {
    passport: /^[A-Z]{2}\d{7}$/,        // Format standard
    national_id: /^\d{9,13}$/,          // Numéro d'identité
    driver_license: /^[A-Z]\d{8}$/,     // Format permis
  };
  
  const format = numberFormats[doc.type];
  return format ? format.test(doc.number) : false;
}
```

---

## 🎯 PROCHAINES ÉTAPES

1. **Implémenter les types** (extension types/index.ts)
2. **Ajouter les méthodes au context** (AppContext.tsx)
3. **Créer les composants UI** (VehicleList, PickupMap, etc.)
4. **Implémenter le formulaire d'enregistrement pro** (RegisterPage.tsx)
5. **Créer la page de publication de départ** (PublishDeparturePage.tsx)
6. **Intégrer l'algorithme de matching** (matchingAlgorithm.ts)
7. **Mettre à jour le DashboardPro** (DashboardPro.tsx)
8. **Ajouter les données mock** (mockData.ts)
9. **Tester les cas de figure** (both cases)
10. **Optimiser et valider** (UX, validation, business logic)

