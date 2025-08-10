// Core SkillSwap TypeScript Models

export interface Location {
  city: string;
  country: string;
  lat: number;
  lng: number;
}

export interface SkillOffered {
  skillId: string;
  level: 1 | 2 | 3 | 4 | 5;
}

export interface SkillWanted {
  skillId: string;
  priority: 'low' | 'medium' | 'high';
}

export interface PortfolioItem {
  title: string;
  mediaUrl: string;
  description: string;
  type: 'image' | 'video' | 'document';
}

export interface Verification {
  idVerified: boolean;
  testsPassed: string[];
}

export interface Availability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  slots: string[]; // ["09:00", "14:00", "16:00"]
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: 'earn' | 'spend' | 'bonus' | 'donation' | 'refund';
  amount: number;
  createdAt: string; // ISO string
  description: string;
  refSessionId?: string;
}

export interface Wallet {
  credits: number;
  txHistory: CreditTransaction[];
}

export interface Socials {
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  instagram?: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  location: Location;
  languages: string[];
  bio: string;
  skillsOffered: SkillOffered[];
  skillsWanted: SkillWanted[];
  portfolio: PortfolioItem[];
  badges: string[];
  verification: Verification;
  ratingAvg: number;
  ratingCount: number;
  availability: Availability[];
  wallet: Wallet;
  socials: Socials;
  joinedAt: string; // ISO string
  lastActive: string; // ISO string
  timezone: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  difficulty: 1 | 2 | 3;
  demandScore: number; // 0-100
  description: string;
  icon: string;
  baseRateCredits: number; // base rate in credits per hour
}

export interface Session {
  id: string;
  type: '1:1' | 'group' | 'async';
  teacherId: string;
  learnerIds: string[];
  skillId: string;
  status: 'draft' | 'booked' | 'completed' | 'disputed' | 'cancelled';
  startsAt: string; // ISO string
  durationMins: number;
  location: 'virtual' | 'in-person';
  address?: string;
  workspaceId?: string;
  notes?: string;
  priceCredits: number;
  maxParticipants?: number; // for group sessions
  createdAt: string; // ISO string
  escrowEnabled: boolean;
}

export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  sessionId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  createdAt: string; // ISO string
  media?: string[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  goal: string;
  startAt: string; // ISO string
  endAt: string; // ISO string
  rules: string;
  rewardCredits: number;
  status: 'upcoming' | 'active' | 'ended';
  participants: number;
  leaderboard: Array<{
    userId: string;
    points: number;
    rank: number;
  }>;
  category: string;
  maxParticipants?: number;
}

export interface Organization {
  id: string;
  name: string;
  logoUrl: string;
  type: 'NGO' | 'School' | 'Company';
  verified: boolean;
  description: string;
  walletAddress?: string;
  website?: string;
  totalDonationsReceived: number;
}

export interface WorkspaceArtifact {
  id: string;
  title: string;
  url: string;
  type: 'doc' | 'image' | 'video' | 'code';
  uploadedBy: string;
  uploadedAt: string; // ISO string
}

export interface Workspace {
  id: string;
  sessionId: string;
  artifacts: WorkspaceArtifact[];
  tasks: Array<{
    id: string;
    title: string;
    completed: boolean;
    assignedTo?: string;
  }>;
  comments: Array<{
    id: string;
    userId: string;
    text: string;
    createdAt: string;
  }>;
}

export interface Class {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  skillId: string;
  maxSeats: number;
  currentSeats: number;
  pricePerSeat: number; // in credits
  schedule: Array<{
    date: string; // ISO string
    startTime: string;
    endTime: string;
  }>;
  syllabus: string[];
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  tags: string[];
  difficulty: 1 | 2 | 3;
}

export interface MentorTier {
  id: string;
  name: string; // "Silver", "Gold", "Platinum"
  creditsPerHour: number;
  features: string[];
  color: string;
}

export interface Mentor {
  id: string;
  userId: string;
  tier: MentorTier;
  specializations: string[];
  yearsExperience: number;
  responseTime: string; // "< 1 hour", "< 24 hours"
  availability: 'available' | 'busy' | 'away';
  bio: string;
  certifications: string[];
}

export interface Dispute {
  id: string;
  sessionId: string;
  reporterId: string;
  reportedId: string;
  reason: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
}

export interface SkillPath {
  id: string;
  name: string;
  description: string;
  skills: Array<{
    skillId: string;
    order: number;
    required: boolean;
  }>;
  estimatedDuration: string; // "4-6 weeks"
  difficulty: 1 | 2 | 3;
  category: string;
}

// API Response Types
export interface MatchResult {
  user: User;
  skill: Skill;
  matchScore: number; // 0-100
  reasons: string[]; // ["skill complementarity", "timezone match", "high rating"]
  distance?: number; // in kilometers
  nextAvailable?: string; // ISO string
}

export interface SearchFilters {
  query?: string;
  category?: string;
  mode?: 'virtual' | 'in-person' | 'async';
  maxDistance?: number; // in km
  minRating?: number;
  priceRange?: [number, number]; // credits per hour
  availability?: 'now' | 'today' | 'week' | 'anytime';
  languages?: string[];
  timezone?: string;
}

// Utility types
export type UserRole = 'user' | 'admin' | 'moderator';

export interface AuthUser extends User {
  role: UserRole;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      sessions: boolean;
      matches: boolean;
      challenges: boolean;
    };
  };
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Form types for various flows
export interface OnboardingData {
  step1: {
    location: Location;
    languages: string[];
    bio: string;
    timezone: string;
  };
  step2: {
    skillsOffered: SkillOffered[];
    skillsWanted: SkillWanted[];
  };
  step3: {
    availability: Availability[];
  };
}

export interface BookingData {
  sessionId: string;
  teacherId: string;
  skillId: string;
  type: '1:1' | 'group' | 'async';
  datetime: string; // ISO string
  duration: number; // minutes
  location: 'virtual' | 'in-person';
  address?: string;
  notes?: string;
  escrowEnabled: boolean;
  totalCredits: number;
}
