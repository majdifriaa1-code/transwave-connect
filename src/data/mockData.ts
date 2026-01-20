import {
  Trip,
  CustomsCategory,
  UserProfile,
  Shipment,
  Conversation,
  PlatformStats,
  CountryStats,
} from '@/types';

// Mock Users
export const MOCK_USERS: UserProfile[] = [
  {
    id: 'user_1',
    email: 'ahmed@transport.ma',
    fullName: 'Ahmed Transport Pro',
    role: 'pro_transporter',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
    isVerified: true,
    kycStatus: 'verified',
    trustScore: 4.9,
    memberSince: new Date('2023-01-15'),
    badges: ['Pro Vérifié', 'Top Transporteur'],
    address: '45 Rue Mohammed V, Casablanca',
  },
  {
    id: 'user_2',
    email: 'sarah@voyage.fr',
    fullName: 'Sarah Voyageuse',
    role: 'citizen',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    isVerified: true,
    kycStatus: 'verified',
    trustScore: 4.8,
    memberSince: new Date('2023-06-20'),
    badges: ['Voyageur Fréquent'],
    address: '12 Rue de la Paix, Paris',
  },
  {
    id: 'user_3',
    email: 'karim@pro.dz',
    fullName: 'Karim Transport Pro',
    role: 'pro_transporter',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim',
    isVerified: true,
    kycStatus: 'verified',
    trustScore: 4.7,
    memberSince: new Date('2022-11-01'),
    badges: ['Pro Vérifié', 'Maritime Expert'],
    address: 'Port d\'Alger, Algérie',
  },
  {
    id: 'user_4',
    email: 'mohamed@sender.fr',
    fullName: 'Mohamed Expéditeur',
    role: 'citizen',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohamed',
    isVerified: true,
    kycStatus: 'verified',
    trustScore: 4.5,
    memberSince: new Date('2024-01-10'),
    badges: ['Expéditeur Régulier'],
    address: '78 Avenue des Champs, Lyon',
  },
];

// Mock Trips
export const MOCK_TRIPS: Trip[] = [
  {
    id: 'trip_101',
    transporterId: 'user_2',
    transporterName: 'Sarah Voyageuse',
    transporterAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    origin: 'Paris (CDG)',
    destination: 'Casablanca (CMN)',
    departureDate: '2025-06-15T09:00:00Z',
    transportType: 'plane',
    totalCapacityKg: 23,
    availableCapacityKg: 15,
    pricePerKg: 12,
    currency: 'EUR',
    status: 'scheduled',
    flightNumber: 'AF1234',
    isPro: false,
  },
  {
    id: 'trip_102',
    transporterId: 'user_3',
    transporterName: 'Karim Transport Pro',
    transporterAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim',
    origin: 'Marseille (Port)',
    destination: 'Alger (Port)',
    departureDate: '2025-06-20T14:00:00Z',
    transportType: 'boat',
    totalCapacityKg: 500,
    availableCapacityKg: 250,
    pricePerKg: 4,
    currency: 'EUR',
    status: 'scheduled',
    isPro: true,
  },
  {
    id: 'trip_103',
    transporterId: 'user_1',
    transporterName: 'Ahmed Transport Pro',
    transporterAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
    origin: 'Lyon',
    destination: 'Tunis',
    departureDate: '2025-06-25T08:00:00Z',
    transportType: 'road',
    totalCapacityKg: 1000,
    availableCapacityKg: 600,
    pricePerKg: 3,
    currency: 'EUR',
    status: 'scheduled',
    isPro: true,
  },
  {
    id: 'trip_104',
    transporterId: 'user_2',
    transporterName: 'Sarah Voyageuse',
    transporterAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    origin: 'Bruxelles (BRU)',
    destination: 'Rabat (RBA)',
    departureDate: '2025-07-01T11:30:00Z',
    transportType: 'plane',
    totalCapacityKg: 23,
    availableCapacityKg: 20,
    pricePerKg: 15,
    currency: 'EUR',
    status: 'scheduled',
    flightNumber: 'SN205',
    isPro: false,
  },
];

