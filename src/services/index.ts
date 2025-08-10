// Service layer for SkillSwap - Mock implementations with real API extension points

import type { 
  User, 
  Skill, 
  Session, 
  MatchResult, 
  SearchFilters, 
  Challenge, 
  Organization,
  CreditTransaction,
  BookingData,
  OnboardingData,
  ApiResponse,
  Class,
  Review,
  Workspace
} from '@/models/types';

import { 
  users, 
  skills, 
  sessions, 
  challenges, 
  organizations, 
  creditTransactions,
  classes,
  reviews,
  workspaces
} from '@/data/mockData';

// Simulate API delay
const apiDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Auth Service
export const authService = {
  async getCurrentUser(): Promise<User | null> {
    await apiDelay(300);
    // TODO: Replace with real auth API call
    return users[1]; // Marcus Chen as demo user
  },

  async signIn(email: string, password: string): Promise<User> {
    await apiDelay();
    // TODO: Replace with real auth API
    console.log('Sign in attempt:', { email });
    return users[1];
  },

  async signOut(): Promise<void> {
    await apiDelay(200);
    // TODO: Replace with real auth API
    console.log('User signed out');
  },

  async signUp(userData: Partial<User>): Promise<User> {
    await apiDelay();
    // TODO: Replace with real auth API
    console.log('Sign up attempt:', userData);
    return { ...users[1], ...userData } as User;
  }
};

// Match Service
export const matchService = {
  async searchMatches(filters: SearchFilters): Promise<ApiResponse<MatchResult[]>> {
    await apiDelay();
    
    // TODO: Replace with real AI matching API
    console.log('Searching matches with filters:', filters);
    
    let filteredUsers = [...users];
    
    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.bio.toLowerCase().includes(query) ||
        user.skillsOffered.some(skill => 
          skills.find(s => s.id === skill.skillId)?.name.toLowerCase().includes(query)
        )
      );
    }
    
    if (filters.category) {
      filteredUsers = filteredUsers.filter(user =>
        user.skillsOffered.some(skill =>
          skills.find(s => s.id === skill.skillId)?.category === filters.category
        )
      );
    }
    
    if (filters.minRating) {
      filteredUsers = filteredUsers.filter(user => user.ratingAvg >= filters.minRating!);
    }
    
    // Convert to MatchResult format
    const matches: MatchResult[] = filteredUsers.map(user => {
      const skill = skills.find(s => s.id === user.skillsOffered[0]?.skillId) || skills[0];
      return {
        user,
        skill,
        matchScore: Math.floor(Math.random() * 30) + 70, // 70-100%
        reasons: ['Skill complementarity', 'High rating', 'Available soon'],
        distance: Math.floor(Math.random() * 50) + 1,
        nextAvailable: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      };
    });
    
    return {
      data: matches,
      success: true,
      pagination: {
        page: 1,
        limit: 20,
        total: matches.length,
        hasMore: false
      }
    };
  },

  async getRecommendedMatches(userId: string): Promise<MatchResult[]> {
    await apiDelay();
    // TODO: Replace with real AI recommendation API
    console.log('Getting recommendations for user:', userId);
    
    const otherUsers = users.filter(u => u.id !== userId).slice(0, 3);
    return otherUsers.map(user => ({
      user,
      skill: skills.find(s => s.id === user.skillsOffered[0]?.skillId) || skills[0],
      matchScore: Math.floor(Math.random() * 20) + 80,
      reasons: ['Perfect skill match', 'Same timezone', 'Excellent reviews'],
      distance: Math.floor(Math.random() * 30) + 1,
      nextAvailable: new Date(Date.now() + Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString()
    }));
  }
};

