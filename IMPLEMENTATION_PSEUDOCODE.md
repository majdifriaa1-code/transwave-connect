# 📝 Pseudo-Code d'Implémentation - Transporteur Pro

## 1. ÉTENDRE LES TYPES (src/types/index.ts)

```typescript
// ====== AJOUTER CES INTERFACES ======

// 1.1 Profil transporteur pro (extension de UserProfile)
export interface ProTransporterProfile extends UserProfile {
  // Informations financières
  rib: string;
  ribVerified: boolean;
  
  // Pièce d'identité
  idDocument: {
    type: 'passport' | 'national_id' | 'driver_license';
    number: string;
    issueDate: string;
    expiryDate: string;
    photoUrl?: string;
    verified: boolean;
  };
  
  // Kbis (optionnel)
  kbisDocument?: {
    number: string;
    registrationDate: string;
    companyName: string;
    photoUrl?: string;
    verified: boolean;
  };
  
  // Flotte et pickup
  vehicleIds: string[];
  specializations: TransportSpecialization[];
  pickupLocations?: PickupLocation[];
  serviceArea?: string[];
  
  // Statut pro
  professionalStatus: 'registered' | 'verified' | 'suspended' | 'inactive';
  registrationDate: Date;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: string;
}

// 1.2 Types transporteur
export type TransportSpecialization = 'general' | 'food' | 'pharma' | 'electronics' | 'furniture' | 'hazmat';
export type VehicleType = 'van' | 'truck' | 'trailer' | 'cargo_bike' | 'car';
export type VehicleFeature = 'gps' | 'refrigerated' | 'climate_control' | 'tail_lift' | 'pallets' | 'tracking';

// 1.3 Véhicule
export interface Vehicle {
  id: string;
  transporterId: string;
  
  // Infos de base
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  
  // Capacités
  type: VehicleType;
  maxCapacityKg: number;
  maxVolumeCbm: number;
  currentLoadKg: number;
  
  // Documents
  registrationCertificate?: string;
  technicalInspection?: {
    date: string;
    validUntil: string;
    documentUrl: string;
  };
  
  // Équipements
  features: VehicleFeature[];
  
  // Statut
  status: 'active' | 'maintenance' | 'inactive';
  createdAt: Date;
  lastMaintenanceDate?: Date;
}

// 1.4 Point de pickup
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

// 1.5 Offre de départ
export interface DepartureOffer {
  id: string;
  transporterId: string;
  
  // Route et dates
  origin: string;
  destination: string;
  departureDate: string;
  pickupDeadline: string;
  
  // Capacités
  totalCapacityKg: number;
  availableCapacityKg: number;
  totalCapacityCbm: number;
  availableCapacityCbm: number;
  
  // Prix
  basePricePerKg: number;
  specializedPricing?: {
    category: TransportSpecialization;
    pricePerKg: number;
  }[];
  
  // Configuration pickup
  pickupType: 'fixed' | 'pickup' | 'both';
  pickupLocations?: PickupLocation[];
  maxPickupDistance?: number;
  
  // Véhicules
  vehicleIds: string[];
  requiredVehicles: number;
  
  // Colis matchés
  matchedShipments: string[];
  status: 'draft' | 'published' | 'full' | 'completed' | 'cancelled';
  
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 2. ÉTENDRE LE CONTEXTE (src/context/AppContext.tsx)

```typescript
// ====== DANS AppContextType, AJOUTER ======

interface AppContextType {
  // ... existant ...
  
  // Vehicles CRUD
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  getTransporterVehicles: (transporterId: string) => Vehicle[];
  updateVehicleLoad: (vehicleId: string, loadKg: number) => void;
  
  // Departure offers
  departureOffers: DepartureOffer[];
  addDepartureOffer: (offer: Omit<DepartureOffer, 'id'>) => void;
  updateDepartureOffer: (id: string, updates: Partial<DepartureOffer>) => void;
  deleteDepartureOffer: (id: string) => void;
  getTransporterOffers: (transporterId: string) => DepartureOffer[];
  matchShipmentToOffers: (shipment: Shipment) => DepartureOffer[];
  
  // Enregistrement pro
  registerProTransporter: (data: ProRegistrationData) => Promise<ProTransporterProfile>;
}

