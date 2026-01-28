# 📊 DONNÉES MOCK - Transporteur Pro

Exemples de données à ajouter à `src/data/mockData.ts` pour tester la fonctionnalité complète.

---

## 1. UTILISATEURS PRO COMPLÈTEMENT ENREGISTRÉS

```typescript
// À ajouter à MOCK_USERS

export const MOCK_PRO_USERS = [
  {
    // Ahmed - Transporteur routier Maroc
    id: 'pro_user_1',
    email: 'ahmed.transport@pro.ma',
    fullName: 'Ahmed Ben Youssef',
    role: 'pro_transporter',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
    isVerified: true,
    kycStatus: 'verified',
    trustScore: 4.9,
    memberSince: new Date('2023-01-15'),
    badges: ['Pro Vérifié', 'Top Transporteur', 'Livraison Rapide'],
    address: '45 Rue Mohammed V, Casablanca, Maroc',
    
    // Pro-specific fields
    rib: 'MA64011519000500001M9842',
    ribVerified: true,
    idDocument: {
      type: 'national_id',
      number: '12345678',
      issueDate: '2019-05-20',
      expiryDate: '2029-05-20',
      photoUrl: 'data:image/png;base64,...',
      verified: true,
    },
    kbisDocument: {
      number: 'MA123456789',
      registrationDate: '2020-03-10',
      companyName: 'Ahmed Transport SARL',
      photoUrl: 'data:image/png;base64,...',
      verified: true,
    },
    vehicleIds: ['vehicle_1', 'vehicle_2'],
    specializations: ['general', 'food'],
    pickupLocations: ['pickup_1', 'pickup_2'],
    serviceArea: ['Casablanca', 'Fès', 'Marrakech'],
    professionalStatus: 'verified',
    registrationDate: new Date('2023-01-15'),
    insuranceProvider: 'Assur Maroc',
    insurancePolicyNumber: 'POL-2023-001234',
    insuranceExpiryDate: '2026-01-15',
  },
  
  {
    // Karim - Transport maritime Algérie
    id: 'pro_user_2',
    email: 'karim.maritime@dz',
    fullName: 'Karim Slimani',
    role: 'pro_transporter',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim',
    isVerified: true,
    kycStatus: 'verified',
    trustScore: 4.7,
    memberSince: new Date('2022-11-01'),
    badges: ['Pro Vérifié', 'Maritime Expert'],
    address: 'Port d\'Alger, Algérie',
    
    // Pro-specific
    rib: 'DZ58000100000000000000009',
    ribVerified: true,
    idDocument: {
      type: 'passport',
      number: 'AA1234567',
      issueDate: '2018-06-15',
      expiryDate: '2028-06-15',
      photoUrl: 'data:image/png;base64,...',
      verified: true,
    },
    vehicleIds: ['vehicle_3'],
    specializations: ['general', 'pharma'],
    pickupLocations: ['pickup_3'],
    serviceArea: ['Alger', 'Oran'],
    professionalStatus: 'verified',
    registrationDate: new Date('2022-11-01'),
    insuranceProvider: 'Assurance Algérienne',
    insurancePolicyNumber: 'MAR-2023-5678',
    insuranceExpiryDate: '2025-11-01',
  },
  
  {
    // Fatima - Transport frigorifique Tunisie
    id: 'pro_user_3',
    email: 'fatima.froid@tn',
    fullName: 'Fatima Hmida',
    role: 'pro_transporter',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima',
    isVerified: true,
    kycStatus: 'verified',
    trustScore: 4.8,
    memberSince: new Date('2023-05-10'),
    badges: ['Pro Vérifié', 'Transport Frigorifique'],
    address: 'Route de Sfax, Tunis, Tunisie',
    
    // Pro-specific
    rib: 'TN5910006104004942712941',
    ribVerified: true,
    idDocument: {
      type: 'national_id',
      number: '98765432',
      issueDate: '2018-03-25',
      expiryDate: '2028-03-25',
      photoUrl: 'data:image/png;base64,...',
      verified: true,
    },
    vehicleIds: ['vehicle_4', 'vehicle_5'],
    specializations: ['food', 'pharma'],
    pickupLocations: ['pickup_4'],
    serviceArea: ['Tunis', 'Sfax', 'Sousse'],
    professionalStatus: 'verified',
    registrationDate: new Date('2023-05-10'),
    insuranceProvider: 'Assurance Tunisienne',
    insurancePolicyNumber: 'FRIG-2023-9012',
    insuranceExpiryDate: '2026-05-10',
  },
];
```

