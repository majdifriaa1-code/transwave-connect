import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, Trip, Shipment, Conversation } from '@/types';
import { MOCK_USERS, MOCK_TRIPS, MOCK_SHIPMENTS, MOCK_CONVERSATIONS } from '@/data/mockData';
import { PricingBreakdown } from '@/types';

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);
  const [shipments, setShipments] = useState<Shipment[]>(MOCK_SHIPMENTS);
  const [conversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [showKycModal, setShowKycModal] = useState(false);

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
