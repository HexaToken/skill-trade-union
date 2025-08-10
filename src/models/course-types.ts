// Enhanced SkillSwap Types for Udemy/Coursera-inspired structure

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
  refClassId?: string;
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
  // Enhanced for instructor/mentor profile
  headline?: string; // Professional headline
  yearsExperience?: number;
  totalStudents?: number;
  totalClasses?: number;
  specializations?: string[];
  teachingStyle?: string;
  certifications?: string[];
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
  relatedSkills?: string[]; // related skill IDs
  prerequisites?: string[]; // prerequisite skill IDs
}

// Enhanced Class/Course structure (Udemy/Coursera inspired)
export interface Lesson {
  id: string;
  title: string;
  description?: string;
  durationMins: number;
  previewable: boolean;
  videoUrl?: string;
  materials?: string[];
  order: number;
}

export interface CourseSection {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  order: number;
}

export interface Class {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  thumbnailUrl: string;
  instructorId: string;
  skillId: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMins: number;
  language: string;
  ratingAvg: number;
  ratingCount: number;
  studentsCount: number;
  
  // Course structure (Udemy style)
  sections: CourseSection[];
  requirements: string[];
  outcomes: string[]; // What you'll learn
  
  // Scheduling and enrollment
  type: 'live' | 'recorded' | 'hybrid';
  maxSeats?: number; // for live classes
  currentSeats?: number;
  schedule?: {
    startDate: string; // ISO string
    endDate?: string;
    sessions: {
      date: string;
      startTime: string;
      endTime: string;
    }[];
  };
  
  priceCredits: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
  
  // Additional materials
  materials?: {
    id: string;
    title: string;
    type: 'pdf' | 'video' | 'link' | 'code';
    url: string;
    downloadable: boolean;
  }[];
  
  // Completion tracking
  certificateTemplate?: string;
  passingGrade?: number; // 0-100
}

// Skill Paths (Coursera Specializations inspired)
export interface SkillPathStep {
  id: string;
  type: 'class' | 'mentorship' | 'project' | 'assessment';
  refId: string; // reference to class, mentor, etc.
  title: string;
  description: string;
  estimatedHours: number;
  isOptional: boolean;
  prerequisites?: string[]; // previous step IDs
  order: number;
}

export interface SkillPath {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  
  steps: SkillPathStep[];
  estimatedHours: number;
  outcomes: string[];
  skills: string[]; // skill IDs covered
  
  // Progress and completion
  completionBadgeId?: string;
  certificateTemplate?: string;
  
  // Enrollment
  priceCredits: number;
  studentsCount: number;
  ratingAvg: number;
  ratingCount: number;
  
  // Metadata
  createdBy: string; // user ID
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
}

export interface UserProgress {
  id: string;
  userId: string;
  pathId?: string;
  classId?: string;
  
  // Progress tracking
  completedSteps: string[];
  currentStep?: string;
  progressPercentage: number;
  
  // Time tracking
  timeSpent: number; // minutes
  lastAccessed: string;
  startedAt: string;
  completedAt?: string;
  
  // Performance
  quiz_scores?: { [lessonId: string]: number };
  assignments?: {
    id: string;
    lessonId: string;
    submittedAt: string;
    grade?: number;
    feedback?: string;
  }[];
}

export interface Session {
  id: string;
  type: '1:1' | 'group' | 'async';
  teacherId: string;
  learnerIds: string[];
  skillId: string;
  classId?: string; // if part of a class
  pathId?: string; // if part of a skill path
  
  status: 'draft' | 'booked' | 'completed' | 'disputed' | 'cancelled';
  startsAt: string; // ISO string
  durationMins: number;
  location: 'virtual' | 'in-person';
  address?: string;
  meetingUrl?: string;
  
  workspaceId?: string;
  notes?: string;
  priceCredits: number;
  maxParticipants?: number; // for group sessions
  
  createdAt: string; // ISO string
  escrowEnabled: boolean;
  
  // Session materials and outcomes
  agenda?: string;
  materials?: string[];
  recordingUrl?: string;
  artifacts?: string[];
}

export interface Review {
  id: string;
  reviewerId: string;
  revieweeId?: string; // for mentor/instructor reviews
  classId?: string;
  sessionId?: string;
  pathId?: string;
  
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  text: string;
  
  // Specific review aspects (Udemy style)
  aspects?: {
    content: number;
    instruction: number;
    value: number;
    engagement: number;
  };
  
  createdAt: string; // ISO string
  media?: string[];
  helpful: number; // helpful votes
  reported: boolean;
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
  maxParticipants?: number;
  
