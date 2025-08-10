// Service stubs for SkillSwap APIs
// TODO: Replace with actual API calls when backend is ready

import type {
  MatchService,
  InstantService,
  BillingService,
  AIService,
  AdvancedSearchFilters,
  MatchResult,
  ExpertProfile,
  ExpertMatchRequest,
  InstantSession,
  AISkillGapAnalysis,
  MapDataPoint
} from '@/models/expert-types';
import type { User, Skill, ApiResponse } from '@/models/types';
import { users, skills } from '@/data/mockData';
import { expertProfiles } from '@/mock/enhanced-data';

// Match Service - Search and recommendations
export const matchService: MatchService = {
  async search(filters: AdvancedSearchFilters): Promise<MatchResult[]> {
    // TODO: Implement actual API call
    // Mock implementation for demo
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
    
    const mockResults: MatchResult[] = users
      .filter(user => {
        if (filters.query) {
          const query = filters.query.toLowerCase();
          return user.name.toLowerCase().includes(query) ||
                 user.skillsOffered.some(skill => {
                   const skillData = skills.find(s => s.id === skill.skillId);
                   return skillData?.name.toLowerCase().includes(query);
                 });
        }
        return true;
      })
      .slice(0, 10)
      .map(user => ({
        user,
        skill: skills[0], // Mock skill
        matchScore: Math.floor(Math.random() * 30) + 70, // 70-100
        reasons: ['skill complementarity', 'timezone match', 'high rating'],
        distance: user.location.city === 'San Francisco' ? undefined : Math.floor(Math.random() * 5000),
        nextAvailable: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }));

    return mockResults;
  },

  async getRecommendations(userId: string): Promise<MatchResult[]> {
    // TODO: Implement ML-based recommendations
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.search({});
  },

  async getMapData(bounds: { ne: [number, number]; sw: [number, number] }): Promise<MapDataPoint[]> {
    // TODO: Implement geospatial query with clustering
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
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
      }
    ];
  }
};

// ExpertMatch AI Service - Instant help functionality
export const instantService: InstantService = {
  async findAvailableExperts(skillId: string, urgency = 'medium'): Promise<ExpertProfile[]> {
    // TODO: Implement real-time expert availability query
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return expertProfiles
      .filter(expert => 
        expert.expertStatus.instantAvailable &&
        expert.expertise.some(exp => exp.skillId === skillId)
      )
      .sort((a, b) => a.expertStatus.responseTimeAvg - b.expertStatus.responseTimeAvg)
      .slice(0, 3);
  },

  async createRequest(requestData: Omit<ExpertMatchRequest, 'id' | 'createdAt' | 'status'>): Promise<ExpertMatchRequest> {
    // TODO: Create actual request in database
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      ...requestData,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
  },

  async startSession(expertId: string, requestId: string): Promise<InstantSession> {
    // TODO: Initialize video call and billing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const expert = expertProfiles.find(e => e.id === expertId);
    const rate = expert?.expertise[0]?.ratePerMinuteCents || 200;
    
    return {
      id: `instant-${Date.now()}`,
      requestId,
      expertId,
      clientId: 'current-user', // TODO: Get from auth
      skillId: 'web-development', // TODO: Get from request
      startedAt: new Date().toISOString(),
      ratePerMinuteCents: rate,
      status: 'connecting'
    };
  },

  async endSession(sessionId: string): Promise<InstantSession> {
    // TODO: End video call, calculate final cost
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 45 * 60 * 1000); // 45 minutes ago
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 60000);
    
    return {
      id: sessionId,
      requestId: 'req-123',
      expertId: 'user-1',
      clientId: 'current-user',
      skillId: 'web-development',
      startedAt: startTime.toISOString(),
      endedAt: endTime.toISOString(),
      durationMinutes: duration,
      ratePerMinuteCents: 200,
      totalCostCents: duration * 200,
      status: 'completed',
      recordingAvailable: true,
      aiSentimentScore: 0.85 + Math.random() * 0.15 // 0.85-1.0
    };
  }
};

