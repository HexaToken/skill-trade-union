import type {
  ExpertProfile,
  Course,
  MentorshipRequest,
  ExpertMatchRequest,
  InstantSession,
  AISkillGapAnalysis,
  SkillBadge,
  ShareableProof,
  MapDataPoint,
  AdminModerationItem,
  PlatformAnalytics,
  EnterpriseOrganization
} from '@/models/expert-types';
import { skills, users, classes } from '@/data/mockData';

// Expert profiles with instant availability
export const expertProfiles: ExpertProfile[] = [
  {
    ...users[0], // Sofia Rodriguez
    expertStatus: {
      verified: true,
      instantAvailable: true,
      specializations: ['Logo Design', 'Brand Identity', 'UI/UX Design'],
      responseTimeAvg: 45, // seconds
      completedInstantSessions: 127,
      instantRating: 4.95,
      instantMinutesRemaining: 180 // Premium user
    },
    expertise: [
      {
        skillId: 'logo-design',
        ratePerMinuteCents: 150, // $1.50/minute
        maxSessionDuration: 120,
        certifications: ['Adobe Certified Expert', 'Brand Strategist Certificate'],
        yearsExperience: 8
      }
    ]
  },
  {
    ...users[1], // Marcus Chen
    expertStatus: {
      verified: true,
      instantAvailable: true,
      specializations: ['React', 'Node.js', 'Full-Stack Development'],
      responseTimeAvg: 30,
      completedInstantSessions: 89,
      instantRating: 4.88,
      instantMinutesRemaining: 240
    },
    expertise: [
      {
        skillId: 'web-development',
        ratePerMinuteCents: 200, // $2.00/minute
        maxSessionDuration: 180,
        certifications: ['AWS Certified', 'React Expert'],
        yearsExperience: 6
      }
    ]
  },
  {
    ...users[4], // Amara Okafor
    expertStatus: {
      verified: true,
      instantAvailable: false, // Currently offline
      specializations: ['Machine Learning', 'Python', 'Data Visualization'],
      responseTimeAvg: 120,
      completedInstantSessions: 45,
      instantRating: 4.92
    },
    expertise: [
      {
        skillId: 'data-science',
        ratePerMinuteCents: 250, // $2.50/minute
        maxSessionDuration: 240,
        certifications: ['Google Data Analytics', 'AWS ML Specialty'],
        yearsExperience: 7
      }
    ]
  }
];

// Enhanced courses with Udemy/Coursera style data
export const courses: Course[] = [
  {
    ...classes[0],
    subtitle: 'Become a full-stack developer with hands-on projects and real-world applications',
    thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    level: 2,
    language: 'English',
    ratingAvg: 4.7,
    ratingCount: 2341,
    lessons: [
      {
        id: 'lesson-1',
        title: 'Introduction to Web Development',
        durationMins: 45,
        previewable: true,
        videoUrl: 'https://example.com/preview1.mp4',
        materials: ['slides.pdf', 'cheatsheet.pdf'],
        order: 1
      },
      {
        id: 'lesson-2',
        title: 'HTML5 & CSS3 Fundamentals',
        durationMins: 90,
        previewable: false,
        materials: ['exercise-files.zip'],
        order: 2
      },
      {
        id: 'lesson-3',
        title: 'JavaScript ES6+ Features',
        durationMins: 120,
        previewable: true,
        videoUrl: 'https://example.com/preview3.mp4',
        order: 3
      }
    ],
    requirements: [
      'Basic computer literacy',
      'Willingness to learn and practice',
      'No prior programming experience needed'
    ],
    outcomes: [
      'Build responsive websites from scratch',
      'Create interactive web applications with React',
      'Deploy applications to cloud platforms',
      'Understand full-stack development principles'
    ],
    enrolled: 1247,
    badges: ['group', 'materials', 'recorded', 'certificate']
  },
  {
    ...classes[1],
    subtitle: 'Create memorable brand identities that resonate with your target audience',
    thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
    level: 2,
    language: 'English',
    ratingAvg: 4.9,
    ratingCount: 567,
    lessons: [
      {
        id: 'lesson-4',
        title: 'Brand Strategy Foundation',
        durationMins: 60,
        previewable: true,
        videoUrl: 'https://example.com/brand-preview.mp4',
        order: 1
      },
      {
        id: 'lesson-5',
        title: 'Logo Design Principles',
        durationMins: 75,
        previewable: false,
        materials: ['design-templates.ai'],
        order: 2
      }
    ],
    requirements: [
      'Basic design software knowledge (Figma, Illustrator, or similar)',
      'Creative mindset and willingness to experiment'
    ],
    outcomes: [
      'Design professional logos and brand marks',
      'Create comprehensive brand guidelines',
      'Understand color theory and typography',
      'Present brand concepts effectively'
    ],
    enrolled: 423,
    badges: ['materials', 'recorded', 'certificate']
  }
];