// Session Service
export const sessionService = {
  async bookSession(bookingData: BookingData): Promise<Session> {
    await apiDelay();
    // TODO: Replace with real booking API
    console.log('Booking session:', bookingData);
    
    const newSession: Session = {
      id: `session-${Date.now()}`,
      type: bookingData.type,
      teacherId: bookingData.teacherId,
      learnerIds: [users[1].id], // Current user
      skillId: bookingData.skillId,
      status: 'booked',
      startsAt: bookingData.datetime,
      durationMins: bookingData.duration,
      location: bookingData.location,
      address: bookingData.address,
      notes: bookingData.notes,
      priceCredits: bookingData.totalCredits,
      createdAt: new Date().toISOString(),
      escrowEnabled: bookingData.escrowEnabled
    };
    
    return newSession;
  },

  async getUserSessions(userId: string): Promise<Session[]> {
    await apiDelay();
    // TODO: Replace with real API
    return sessions.filter(s => 
      s.teacherId === userId || s.learnerIds.includes(userId)
    );
  },

  async getUpcomingSessions(userId: string): Promise<Session[]> {
    await apiDelay();
    return sessions.filter(s => 
      (s.teacherId === userId || s.learnerIds.includes(userId)) &&
      s.status === 'booked' &&
      new Date(s.startsAt) > new Date()
    );
  },

  async completeSession(sessionId: string, review: Partial<Review>): Promise<void> {
    await apiDelay();
    // TODO: Replace with real API
    console.log('Completing session:', sessionId, review);
  },

  async cancelSession(sessionId: string, reason: string): Promise<void> {
    await apiDelay();
    // TODO: Replace with real API
    console.log('Canceling session:', sessionId, reason);
  }
};

// Wallet Service
export const walletService = {
  async getBalance(userId: string): Promise<number> {
    await apiDelay(200);
    // TODO: Replace with real API
    const user = users.find(u => u.id === userId);
    return user?.wallet.credits || 0;
  },

  async getTransactions(userId: string): Promise<CreditTransaction[]> {
    await apiDelay();
    // TODO: Replace with real API
    return creditTransactions.filter(tx => tx.userId === userId);
  },

  async donateCredits(userId: string, orgId: string, amount: number): Promise<CreditTransaction> {
    await apiDelay();
    // TODO: Replace with real API
    console.log('Donating credits:', { userId, orgId, amount });
    
    const transaction: CreditTransaction = {
      id: `tx-${Date.now()}`,
      userId,
      type: 'donation',
      amount: -amount,
      createdAt: new Date().toISOString(),
      description: `Donated to ${organizations.find(o => o.id === orgId)?.name || 'Organization'}`
    };
    
    return transaction;
  },

  async earnCredits(userId: string, amount: number, description: string): Promise<CreditTransaction> {
    await apiDelay();
    // TODO: Replace with real API
    const transaction: CreditTransaction = {
      id: `tx-${Date.now()}`,
      userId,
      type: 'earn',
      amount,
      createdAt: new Date().toISOString(),
      description
    };
    
    return transaction;
  }
};

// User Service
export const userService = {
  async getUser(userId: string): Promise<User | null> {
    await apiDelay();
    // TODO: Replace with real API
    return users.find(u => u.id === userId) || null;
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    await apiDelay();
    // TODO: Replace with real API
    console.log('Updating user:', userId, userData);
    const user = users.find(u => u.id === userId);
    return { ...user, ...userData } as User;
  },

  async completeOnboarding(userId: string, data: OnboardingData): Promise<User> {
    await apiDelay();
    // TODO: Replace with real API
    console.log('Completing onboarding:', userId, data);
    const user = users.find(u => u.id === userId);
    return { 
      ...user, 
      location: data.step1.location,
      languages: data.step1.languages,
      bio: data.step1.bio,
      skillsOffered: data.step2.skillsOffered,
      skillsWanted: data.step2.skillsWanted,
      availability: data.step3.availability
    } as User;
  },

  async uploadAvatar(userId: string, file: File): Promise<string> {
    await apiDelay();
    // TODO: Replace with real file upload API
    console.log('Uploading avatar:', userId, file.name);
    return `https://example.com/avatars/${userId}/${file.name}`;
  }
};

// Challenge Service
export const challengeService = {
  async getChallenges(): Promise<Challenge[]> {
    await apiDelay();
    // TODO: Replace with real API
    return challenges;
  },

  async joinChallenge(challengeId: string, userId: string): Promise<void> {
    await apiDelay();
    // TODO: Replace with real API
    console.log('Joining challenge:', challengeId, userId);
  },

  async getChallengeLeaderboard(challengeId: string): Promise<Challenge['leaderboard']> {
    await apiDelay();
    const challenge = challenges.find(c => c.id === challengeId);
    return challenge?.leaderboard || [];
  },

  async updateChallengeProgress(challengeId: string, userId: string, points: number): Promise<void> {
    await apiDelay();
    // TODO: Replace with real API
    console.log('Updating challenge progress:', { challengeId, userId, points });
  }
};