// Billing Service - Payment processing
export const billingService: BillingService = {
  async startMeter(sessionId: string, ratePerMinuteCents: number): Promise<void> {
    // TODO: Initialize per-minute billing meter
    console.log(`🔄 Started billing meter for session ${sessionId} at $${ratePerMinuteCents/100}/minute`);
    await new Promise(resolve => setTimeout(resolve, 200));
  },

  async stopMeter(sessionId: string): Promise<{ totalCostCents: number; duration: number }> {
    // TODO: Stop meter and calculate final cost
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const duration = Math.floor(Math.random() * 60) + 15; // 15-75 minutes
    const totalCostCents = duration * 200; // $2.00/minute
    
    console.log(`⏹️ Stopped billing meter for session ${sessionId}: ${duration} minutes, $${totalCostCents/100}`);
    return { totalCostCents, duration };
  },

  async processPayment(amount: number, method: 'stripe' | 'paypal'): Promise<{ success: boolean; transactionId?: string }> {
    // TODO: Integrate with Stripe/PayPal APIs
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const success = Math.random() > 0.1; // 90% success rate for demo
    
    if (success) {
      return {
        success: true,
        transactionId: `${method}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } else {
      return { success: false };
    }
  },

  async convertCreditsToUSD(credits: number): Promise<number> {
    // TODO: Get current exchange rate
    await new Promise(resolve => setTimeout(resolve, 100));
    return credits * 0.10; // $0.10 per credit for demo
  }
};

// AI Service - Machine learning features
export const aiService: AIService = {
  async analyzeSkillGap(userId: string, data: any): Promise<AISkillGapAnalysis> {
    // TODO: Implement ML skill gap analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      id: `analysis-${Date.now()}`,
      userId,
      analyzedAt: new Date().toISOString(),
      source: 'manual',
      currentSkills: [
        { skillId: 'web-development', proficiencyLevel: 4, confidence: 0.9 },
        { skillId: 'logo-design', proficiencyLevel: 2, confidence: 0.7 }
      ],
      recommendedSkills: [
        {
          skillId: 'data-science',
          priority: 'high',
          reason: 'High market demand and complements your technical background',
          marketDemand: 92,
          relatedJobs: ['Data Engineer', 'ML Engineer', 'Product Analyst']
        }
      ],
      suggestedMentors: ['user-5'],
      suggestedClasses: ['class-1'],
      suggestedPaths: ['path-1']
    };
  },

  async generateMatchScore(user1: User, user2: User, skillId: string): Promise<number> {
    // TODO: Implement ML-based compatibility scoring
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock scoring based on ratings, location, timezone
    let score = 70;
    
    if (user2.ratingAvg > 4.5) score += 10;
    if (user1.timezone === user2.timezone) score += 15;
    if (user1.languages.some(lang => user2.languages.includes(lang))) score += 10;
    
    return Math.min(score + Math.random() * 10, 100);
  },

  async assessSentiment(sessionId: string, transcriptData: any): Promise<number> {
    // TODO: Implement NLP sentiment analysis
    await new Promise(resolve => setTimeout(resolve, 800));
    return 0.8 + Math.random() * 0.2; // 0.8-1.0 for demo
  },

  async suggestNextSteps(userId: string, completedSkillId: string): Promise<{
    skills: string[];
    classes: string[];
    mentors: string[];
  }> {
    // TODO: Implement recommendation engine
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      skills: ['data-science', 'photography'],
      classes: ['class-1'],
      mentors: ['user-1', 'user-5']
    };
  }
};

// Authentication service stub
export const authService = {
  async getCurrentUser(): Promise<User | null> {
    // TODO: Implement actual authentication
    return users[1]; // Return Marcus Chen as current user for demo
  },

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; token?: string }> {
    // TODO: Implement authentication with backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      user: users[1],
      token: 'mock_jwt_token'
    };
  },

  async logout(): Promise<void> {
    // TODO: Clear authentication state
    await new Promise(resolve => setTimeout(resolve, 200));
  }
};

// Session management service
export const sessionService = {
  async createSession(data: any): Promise<{ sessionId: string }> {
    // TODO: Create session in database
    await new Promise(resolve => setTimeout(resolve, 500));
    return { sessionId: `session-${Date.now()}` };
  },

  async joinSession(sessionId: string): Promise<{ roomUrl: string; token: string }> {
    // TODO: Initialize video call room (WebRTC/Agora/Zoom SDK)
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      roomUrl: `/session/${sessionId}`,
      token: 'mock_room_token'
    };
  },

  async endSession(sessionId: string, feedback: any): Promise<void> {
    // TODO: End session and process feedback
    await new Promise(resolve => setTimeout(resolve, 400));
  }
};

// Translation service stub
export const translationService = {
  async translateText(text: string, from: string, to: string): Promise<string> {
    // TODO: Integrate with Google Translate or similar
    await new Promise(resolve => setTimeout(resolve, 300));
    return `[Translated from ${from} to ${to}] ${text}`;
  },

  async enableRealTimeTranslation(sessionId: string, languages: { source: string; target: string }): Promise<void> {
    // TODO: Enable real-time translation for video call
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};

// Notification service
export const notificationService = {
  async sendNotification(userId: string, type: string, data: any): Promise<void> {
    // TODO: Send push/email notifications
    console.log(`📧 Notification sent to ${userId}: ${type}`, data);
    await new Promise(resolve => setTimeout(resolve, 100));
  },

  async getUnreadCount(userId: string): Promise<number> {
    // TODO: Get unread notification count
    return Math.floor(Math.random() * 10);
  }
};

// File upload service
export const uploadService = {
  async uploadFile(file: File, type: 'avatar' | 'portfolio' | 'artifact'): Promise<{ url: string }> {
    // TODO: Upload to cloud storage (AWS S3, Cloudinary, etc.)
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      url: `https://cdn.skillswap.com/${type}/${Date.now()}-${file.name}`
    };
  },

  async generatePreview(fileUrl: string): Promise<{ previewUrl: string }> {
    // TODO: Generate preview/thumbnail
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      previewUrl: fileUrl.replace(/\.[^/.]+$/, '-preview.jpg')
    };
  }
};

// Export all services
export const services = {
  match: matchService,
  instant: instantService,
  billing: billingService,
  ai: aiService,
  auth: authService,
  session: sessionService,
  translation: translationService,
  notification: notificationService,
  upload: uploadService
};

export default services;