---

## 2. VÉHICULES ENREGISTRÉS

```typescript
// À ajouter à mockData.ts

export const MOCK_VEHICLES: Vehicle[] = [
  {
    // Ahmed - Camion Renault
    id: 'vehicle_1',
    transporterId: 'pro_user_1',
    licensePlate: 'CASA-123-MA',
    brand: 'Renault',
    model: 'Trucks T520',
    year: 2021,
    color: 'Blanc',
    type: 'truck',
    maxCapacityKg: 5000,
    maxVolumeCbm: 25,
    currentLoadKg: 0,
    registrationCertificate: 'data:image/png;base64,...',
    technicalInspection: {
      date: '2023-09-15',
      validUntil: '2025-09-15',
      documentUrl: 'data:image/png;base64,...',
    },
    features: ['gps', 'tail_lift', 'tracking'],
    status: 'active',
    createdAt: new Date('2021-11-20'),
    lastMaintenanceDate: new Date('2024-01-10'),
  },
  
  {
    // Ahmed - Camionnette Ford
    id: 'vehicle_2',
    transporterId: 'pro_user_1',
    licensePlate: 'CASA-456-MA',
    brand: 'Ford',
    model: 'Transit Custom',
    year: 2022,
    color: 'Bleu',
    type: 'van',
    maxCapacityKg: 1500,
    maxVolumeCbm: 10,
    currentLoadKg: 0,
    features: ['gps', 'climate_control'],
    status: 'active',
    createdAt: new Date('2022-03-15'),
    lastMaintenanceDate: new Date('2024-01-05'),
  },
  
  {
    // Karim - Bateau/Conteneur
    id: 'vehicle_3',
    transporterId: 'pro_user_2',
    licensePlate: 'ALGER-001-DZ',
    brand: 'Maersk',
    model: 'Container Ship',
    year: 2018,
    color: 'Gris',
    type: 'truck', // Simplification
    maxCapacityKg: 500000,
    maxVolumeCbm: 2000,
    currentLoadKg: 0,
    features: ['gps', 'refrigerated', 'pallets', 'tracking'],
    status: 'active',
    createdAt: new Date('2018-06-01'),
    lastMaintenanceDate: new Date('2024-01-20'),
  },
  
  {
    // Fatima - Camion Frigorifique
    id: 'vehicle_4',
    transporterId: 'pro_user_3',
    licensePlate: 'TUNIS-789-TN',
    brand: 'Mercedes-Benz',
    model: 'Actros Refrigerated',
    year: 2022,
    color: 'Blanc',
    type: 'truck',
    maxCapacityKg: 8000,
    maxVolumeCbm: 30,
    currentLoadKg: 0,
    features: ['gps', 'refrigerated', 'climate_control', 'tracking'],
    status: 'active',
    createdAt: new Date('2022-04-10'),
    lastMaintenanceDate: new Date('2024-01-08'),
  },
  
  {
    // Fatima - Camionnette frigorifique
    id: 'vehicle_5',
    transporterId: 'pro_user_3',
    licensePlate: 'TUNIS-012-TN',
    brand: 'Fiat',
    model: 'Ducato Refrigerated',
    year: 2023,
    color: 'Blanc',
    type: 'van',
    maxCapacityKg: 2000,
    maxVolumeCbm: 12,
    currentLoadKg: 0,
    features: ['gps', 'refrigerated'],
    status: 'active',
    createdAt: new Date('2023-02-20'),
    lastMaintenanceDate: new Date('2024-01-15'),
  },
];
```

---

## 3. POINTS DE PICKUP

