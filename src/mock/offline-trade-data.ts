import { OfflineTrade, TradeUser, TradeParticipants } from '@/models/offline-trade-types';

export const mockTradeUsers: TradeUser[] = [
  {
    id: 'u_1',
    name: 'Marcus Chen',
    email: 'marcus.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    balance: 325,
    reputation: 4.8,
    verifiedId: true
  },
  {
    id: 'u_2',
    name: 'Ava Ramirez',
    email: 'ava.ramirez@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b056a692?w=150&h=150&fit=crop&crop=face',
    balance: 240,
    reputation: 4.9,
    verifiedId: true
  },
  {
    id: 'u_3',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    balance: 180,
    reputation: 4.7,
    verifiedId: true
  },
  {
    id: 'u_4',
    name: 'Diego Martinez',
    email: 'diego.martinez@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    balance: 295,
    reputation: 4.9,
    verifiedId: true
  }
];

export const mockOfflineTrades: OfflineTrade[] = [
  {
    id: 't_001',
    status: 'awaiting-counterparty',
    initiatorId: 'u_1',
    counterpartyId: 'u_2',
    skill: 'Bike Repair',
    skillTags: ['Mechanical', 'DIY', 'Maintenance'],
    roles: { u_1: 'taught', u_2: 'learned' },
    startedAt: '2025-01-20T15:00:00Z',
    durationMins: 90,
    location: 'Brooklyn, NY',
    isInPerson: true,
    creditsProposed: 20,
    pricing: {
      basePerHour: 10,
      complexity: 1.3,
      demand: 1.1,
      durationMins: 90,
      totalCredits: 20
    },
    escrowEnabled: true,
    verification: {
      method: 'qr',
      qrToken: 'qr_tkn_abc123',
      expiresAt: '2025-01-21T15:00:00Z'
    },
    attachments: [
      {
        id: 'att_001',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
        type: 'image',
        caption: 'Before - Bike chain issue',
        timestamp: '2025-01-20T15:00:00Z'
      }
    ],
    notes: 'Taught how to fix a slipped chain and adjust brakes. Student was very engaged and picked up quickly.',
    audit: {
      createdBy: 'u_1',
      createdAt: '2025-01-20T15:30:00Z'
    }
  },
  {
    id: 't_002',
    status: 'confirmed',
    initiatorId: 'u_3',
    counterpartyId: 'u_1',
    skill: 'React Development',
    skillTags: ['JavaScript', 'Frontend', 'React', 'Hooks'],
    roles: { u_3: 'taught', u_1: 'learned' },
    startedAt: '2025-01-19T14:00:00Z',
    durationMins: 120,
    location: 'Manhattan Coffee Co.',
    isInPerson: true,
    creditsProposed: 25,
    creditsActual: 25,
    pricing: {
      basePerHour: 10,
      complexity: 1.6,
      demand: 1.2,
      durationMins: 120,
      totalCredits: 25
    },
    escrowEnabled: true,
    verification: {
      method: 'pin',
      pin: '493821',
      expiresAt: '2025-01-20T14:00:00Z'
    },
    attachments: [
      {
        id: 'att_002',
        url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
        type: 'image',
        caption: 'Code review session',
        timestamp: '2025-01-19T14:30:00Z'
      }
    ],
    notes: 'Excellent session on custom hooks and state management. Marcus grasped the concepts quickly.',
    audit: {
      createdBy: 'u_3',
      createdAt: '2025-01-19T16:30:00Z',
      updatedBy: 'u_1',
      updatedAt: '2025-01-19T18:00:00Z'
    }
  },
  {
    id: 't_003',
    status: 'needs-reconfirm',
    initiatorId: 'u_2',
    counterpartyId: 'u_4',
    skill: 'Spanish Conversation',
    skillTags: ['Language', 'Spanish', 'Conversation', 'Grammar'],
    roles: { u_2: 'learned', u_4: 'taught' },
    startedAt: '2025-01-20T10:00:00Z',
    durationMins: 60,
    location: 'Central Park',
    isInPerson: true,
    creditsProposed: 12,
    pricing: {
      basePerHour: 10,
      complexity: 1.0,
      demand: 1.1,
      durationMins: 60,
      totalCredits: 12
    },
    escrowEnabled: true,
    verification: {
      method: 'qr',
      qrToken: 'qr_tkn_def456',
      expiresAt: '2025-01-21T10:00:00Z'
    },
    attachments: [],
    notes: 'Conversational practice focusing on past tense conjugations.',
    counterOffers: [
      {
        id: 'co_001',
        proposedCredits: 15,
        reason: 'Session went longer than planned, covered more grammar topics',
        createdBy: 'u_4',
        createdAt: '2025-01-20T11:30:00Z',
        status: 'pending'
      }
    ],
    audit: {
      createdBy: 'u_2',
      createdAt: '2025-01-20T11:00:00Z'
    }
  },
  {
    id: 't_004',
    status: 'disputed',
    initiatorId: 'u_4',
    counterpartyId: 'u_3',
    skill: 'Guitar Basics',
    skillTags: ['Music', 'Guitar', 'Chords', 'Strumming'],
    roles: { u_4: 'taught', u_3: 'learned' },
    startedAt: '2025-01-18T16:00:00Z',
    durationMins: 90,
    location: 'Music Studio, Queens',
    isInPerson: true,
    creditsProposed: 18,
    pricing: {
      basePerHour: 10,
      complexity: 1.3,
      demand: 1.0,
      durationMins: 90,
      totalCredits: 18
    },
    escrowEnabled: true,
    verification: {
      method: 'pin',
      pin: '789123',
      expiresAt: '2025-01-19T16:00:00Z'
    },
    attachments: [
      {
        id: 'att_003',
        url: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=600&h=400&fit=crop',
        type: 'image',
        caption: 'Guitar lesson setup',
        timestamp: '2025-01-18T16:00:00Z'
      }
    ],
    notes: 'Basic chord progression lesson and strumming techniques.',
    disputeReason: 'wrong-credits',
    disputeEvidence: [
      {
        id: 'ev_001',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
        type: 'image',
        caption: 'Time log showing 45 minutes, not 90',
        timestamp: '2025-01-18T17:00:00Z'
      }
    ],
    audit: {
      createdBy: 'u_4',
      createdAt: '2025-01-18T17:30:00Z',
      adminNotes: 'Under review - conflicting duration reports'
    }
  },
  {
    id: 't_005',
    status: 'expired',
    initiatorId: 'u_1',
    counterpartyId: 'u_3',
    skill: 'Photography Basics',
    skillTags: ['Photography', 'Camera', 'Composition', 'Lighting'],
    roles: { u_1: 'learned', u_3: 'taught' },
    startedAt: '2025-01-17T13:00:00Z',
    durationMins: 120,
    location: 'Washington Square Park',
    isInPerson: true,
    creditsProposed: 24,
    pricing: {
      basePerHour: 10,
      complexity: 1.3,
      demand: 1.0,
      durationMins: 120,
      totalCredits: 24
    },
    escrowEnabled: false,
    verification: {
      method: 'qr',
      qrToken: 'qr_tkn_ghi789',
      expiresAt: '2025-01-18T13:00:00Z'
    },
    attachments: [],
    notes: 'Outdoor photography session covering composition and natural lighting.',
    audit: {
      createdBy: 'u_1',
      createdAt: '2025-01-17T15:30:00Z'
    }
  }
];

