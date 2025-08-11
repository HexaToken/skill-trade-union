export type TradeStatus = 
  | 'draft' 
  | 'awaiting-counterparty' 
  | 'confirmed' 
  | 'disputed' 
  | 'expired'
  | 'needs-reconfirm';

export type TradeRole = 'taught' | 'learned' | 'both';

export type ComplexityLevel = 'simple' | 'standard' | 'advanced';

export type VerificationMethod = 'qr' | 'pin';

export interface TradeAttachment {
  id: string;
  url: string;
  type: 'image' | 'document';
  caption?: string;
  timestamp?: string;
}

export interface TradePricing {
  basePerHour: number;
  complexity: number;
  demand: number;
  durationMins: number;
  totalCredits: number;
}

export interface TradeVerification {
  method: VerificationMethod;
  pin?: string;
  qrToken?: string;
  expiresAt: string;
}

export interface TradeAudit {
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  adminNotes?: string;
}

export interface TradeCounterOffer {
  id: string;
  proposedCredits: number;
  reason?: string;
  createdBy: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface OfflineTrade {
  id: string;
  status: TradeStatus;
  initiatorId: string;
  counterpartyId: string;
  skill: string;
  skillTags: string[];
  roles: Record<string, TradeRole>;
  startedAt: string;
  durationMins: number;
  location: string;
  isInPerson: boolean;
  creditsProposed: number;
  creditsActual?: number;
  pricing: TradePricing;
  escrowEnabled: boolean;
  verification: TradeVerification;
  attachments: TradeAttachment[];
  notes?: string;
  audit: TradeAudit;
  counterOffers?: TradeCounterOffer[];
  disputeReason?: string;
  disputeEvidence?: TradeAttachment[];
}

export interface TradeUser {
  id: string;
  name: string;
  avatar: string;
  email: string;
  balance: number;
  reputation: number;
  verifiedId: boolean;
}

export interface TradeParticipants {
  initiator: TradeUser;
  counterparty: TradeUser;
}

// Form interfaces for the wizard steps
export interface TradeDetailsForm {
  counterpartyId: string;
  skill: string;
  skillTags: string[];
  role: TradeRole;
  startedAt: string;
  durationMins: number;
  location: string;
  isInPerson: boolean;
  creditsProposed: number;
  complexity: ComplexityLevel;
  notes?: string;
  attachments: File[];
}

export interface TradeVerificationForm {
  method: VerificationMethod;
  escrowEnabled: boolean;
  agreeToTerms: boolean;
}

export interface TradeConfirmForm {
  role: TradeRole;
  creditsCounterOffer?: number;
  pin?: string;
  notes?: string;
}

export interface TradeDisputeForm {
  reason: 'incorrect-details' | 'did-not-occur' | 'wrong-credits' | 'other';
  description: string;
  evidence: File[];
}

// Pricing configuration
export const COMPLEXITY_MULTIPLIERS: Record<ComplexityLevel, number> = {
  simple: 1.0,
  standard: 1.3,
  advanced: 1.6
};

export const BASE_CREDITS_PER_HOUR = 10;
export const DEMAND_MULTIPLIER_RANGE = { min: 0.8, max: 1.5 };
export const COUNTER_OFFER_MAX_PERCENTAGE = 10; // ±10%
export const TRADE_EXPIRY_HOURS = 24;
export const HIGH_VALUE_THRESHOLD = 100; // credits

// Helper functions
export const calculateTotalCredits = (
  basePerHour: number,
  durationMins: number,
  complexity: ComplexityLevel,
  demand: number = 1.0
): number => {
  const complexityMultiplier = COMPLEXITY_MULTIPLIERS[complexity];
  const durationHours = durationMins / 60;
  return Math.round(basePerHour * durationHours * complexityMultiplier * demand);
};

export const isHighValueTrade = (credits: number): boolean => {
  return credits >= HIGH_VALUE_THRESHOLD;
};

export const getTradeStatusColor = (status: TradeStatus): string => {
  switch (status) {
    case 'draft':
      return 'bg-[#64748B]/10 text-[#64748B] border-[#64748B]/20';
    case 'awaiting-counterparty':
      return 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20';
    case 'confirmed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
    case 'needs-reconfirm':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
    case 'disputed':
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
    case 'expired':
      return 'bg-[#64748B]/10 text-[#64748B] border-[#64748B]/20';
    default:
      return 'bg-[#64748B]/10 text-[#64748B] border-[#64748B]/20';
  }
};

export const getTradeStatusLabel = (status: TradeStatus): string => {
  switch (status) {
    case 'draft':
      return 'Draft';
    case 'awaiting-counterparty':
      return 'Pending Confirmation';
    case 'confirmed':
      return 'Confirmed';
    case 'needs-reconfirm':
      return 'Needs Re-confirmation';
    case 'disputed':
      return 'Disputed';
    case 'expired':
      return 'Expired';
    default:
      return 'Unknown';
  }
};