// Class Service
export const classService = {
  async getClasses(filters?: { skillId?: string; difficulty?: number }): Promise<Class[]> {
    await apiDelay();
    // TODO: Replace with real API
    let filteredClasses = [...classes];
    
    if (filters?.skillId) {
      filteredClasses = filteredClasses.filter(c => c.skillId === filters.skillId);
    }
    
    if (filters?.difficulty) {
      filteredClasses = filteredClasses.filter(c => c.difficulty === filters.difficulty);
    }
    
    return filteredClasses;
  },

  async enrollInClass(classId: string, userId: string): Promise<void> {
    await apiDelay();
    // TODO: Replace with real API
    console.log('Enrolling in class:', classId, userId);
  },

  async createClass(classData: Partial<Class>): Promise<Class> {
    await apiDelay();
    // TODO: Replace with real API
    console.log('Creating class:', classData);
    
    const newClass: Class = {
      id: `class-${Date.now()}`,
      title: classData.title || '',
      description: classData.description || '',
      teacherId: classData.teacherId || '',
      skillId: classData.skillId || '',
      maxSeats: classData.maxSeats || 10,
      currentSeats: 0,
      pricePerSeat: classData.pricePerSeat || 50,
      schedule: classData.schedule || [],
      syllabus: classData.syllabus || [],
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      tags: classData.tags || [],
      difficulty: classData.difficulty || 1
    };
    
    return newClass;
  }
};

// Organization Service
export const organizationService = {
  async getOrganizations(): Promise<Organization[]> {
    await apiDelay();
    // TODO: Replace with real API
    return organizations;
  },

  async getOrganization(orgId: string): Promise<Organization | null> {
    await apiDelay();
    return organizations.find(o => o.id === orgId) || null;
  }
};

// Skill Service
export const skillService = {
  async getSkills(): Promise<Skill[]> {
    await apiDelay(200);
    // TODO: Replace with real API
    return skills;
  },

  async getSkillsByCategory(category: string): Promise<Skill[]> {
    await apiDelay();
    return skills.filter(s => s.category === category);
  },

  async getSkillCategories(): Promise<string[]> {
    await apiDelay(200);
    return [...new Set(skills.map(s => s.category))];
  },

  async getSkill(skillId: string): Promise<Skill | null> {
    await apiDelay(200);
    return skills.find(s => s.id === skillId) || null;
  }
};

// Review Service
export const reviewService = {
  async getReviewsForUser(userId: string): Promise<Review[]> {
    await apiDelay();
    // TODO: Replace with real API
    return reviews.filter(r => r.revieweeId === userId);
  },

  async createReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    await apiDelay();
    // TODO: Replace with real API
    const review: Review = {
      ...reviewData,
      id: `review-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    console.log('Creating review:', review);
    return review;
  }
};

// Workspace Service (for async sessions)
export const workspaceService = {
  async getWorkspace(workspaceId: string): Promise<Workspace | null> {
    await apiDelay();
    // TODO: Replace with real API
    return workspaces.find(w => w.id === workspaceId) || null;
  },

  async uploadArtifact(workspaceId: string, file: File, userId: string): Promise<void> {
    await apiDelay();
    // TODO: Replace with real file upload API
    console.log('Uploading artifact:', workspaceId, file.name, userId);
  },

  async addComment(workspaceId: string, userId: string, text: string): Promise<void> {
    await apiDelay();
    // TODO: Replace with real API
    console.log('Adding comment:', workspaceId, userId, text);
  },

  async updateTaskStatus(workspaceId: string, taskId: string, completed: boolean): Promise<void> {
    await apiDelay();
    // TODO: Replace with real API
    console.log('Updating task status:', workspaceId, taskId, completed);
  }
};

// Admin Service
export const adminService = {
  async getModerationQueue(): Promise<any[]> {
    await apiDelay();
    // TODO: Replace with real API
    console.log('Getting moderation queue');
    return []; // Mock empty queue
  },

  async getAnalytics(): Promise<any> {
    await apiDelay();
    // TODO: Replace with real analytics API
    return {
      dailyActiveUsers: 1205,
      sessionsCompleted: 89,
      creditsTransacted: 15420,
      newSignups: 67
    };
  },

  async resolveDispute(disputeId: string, resolution: string): Promise<void> {
    await apiDelay();
    // TODO: Replace with real API
    console.log('Resolving dispute:', disputeId, resolution);
  }
};

// Export all services
export const services = {
  auth: authService,
  match: matchService,
  session: sessionService,
  wallet: walletService,
  user: userService,
  challenge: challengeService,
  class: classService,
  organization: organizationService,
  skill: skillService,
  review: reviewService,
  workspace: workspaceService,
  admin: adminService
};

export default services;
