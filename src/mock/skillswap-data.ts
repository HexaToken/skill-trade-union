export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  location: {
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
  languages: string[];
  bio: string;
  skillsOffered: Array<{
    skillId: string;
    level: 1 | 2 | 3 | 4 | 5;
  }>;
  skillsWanted: Array<{
    skillId: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  portfolio: Array<{
    title: string;
    mediaUrl: string;
    description: string;
    type: 'image' | 'video' | 'document';
  }>;
  badges: string[];
  verification: {
    idVerified: boolean;
    testsPassed: string[];
  };
  ratingAvg: number;
  ratingCount: number;
  availability: Array<{
    dayOfWeek: number;
    slots: string[];
  }>;
  wallet: {
    credits: number;
    txHistory: CreditTransaction[];
  };
  socials: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  joinedAt: string;
  lastActive: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  difficulty: 1 | 2 | 3;
  demandScore: number;
  description: string;
  icon: string;
}

export interface Session {
  id: string;
  type: '1:1' | 'group' | 'async';
  teacherId: string;
  learnerIds: string[];
  skillId: string;
  status: 'draft' | 'booked' | 'completed' | 'disputed' | 'cancelled';
  startsAt: string;
  durationMins: number;
  location: 'virtual' | 'in-person';
  address?: string;
  workspaceId?: string;
  notes: string;
  creditsPerHour: number;
  maxParticipants?: number;
  createdAt: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: 'earn' | 'spend' | 'bonus' | 'donation' | 'refund';
  amount: number;
  createdAt: string;
  description: string;
  refSessionId?: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  sessionId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  createdAt: string;
  media: string[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  goal: string;
  startAt: string;
  endAt: string;
  rules: string[];
  rewardCredits: number;
  status: 'upcoming' | 'active' | 'completed';
  participants: number;
  leaderboard: Array<{
    userId: string;
    score: number;
    rank: number;
  }>;
}

export interface Donation {
  id: string;
  userId: string;
  orgId: string;
  amountCredits: number;
  amountCrypto?: number;
  tokenSymbol?: string;
  txHash?: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  logoUrl: string;
  type: 'NGO' | 'School' | 'Company';
  verified: boolean;
  description: string;
  walletAddress?: string;
}

export interface Workspace {
  id: string;
  sessionId: string;
  artifacts: Array<{
    id: string;
    title: string;
    url: string;
    type: 'doc' | 'image' | 'video' | 'code';
    uploadedBy: string;
    uploadedAt: string;
  }>;
}

// Mock Data
export const skills: Skill[] = [
  {
    id: 'logo-design',
    name: 'Logo Design',
    category: 'Design',
    difficulty: 2,
    demandScore: 85,
    description: 'Create memorable brand identities and logos',
    icon: '🎨'
  },
  {
    id: 'guitar',
    name: 'Guitar',
    category: 'Music',
    difficulty: 2,
    demandScore: 75,
    description: 'Learn acoustic and electric guitar techniques',
    icon: '🎸'
  },
  {
    id: 'spanish',
    name: 'Spanish Tutoring',
    category: 'Languages',
    difficulty: 1,
    demandScore: 90,
    description: 'Conversational and grammar Spanish lessons',
    icon: '🇪🇸'
  },
  {
    id: 'bike-repair',
    name: 'Bike Repair',
    category: 'Mechanical',
    difficulty: 2,
    demandScore: 60,
    description: 'Fix and maintain bicycles of all types',
    icon: '🚲'
  },
  {
    id: 'web-dev',
    name: 'Web Development',
    category: 'Technology',
    difficulty: 3,
    demandScore: 95,
    description: 'Build modern websites and web applications',
    icon: '💻'
  },
  {
    id: 'accounting',
    name: 'Accounting',
    category: 'Business',
    difficulty: 2,
    demandScore: 80,
    description: 'Financial management and bookkeeping',
    icon: '📊'
  },
  {
    id: 'photography',
    name: 'Photography',
    category: 'Creative',
    difficulty: 2,
    demandScore: 70,
    description: 'Portrait, landscape, and commercial photography',
    icon: '📸'
  },
  {
    id: 'yoga',
    name: 'Yoga',
    category: 'Wellness',
    difficulty: 1,
    demandScore: 85,
    description: 'Mindful movement and flexibility training',
    icon: '🧘'
  }
];

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Sofia Rodriguez',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    location: { city: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734 },
    languages: ['Spanish', 'English', 'Catalan'],
    bio: 'Creative professional with 8+ years in brand design. I love helping others bring their visual ideas to life!',
    skillsOffered: [
      { skillId: 'logo-design', level: 5 },
      { skillId: 'photography', level: 4 }
    ],
    skillsWanted: [
      { skillId: 'web-dev', priority: 'high' },
      { skillId: 'guitar', priority: 'medium' }
    ],
    portfolio: [
      {
        title: 'Tech Startup Logo Suite',
        mediaUrl: 'https://images.unsplash.com/photo-1635405074683-96d6921a2a68?w=400&h=300&fit=crop',
        description: 'Complete brand identity for a fintech startup',
        type: 'image'
      }
    ],
    badges: ['verified-designer', 'top-mentor', 'quick-responder'],
    verification: { idVerified: true, testsPassed: ['design-fundamentals', 'adobe-certified'] },
    ratingAvg: 4.9,
    ratingCount: 127,
    availability: [
      { dayOfWeek: 1, slots: ['09:00', '14:00', '16:00'] },
      { dayOfWeek: 3, slots: ['10:00', '15:00'] }
    ],
    wallet: {
      credits: 485,
      txHistory: []
    },
    socials: {
      twitter: '@sofiadesigns',
      linkedin: 'sofia-rodriguez-design',
      website: 'sofiadesigns.co'
    },
    joinedAt: '2023-08-15',
    lastActive: '2024-01-20T14:30:00Z'
  },
  {
    id: 'user-2',
    name: 'Marcus Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    location: { city: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194 },
    languages: ['English', 'Mandarin'],
    bio: 'Full-stack developer and guitar enthusiast. Building the future, one line of code at a time.',
    skillsOffered: [
      { skillId: 'web-dev', level: 5 },
      { skillId: 'guitar', level: 3 }
    ],
    skillsWanted: [
      { skillId: 'spanish', priority: 'high' },
      { skillId: 'photography', priority: 'low' }
    ],
    portfolio: [
      {
        title: 'E-commerce Platform',
        mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        description: 'React-based marketplace with 50k+ users',
        type: 'image'
      }
    ],
    badges: ['code-master', 'helpful-teacher'],
    verification: { idVerified: true, testsPassed: ['javascript-expert', 'react-certification'] },
    ratingAvg: 4.8,
    ratingCount: 89,
    availability: [
      { dayOfWeek: 2, slots: ['18:00', '19:00'] },
      { dayOfWeek: 6, slots: ['10:00', '14:00', '16:00'] }
    ],
    wallet: {
      credits: 720,
      txHistory: []
    },
    socials: {
      github: 'marcuscode',
      linkedin: 'marcus-chen-dev'
    },
    joinedAt: '2023-09-20',
    lastActive: '2024-01-20T16:45:00Z'
  },
  {
    id: 'user-3',
    name: 'Isabella Thompson',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    location: { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
    languages: ['English', 'French'],
    bio: 'Certified yoga instructor and wellness coach. Let\'s find balance together!',
    skillsOffered: [
      { skillId: 'yoga', level: 5 },
      { skillId: 'accounting', level: 3 }
    ],
    skillsWanted: [
      { skillId: 'logo-design', priority: 'medium' },
      { skillId: 'web-dev', priority: 'low' }
    ],
    portfolio: [
      {
        title: 'Morning Flow Sequence',
        mediaUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
        description: '20-minute energizing morning yoga routine',
        type: 'video'
      }
    ],
    badges: ['wellness-expert', 'community-favorite'],
    verification: { idVerified: true, testsPassed: ['yoga-alliance-certified'] },
    ratingAvg: 4.9,
    ratingCount: 156,
    availability: [
      { dayOfWeek: 1, slots: ['07:00', '08:00', '17:00'] },
      { dayOfWeek: 4, slots: ['07:00', '18:00'] }
    ],
    wallet: {
      credits: 340,
      txHistory: []
    },
    socials: {
      instagram: '@isabellayoga',
      website: 'isabellaflow.com'
    },
    joinedAt: '2023-07-10',
    lastActive: '2024-01-20T12:20:00Z'
  }
];

export const challenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: '30-Day Design Sprint',
    description: 'Create a logo every day for 30 days and build your portfolio',
    goal: 'Complete 30 unique logo designs',
    startAt: '2024-02-01T00:00:00Z',
    endAt: '2024-03-02T23:59:59Z',
    rules: ['One logo per day', 'Must be original work', 'Share progress daily'],
    rewardCredits: 500,
    status: 'active',
    participants: 247,
    leaderboard: [
      { userId: 'user-1', score: 28, rank: 1 },
      { userId: 'user-4', score: 25, rank: 2 },
      { userId: 'user-5', score: 23, rank: 3 }
    ]
  },
  {
    id: 'challenge-2',
    title: 'Code for Good',
    description: 'Build tools that help local communities and nonprofits',
    goal: 'Deploy a working application for a nonprofit',
    startAt: '2024-01-15T00:00:00Z',
    endAt: '2024-03-15T23:59:59Z',
    rules: ['Must benefit a real organization', 'Open source preferred', 'Document your impact'],
    rewardCredits: 1000,
    status: 'active',
    participants: 89,
    leaderboard: [
      { userId: 'user-2', score: 950, rank: 1 },
      { userId: 'user-6', score: 830, rank: 2 }
    ]
  }
];