// ExpertMatch AI requests
export const expertMatchRequests: ExpertMatchRequest[] = [
  {
    id: 'request-1',
    userId: 'user-3',
    skillId: 'web-development',
    topic: 'React Hook debugging',
    urgency: 'high',
    description: 'Having trouble with useEffect infinite loops in my component. Need immediate help to fix production issue.',
    estimatedDuration: 30,
    maxRate: 300, // $3.00/minute max
    createdAt: '2024-01-20T15:45:00Z',
    status: 'matched'
  },
  {
    id: 'request-2',
    userId: 'user-2',
    skillId: 'logo-design',
    topic: 'Logo feedback and refinement',
    urgency: 'medium',
    description: 'Need quick feedback on logo concepts for client presentation tomorrow.',
    estimatedDuration: 45,
    createdAt: '2024-01-20T14:20:00Z',
    status: 'completed'
  }
];

// Instant sessions
export const instantSessions: InstantSession[] = [
  {
    id: 'instant-1',
    requestId: 'request-1',
    expertId: 'user-2',
    clientId: 'user-3',
    skillId: 'web-development',
    startedAt: '2024-01-20T15:50:00Z',
    endedAt: '2024-01-20T16:25:00Z',
    durationMinutes: 35,
    ratePerMinuteCents: 200,
    totalCostCents: 7000, // $70.00
    status: 'completed',
    recordingAvailable: true,
    recordingPurchased: false,
    aiSentimentScore: 0.92
  }
];

// Mentorship requests
export const mentorshipRequests: MentorshipRequest[] = [
  {
    id: 'mentor-req-1',
    mentorId: 'user-1',
    studentId: 'user-3',
    skillId: 'logo-design',
    type: 'short-term',
    duration: '6 weeks',
    goals: [
      'Build a strong portfolio of logo designs',
      'Learn industry-standard design processes',
      'Prepare for freelance design work'
    ],
    preferredSchedule: 'Weekly 1-hour sessions, flexible timing',
    budget: {
      creditsPerHour: 25,
      totalBudget: 150,
      flexible: true
    },
    status: 'pending',
    createdAt: '2024-01-18T10:00:00Z',
    message: 'Hi Sofia! I\'m really impressed by your work and would love to learn from you. I\'m looking to transition into design work and could use structured guidance.'
  }
];

// AI Skill Gap Analysis
export const skillGapAnalyses: AISkillGapAnalysis[] = [
  {
    id: 'analysis-1',
    userId: 'user-2',
    analyzedAt: '2024-01-15T12:00:00Z',
    source: 'linkedin',
    currentSkills: [
      { skillId: 'web-development', proficiencyLevel: 5, confidence: 0.95 },
      { skillId: 'guitar', proficiencyLevel: 3, confidence: 0.8 }
    ],
    recommendedSkills: [
      {
        skillId: 'data-science',
        priority: 'high',
        reason: 'Growing demand in your industry, complements your technical background',
        marketDemand: 92,
        relatedJobs: ['Full-Stack Data Engineer', 'Technical Product Manager', 'DevOps Engineer']
      },
      {
        skillId: 'logo-design',
        priority: 'medium',
        reason: 'Valuable for freelance opportunities and personal projects',
        marketDemand: 75,
        relatedJobs: ['Freelance Designer', 'UI/UX Developer', 'Creative Technologist']
      }
    ],
    suggestedMentors: ['user-5', 'user-1'],
    suggestedClasses: ['class-1'],
    suggestedPaths: ['path-1']
  }
];

// Skill badges
export const skillBadges: SkillBadge[] = [
  {
    id: 'badge-verified-designer',
    name: 'Verified Designer',
    description: 'Completed portfolio review and design fundamentals assessment',
    iconUrl: '🎨',
    skillId: 'logo-design',
    requirements: {
      certificationsEarned: ['design-fundamentals'],
      sessionsCompleted: 5,
      rating: 4.5
    },
    color: '#7C3AED',
    rarity: 'uncommon'
  },
  {
    id: 'badge-code-master',
    name: 'Code Master',
    description: 'Demonstrated exceptional programming skills and mentoring ability',
    iconUrl: '💻',
    skillId: 'web-development',
    requirements: {
      hoursTeaching: 50,
      rating: 4.8,
      sessionsCompleted: 25
    },
    color: '#06B6D4',
    rarity: 'rare'
  },
  {
    id: 'badge-quick-responder',
    name: 'Quick Responder',
    description: 'Consistently responds to instant help requests within 60 seconds',
    iconUrl: '⚡',
    skillId: 'web-development',
    requirements: {
      hoursTeaching: 10
    },
    color: '#F59E0B',
    rarity: 'common'
  }
];