export const getUserById = (id: string): TradeUser | undefined => {
  return mockTradeUsers.find(user => user.id === id);
};

export const getTradeParticipants = (trade: OfflineTrade): TradeParticipants | null => {
  const initiator = getUserById(trade.initiatorId);
  const counterparty = getUserById(trade.counterpartyId);
  
  if (!initiator || !counterparty) {
    return null;
  }
  
  return { initiator, counterparty };
};

export const getTradesByUserId = (userId: string): OfflineTrade[] => {
  return mockOfflineTrades.filter(
    trade => trade.initiatorId === userId || trade.counterpartyId === userId
  );
};

export const getTradesByStatus = (status: string): OfflineTrade[] => {
  return mockOfflineTrades.filter(trade => trade.status === status);
};

export const getTradesAwaitingUser = (userId: string): OfflineTrade[] => {
  return mockOfflineTrades.filter(
    trade => trade.status === 'awaiting-counterparty' && trade.counterpartyId === userId
  );
};

export const getPendingTradesByUser = (userId: string): OfflineTrade[] => {
  return mockOfflineTrades.filter(
    trade => (trade.status === 'awaiting-counterparty' || trade.status === 'needs-reconfirm') && 
             (trade.initiatorId === userId || trade.counterpartyId === userId)
  );
};

// Mock skills data for autocomplete
export const mockSkills = [
  'React Development', 'JavaScript', 'Python', 'Web Design', 'UI/UX Design',
  'Bike Repair', 'Guitar Basics', 'Piano', 'Cooking', 'Photography',
  'Spanish Conversation', 'French', 'German', 'Chinese', 'Language Exchange',
  'Yoga', 'Meditation', 'Fitness Training', 'Rock Climbing', 'Swimming',
  'Marketing', 'Business Strategy', 'Project Management', 'Public Speaking',
  'Writing', 'Copywriting', 'Video Editing', 'Graphic Design', 'Illustration',
  'Woodworking', 'Gardening', 'Home Repair', 'Electrical Work', 'Plumbing'
];

// Generate a unique trade ID
export const generateTradeId = (): string => {
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;
};

// Generate a 6-digit PIN
export const generatePin = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate a QR token
export const generateQRToken = (): string => {
  return `qr_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 8)}`;
};
