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

// ====== PROFESSIONAL TRANSPORTER TYPES (NEW) ======

// Enum types for Pro features
export type TransportSpecialization = 'general' | 'food' | 'pharma' | 'electronics' | 'furniture' | 'hazmat';
export type VehicleType = 'van' | 'truck' | 'trailer' | 'cargo_bike' | 'car';
export type VehicleFeature = 'gps' | 'refrigerated' | 'climate_control' | 'tail_lift' | 'pallets' | 'tracking';
export type ProfessionalStatus = 'registered' | 'verified' | 'suspended' | 'inactive';
export type DepartureStatus = 'draft' | 'published' | 'full' | 'completed' | 'cancelled';
export type PickupType = 'fixed' | 'pickup' | 'both';
export type IDDocumentType = 'passport' | 'national_id' | 'driver_license';

// ID Document structure
export interface IDDocument {
  type: IDDocumentType;
  number: string;
  issueDate: string;
  expiryDate: string;
  photoUrl?: string;
  verified: boolean;
}

// Kbis Document structure (optional for pros)
export interface KbisDocument {
  number: string;
  registrationDate: string;
  companyName: string;
  photoUrl?: string;
  verified: boolean;
}

// Professional Transporter Profile (extends UserProfile)
export interface ProTransporterProfile extends UserProfile {
  // Financial information
  rib: string;
  ribVerified: boolean;

  // Identity documents
  idDocument: IDDocument;

  // Business documents (optional)
  kbisDocument?: KbisDocument;

  // Fleet and operations
  vehicleIds: string[];
  specializations: TransportSpecialization[];
  pickupLocations?: string[]; // Array of pickup location IDs
  serviceArea?: string[];

  // Professional status
  professionalStatus: ProfessionalStatus;
  registrationDate: Date;

  // Insurance
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: string;
}

// Vehicle structure
export interface Vehicle {
  id: string;
  transporterId: string;

  // Basic info
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  color: string;

  // Capacity
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

  // Equipment
  features: VehicleFeature[];

  // Status
  status: 'active' | 'maintenance' | 'inactive';
  createdAt: Date;
  lastMaintenanceDate?: Date;
}

// Pickup Location structure
export interface PickupLocation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
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

// Specialized Pricing
export interface SpecializedPricing {
  category: TransportSpecialization;
  pricePerKg: number;
}

// Departure Offer structure
export interface DepartureOffer {
  id: string;
  transporterId: string;

  // Route and timing
  origin: string;
  destination: string;
  departureDate: string;
  pickupDeadline: string;

  // Capacity
  totalCapacityKg: number;
  availableCapacityKg: number;
  totalCapacityCbm: number;
  availableCapacityCbm: number;

  // Pricing
  basePricePerKg: number;
  specializedPricing?: SpecializedPricing[];

  // Pickup configuration
  pickupType: PickupType;
  pickupLocations?: PickupLocation[];
  maxPickupDistance?: number; // kilometers for at-home pickup

  // Vehicles
  vehicleIds: string[];
  requiredVehicles: number;

  // Matched shipments
  matchedShipments: string[];

  // Status
  status: DepartureStatus;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Matched Offer Response (for client UI)
export interface MatchedOffer {
  offer: DepartureOffer;
  transporterId: string;
  transporterName: string;
  transporterRating: number;
  estimatedPrice: number;
  matchScore: number;
}

// Registration Data for Pro (temporary, for form submission)
export interface ProRegistrationData {
  // Basic info
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
  address: string;

  // Financial
  rib: string;
  accountHolder: string;

  // Identity document
  idType: IDDocumentType;
  idNumber: string;
  idIssueDate: string;
  idExpiryDate: string;
  idPhotoBase64: string;

  // Business document
  companyName?: string;
  kbisNumber?: string;
  kbisRegistrationDate?: string;
  kbisPhotoBase64?: string;

  // Professional info
  specializations?: TransportSpecialization[];
  serviceArea?: string[];
  insuranceProvider: string;
  insurancePolicyNumber: string;
  insuranceExpiryDate: string;
}