// Shareable proofs
export const shareableProofs: ShareableProof[] = [
  {
    id: 'proof-1',
    userId: 'user-2',
    type: 'completion',
    skillId: 'web-development',
    classId: 'class-1',
    issuedAt: '2024-01-10T00:00:00Z',
    verificationCode: 'SS-WEB-2024-001',
    shareableUrl: 'https://skillswap.com/verify/SS-WEB-2024-001',
    printableUrl: 'https://skillswap.com/print/SS-WEB-2024-001',
    metadata: {
      title: 'Complete Web Development Bootcamp',
      description: 'Successfully completed 40-hour intensive web development course',
      issuer: 'SkillSwap Platform',
      credentialType: 'Course Completion Certificate'
    }
  }
];

// Map data points for global skill map
export const mapDataPoints: MapDataPoint[] = [
  {
    id: 'map-1',
    type: 'demand-hotspot',
    skillId: 'web-development',
    location: { lat: 37.7749, lng: -122.4194, city: 'San Francisco', country: 'USA' },
    metadata: { count: 245, intensity: 95 }
  },
  {
    id: 'map-2',
    type: 'mentor',
    skillId: 'logo-design',
    location: { lat: 41.3851, lng: 2.1734, city: 'Barcelona', country: 'Spain' },
    metadata: { userId: 'user-1' }
  },
  {
    id: 'map-3',
    type: 'demand-hotspot',
    skillId: 'data-science',
    location: { lat: 6.5244, lng: 3.3792, city: 'Lagos', country: 'Nigeria' },
    metadata: { count: 89, intensity: 70 }
  },
  {
    id: 'map-4',
    type: 'class',
    skillId: 'web-development',
    location: { lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK' },
    metadata: { classId: 'class-1' }
  }
];

// Admin moderation queue
export const moderationQueue: AdminModerationItem[] = [
  {
    id: 'mod-1',
    type: 'profile',
    reportedBy: 'user-3',
    targetId: 'user-fake',
    reason: 'Suspicious credentials',
    description: 'Profile claims unrealistic experience and certifications',
    status: 'pending',
    priority: 'high',
    createdAt: '2024-01-20T10:00:00Z',
    actions: {}
  },
  {
    id: 'mod-2',
    type: 'review',
    reportedBy: 'user-1',
    targetId: 'review-fake',
    reason: 'Fake review',
    description: 'Suspected bot-generated review with generic content',
    status: 'reviewing',
    priority: 'medium',
    createdAt: '2024-01-19T14:30:00Z',
    reviewedBy: 'admin-1',
    reviewedAt: '2024-01-20T09:15:00Z',
    actions: {
      contentRemoval: true
    }
  }
];

// Platform analytics
export const platformAnalytics: PlatformAnalytics = {
  period: 'month',
  metrics: {
    dailyActiveUsers: 2847,
    totalSessions: 15234,
    creditVelocity: 189640,
    userRetention: {
      '7day': 0.78,
      '30day': 0.56,
      '90day': 0.34
    },
    topSkills: [
      { skillId: 'web-development', sessionCount: 3421, growthRate: 0.23 },
      { skillId: 'data-science', sessionCount: 2876, growthRate: 0.31 },
      { skillId: 'logo-design', sessionCount: 2145, growthRate: 0.18 }
    ],
    revenueMetrics: {
      instantSessionRevenue: 45720, // $457.20
      platformFees: 12846, // $128.46
      conversionRate: 0.067
    },
    geographicDistribution: [
      { country: 'USA', userCount: 8945, sessionCount: 45231 },
      { country: 'UK', userCount: 3421, sessionCount: 18907 },
      { country: 'Germany', userCount: 2876, sessionCount: 14532 },
      { country: 'Spain', userCount: 2134, sessionCount: 11245 },
      { country: 'Nigeria', userCount: 1876, sessionCount: 9876 }
    ]
  }
};

// Enterprise organization
export const enterpriseOrgs: EnterpriseOrganization[] = [
  {
    id: 'enterprise-1',
    name: 'TechCorp Solutions',
    logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
    type: 'Company',
    verified: true,
    description: 'Leading technology consultancy with 500+ employees',
    website: 'techcorp.com',
    totalDonationsReceived: 0,
    enterpriseFeatures: {
      privateDirectory: true,
      internalChallenges: true,
      customBranding: true,
      analyticsAccess: true,
      prioritySupport: true
    },
    employees: [
      {
        userId: 'user-2',
        role: 'admin',
        department: 'Engineering',
        addedAt: '2024-01-01T00:00:00Z'
      },
      {
        userId: 'user-5',
        role: 'member',
        department: 'Data Science',
        addedAt: '2024-01-05T00:00:00Z'
      }
    ],
    usage: {
      totalSessions: 1247,
      creditsUsed: 18540,
      popularSkills: ['web-development', 'data-science', 'logo-design'],
      monthlyActiveUsers: 89
    }
  }
];

// Export all enhanced data
export const enhancedData = {
  expertProfiles,
  courses,
  expertMatchRequests,
  instantSessions,
  mentorshipRequests,
  skillGapAnalyses,
  skillBadges,
  shareableProofs,
  mapDataPoints,
  moderationQueue,
  platformAnalytics,
  enterpriseOrgs
};

export default enhancedData;
