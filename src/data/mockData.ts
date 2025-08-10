import type { 
  User, 
  Skill, 
  Session, 
  CreditTransaction, 
  Review, 
  Challenge, 
  Organization, 
  Workspace, 
  Class, 
  Mentor, 
  MentorTier,
  SkillPath,
  AuthUser
} from '@/models/types';

// Skills - 6 examples from specification
export const skills: Skill[] = [
  {
    id: 'logo-design',
    name: 'Logo Design',
    category: 'Design',
    difficulty: 2,
    demandScore: 85,
    description: 'Create memorable brand identities and professional logos',
    icon: '🎨',
    baseRateCredits: 15
  },
  {
    id: 'guitar',
    name: 'Guitar',
    category: 'Music',
    difficulty: 2,
    demandScore: 75,
    description: 'Learn acoustic and electric guitar techniques, chords, and songs',
    icon: '🎸',
    baseRateCredits: 12
  },
  {
    id: 'spanish-tutoring',
    name: 'Spanish Tutoring',
    category: 'Languages',
    difficulty: 1,
    demandScore: 90,
    description: 'Conversational Spanish, grammar, and cultural immersion',
    icon: '🇪🇸',
    baseRateCredits: 10
  },
  {
    id: 'bike-repair',
    name: 'Bike Repair',
    category: 'Mechanical',
    difficulty: 2,
    demandScore: 60,
    description: 'Fix and maintain bicycles of all types and brands',
    icon: '🚲',
    baseRateCredits: 14
  },
  {
    id: 'web-development',
    name: 'Web Development',
    category: 'Technology',
    difficulty: 3,
    demandScore: 95,
    description: 'Build modern websites and web applications with latest frameworks',
    icon: '💻',
    baseRateCredits: 25
  },
  {
    id: 'accounting',
    name: 'Accounting',
    category: 'Business',
    difficulty: 2,
    demandScore: 80,
    description: 'Financial management, bookkeeping, and tax preparation',
    icon: '📊',
    baseRateCredits: 20
  },
  {
    id: 'photography',
    name: 'Photography',
    category: 'Creative',
    difficulty: 2,
    demandScore: 70,
    description: 'Portrait, landscape, and commercial photography techniques',
    icon: '📸',
    baseRateCredits: 18
  },
  {
    id: 'yoga',
    name: 'Yoga',
    category: 'Wellness',
    difficulty: 1,
    demandScore: 85,
    description: 'Mindful movement, flexibility training, and meditation',
    icon: '🧘',
    baseRateCredits: 16
  },
  {
    id: 'cooking',
    name: 'Cooking',
    category: 'Lifestyle',
    difficulty: 1,
    demandScore: 78,
    description: 'Learn culinary techniques and international cuisines',
    icon: '👨‍🍳',
    baseRateCredits: 13
  },
  {
    id: 'data-science',
    name: 'Data Science',
    category: 'Technology',
    difficulty: 3,
    demandScore: 92,
    description: 'Analytics, machine learning, and data visualization',
    icon: '📈',
    baseRateCredits: 30
  }
];

