// User Types
export type UserRole = 'citizen' | 'pro_transporter' | 'admin';
export type VerificationStatus = 'none' | 'pending' | 'verified' | 'rejected';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  isVerified: boolean;
  kycStatus: VerificationStatus;
  trustScore: number;
  memberSince: Date;
  badges: string[];
  address?: string;
}

// Transport Types
export type TransportType = 'plane' | 'boat' | 'road';
export type TripStatus = 'scheduled' | 'full' | 'completed' | 'cancelled';
export type Currency = 'EUR' | 'MAD' | 'DZD' | 'TND';

export interface Trip {
  id: string;
  transporterId: string;
  transporterName: string;
  transporterAvatar?: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate?: string;
  transportType: TransportType;
  totalCapacityKg: number;
  availableCapacityKg: number;
  pricePerKg: number;
  currency: Currency;
  status: TripStatus;
  flightNumber?: string;
  isPro?: boolean;
}

// Customs Types
export type RiskLevel = 'low' | 'medium' | 'high';

export interface CustomsCategory {
  id: string;
  label: string;
  hsCodePrefix: string;
  estimatedTaxRate: number;
  riskLevel: RiskLevel;
  icon: string;
}

// Shipment Types
export type ShipmentStatus = 'draft' | 'published' | 'matched' | 'in_transit' | 'delivered' | 'disputed';
export type ShipmentType = 'standard' | 'solidarity';

export interface Shipment {
  id: string;
  senderId: string;
  senderName?: string;
  tripId?: string;
  origin: string;
  destination: string;
  itemCategory: string;
  description: string;
  weightKg: number;
  dimensions: string;
  declaredValue: number;
  photos: string[];
  status: ShipmentStatus;
  type: ShipmentType;
  preferredDate?: string;
  proposedPrice?: number;
  createdAt: Date;
}

// Transaction Types
export type TransactionStatus = 'created' | 'escrow_held' | 'released_to_transporter' | 'refunded';

export interface Transaction {
  id: string;
  shipmentId: string;
  amountTotal: number;
  transporterPayout: number;
  platformFee: number;
  status: TransactionStatus;
  qrCodeToken: string;
  createdAt: Date;
}

// Pricing Calculation
export interface PricingBreakdown {
  transporterPayout: number;
  platformFee: number;
  totalPrice: number;
  isSolidarity: boolean;
}

// Message Types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

// Statistics
export interface PlatformStats {
  totalDeliveries: number;
  activeDeliveries: number;
  freeDeliveries: number;
  activeUsers: number;
}

export interface CountryStats {
  code: string;
  name: string;
  flag: string;
  shipments: number;
  percentage: number;
}

// Tracking
export interface TrackingStep {
  id: string;
  title: string;
  location?: string;
  timestamp?: Date;
  status: 'pending' | 'active' | 'completed';
  icon: string;
}