// ====== DANS AppProvider, AJOUTER ÉTAT ======

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // ... existant ...
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [departureOffers, setDepartureOffers] = useState<DepartureOffer[]>([]);
  
  // ====== IMPLÉMENTER LES FONCTIONS ======
  
  // Vehicles
  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `vehicle_${Date.now()}`,
    };
    setVehicles(prev => [newVehicle, ...prev]);
    
    // Ajouter à ProTransporterProfile si c'est le bon rôle
    if (currentUser?.role === 'pro_transporter') {
      const proUser = currentUser as ProTransporterProfile;
      proUser.vehicleIds.push(newVehicle.id);
      setCurrentUser(proUser);
    }
  };
  
  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => 
      v.id === id ? { ...v, ...updates } : v
    ));
  };
  
  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    
    // Retirer du profil
    if (currentUser?.role === 'pro_transporter') {
      const proUser = currentUser as ProTransporterProfile;
      proUser.vehicleIds = proUser.vehicleIds.filter(vid => vid !== id);
      setCurrentUser(proUser);
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
  
  // Departure offers
  const addDepartureOffer = (offerData: Omit<DepartureOffer, 'id'>) => {
    const newOffer: DepartureOffer = {
      ...offerData,
      id: `departure_${Date.now()}`,
    };
    setDepartureOffers(prev => [newOffer, ...prev]);
  };
  
  const updateDepartureOffer = (id: string, updates: Partial<DepartureOffer>) => {
    setDepartureOffers(prev => prev.map(o =>
      o.id === id ? { ...o, ...updates } : o
    ));
  };
  
  const deleteDepartureOffer = (id: string) => {
    setDepartureOffers(prev => prev.filter(o => o.id !== id));
  };
  
  const getTransporterOffers = (transporterId: string): DepartureOffer[] => {
    return departureOffers.filter(o => o.transporterId === transporterId);
  };
  
  const matchShipmentToOffers = (shipment: Shipment): DepartureOffer[] => {
    // Voir section "Algorithme de matching" ci-dessous
    return departureOffers.filter(offer => {
      // 1. Route match
      const originMatch = shipment.origin.toLowerCase().includes(
        offer.origin.toLowerCase()
      ) || offer.origin.toLowerCase().includes(
        shipment.origin.toLowerCase().split(' ')[0]
      );
      const destMatch = shipment.destination.toLowerCase().includes(
        offer.destination.toLowerCase()
      ) || offer.destination.toLowerCase().includes(
        shipment.destination.toLowerCase().split(' ')[0]
      );
      
      if (!originMatch || !destMatch) return false;
      
      // 2. Capacité suffisante
      if (offer.availableCapacityKg < shipment.weightKg) return false;
      
      // 3. Date ok (préférence < deadline)
      const prefDate = new Date(shipment.preferredDate || Date.now());
      const deadline = new Date(offer.pickupDeadline);
      if (prefDate > deadline) return false;
      
      // 4. Statut valide
      if (offer.status === 'full' || offer.status === 'cancelled') return false;
      
      return true;
    });
  };
  
  // Enregistrement pro
  const registerProTransporter = async (data: ProRegistrationData): Promise<ProTransporterProfile> => {
    const newUser: ProTransporterProfile = {
      id: `user_${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
      role: 'pro_transporter',
      address: data.address,
      isVerified: false,
      kycStatus: 'pending',
      trustScore: 0,
      memberSince: new Date(),
      badges: [],
      
      // Pro-specific
      rib: data.rib,
      ribVerified: false,
      idDocument: {
        type: data.idType,
        number: data.idNumber,
        issueDate: data.idIssueDate,
        expiryDate: data.idExpiryDate,
        photoUrl: data.idPhotoBase64,
        verified: false,
      },
      kbisDocument: data.kbisNumber ? {
        number: data.kbisNumber,
        registrationDate: data.kbisRegistrationDate,
        companyName: data.companyName,
        photoUrl: data.kbisPhotoBase64,
        verified: false,
      } : undefined,
      vehicleIds: [],
      specializations: data.specializations || [],
      pickupLocations: [],
      serviceArea: data.serviceArea || [],
      professionalStatus: 'registered',
      registrationDate: new Date(),
      insuranceProvider: data.insuranceProvider,
      insurancePolicyNumber: data.insurancePolicyNumber,
      insuranceExpiryDate: data.insuranceExpiryDate,
    };
    
    setCurrentUser(newUser);
    localStorage.setItem(`pro_user_${newUser.id}`, JSON.stringify(newUser));
    
    return newUser;
  };
  
  return (
    <AppContext.Provider value={{
      // ... existing ...
      vehicles,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      getTransporterVehicles,
      updateVehicleLoad,
      departureOffers,
      addDepartureOffer,
      updateDepartureOffer,
      deleteDepartureOffer,
      getTransporterOffers,
      matchShipmentToOffers,
      registerProTransporter,
    }}>
      {children}
    </AppContext.Provider>
  );
};
```

---

## 3. ALGORITHME DE MATCHING (src/utils/matchingAlgorithm.ts)

```typescript
// ====== CRÉER CE FICHIER ======

import { Shipment, DepartureOffer } from '@/types';

/**
 * Trouver les offres de départ compatibles avec un colis
 */
export function findMatchingOffers(
  shipment: Shipment,
  offers: DepartureOffer[]
): DepartureOffer[] {
  return offers.filter(offer => {
    // 1. VÉRIFIER ROUTE
    const originMatch = shipment.origin.toLowerCase().includes(
      offer.origin.toLowerCase()
    ) || offer.origin.toLowerCase().includes(
      shipment.origin.toLowerCase().split(' ')[0]
    );
    
    const destMatch = shipment.destination.toLowerCase().includes(
      offer.destination.toLowerCase()
    ) || offer.destination.toLowerCase().includes(
      shipment.destination.toLowerCase().split(' ')[0]
    );
    
    if (!originMatch || !destMatch) return false;
    
    // 2. VÉRIFIER CAPACITÉ
    if (offer.availableCapacityKg < shipment.weightKg) return false;
    
    // 3. VÉRIFIER DATE (préférence du client < deadline)
    const shipmentDate = new Date(shipment.preferredDate || Date.now());
    const deadline = new Date(offer.pickupDeadline);
    if (shipmentDate > deadline) return false;
    
    // 4. VÉRIFIER STATUT
    if (offer.status === 'full' || offer.status === 'cancelled') return false;
    
    return true;
  });
}

/**
 * Calculer un score de matching (pour prioriser les offres)
 */
export function calculateMatchScore(
  shipment: Shipment,
  offer: DepartureOffer
): number {
  let score = 100;
  
  // Pénalité: date proche (plus c'est proche, moins bon)
  const daysUntilDeadline = Math.ceil(
    (new Date(offer.pickupDeadline).getTime() - 
     new Date(shipment.preferredDate || Date.now()).getTime()) / 
    (1000 * 60 * 60 * 24)
  );
  score -= daysUntilDeadline * 5;
  
  // Bonus: utilisation optimale de la capacité
  const capacityUsage = (shipment.weightKg / offer.totalCapacityKg) * 100;
  if (capacityUsage > 70) score += 30;  // Bon usage
  else if (capacityUsage > 50) score += 15;
  
  // Bonus: pickup flexible
  if (offer.pickupType === 'both') score += 25;
  else if (offer.pickupType === 'pickup') score += 15;
  
  return Math.max(0, score);
}

/**
 * Simuler les offres disponibles pour un colis
 */
export function simulateOffers(
  shipment: Shipment,
  allOffers: DepartureOffer[]
): SimulatedOfferResponse {
  const matching = findMatchingOffers(shipment, allOffers)
    .map(offer => ({
      offer,
      score: calculateMatchScore(shipment, offer),
    }))
    .sort((a, b) => b.score - a.score);
  
  // Calculer le prix moyen
  const avgPrice = matching.length > 0
    ? matching.reduce((sum, m) => sum + m.offer.basePricePerKg, 0) / matching.length
    : 0;
  
  // Estimer la livraison (date départ la plus proche)
  const estimatedDelivery = matching.length > 0
    ? new Date(matching[0].offer.departureDate)
    : null;
  
  return {
    totalMatches: matching.length,
    topMatches: matching.slice(0, 3),
    avgPrice: Math.round(avgPrice * 100) / 100,
    estimatedDelivery,
  };
}

export interface SimulatedOfferResponse {
  totalMatches: number;
  topMatches: Array<{ offer: DepartureOffer; score: number }>;
  avgPrice: number;
  estimatedDelivery: Date | null;
}
```

---

## 4. FORMULAIRE D'ENREGISTREMENT PRO (src/pages/RegisterPage.tsx)

```typescript
// ====== MODIFIER RegisterPage.tsx ======

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login, registerProTransporter } = useApp();
  const { toast } = useToast();
  
  // 1. SÉLECTION DU PROFIL
  const [userRole, setUserRole] = useState<'citizen' | 'pro'>('citizen');
  const [step, setStep] = useState(1);  // 1=profile, 2=basic, 3+=pro
  
  // 2. FORMULAIRE DE BASE
  const [basicForm, setBasicForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  
  // 3. FORMULAIRE PRO - ÉTAPE 1: RIB
  const [ribForm, setRibForm] = useState({
    rib: '',
    accountHolder: '',
    bankName: '',
  });
  
  // 4. FORMULAIRE PRO - ÉTAPE 2: PIÈCE D'IDENTITÉ
  const [idForm, setIdForm] = useState({
    type: 'national_id' as 'passport' | 'national_id' | 'driver_license',
    number: '',
    issueDate: '',
    expiryDate: '',
    photoFile: null as File | null,
  });
  
  // 5. FORMULAIRE PRO - ÉTAPE 3: KBIS (OPTIONNEL)
  const [kbisForm, setKbisForm] = useState({
    skip: true,
    companyName: '',
    number: '',
    registrationDate: '',
    photoFile: null as File | null,
  });
  
  // 6. FORMULAIRE PRO - ÉTAPE 4: INFOS PRO
  const [proInfoForm, setProInfoForm] = useState({
    specializations: [] as TransportSpecialization[],
    serviceAreas: [] as string[],
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceExpiryDate: '',
  });
  
  // Handlers
  const handleSelectRole = (role: 'citizen' | 'pro') => {
    setUserRole(role);
    setStep(2);
  };
  
  const handleBasicFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (basicForm.password !== basicForm.confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas',
        variant: 'destructive',
      });
      return;
    }
    
    if (userRole === 'citizen') {
      // Enregistrement simple citoyen
      const success = await login(basicForm.email, basicForm.password);
      if (success) {
        toast({ title: '✅ Compte créé!' });
        navigate('/');
      }
    } else {
      // Continuer vers pro steps
      setStep(3);
    }
  };
  
  const handleRibSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation IBAN
    if (!validateIBAN(ribForm.rib)) {
      toast({
        title: 'IBAN invalide',
        description: 'Entrer un IBAN correct',
        variant: 'destructive',
      });
      return;
    }
    
    setStep(4);
  };
  
  const handleIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation date expiration
    if (new Date(idForm.expiryDate) < new Date()) {
      toast({
        title: 'Pièce expirée',
        description: 'La date d\'expiration doit être future',
        variant: 'destructive',
      });
      return;
    }
    
    // Convertir photo en base64
    let photoBase64 = '';
    if (idForm.photoFile) {
      photoBase64 = await fileToBase64(idForm.photoFile);
    }
    
    setStep(5);
  };
  
  const handleKbisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!kbisForm.skip) {
      // Valider si pas skippé
      let photoBase64 = '';
      if (kbisForm.photoFile) {
        photoBase64 = await fileToBase64(kbisForm.photoFile);
      }
    }
    
    setStep(6);
  };
  
  const handleProInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enregistrer le transporteur pro
    try {
      const newUser = await registerProTransporter({
        email: basicForm.email,
        password: basicForm.password,
        firstName: basicForm.firstName,
        lastName: basicForm.lastName,
        address: basicForm.address,
        fullName: `${basicForm.firstName} ${basicForm.lastName}`,
        
        rib: ribForm.rib,
        accountHolder: ribForm.accountHolder,
        
        idType: idForm.type,
        idNumber: idForm.number,
        idIssueDate: idForm.issueDate,
        idExpiryDate: idForm.expiryDate,
        idPhotoBase64: idForm.photoFile ? await fileToBase64(idForm.photoFile) : '',
        
        companyName: kbisForm.companyName,
        kbisNumber: !kbisForm.skip ? kbisForm.number : '',
        kbisRegistrationDate: !kbisForm.skip ? kbisForm.registrationDate : '',
        kbisPhotoBase64: !kbisForm.skip && kbisForm.photoFile 
          ? await fileToBase64(kbisForm.photoFile) 
          : '',
        
        specializations: proInfoForm.specializations,
        serviceArea: proInfoForm.serviceAreas,
        insuranceProvider: proInfoForm.insuranceProvider,
        insurancePolicyNumber: proInfoForm.insurancePolicyNumber,
        insuranceExpiryDate: proInfoForm.insuranceExpiryDate,
      });
      
      toast({
        title: '✅ Compte pro créé!',
        description: 'En attente de vérification des documents.',
      });
      navigate('/dashboard/pro');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Vérifier les données',
        variant: 'destructive',
      });
    }
  };
  
  // RENDU
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 py-10">
      <div className="w-full max-w-md">
        {/* STEP 1: Sélection profil */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Choisir un profil</h2>
            
            <Button 
              variant="outline"
              className="w-full h-20"
              onClick={() => handleSelectRole('citizen')}
            >
              <div className="text-left">
                <p className="font-bold">Citoyen</p>
                <p className="text-sm text-muted-foreground">Voyageur ou expéditeur</p>
              </div>
            </Button>
            
            <Button 
              variant="accent"
              className="w-full h-20"
              onClick={() => handleSelectRole('pro')}
            >
              <div className="text-left">
                <p className="font-bold">Transporteur Pro</p>
                <p className="text-sm">Gestion professionnelle</p>
              </div>
            </Button>
          </div>
        )}
        
        {/* STEP 2: Informations de base */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Créer votre compte</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBasicFormSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Prénom"
                    value={basicForm.firstName}
                    onChange={(e) => setBasicForm({...basicForm, firstName: e.target.value})}
                    required
                  />
                  <Input
                    placeholder="Nom"
                    value={basicForm.lastName}
                    onChange={(e) => setBasicForm({...basicForm, lastName: e.target.value})}
                    required
                  />
                </div>
                
                <Input
                  type="email"
                  placeholder="Email"
                  value={basicForm.email}
                  onChange={(e) => setBasicForm({...basicForm, email: e.target.value})}
                  required
                />
                
                <Input
                  placeholder="Adresse"
                  value={basicForm.address}
                  onChange={(e) => setBasicForm({...basicForm, address: e.target.value})}
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="password"
                    placeholder="Mot de passe"
                    value={basicForm.password}
                    onChange={(e) => setBasicForm({...basicForm, password: e.target.value})}
                    minLength={8}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Confirmer"
                    value={basicForm.confirmPassword}
                    onChange={(e) => setBasicForm({...basicForm, confirmPassword: e.target.value})}
                    minLength={8}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  {userRole === 'citizen' ? 'Créer mon compte' : 'Continuer'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        
        {/* STEP 3: RIB */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Informations Bancaires</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRibSubmit} className="space-y-4">
                <div>
                  <Label>IBAN/RIB</Label>
                  <Input
                    placeholder="FR1420041010050500013M02606"
                    value={ribForm.rib}
                    onChange={(e) => setRibForm({...ribForm, rib: e.target.value.toUpperCase()})}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Formats: FR, MA, DZ, TN, BE, CH
                  </p>
                </div>
                
                <Input
                  placeholder="Titulaire du compte"
                  value={ribForm.accountHolder}
                  onChange={(e) => setRibForm({...ribForm, accountHolder: e.target.value})}
                  required
                />
                
                <Input
                  placeholder="Banque (Ex: BNP Paribas)"
                  value={ribForm.bankName}
                  onChange={(e) => setRibForm({...ribForm, bankName: e.target.value})}
                  required
                />
                
                <Button type="submit" className="w-full">Suivant</Button>
              </form>
            </CardContent>
          </Card>
        )}
        
        {/* STEP 4: Pièce d'identité */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Pièce d'Identité</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleIdSubmit} className="space-y-4">
                <div>
                  <Label>Type</Label>
                  <select
                    value={idForm.type}
                    onChange={(e) => setIdForm({...idForm, type: e.target.value as any})}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="national_id">Carte Nationale d'Identité</option>
                    <option value="passport">Passeport</option>
                    <option value="driver_license">Permis de Conduire</option>
                  </select>
                </div>
                
                <Input
                  placeholder="Numéro de document"
                  value={idForm.number}
                  onChange={(e) => setIdForm({...idForm, number: e.target.value})}
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Émis le</Label>
                    <Input
                      type="date"
                      value={idForm.issueDate}
                      onChange={(e) => setIdForm({...idForm, issueDate: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label>Expires le</Label>
                    <Input
                      type="date"
                      value={idForm.expiryDate}
                      onChange={(e) => setIdForm({...idForm, expiryDate: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Photo du document</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setIdForm({...idForm, photoFile: e.target.files?.[0] || null})}
                  />
                </div>
                
                <Button type="submit" className="w-full">Suivant</Button>
              </form>
            </CardContent>
          </Card>
        )}
        
        {/* STEP 5: KBIS (optionnel) */}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Kbis (Optionnel)</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleKbisSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="skip_kbis"
                    checked={kbisForm.skip}
                    onChange={(e) => setKbisForm({...kbisForm, skip: e.target.checked})}
                  />
                  <label htmlFor="skip_kbis" className="text-sm">Passer cette étape</label>
                </div>
                
                {!kbisForm.skip && (
                  <>
                    <Input
                      placeholder="Nom de l'entreprise"
                      value={kbisForm.companyName}
                      onChange={(e) => setKbisForm({...kbisForm, companyName: e.target.value})}
                    />
                    
                    <Input
                      placeholder="Numéro Kbis"
                      value={kbisForm.number}
                      onChange={(e) => setKbisForm({...kbisForm, number: e.target.value})}
                    />
                    
                    <Input
                      type="date"
                      value={kbisForm.registrationDate}
                      onChange={(e) => setKbisForm({...kbisForm, registrationDate: e.target.value})}
                    />
                    
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setKbisForm({...kbisForm, photoFile: e.target.files?.[0] || null})}
                    />
                  </>
                )}
                
                <Button type="submit" className="w-full">Suivant</Button>
              </form>
            </CardContent>
          </Card>
        )}
        
        {/* STEP 6: Infos pro */}
        {step === 6 && (
          <Card>
            <CardHeader>
              <CardTitle>Informations Professionnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProInfoSubmit} className="space-y-4">
                <div>
                  <Label>Spécialisations</Label>
                  <div className="space-y-2 mt-2">
                    {(['general', 'food', 'pharma', 'electronics'] as const).map(spec => (
                      <div key={spec} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={spec}
                          checked={proInfoForm.specializations.includes(spec)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProInfoForm({
                                ...proInfoForm,
                                specializations: [...proInfoForm.specializations, spec],
                              });
                            } else {
                              setProInfoForm({
                                ...proInfoForm,
                                specializations: proInfoForm.specializations.filter(s => s !== spec),
                              });
                            }
                          }}
                        />
                        <label htmlFor={spec} className="text-sm capitalize">{spec}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Input
                  placeholder="Assureur"
                  value={proInfoForm.insuranceProvider}
                  onChange={(e) => setProInfoForm({...proInfoForm, insuranceProvider: e.target.value})}
                  required
                />
                
                <Input
                  placeholder="Numéro de police"
                  value={proInfoForm.insurancePolicyNumber}
                  onChange={(e) => setProInfoForm({...proInfoForm, insurancePolicyNumber: e.target.value})}
                  required
                />
                
                <Input
                  type="date"
                  value={proInfoForm.insuranceExpiryDate}
                  onChange={(e) => setProInfoForm({...proInfoForm, insuranceExpiryDate: e.target.value})}
                  required
                />
                
                <Button type="submit" variant="accent" className="w-full">
                  Créer mon compte pro
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ====== FONCTION UTILITAIRE ======
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function validateIBAN(iban: string): boolean {
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

---

## 5. PUBLICATION DE DÉPART (src/pages/PublishDeparturePage.tsx)

```typescript
// ====== CRÉER CE FICHIER ======

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PublishDeparturePage() {
  const { currentUser, vehicles, addDepartureOffer, getTransporterVehicles } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // Form data
  const [form, setForm] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    pickupDeadline: '',
    selectedVehicleIds: [] as string[],
    basePricePerKg: 0,
    pickupType: 'fixed' as 'fixed' | 'pickup' | 'both',
  });
  
  const transporterVehicles = getTransporterVehicles(currentUser?.id || '');
  
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const departure = new Date(form.departureDate);
    const deadline = new Date(form.pickupDeadline);
    
    if (deadline >= departure) {
      toast({
        title: 'Erreur',
        description: 'Date limite < date départ',
        variant: 'destructive',
      });
      return;
    }
    
    setStep(2);
  };
  
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.selectedVehicleIds.length === 0) {
      toast({
        title: 'Erreur',
        description: 'Sélectionner au moins 1 véhicule',
        variant: 'destructive',
      });
      return;
    }
    
    if (form.basePricePerKg <= 0) {
      toast({
        title: 'Erreur',
        description: 'Tarif > 0',
        variant: 'destructive',
      });
      return;
    }
    
    setStep(3);
  };
  
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculer capacité totale
    const totalCapacity = form.selectedVehicleIds.reduce((sum, id) => {
      const vehicle = vehicles.find(v => v.id === id);
      return sum + (vehicle?.maxCapacityKg || 0);
    }, 0);
    
    const totalVolume = form.selectedVehicleIds.reduce((sum, id) => {
      const vehicle = vehicles.find(v => v.id === id);
      return sum + (vehicle?.maxVolumeCbm || 0);
    }, 0);
    
    // Créer l'offre
    addDepartureOffer({
      transporterId: currentUser?.id || '',
      origin: form.origin,
      destination: form.destination,
      departureDate: form.departureDate,
      pickupDeadline: form.pickupDeadline,
      totalCapacityKg: totalCapacity,
      availableCapacityKg: totalCapacity,
      totalCapacityCbm: totalVolume,
      availableCapacityCbm: totalVolume,
      basePricePerKg: form.basePricePerKg,
      pickupType: form.pickupType,
      vehicleIds: form.selectedVehicleIds,
      requiredVehicles: form.selectedVehicleIds.length,
      matchedShipments: [],
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    toast({ title: '✅ Départ publié!' });
    navigate('/dashboard/pro');
  };
  
  return (
    <div className="container mx-auto max-w-2xl py-8">
      {/* STEP 1: Route & Dates */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Route & Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Départ</Label>
                  <Input
                    placeholder="Ex: Lyon"
                    value={form.origin}
                    onChange={(e) => setForm({...form, origin: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>Arrivée</Label>
                  <Input
                    placeholder="Ex: Casablanca"
                    value={form.destination}
                    onChange={(e) => setForm({...form, destination: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date de départ</Label>
                  <Input
                    type="date"
                    value={form.departureDate}
                    onChange={(e) => setForm({...form, departureDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>Deadline ramassage</Label>
                  <Input
                    type="date"
                    value={form.pickupDeadline}
                    onChange={(e) => setForm({...form, pickupDeadline: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full">Suivant</Button>
            </form>
          </CardContent>
        </Card>
      )}
      
      {/* STEP 2: Véhicules & Tarif */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Véhicules & Tarif</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div>
                <Label>Sélectionner véhicules</Label>
                <div className="space-y-2 mt-2 max-h-40 overflow-y-auto border rounded p-3">
                  {transporterVehicles.map(vehicle => (
                    <div key={vehicle.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={vehicle.id}
                        checked={form.selectedVehicleIds.includes(vehicle.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm({
                              ...form,
                              selectedVehicleIds: [...form.selectedVehicleIds, vehicle.id],
                            });
                          } else {
                            setForm({
                              ...form,
                              selectedVehicleIds: form.selectedVehicleIds.filter(id => id !== vehicle.id),
                            });
                          }
                        }}
                      />
                      <label htmlFor={vehicle.id} className="text-sm">
                        {vehicle.brand} {vehicle.model} ({vehicle.maxCapacityKg}kg)
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Prix par kg (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.basePricePerKg}
                  onChange={(e) => setForm({...form, basePricePerKg: parseFloat(e.target.value)})}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">Suivant</Button>
            </form>
          </CardContent>
        </Card>
      )}
      
      {/* STEP 3: Configuration Pickup */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Configuration Pickup</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <Label>Type de pickup</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="fixed"
                      value="fixed"
                      checked={form.pickupType === 'fixed'}
                      onChange={(e) => setForm({...form, pickupType: e.target.value as any})}
                    />
                    <label htmlFor="fixed" className="text-sm">Points de pickup FIXES uniquement</label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="pickup"
                      value="pickup"
                      checked={form.pickupType === 'pickup'}
                      onChange={(e) => setForm({...form, pickupType: e.target.value as any})}
                    />
                    <label htmlFor="pickup" className="text-sm">Pickup À DOMICILE uniquement</label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="both"
                      value="both"
                      checked={form.pickupType === 'both'}
                      onChange={(e) => setForm({...form, pickupType: e.target.value as any})}
                    />
                    <label htmlFor="both" className="text-sm">LES DEUX options</label>
                  </div>
                </div>
              </div>
              
              <Button type="submit" variant="accent" className="w-full">
                Publier le départ
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

---

## 6. UTILITAIRES DE VALIDATION (src/utils/transporterUtils.ts)

```typescript
// ====== CRÉER CE FICHIER ======

export function validateIBAN(iban: string): boolean {
  const ibanRegex: Record<string, RegExp> = {
    FR: /^FR\d{2}\d{5}\d{5}[\dA-Z]{11}\d{2}$/,
    MA: /^MA\d{2}\d{3}\d{1}\d{14}$/,
    DZ: /^DZ\d{2}\d{3}\d{17}$/,
    TN: /^TN\d{2}\d{3}\d{3}\d{13}\d{2}$/,
    BE: /^BE\d{2}\d{3}\d{7}\d{2}$/,
    CH: /^CH\d{2}\d{5}[\dA-Z]{12}$/,
  };
  
  const country = iban.substring(0, 2);
  const regex = ibanRegex[country];
  return regex ? regex.test(iban.toUpperCase()) : false;
}

export function validateIDDocument(
  type: 'passport' | 'national_id' | 'driver_license',
  number: string,
  expiryDate: string
): boolean {
  // 1. Vérifier expiration
  if (new Date(expiryDate) < new Date()) return false;
  
  // 2. Vérifier format numéro
  const formats: Record<string, RegExp> = {
    passport: /^[A-Z]{2}\d{7}$/,
    national_id: /^\d{9,13}$/,
    driver_license: /^[A-Z]\d{8}$/,
  };
  
  const format = formats[type];
  return format ? format.test(number.toUpperCase()) : false;
}

export function calculateVehicleCapacity(
  vehicleIds: string[],
  vehicles: Vehicle[]
): { totalKg: number; totalCbm: number } {
  return vehicleIds.reduce(
    (acc, id) => {
      const vehicle = vehicles.find(v => v.id === id);
      return {
        totalKg: acc.totalKg + (vehicle?.maxCapacityKg || 0),
        totalCbm: acc.totalCbm + (vehicle?.maxVolumeCbm || 0),
      };
    },
    { totalKg: 0, totalCbm: 0 }
  );
}
```

---

## Résumé des étapes d'implémentation

1. **Étendre types/index.ts** - Ajouter les interfaces Pro
2. **Étendre AppContext.tsx** - Ajouter méthodes vehicles et offers
3. **Créer matchingAlgorithm.ts** - Logique de matching
4. **Modifier RegisterPage.tsx** - Ajouter steps pro
5. **Créer PublishDeparturePage.tsx** - Multi-step form
6. **Créer VehicleList.tsx** - Component liste véhicules
7. **Créer PickupMap.tsx** - Component carte
8. **Mettre à jour DashboardPro.tsx** - Intégrer sections
9. **Ajouter données mock** dans mockData.ts
10. **Tester les 2 cas de figure** (fixed + pickup vs fixed only)

