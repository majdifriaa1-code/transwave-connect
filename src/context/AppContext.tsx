import { createContext, useContext, useState, ReactNode, FC } from 'react';
import { UserProfile, Trip, Shipment, Conversation, Vehicle, DepartureOffer, PickupLocation, ProTransporterProfile, ProRegistrationData, MatchedOffer } from '@/types';
import { MOCK_USERS, MOCK_TRIPS, MOCK_SHIPMENTS, MOCK_CONVERSATIONS } from '@/data/mockData';
import { PricingBreakdown } from '@/types';
import { findMatchingOffers, calculateMatchScore } from '@/utils/matchingAlgorithm';

interface AppContextType {
  // User state
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Trips state
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  getAvailableTrips: (origin?: string, destination?: string) => Trip[];
  
  // Shipments state
  shipments: Shipment[];
  addShipment: (shipment: Omit<Shipment, 'id' | 'createdAt'>) => void;
  getMatchingTrips: (shipment: Shipment) => Trip[];
  
  // Conversations
  conversations: Conversation[];
  totalUnreadMessages: number;
  
  // Pricing calculations
  calculatePricing: (weightKg: number, pricePerKg: number, isSolidarity: boolean) => PricingBreakdown;
  
  // KYC Modal
  showKycModal: boolean;
  setShowKycModal: (show: boolean) => void;

  // Professional Transporter - Vehicles
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  getTransporterVehicles: (transporterId: string) => Vehicle[];
  updateVehicleLoad: (vehicleId: string, loadKg: number) => void;

  // Professional Transporter - Pickup Locations
  pickupLocations: PickupLocation[];
  addPickupLocation: (location: Omit<PickupLocation, 'id'>) => void;
  updatePickupLocation: (id: string, updates: Partial<PickupLocation>) => void;
  deletePickupLocation: (id: string) => void;

  // Professional Transporter - Departure Offers
  departureOffers: DepartureOffer[];
  addDepartureOffer: (offer: Omit<DepartureOffer, 'id'>) => void;
  updateDepartureOffer: (id: string, updates: Partial<DepartureOffer>) => void;
  deleteDepartureOffer: (id: string) => void;
  getTransporterOffers: (transporterId: string) => DepartureOffer[];

  // Professional Transporter - Matching
  matchShipmentToOffers: (shipment: Shipment) => MatchedOffer[];