// Customs Categories
export const CUSTOMS_CATEGORIES: CustomsCategory[] = [
  {
    id: 'cat_1',
    label: 'Vêtements & Tissus',
    hsCodePrefix: '61',
    estimatedTaxRate: 0,
    riskLevel: 'low',
    icon: '👕',
  },
  {
    id: 'cat_2',
    label: 'Électronique (Tél, Ordi)',
    hsCodePrefix: '85',
    estimatedTaxRate: 0.25,
    riskLevel: 'high',
    icon: '📱',
  },
  {
    id: 'cat_3',
    label: 'Médicaments (Ordonnance)',
    hsCodePrefix: '30',
    estimatedTaxRate: 0,
    riskLevel: 'medium',
    icon: '💊',
  },
  {
    id: 'cat_4',
    label: 'Documents / Papiers',
    hsCodePrefix: '49',
    estimatedTaxRate: 0,
    riskLevel: 'low',
    icon: '📄',
  },
  {
    id: 'cat_5',
    label: 'Cosmétiques',
    hsCodePrefix: '33',
    estimatedTaxRate: 0.15,
    riskLevel: 'medium',
    icon: '💄',
  },
  {
    id: 'cat_6',
    label: 'Alimentation',
    hsCodePrefix: '21',
    estimatedTaxRate: 0.1,
    riskLevel: 'high',
    icon: '🍫',
  },
];

// Mock Shipments
export const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: 'ship_1',
    senderId: 'user_4',
    senderName: 'Mohamed Expéditeur',
    origin: 'Paris',
    destination: 'Casablanca',
    itemCategory: 'cat_3',
    description: 'Médicaments pour ma grand-mère',
    weightKg: 2,
    dimensions: '20x15x10',
    declaredValue: 50,
    photos: [],
    status: 'published',
    type: 'solidarity',
    preferredDate: '2025-06-16',
    proposedPrice: 0,
    createdAt: new Date(),
  },
  {
    id: 'ship_2',
    senderId: 'user_4',
    senderName: 'Mohamed Expéditeur',
    origin: 'Lyon',
    destination: 'Alger',
    itemCategory: 'cat_2',
    description: 'Ordinateur portable pour mon frère',
    weightKg: 3.5,
    dimensions: '40x30x8',
    declaredValue: 800,
    photos: [],
    status: 'published',
    type: 'standard',
    preferredDate: '2025-06-22',
    proposedPrice: 60,
    createdAt: new Date(),
  },
];

// Mock Conversations
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    participantId: 'user_2',
    participantName: 'Sarah Voyageuse',
    participantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    lastMessage: 'Parfait ! Je peux prendre votre colis le 15 juin.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 2,
  },
  {
    id: 'conv_2',
    participantId: 'user_3',
    participantName: 'Karim Transport Pro',
    participantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim',
    lastMessage: 'Le départ est confirmé pour le 20 juin.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
  },
  {
    id: 'conv_3',
    participantId: 'user_1',
    participantName: 'Ahmed Transport Pro',
    participantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
    lastMessage: 'Merci pour votre confiance !',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 1,
  },
];

// Platform Statistics
export const PLATFORM_STATS: PlatformStats = {
  totalDeliveries: 1247,
  activeDeliveries: 89,
  freeDeliveries: 342,
  activeUsers: 2456,
};

// Country Statistics
export const COUNTRY_STATS: CountryStats[] = [
  { code: 'FR', name: 'France', flag: '🇫🇷', shipments: 456, percentage: 95 },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', shipments: 389, percentage: 85 },
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿', shipments: 267, percentage: 70 },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳', shipments: 198, percentage: 55 },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪', shipments: 145, percentage: 45 },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭', shipments: 112, percentage: 35 },
];

// Maghreb countries for customs check
export const MAGHREB_COUNTRIES = ['maroc', 'morocco', 'algérie', 'algeria', 'tunisie', 'tunisia', 'casablanca', 'alger', 'tunis', 'rabat', 'oran', 'fès', 'sfax'];

// Check if destination is in Maghreb
export const isMaghrebDestination = (destination: string): boolean => {
  const lowerDest = destination.toLowerCase();
  return MAGHREB_COUNTRIES.some(country => lowerDest.includes(country));
};