  leaderboard: Array<{
    userId: string;
    points: number;
    rank: number;
    achievements?: string[];
  }>;
  
  category: string;
  difficulty: 1 | 2 | 3;
  skillsRequired?: string[];
  
  // Challenge structure
  tasks?: {
    id: string;
    title: string;
    description: string;
    points: number;
    required: boolean;
  }[];
}

export interface Organization {
  id: string;
  name: string;
  logoUrl: string;
  type: 'NGO' | 'School' | 'Company';
  verified: boolean;
  description: string;
  website?: string;
  
  // Donation and funding
  walletAddress?: string;
  totalDonationsReceived: number;
  
  // Course partnerships
  classes?: string[]; // class IDs
  paths?: string[]; // path IDs
  scholarships?: {
    id: string;
    title: string;
    description: string;
    creditsAwarded: number;
    eligibility: string[];
  }[];
}

export interface WorkspaceArtifact {
  id: string;
  title: string;
  url: string;
  type: 'doc' | 'image' | 'video' | 'code';
  uploadedBy: string;
  uploadedAt: string; // ISO string
  size?: number;
  mimeType?: string;
}

export interface Workspace {
  id: string;
  sessionId: string;
  classId?: string;
  pathId?: string;
  
  artifacts: WorkspaceArtifact[];
  
  tasks: Array<{
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    assignedTo?: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  
  comments: Array<{
    id: string;
    userId: string;
    text: string;
    createdAt: string;
    parentId?: string; // for threaded comments
  }>;
  
  // Collaboration features
  collaborators: string[]; // user IDs
  permissions: {
    [userId: string]: 'read' | 'write' | 'admin';
  };
}

// Mentor tiers and marketplace
export interface MentorTier {
  id: string;
  name: string; // "Silver", "Gold", "Platinum"
  creditsPerHour: number;
  features: string[];
  color: string;
  requirements: {
    minRating: number;
    minSessions: number;
    minStudents: number;
    verificationRequired: boolean;
  };
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
  
  // Mentoring focus
  mentoringAreas: string[];
  careerLevel: 'junior' | 'mid' | 'senior' | 'executive';
  industries: string[];
  
  // Rates and packages
  packages?: {
    id: string;
    title: string;
    description: string;
    sessions: number;
    creditsTotal: number;
    duration: number; // days
    features: string[];
  }[];
}

// Search and filtering
export interface SearchFilters {
  query?: string;
  category?: string;
  level?: string[];
  type?: 'class' | 'mentorship' | 'path' | 'challenge';
  mode?: 'virtual' | 'in-person' | 'async';
  priceRange?: [number, number]; // credits
  duration?: [number, number]; // hours
  rating?: number;
  language?: string[];
  startDate?: string;
  availability?: 'anytime' | 'this-week' | 'this-month';
  skills?: string[];
}

// API Response Types
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

export interface SearchResult<T> {
  items: T[];
  total: number;
  facets: {
    categories: { name: string; count: number }[];
    levels: { name: string; count: number }[];
    languages: { name: string; count: number }[];
    priceRanges: { min: number; max: number; count: number }[];
  };
}

// Form types for onboarding and creation
export interface OnboardingData {
  step1: {
    location: Location;
    languages: string[];
    bio: string;
    timezone: string;
    headline?: string;
  };
  step2: {
    skillsOffered: SkillOffered[];
    skillsWanted: SkillWanted[];
    teachingStyle?: string;
    yearsExperience?: number;
  };
  step3: {
    availability: Availability[];
    mentorInterest: boolean;
    classCreationInterest: boolean;
  };
}

export interface BookingData {
  sessionId: string;
  teacherId: string;
  skillId: string;
  classId?: string;
  type: '1:1' | 'group' | 'async';
  datetime: string; // ISO string
  duration: number; // minutes
  location: 'virtual' | 'in-person';
  address?: string;
  notes?: string;
  escrowEnabled: boolean;
  totalCredits: number;
}

// Utility types
export type UserRole = 'student' | 'instructor' | 'mentor' | 'admin' | 'moderator';

export interface AuthUser extends User {
  role: UserRole;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      sessions: boolean;
      classes: boolean;
      challenges: boolean;
      marketing: boolean;
    };
    privacy: {
      showProfile: boolean;
      showLocation: boolean;
      showActivity: boolean;
    };
  };
  enrollments: {
    classId: string;
    enrolledAt: string;
    progress: UserProgress;
  }[];
  pathEnrollments: {
    pathId: string;
    enrolledAt: string;
    progress: UserProgress;
  }[];
}