```typescript
// À ajouter à mockData.ts

export const MOCK_PICKUP_LOCATIONS: PickupLocation[] = [
  {
    // Ahmed - Agence Casablanca Centre
    id: 'pickup_1',
    name: 'Agence Casablanca Centre',
    address: '2 Rue Mohammed V, Casablanca 20000, Maroc',
    coordinates: {
      latitude: 33.5731,
      longitude: -7.5898,
    },
    isActive: true,
    operatingHours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '10:00', close: '14:00' },
      sunday: { open: 'closed', close: 'closed' },
    },
  },
  
  {
    // Ahmed - Entrepôt périphérie
    id: 'pickup_2',
    name: 'Entrepôt Casablanca Banlieue',
    address: 'Z.I. Nord, Lot 45, Casablanca, Maroc',
    coordinates: {
      latitude: 33.6200,
      longitude: -7.5500,
    },
    isActive: true,
    operatingHours: {
      monday: { open: '07:00', close: '19:00' },
      tuesday: { open: '07:00', close: '19:00' },
      wednesday: { open: '07:00', close: '19:00' },
      thursday: { open: '07:00', close: '19:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { open: 'closed', close: 'closed' },
      sunday: { open: 'closed', close: 'closed' },
    },
  },
  
  {
    // Karim - Port Alger
    id: 'pickup_3',
    name: 'Port d\'Alger - Quai Principal',
    address: 'Quai Principal, Port d\'Alger, Algérie',
    coordinates: {
      latitude: 36.7540,
      longitude: 3.0588,
    },
    isActive: true,
    operatingHours: {
      monday: { open: '06:00', close: '20:00' },
      tuesday: { open: '06:00', close: '20:00' },
      wednesday: { open: '06:00', close: '20:00' },
      thursday: { open: '06:00', close: '20:00' },
      friday: { open: '08:00', close: '18:00' },
      saturday: { open: '08:00', close: '14:00' },
      sunday: { open: 'closed', close: 'closed' },
    },
  },
  
  {
    // Fatima - Agence Tunis
    id: 'pickup_4',
    name: 'Agence Tunis Centre',
    address: 'Avenue Habib Bourguiba, Tunis 1001, Tunisie',
    coordinates: {
      latitude: 36.8065,
      longitude: 10.1956,
    },
    isActive: true,
    operatingHours: {
      monday: { open: '08:30', close: '17:30' },
      tuesday: { open: '08:30', close: '17:30' },
      wednesday: { open: '08:30', close: '17:30' },
      thursday: { open: '08:30', close: '17:30' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '10:00', close: '13:00' },
      sunday: { open: 'closed', close: 'closed' },
    },
  },
];
```

---

## 4. OFFRES DE DÉPART (CAS 1 & CAS 2)