export const organizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Code for Africa',
    logoUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=100&h=100&fit=crop',
    type: 'NGO',
    verified: true,
    description: 'Empowering African societies through technology and data journalism',
    walletAddress: '0x1234...5678'
  },
  {
    id: 'org-2',
    name: 'Local Art Academy',
    logoUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop',
    type: 'School',
    verified: true,
    description: 'Supporting emerging artists with education and resources'
  }
];

export const sessions: Session[] = [
  {
    id: 'session-1',
    type: '1:1',
    teacherId: 'user-1',
    learnerIds: ['user-2'],
    skillId: 'logo-design',
    status: 'booked',
    startsAt: '2024-01-25T15:00:00Z',
    durationMins: 60,
    location: 'virtual',
    notes: 'Looking to redesign my startup logo with modern techniques',
    creditsPerHour: 45,
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'session-2',
    type: 'group',
    teacherId: 'user-3',
    learnerIds: ['user-1', 'user-2', 'user-4'],
    skillId: 'yoga',
    status: 'booked',
    startsAt: '2024-01-22T07:00:00Z',
    durationMins: 45,
    location: 'virtual',
    notes: 'Morning flow session for beginners',
    creditsPerHour: 25,
    maxParticipants: 8,
    createdAt: '2024-01-19T14:30:00Z'
  }
];

