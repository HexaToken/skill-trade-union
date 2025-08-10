// ExpertMatch AI and additional feature types

export interface ExpertMatchRequest {
  id: string;
  userId: string;
  skillId: string;
  topic: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  estimatedDuration?: number; // minutes
  maxRate?: number; // per minute in cents
  createdAt: string;
  status: 'pending' | 'matched' | 'in-session' | 'completed' | 'cancelled';
}

export interface ExpertAvailability {
  userId: string;
  skillId: string;
  instantAvailable: boolean;
  ratePerMinuteCents: number;
  maxSessionDuration: number; // minutes
  averageResponseTime: number; // seconds
  nextAvailableSlot?: string; // ISO string
  lastSeen: string; // ISO string
}

export interface InstantSession {
  id: string;
  requestId: string;
  expertId: string;
  clientId: string;
  skillId: string;
  startedAt: string;
  endedAt?: string;
  durationMinutes?: number;
  ratePerMinuteCents: number;
  totalCostCents?: number;
  status: 'connecting' | 'active' | 'completed' | 'failed';
  recordingAvailable?: boolean;
  recordingPurchased?: boolean;
  aiSentimentScore?: number; // 0-1
}

export interface ExpertProfile extends User {
  expertStatus: {
    verified: boolean;
    instantAvailable: boolean;
    specializations: string[];
    responseTimeAvg: number; // seconds
    completedInstantSessions: number;
    instantRating: number;
    instantMinutesRemaining?: number; // for premium users
  };
  expertise: {
    skillId: string;
    ratePerMinuteCents: number;
    maxSessionDuration: number;
    certifications: string[];
    yearsExperience: number;
  }[];
}

export interface Lesson {
  id: string;
  title: string;
  durationMins: number;
  previewable: boolean;
  videoUrl?: string;
  materials?: string[];
  order: number;
}

export interface Course extends Class {
  subtitle: string;
  thumbnailUrl: string;
  level: 1 | 2 | 3;
  language: string;
  ratingAvg: number;
  ratingCount: number;
  lessons: Lesson[];
  requirements: string[];
  outcomes: string[];
  enrolled: number;
  badges: ('group' | 'materials' | 'recorded' | 'certificate')[];
}

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  studentId: string;
  skillId: string;
  type: 'short-term' | 'long-term' | 'project-based';
  duration?: string; // "3 months", "until project completion"
  goals: string[];
  preferredSchedule: string;
  budget: {
    creditsPerHour: number;
    totalBudget?: number;
    flexible: boolean;
  };
  status: 'pending' | 'accepted' | 'declined' | 'active' | 'completed';
  createdAt: string;
  message: string;
}

export interface BookingRequest {
  sessionId: string;
  teacherId: string;
  learnerId: string;
  skillId: string;
  type: '1:1' | 'group' | 'async' | 'instant';
  preferredDatetime: string;
  alternativeDatetimes?: string[];
  duration: number; // minutes
  location: 'virtual' | 'in-person';
  address?: string;
  notes?: string;
  escrowEnabled: boolean;
  totalCredits: number;
  urgentHelp?: boolean; // triggers ExpertMatch AI suggestion
}

export interface AISkillGapAnalysis {
  id: string;
  userId: string;
  analyzedAt: string;
  source: 'resume' | 'linkedin' | 'manual';
  currentSkills: {
    skillId: string;
    proficiencyLevel: number; // 1-5
    confidence: number; // 0-1
  }[];
  recommendedSkills: {
    skillId: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
    marketDemand: number; // 0-100
    relatedJobs: string[];
  }[];
  suggestedMentors: string[]; // user IDs
  suggestedClasses: string[]; // class IDs
  suggestedPaths: string[]; // path IDs
}

export interface LanguageAssist {
  sessionId: string;
  enabled: boolean;
  sourceLanguage: string;
  targetLanguage: string;
  mode: 'real-time' | 'on-demand';
  translatedMessages: {
    id: string;
    originalText: string;
    translatedText: string;
    confidence: number;
    timestamp: string;
  }[];
}

export interface OfflineExchange {
  id: string;
  teacherId: string;
  learnerId: string;
  skillId: string;
  location: string;
  completedAt: string;
  durationMins: number;
  creditsExchanged: number;
  teacherConfirmed: boolean;
  learnerConfirmed: boolean;
  status: 'pending' | 'confirmed' | 'disputed';
  evidence?: {
    photos: string[];
    description: string;
  };
}