```typescript
// À ajouter à mockData.ts

export const MOCK_DEPARTURE_OFFERS: DepartureOffer[] = [
  {
    // ===== CAS 1: BOTH (Ramassage + Pickup Fixe) =====
    id: 'departure_1',
    transporterId: 'pro_user_1',
    origin: 'Lyon',
    destination: 'Casablanca',
    departureDate: '2025-06-20T08:00:00Z',
    pickupDeadline: '2025-06-18T18:00:00Z',
    
    totalCapacityKg: 6500,
    availableCapacityKg: 6500,
    totalCapacityCbm: 35,
    availableCapacityCbm: 35,
    
    basePricePerKg: 3.50,
    
    // === CONFIGURATION PICKUP TYPE: BOTH ===
    pickupType: 'both',
    pickupLocations: [
      {
        id: 'pickup_1',
        name: 'Agence Casablanca Centre',
        address: '2 Rue Mohammed V, Casablanca',
        coordinates: { latitude: 33.5731, longitude: -7.5898 },
        isActive: true,
        operatingHours: {
          monday: { open: '08:00', close: '18:00' },
          tuesday: { open: '08:00', close: '18:00' },
          wednesday: { open: '08:00', close: '18:00' },
          thursday: { open: '08:00', close: '18:00' },
          friday: { open: '09:00', close: '17:00' },
          saturday: { open: '10:00', close: '14:00' },
          sunday: { open: 'closed', close: 'closed' },
        },
      },
    ],
    maxPickupDistance: 50, // km depuis Lyon
    
    vehicleIds: ['vehicle_1', 'vehicle_2'],
    requiredVehicles: 2,
    
    matchedShipments: ['ship_1', 'ship_2'],
    status: 'published',
    
    createdAt: new Date('2025-06-15T10:00:00Z'),
    updatedAt: new Date('2025-06-15T10:00:00Z'),
  },
  
  {
    // ===== CAS 2: FIXED UNIQUEMENT (Point Fixe) =====
    id: 'departure_2',
    transporterId: 'pro_user_2',
    origin: 'Marseille',
    destination: 'Alger',
    departureDate: '2025-06-22T14:00:00Z',
    pickupDeadline: '2025-06-20T18:00:00Z',
    
    totalCapacityKg: 500000,
    availableCapacityKg: 500000,
    totalCapacityCbm: 2000,
    availableCapacityCbm: 2000,
    
    basePricePerKg: 2.50,
    
    // === CONFIGURATION PICKUP TYPE: FIXED UNIQUEMENT ===
    pickupType: 'fixed',
    pickupLocations: [
      {
        id: 'pickup_3',
        name: 'Port d\'Alger - Quai Principal',
        address: 'Quai Principal, Port d\'Alger',
        coordinates: { latitude: 36.7540, longitude: 3.0588 },
        isActive: true,
        operatingHours: {
          monday: { open: '06:00', close: '20:00' },
          tuesday: { open: '06:00', close: '20:00' },
          wednesday: { open: '06:00', close: '20:00' },
          thursday: { open: '06:00', close: '20:00' },
          friday: { open: '08:00', close: '18:00' },
          saturday: { open: '08:00', close: '14:00' },
          sunday: { open: 'closed', close: 'closed' },
        },
      },
    ],
    // NO maxPickupDistance for fixed-only
    
    vehicleIds: ['vehicle_3'],
    requiredVehicles: 1,
    
    matchedShipments: [],
    status: 'published',
    
    createdAt: new Date('2025-06-16T12:00:00Z'),
    updatedAt: new Date('2025-06-16T12:00:00Z'),
  },
  
  {
    // ===== CAS 2b: PICKUP À DOMICILE UNIQUEMENT =====
    id: 'departure_3',
    transporterId: 'pro_user_3',
    origin: 'Tunis',
    destination: 'Paris',
    departureDate: '2025-06-25T10:00:00Z',
    pickupDeadline: '2025-06-22T18:00:00Z',
    
    totalCapacityKg: 10000,
    availableCapacityKg: 8500,
    totalCapacityCbm: 42,
    availableCapacityCbm: 35,
    
    basePricePerKg: 4.00,
    specializedPricing: [
      {
        category: 'pharma',
        pricePerKg: 5.50,
      },
      {
        category: 'food',
        pricePerKg: 4.50,
      },
    ],
    
    // === CONFIGURATION PICKUP TYPE: PICKUP (À DOMICILE) ===
    pickupType: 'pickup',
    pickupLocations: undefined, // Pas de points fixes
    maxPickupDistance: 75, // km depuis Tunis
    
    vehicleIds: ['vehicle_4', 'vehicle_5'],
    requiredVehicles: 2,
    
    matchedShipments: [],
    status: 'published',
    
    createdAt: new Date('2025-06-17T14:00:00Z'),
    updatedAt: new Date('2025-06-17T14:00:00Z'),
  },
  
  {
    // ===== CAS 1b: BOTH avec tarifs spécialisés =====
    id: 'departure_4',
    transporterId: 'pro_user_1',
    origin: 'Paris',
    destination: 'Marrakech',
    departureDate: '2025-06-28T09:00:00Z',
    pickupDeadline: '2025-06-25T19:00:00Z',
    
    totalCapacityKg: 5000,
    availableCapacityKg: 5000,
    totalCapacityCbm: 25,
    availableCapacityCbm: 25,
    
    basePricePerKg: 3.00,
    specializedPricing: [
      { category: 'pharma', pricePerKg: 6.00 },
      { category: 'electronics', pricePerKg: 5.50 },
    ],
    
    pickupType: 'both',
    pickupLocations: [
      {
        id: 'pickup_1',
        name: 'Agence Casablanca Centre',
        address: '2 Rue Mohammed V, Casablanca',
        coordinates: { latitude: 33.5731, longitude: -7.5898 },
        isActive: true,
        operatingHours: {
          monday: { open: '08:00', close: '18:00' },
          tuesday: { open: '08:00', close: '18:00' },
          wednesday: { open: '08:00', close: '18:00' },
          thursday: { open: '08:00', close: '18:00' },
          friday: { open: '09:00', close: '17:00' },
          saturday: { open: '10:00', close: '14:00' },
          sunday: { open: 'closed', close: 'closed' },
        },
      },
    ],
    maxPickupDistance: 100,
    
    vehicleIds: ['vehicle_1'],
    requiredVehicles: 1,
    
    matchedShipments: [],
    status: 'published',
    
    createdAt: new Date('2025-06-18T11:00:00Z'),
    updatedAt: new Date('2025-06-18T11:00:00Z'),
  },
];
```