  // Professional Transporter - Registration
  registerProTransporter: (data: ProRegistrationData) => Promise<ProTransporterProfile>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);
  const [shipments, setShipments] = useState<Shipment[]>(MOCK_SHIPMENTS);
  const [conversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [showKycModal, setShowKycModal] = useState(false);

  // Professional Transporter state
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [departureOffers, setDepartureOffers] = useState<DepartureOffer[]>([]);

  const isAuthenticated = currentUser !== null;

  const login = async (email: string, _password: string): Promise<boolean> => {
    // Mock login - find user by email
    const user = MOCK_USERS.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    // For demo, create a new user if not found
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      email,
      fullName: email.split('@')[0],
      role: 'citizen',
      isVerified: false,
      kycStatus: 'none',
      trustScore: 0,
      memberSince: new Date(),
      badges: [],
    };
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addTrip = (tripData: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: `trip_${Date.now()}`,
    };
    setTrips(prev => [newTrip, ...prev]);
  };

  const getAvailableTrips = (origin?: string, destination?: string): Trip[] => {
    return trips.filter(trip => {
      if (trip.status !== 'scheduled') return false;
      if (trip.availableCapacityKg <= 0) return false;
      if (origin && !trip.origin.toLowerCase().includes(origin.toLowerCase())) return false;
      if (destination && !trip.destination.toLowerCase().includes(destination.toLowerCase())) return false;
      return true;
    });
  };

  const addShipment = (shipmentData: Omit<Shipment, 'id' | 'createdAt'>) => {
    const newShipment: Shipment = {
      ...shipmentData,
      id: `ship_${Date.now()}`,
      createdAt: new Date(),
    };
    setShipments(prev => [newShipment, ...prev]);
  };

  const getMatchingTrips = (shipment: Shipment): Trip[] => {
    return trips.filter(trip => {
      // Must have available capacity
      if (trip.availableCapacityKg < shipment.weightKg) return false;
      // Must be scheduled
      if (trip.status !== 'scheduled') return false;
      // Match origin and destination (basic matching)
      const originMatch = trip.origin.toLowerCase().includes(shipment.origin.toLowerCase()) ||
                         shipment.origin.toLowerCase().includes(trip.origin.toLowerCase().split(' ')[0]);
      const destMatch = trip.destination.toLowerCase().includes(shipment.destination.toLowerCase()) ||
                       shipment.destination.toLowerCase().includes(trip.destination.toLowerCase().split(' ')[0]);
      return originMatch && destMatch;
    });
  };

  const calculatePricing = (weightKg: number, pricePerKg: number, isSolidarity: boolean): PricingBreakdown => {
    if (isSolidarity) {
      return {
        transporterPayout: 0,
        platformFee: 0,
        totalPrice: 0,
        isSolidarity: true,
      };
    }

    const transporterPayout = weightKg * pricePerKg;
    const platformFee = Math.max(2, transporterPayout * 0.15); // 15% minimum 2€
    const totalPrice = transporterPayout + platformFee;

    return {
      transporterPayout: Math.round(transporterPayout * 100) / 100,
      platformFee: Math.round(platformFee * 100) / 100,
      totalPrice: Math.round(totalPrice * 100) / 100,
      isSolidarity: false,
    };
  };

  // Vehicle Management
  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `vehicle_${Date.now()}`,
    };
    setVehicles(prev => [newVehicle, ...prev]);
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const getTransporterVehicles = (transporterId: string): Vehicle[] => {
    return vehicles.filter(v => v.transporterId === transporterId);
  };

  const updateVehicleLoad = (vehicleId: string, loadKg: number) => {
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, currentLoadKg: loadKg } : v));
  };

  // Pickup Location Management
  const addPickupLocation = (locationData: Omit<PickupLocation, 'id'>) => {
    const newLocation: PickupLocation = {
      ...locationData,
      id: `pickup_${Date.now()}`,
    };
    setPickupLocations(prev => [newLocation, ...prev]);
  };

  const updatePickupLocation = (id: string, updates: Partial<PickupLocation>) => {
    setPickupLocations(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deletePickupLocation = (id: string) => {
    setPickupLocations(prev => prev.filter(l => l.id !== id));
  };

  // Departure Offer Management
  const addDepartureOffer = (offerData: Omit<DepartureOffer, 'id'>) => {
    const newOffer: DepartureOffer = {
      ...offerData,
      id: `departure_${Date.now()}`,
    };
    setDepartureOffers(prev => [newOffer, ...prev]);
  };

  const updateDepartureOffer = (id: string, updates: Partial<DepartureOffer>) => {
    setDepartureOffers(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const deleteDepartureOffer = (id: string) => {
    setDepartureOffers(prev => prev.filter(o => o.id !== id));
  };

  const getTransporterOffers = (transporterId: string): DepartureOffer[] => {
    return departureOffers.filter(o => o.transporterId === transporterId);
  };

  // Matching Algorithm
  const matchShipmentToOffers = (shipment: Shipment): MatchedOffer[] => {
    const matching = findMatchingOffers(shipment, departureOffers);
    
    return matching
      .map(offer => {
        const transporter = currentUser && 'vehicleIds' in currentUser 
          ? currentUser 
          : null;
        
        return {
          offer,
          transporterId: offer.transporterId,
          transporterName: offer.transporterId, // In real app, fetch from users
          transporterRating: 4.5, // Mock rating
          estimatedPrice: shipment.weightKg * offer.basePricePerKg,
          matchScore: calculateMatchScore(shipment, offer),
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  };

  // Professional Transporter Registration
  const registerProTransporter = async (data: ProRegistrationData): Promise<ProTransporterProfile> => {
    const newUser: ProTransporterProfile = {
      id: `pro_${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
      role: 'pro_transporter',
      address: data.address,
      isVerified: false,
      kycStatus: 'pending',
      trustScore: 0,
      memberSince: new Date(),
      badges: [],

      // Professional fields
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
      kbisDocument: data.kbisNumber
        ? {
            number: data.kbisNumber,
            registrationDate: data.kbisRegistrationDate || '',
            companyName: data.companyName || '',
            photoUrl: data.kbisPhotoBase64,
            verified: false,
          }
        : undefined,
      vehicleIds: [],
      specializations: data.specializations || [],
      pickupLocations: [],
      serviceArea: data.serviceArea,
      professionalStatus: 'registered',
      registrationDate: new Date(),
      insuranceProvider: data.insuranceProvider,
      insurancePolicyNumber: data.insurancePolicyNumber,
      insuranceExpiryDate: data.insuranceExpiryDate,
    };

    setCurrentUser(newUser);
    return newUser;
  };

  const totalUnreadMessages = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        login,
        logout,
        trips,
        addTrip,
        getAvailableTrips,
        shipments,
        addShipment,
        getMatchingTrips,
        conversations,
        totalUnreadMessages,
        calculatePricing,
        showKycModal,
        setShowKycModal,
        vehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        getTransporterVehicles,
        updateVehicleLoad,
        pickupLocations,
        addPickupLocation,
        updatePickupLocation,
        deletePickupLocation,
        departureOffers,
        addDepartureOffer,
        updateDepartureOffer,
        deleteDepartureOffer,
        getTransporterOffers,
        matchShipmentToOffers,
        registerProTransporter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