// Users - 5 sample users with varied geos/timezones
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
      { skillId: 'web-development', priority: 'high' },
      { skillId: 'guitar', priority: 'medium' }
    ],
    portfolio: [
      {
        title: 'Tech Startup Logo Suite',
        mediaUrl: 'https://images.unsplash.com/photo-1635405074683-96d6921a2a68?w=400&h=300&fit=crop',
        description: 'Complete brand identity for a fintech startup',
        type: 'image'
      },
      {
        title: 'Brand Guidelines Document',
        mediaUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop',
        description: 'Comprehensive brand guide with color palette and typography',
        type: 'document'
      }
    ],
    badges: ['verified-designer', 'top-mentor', 'quick-responder'],
    verification: { idVerified: true, testsPassed: ['design-fundamentals', 'adobe-certified'] },
    ratingAvg: 4.9,
    ratingCount: 127,
    availability: [
      { dayOfWeek: 1, slots: ['09:00', '14:00', '16:00'] },
      { dayOfWeek: 3, slots: ['10:00', '15:00'] },
      { dayOfWeek: 5, slots: ['09:00', '11:00', '14:00'] }
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
    joinedAt: '2023-08-15T00:00:00Z',
    lastActive: '2024-01-20T14:30:00Z',
    timezone: 'Europe/Madrid'
  },
  {
    id: 'user-2',
    name: 'Marcus Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    location: { city: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194 },
    languages: ['English', 'Mandarin'],
    bio: 'Full-stack developer and guitar enthusiast. Building the future, one line of code at a time.',
    skillsOffered: [
      { skillId: 'web-development', level: 5 },
      { skillId: 'guitar', level: 3 }
    ],
    skillsWanted: [
      { skillId: 'spanish-tutoring', priority: 'high' },
      { skillId: 'photography', priority: 'low' }
    ],
    portfolio: [
      {
        title: 'E-commerce Platform',
        mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        description: 'React-based marketplace with 50k+ users',
        type: 'image'
      },
      {
        title: 'Guitar Cover Performance',
        mediaUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
        description: 'Acoustic version of "Hotel California"',
        type: 'video'
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
    joinedAt: '2023-09-20T00:00:00Z',
    lastActive: '2024-01-20T16:45:00Z',
    timezone: 'America/Los_Angeles'
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
      { skillId: 'web-development', priority: 'low' }
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
    joinedAt: '2023-07-10T00:00:00Z',
    lastActive: '2024-01-20T12:20:00Z',
    timezone: 'Europe/London'
  },
  {
    id: 'user-4',
    name: 'Kenji Nakamura',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    location: { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
    languages: ['Japanese', 'English'],
    bio: 'Master chef specializing in traditional Japanese cuisine and modern fusion techniques.',
    skillsOffered: [
      { skillId: 'cooking', level: 5 },
      { skillId: 'bike-repair', level: 4 }
    ],
    skillsWanted: [
      { skillId: 'data-science', priority: 'high' },
      { skillId: 'photography', priority: 'medium' }
    ],
    portfolio: [
      {
        title: 'Sushi Masterclass',
        mediaUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
        description: 'Traditional sushi preparation techniques',
        type: 'video'
      }
    ],
    badges: ['culinary-master', 'patient-teacher'],
    verification: { idVerified: true, testsPassed: ['culinary-certification'] },
    ratingAvg: 4.95,
    ratingCount: 203,
    availability: [
      { dayOfWeek: 0, slots: ['10:00', '14:00'] },
      { dayOfWeek: 3, slots: ['09:00', '13:00', '16:00'] }
    ],
    wallet: {
      credits: 892,
      txHistory: []
    },
    socials: {
      instagram: '@chefkenji',
      website: 'kenjicooks.jp'
    },
    joinedAt: '2023-06-05T00:00:00Z',
    lastActive: '2024-01-20T09:15:00Z',
    timezone: 'Asia/Tokyo'
  },
  {
    id: 'user-5',
    name: 'Amara Okafor',
    avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    location: { city: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792 },
    languages: ['English', 'Yoruba', 'French'],
    bio: 'Data scientist and AI researcher passionate about using technology to solve real-world problems.',
    skillsOffered: [
      { skillId: 'data-science', level: 5 },
      { skillId: 'accounting', level: 4 }
    ],
    skillsWanted: [
      { skillId: 'spanish-tutoring', priority: 'high' },
      { skillId: 'yoga', priority: 'medium' }
    ],
    portfolio: [
      {
        title: 'Climate Data Analysis',
        mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        description: 'Machine learning model for climate pattern prediction',
        type: 'document'
      }
    ],
    badges: ['data-wizard', 'research-pioneer', 'community-builder'],
    verification: { idVerified: true, testsPassed: ['data-science-certified', 'ml-expert'] },
    ratingAvg: 4.85,
    ratingCount: 67,
    availability: [
      { dayOfWeek: 2, slots: ['14:00', '16:00', '18:00'] },
      { dayOfWeek: 5, slots: ['15:00', '17:00'] }
    ],
    wallet: {
      credits: 1205,
      txHistory: []
    },
    socials: {
      twitter: '@amaradata',
      linkedin: 'amara-okafor-ds',
      github: 'amaraokafor'
    },
    joinedAt: '2023-10-12T00:00:00Z',
    lastActive: '2024-01-20T15:30:00Z',
    timezone: 'Africa/Lagos'
  }
];

// Current authenticated user (for demo purposes)
export const currentUser: AuthUser = {
  ...users[1], // Marcus Chen
  role: 'user',
  preferences: {
    theme: 'system',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      sessions: true,
      matches: true,
      challenges: true
    }
  }
};

// Credit Transactions
export const creditTransactions: CreditTransaction[] = [
  {
    id: 'tx-1',
    userId: 'user-2',
    type: 'earn',
    amount: 50,
    createdAt: '2024-01-18T16:00:00Z',
    description: 'Teaching: React Component Workshop',
    refSessionId: 'session-1'
  },
  {
    id: 'tx-2',
    userId: 'user-2',
    type: 'spend',
    amount: -30,
    createdAt: '2024-01-17T14:00:00Z',
    description: 'Learning: Logo Design Fundamentals',
    refSessionId: 'session-2'
  },
  {
    id: 'tx-3',
    userId: 'user-2',
    type: 'bonus',
    amount: 100,
    createdAt: '2024-01-15T12:00:00Z',
    description: 'Welcome bonus for new user'
  },
  {
    id: 'tx-4',
    userId: 'user-2',
    type: 'earn',
    amount: 75,
    createdAt: '2024-01-16T19:00:00Z',
    description: 'Teaching: JavaScript Fundamentals',
    refSessionId: 'session-3'
  },
  {
    id: 'tx-5',
    userId: 'user-2',
    type: 'donation',
    amount: -25,
    createdAt: '2024-01-14T10:00:00Z',
    description: 'Donated to Code for Africa'
  }
];

// Sessions
export const sessions: Session[] = [
  {
    id: 'session-1',
    type: '1:1',
    teacherId: 'user-2',
    learnerIds: ['user-1'],
    skillId: 'web-development',
    status: 'completed',
    startsAt: '2024-01-18T16:00:00Z',
    durationMins: 120,
    location: 'virtual',
    notes: 'Focus on React hooks and state management',
    priceCredits: 50,
    createdAt: '2024-01-15T10:00:00Z',
    escrowEnabled: true
  },
  {
    id: 'session-2',
    type: '1:1',
    teacherId: 'user-1',
    learnerIds: ['user-2'],
    skillId: 'logo-design',
    status: 'completed',
    startsAt: '2024-01-17T14:00:00Z',
    durationMins: 90,
    location: 'virtual',
    notes: 'Redesign my startup logo with modern techniques',
    priceCredits: 30,
    createdAt: '2024-01-14T12:00:00Z',
    escrowEnabled: true
  },
  {
    id: 'session-3',
    type: 'group',
    teacherId: 'user-3',
    learnerIds: ['user-1', 'user-2', 'user-4'],
    skillId: 'yoga',
    status: 'booked',
    startsAt: '2024-01-25T07:00:00Z',
    durationMins: 60,
    location: 'virtual',
    notes: 'Morning flow session for beginners',
    priceCredits: 20,
    maxParticipants: 8,
    createdAt: '2024-01-19T14:30:00Z',
    escrowEnabled: false
  }
];

// Reviews
export const reviews: Review[] = [
  {
    id: 'review-1',
    reviewerId: 'user-1',
    revieweeId: 'user-2',
    sessionId: 'session-1',
    rating: 5,
    text: 'Marcus is an exceptional teacher! He explained React concepts clearly and provided practical examples. My understanding has improved dramatically.',
    createdAt: '2024-01-18T18:00:00Z'
  },
  {
    id: 'review-2',
    reviewerId: 'user-2',
    revieweeId: 'user-1',
    sessionId: 'session-2',
    rating: 5,
    text: 'Sofia has incredible design skills! She helped me create a professional logo that perfectly captures my brand vision.',
    createdAt: '2024-01-17T16:00:00Z'
  }
];

// Challenges
export const challenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: '30-Day Design Sprint',
    description: 'Create a unique logo design every day for 30 days to build your portfolio and skills',
    goal: 'Complete 30 original logo designs',
    startAt: '2024-02-01T00:00:00Z',
    endAt: '2024-03-02T23:59:59Z',
    rules: 'One logo per day, must be original work, share progress daily in community',
    rewardCredits: 500,
    status: 'active',
    participants: 247,
    leaderboard: [
      { userId: 'user-1', points: 950, rank: 1 },
      { userId: 'user-4', points: 890, rank: 2 },
      { userId: 'user-5', points: 820, rank: 3 }
    ],
    category: 'Design',
    maxParticipants: 500
  },
  {
    id: 'challenge-2',
    title: 'Code for Good',
    description: 'Build applications that help local communities and nonprofits',
    goal: 'Deploy a working application for a nonprofit organization',
    startAt: '2024-01-15T00:00:00Z',
    endAt: '2024-03-15T23:59:59Z',
    rules: 'Must benefit a real organization, open source preferred, document your impact',
    rewardCredits: 1000,
    status: 'active',
    participants: 89,
    leaderboard: [
      { userId: 'user-2', points: 1200, rank: 1 },
      { userId: 'user-5', points: 1050, rank: 2 }
    ],
    category: 'Technology'
  }
];