---

## 5. SHIPMENTS MATCHÉS (CAS 1)

```typescript
// Ajouter à MOCK_SHIPMENTS pour tester le matching

{
  id: 'ship_matched_1',
  senderId: 'user_4',
  senderName: 'Mohamed Expéditeur',
  origin: 'Paris',
  destination: 'Casablanca',
  itemCategory: 'cat_3',
  description: 'Boîtes de documents importants',
  weightKg: 15,
  dimensions: '50x40x30',
  declaredValue: 200,
  photos: [],
  status: 'matched',  // ← Matché avec departure_1
  type: 'standard',
  preferredDate: '2025-06-17',
  proposedPrice: 52.50,  // 15kg * 3.50€/kg = 52.50€
  createdAt: new Date(),
  departureOfferId: 'departure_1',
  selectedPickupLocation: {
    id: 'pickup_1',
    name: 'Agence Casablanca Centre',
    address: '2 Rue Mohammed V, Casablanca',
    // ...
  },
  preferredPickupType: 'fixed',
},

{
  id: 'ship_matched_2',
  senderId: 'user_5',
  senderName: 'Sophie Client',
  origin: 'Lyon',
  destination: 'Casablanca',
  itemCategory: 'cat_5',
  description: 'Cosmétiques et produits beauté',
  weightKg: 8,
  dimensions: '30x25x20',
  declaredValue: 120,
  photos: [],
  status: 'matched',  // ← Matché avec departure_1
  type: 'standard',
  preferredDate: '2025-06-16',
  proposedPrice: 28.00,  // 8kg * 3.50€/kg = 28€
  createdAt: new Date(),
  departureOfferId: 'departure_1',
  preferredPickupType: 'at_home',  // ← Pickup à domicile
  estimatedPickupDate: '2025-06-17T14:00:00Z',
},
```

---

## 6. RÉSUMÉ DES DONNÉES

### Transporteurs
- **Ahmed** (Morocco, Road): 2 véhicules, 2 points de pickup
- **Karim** (Algeria, Maritime): 1 bateau, 1 point de pickup
- **Fatima** (Tunisia, Refrigerated): 2 camions frigo, 1 point de pickup

### Offres de départ
1. **departure_1**: CAS 1 - BOTH (Ramassage + Fixed), 2 colis matchés
2. **departure_2**: CAS 2 - FIXED uniquement, Maritime
3. **departure_3**: CAS 2b - PICKUP uniquement, Spécialisation pharma/food
4. **departure_4**: CAS 1b - BOTH avec tarifs spécialisés

### Véhicules
- 5 véhicules répartis entre les 3 transporteurs
- Mix: Camions, camionnettes, bateau

### Points de pickup
- 4 points répartis (Casablanca x2, Alger, Tunis)
- Horaires réalistes

---

## 7. CAS DE TEST RECOMMANDÉS

### Test 1: Matching CAS 1 (BOTH)
```
✓ Envoyer colis Paris → Casablanca
✓ Système trouve departure_1 (BOTH)
✓ Client voit 2 options: Fixed + At-home
✓ Client choisit Fixed
✓ Colis ramassé à "Agence Casablanca Centre"
```

### Test 2: Matching CAS 2 (FIXED UNIQUEMENT)
```
✓ Envoyer colis Marseille → Alger
✓ Système trouve departure_2 (FIXED)
✓ Client voit UNIQUEMENT "Port d'Alger"
✓ Pas d'option à domicile disponible
✓ Client doit livrer au port
```

### Test 3: Tarifs spécialisés
```
✓ Envoyer colis pharma
✓ Departure_4 propose 6€/kg (vs 3€/kg générique)
✓ Prix calculé: 10kg pharma × 6€ = 60€
```

### Test 4: Dépassement capacité
```
✓ Departure_1 commence avec 6500kg
✓ Colis 1 (15kg) matché → Reste: 6485kg
✓ Colis 2 (8kg) matché → Reste: 6477kg
✓ Colis 3 (6500kg) demande → IMPOSSIBLE (capacity exceeded)
```