export const creditTransactions: CreditTransaction[] = [
  {
    id: 'tx-1',
    userId: 'user-1',
    type: 'earn',
    amount: 45,
    createdAt: '2024-01-18T16:00:00Z',
    description: 'Teaching: Logo Design Fundamentals',
    refSessionId: 'session-old-1'
  },
  {
    id: 'tx-2',
    userId: 'user-2',
    type: 'spend',
    amount: -45,
    createdAt: '2024-01-18T16:00:00Z',
    description: 'Learning: Logo Design Fundamentals',
    refSessionId: 'session-old-1'
  },
  {
    id: 'tx-3',
    userId: 'user-2',
    type: 'bonus',
    amount: 100,
    createdAt: '2024-01-15T12:00:00Z',
    description: 'Welcome bonus for new user'
  }
];

export const reviews: Review[] = [
  {
    id: 'review-1',
    reviewerId: 'user-2',
    revieweeId: 'user-1',
    sessionId: 'session-old-1',
    rating: 5,
    text: 'Sofia is an amazing teacher! She broke down complex design principles into easy-to-understand concepts. My logo looks professional now!',
    createdAt: '2024-01-18T17:00:00Z',
    media: []
  },
  {
    id: 'review-2',
    reviewerId: 'user-1',
    revieweeId: 'user-3',
    sessionId: 'session-old-2',
    rating: 5,
    text: 'Isabella\'s yoga session was exactly what I needed. Great energy and clear instructions for a beginner like me.',
    createdAt: '2024-01-17T08:30:00Z',
    media: []
  }
];