// Organizations for donations
export const organizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Code for Africa',
    logoUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=100&h=100&fit=crop',
    type: 'NGO',
    verified: true,
    description: 'Empowering African societies through technology and data journalism',
    walletAddress: '0x1234...5678',
    website: 'codeforafrica.org',
    totalDonationsReceived: 15420
  },
  {
    id: 'org-2',
    name: 'Local Art Academy',
    logoUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop',
    type: 'School',
    verified: true,
    description: 'Supporting emerging artists with education and resources',
    totalDonationsReceived: 8930
  },
  {
    id: 'org-3',
    name: 'TechEd Foundation',
    logoUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop',
    type: 'NGO',
    verified: true,
    description: 'Bringing coding education to underserved communities worldwide',
    totalDonationsReceived: 22100
  }
];

// Mentor Tiers
export const mentorTiers: MentorTier[] = [
  {
    id: 'silver',
    name: 'Silver',
    creditsPerHour: 15,
    features: ['1:1 Sessions', 'Email Support', 'Basic Portfolio Review'],
    color: '#C0C0C0'
  },
  {
    id: 'gold',
    name: 'Gold', 
    creditsPerHour: 25,
    features: ['1:1 Sessions', 'Priority Support', 'Portfolio Review', 'Career Guidance'],
    color: '#FFD700'
  },
  {
    id: 'platinum',
    name: 'Platinum',
    creditsPerHour: 40,
    features: ['1:1 Sessions', '24/7 Support', 'Full Portfolio Review', 'Career Guidance', 'Industry Connections'],
    color: '#E5E4E2'
  }
];