export interface SkillBadge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  skillId: string;
  requirements: {
    sessionsCompleted?: number;
    rating?: number;
    hoursTeaching?: number;
    hoursLearning?: number;
    certificationsEarned?: string[];
  };
  color: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface ShareableProof {
  id: string;
  userId: string;
  type: 'completion' | 'skill-mastery' | 'teaching-hours' | 'badge-earned';
  skillId?: string;
  classId?: string;
  badgeId?: string;
  issuedAt: string;
  verificationCode: string;
  shareableUrl: string;
  printableUrl: string;
  metadata: {
    title: string;
    description: string;
    issuer: string;
    credentialType: string;
  };
}

// Extended search and filter types
export interface AdvancedSearchFilters extends SearchFilters {
  instantAvailable?: boolean;
  mentorTier?: 'silver' | 'gold' | 'platinum';
  hasPortfolio?: boolean;
  verified?: boolean;
  responseTime?: 'instant' | 'hour' | 'day' | 'week';
  teachingExperience?: number; // minimum years
  studentCount?: number; // minimum students taught
  completionRate?: number; // minimum completion rate
  badges?: string[];
  certifications?: string[];
}

export interface MapDataPoint {
  id: string;
  type: 'mentor' | 'class' | 'demand-hotspot';
  skillId: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  metadata: {
    count?: number; // for demand hotspots
    userId?: string; // for mentors
    classId?: string; // for classes
    intensity?: number; // for heat layer
  };
}

export interface AdminModerationItem {
  id: string;
  type: 'profile' | 'session' | 'review' | 'dispute' | 'content';
  reportedBy?: string;
  targetId: string; // user, session, review, etc.
  reason: string;
  description: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  resolution?: string;
  actions: {
    warning?: boolean;
    suspension?: { duration: string; reason: string };
    ban?: boolean;
    contentRemoval?: boolean;
  };
}

export interface PlatformAnalytics {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  metrics: {
    dailyActiveUsers: number;
    totalSessions: number;
    creditVelocity: number; // credits exchanged per period
    userRetention: {
      '7day': number;
      '30day': number;
      '90day': number;
    };
    topSkills: {
      skillId: string;
      sessionCount: number;
      growthRate: number;
    }[];
    revenueMetrics: {
      instantSessionRevenue: number;
      platformFees: number;
      conversionRate: number;
    };
    geographicDistribution: {
      country: string;
      userCount: number;
      sessionCount: number;
    }[];
  };
}

export interface EnterpriseOrganization extends Organization {
  enterpriseFeatures: {
    privateDirectory: boolean;
    internalChallenges: boolean;
    customBranding: boolean;
    analyticsAccess: boolean;
    prioritySupport: boolean;
  };
  employees: {
    userId: string;
    role: 'member' | 'admin' | 'manager';
    department?: string;
    addedAt: string;
  }[];
  usage: {
    totalSessions: number;
    creditsUsed: number;
    popularSkills: string[];
    monthlyActiveUsers: number;
  };
}

// Service interface stubs for implementation
export interface MatchService {
  search(filters: AdvancedSearchFilters): Promise<MatchResult[]>;
  getRecommendations(userId: string): Promise<MatchResult[]>;
  getMapData(bounds: { ne: [number, number]; sw: [number, number] }): Promise<MapDataPoint[]>;
}

export interface InstantService {
  findAvailableExperts(skillId: string, urgency?: string): Promise<ExpertProfile[]>;
  createRequest(request: Omit<ExpertMatchRequest, 'id' | 'createdAt' | 'status'>): Promise<ExpertMatchRequest>;
  startSession(expertId: string, requestId: string): Promise<InstantSession>;
  endSession(sessionId: string): Promise<InstantSession>;
}

export interface BillingService {
  startMeter(sessionId: string, ratePerMinuteCents: number): Promise<void>;
  stopMeter(sessionId: string): Promise<{ totalCostCents: number; duration: number }>;
  processPayment(amount: number, method: 'stripe' | 'paypal'): Promise<{ success: boolean; transactionId?: string }>;
  convertCreditsToUSD(credits: number): Promise<number>;
}

export interface AIService {
  analyzeSkillGap(userId: string, data: any): Promise<AISkillGapAnalysis>;
  generateMatchScore(user1: User, user2: User, skillId: string): Promise<number>;
  assessSentiment(sessionId: string, transcriptData: any): Promise<number>;
  suggestNextSteps(userId: string, completedSkillId: string): Promise<{
    skills: string[];
    classes: string[];
    mentors: string[];
  }>;
}