// Classes
export const classes: Class[] = [
  {
    id: 'class-1',
    title: 'Complete Web Development Bootcamp',
    description: 'Learn full-stack web development from scratch with hands-on projects',
    teacherId: 'user-2',
    skillId: 'web-development',
    maxSeats: 20,
    currentSeats: 12,
    pricePerSeat: 150,
    schedule: [
      {
        date: '2024-02-05T00:00:00Z',
        startTime: '18:00',
        endTime: '20:00'
      },
      {
        date: '2024-02-07T00:00:00Z', 
        startTime: '18:00',
        endTime: '20:00'
      }
    ],
    syllabus: [
      'HTML & CSS Fundamentals',
      'JavaScript & ES6+',
      'React & Component Architecture',
      'Node.js & Express',
      'Database Design & MongoDB',
      'Deployment & DevOps'
    ],
    status: 'upcoming',
    createdAt: '2024-01-10T00:00:00Z',
    tags: ['beginner-friendly', 'project-based', 'career-focused'],
    difficulty: 2
  },
  {
    id: 'class-2',
    title: 'Brand Identity Masterclass',
    description: 'Design compelling brand identities that tell powerful stories',
    teacherId: 'user-1',
    skillId: 'logo-design',
    maxSeats: 15,
    currentSeats: 8,
    pricePerSeat: 120,
    schedule: [
      {
        date: '2024-02-10T00:00:00Z',
        startTime: '14:00',
        endTime: '16:00'
      }
    ],
    syllabus: [
      'Brand Strategy & Research',
      'Logo Design Principles',
      'Color Theory & Typography',
      'Brand Guidelines Creation'
    ],
    status: 'upcoming',
    createdAt: '2024-01-12T00:00:00Z',
    tags: ['design', 'branding', 'creative'],
    difficulty: 2
  }
];

// Skill Learning Paths
export const skillPaths: SkillPath[] = [
  {
    id: 'path-1',
    name: 'Frontend Developer Path',
    description: 'Complete journey from beginner to professional frontend developer',
    skills: [
      { skillId: 'web-development', order: 1, required: true },
      { skillId: 'logo-design', order: 2, required: false },
      { skillId: 'photography', order: 3, required: false }
    ],
    estimatedDuration: '3-4 months',
    difficulty: 2,
    category: 'Technology'
  },
  {
    id: 'path-2',
    name: 'Creative Professional Path',
    description: 'Build skills across visual design and creative fields',
    skills: [
      { skillId: 'logo-design', order: 1, required: true },
      { skillId: 'photography', order: 2, required: true },
      { skillId: 'web-development', order: 3, required: false }
    ],
    estimatedDuration: '2-3 months',
    difficulty: 2,
    category: 'Design'
  }
];

// Workspaces (for async sessions)
export const workspaces: Workspace[] = [
  {
    id: 'workspace-1',
    sessionId: 'session-1',
    artifacts: [
      {
        id: 'artifact-1',
        title: 'React Component Examples',
        url: '/files/react-examples.zip',
        type: 'code',
        uploadedBy: 'user-2',
        uploadedAt: '2024-01-18T16:30:00Z'
      }
    ],
    tasks: [
      {
        id: 'task-1',
        title: 'Create a reusable Button component',
        completed: true,
        assignedTo: 'user-1'
      },
      {
        id: 'task-2', 
        title: 'Implement state management with useReducer',
        completed: false,
        assignedTo: 'user-1'
      }
    ],
    comments: [
      {
        id: 'comment-1',
        userId: 'user-2',
        text: 'Great work on the Button component! The props interface is very clean.',
        createdAt: '2024-01-18T17:00:00Z'
      }
    ]
  }
];

// Export all data
export const mockData = {
  skills,
  users,
  currentUser,
  creditTransactions,
  sessions,
  reviews,
  challenges,
  organizations,
  mentorTiers,
  classes,
  skillPaths,
  workspaces
};

export default mockData;
