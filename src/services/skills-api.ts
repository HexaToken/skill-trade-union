// Skills API Service
// Handles all skill-related API operations

import {
  type Skill,
  type SkillSuggestion,
  type SkillSearchParams,
  type SkillSearchResponse,
  type CreateSkillRequest,
  type UpdateSkillRequest,
  type BulkSkillImportRequest,
  type CreateSkillSuggestionRequest,
  type SkillAnalytics,
  type UserSkill,
  type SelectedSkill,
  SKILL_CATEGORIES,
  generateSkillSlug,
} from '@/models/skill-types';

const API_BASE = '/api/v1';

// Mock data for development
const mockSkills: Skill[] = [
  {
    id: 'skill_react',
    name: 'React',
    slug: 'react',
    category: 'Development',
    subcategories: ['Frontend', 'JavaScript'],
    aliases: ['react.js', 'reactjs', 'react js'],
    levelScale: ['Beginner', 'Intermediate', 'Advanced'],
    icon: '/icons/react.svg',
    verifiedTestId: 'test_react_v1',
    isFeatured: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    description: 'A JavaScript library for building user interfaces',
    trendingScore: 95,
  },
  {
    id: 'skill_webflow',
    name: 'Webflow',
    slug: 'webflow',
    category: 'Design',
    subcategories: ['No-Code', 'Web Design'],
    aliases: ['web flow', 'webflow.io'],
    levelScale: ['Beginner', 'Intermediate', 'Advanced'],
    icon: '/icons/webflow.svg',
    verifiedTestId: 'test_webflow_v1',
    isFeatured: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    description: 'Visual web design tool for creating responsive websites without code',
    trendingScore: 88,
  },
  {
    id: 'skill_figma',
    name: 'Figma',
    slug: 'figma',
    category: 'Design',
    subcategories: ['UI/UX', 'Prototyping'],
    aliases: ['figma design', 'fig ma'],
    levelScale: ['Beginner', 'Intermediate', 'Advanced'],
    icon: '/icons/figma.svg',
    isFeatured: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    description: 'Collaborative interface design tool',
    trendingScore: 92,
  },
  {
    id: 'skill_spanish',
    name: 'Spanish',
    slug: 'spanish',
    category: 'Language',
    subcategories: ['Conversational', 'Business'],
    aliases: ['español', 'castilian', 'castellano'],
    levelScale: ['Beginner', 'Intermediate', 'Advanced'],
    icon: '/icons/spanish.svg',
    isFeatured: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    description: 'Spanish language learning and conversation',
    trendingScore: 85,
  },
  {
    id: 'skill_node',
    name: 'Node.js',
    slug: 'nodejs',
    category: 'Development',
    subcategories: ['Backend', 'JavaScript'],
    aliases: ['node', 'nodejs', 'node js'],
    levelScale: ['Beginner', 'Intermediate', 'Advanced'],
    icon: '/icons/nodejs.svg',
    isFeatured: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    description: 'JavaScript runtime for building server-side applications',
    trendingScore: 78,
  },
  {
    id: 'skill_yoga',
    name: 'Yoga',
    slug: 'yoga',
    category: 'Health/Fitness',
    subcategories: ['Wellness', 'Mindfulness'],
    aliases: ['hatha yoga', 'vinyasa'],
    levelScale: ['Beginner', 'Intermediate', 'Advanced'],
    icon: '/icons/yoga.svg',
    isFeatured: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    description: 'Physical, mental and spiritual practice',
    trendingScore: 72,
  },
];

const mockSuggestions: SkillSuggestion[] = [
  {
    id: 'suggestion_1',
    userId: 'user_123',
    name: 'Svelte',
    category: 'Development',
    description: 'A modern frontend framework that compiles to vanilla JavaScript',
    references: ['https://svelte.dev', 'https://kit.svelte.dev'],
    status: 'pending',
    createdAt: '2024-01-15T10:00:00Z',
  },
];

// Utility functions
function normalizeQuery(query: string): string {
  return query.toLowerCase().trim();
}

function searchSkills(skills: Skill[], searchParams: SkillSearchParams): Skill[] {
  let filtered = skills;

  // Filter by status
  if (searchParams.status) {
    filtered = filtered.filter(skill => skill.status === searchParams.status);
  }

  // Filter by category
  if (searchParams.category) {
    filtered = filtered.filter(skill => skill.category === searchParams.category);
  }

  // Filter by featured
  if (searchParams.isFeatured !== undefined) {
    filtered = filtered.filter(skill => skill.isFeatured === searchParams.isFeatured);
  }

  // Text search across name and aliases
  if (searchParams.query) {
    const query = normalizeQuery(searchParams.query);
    filtered = filtered.filter(skill => {
      const nameMatch = skill.name.toLowerCase().includes(query);
      const aliasMatch = skill.aliases.some(alias => 
        alias.toLowerCase().includes(query)
      );
      const categoryMatch = skill.category.toLowerCase().includes(query);
      const subcategoryMatch = skill.subcategories.some(sub =>
        sub.toLowerCase().includes(query)
      );
      
      return nameMatch || aliasMatch || categoryMatch || subcategoryMatch;
    });
  }

  // Sort results
  const sortBy = searchParams.sort || 'name';
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return (b.trendingScore || 0) - (a.trendingScore || 0);
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        return (b.trendingScore || 0) - (a.trendingScore || 0); // Use trending as proxy
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return filtered;
}

// API functions
export const skillsApi = {
  // Get skills with search and filtering
  async searchSkills(params: SkillSearchParams = {}): Promise<SkillSearchResponse> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const filtered = searchSkills(mockSkills, params);
    const limit = params.limit || 20;
    const offset = params.offset || 0;
    
    const paginated = filtered.slice(offset, offset + limit);
    
    return {
      skills: paginated,
      total: filtered.length,
      hasMore: offset + limit < filtered.length,
      nextOffset: offset + limit < filtered.length ? offset + limit : undefined,
    };
  },

  // Get single skill by ID
  async getSkill(id: string): Promise<Skill | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockSkills.find(skill => skill.id === id) || null;
  },

  // Get skill by slug
  async getSkillBySlug(slug: string): Promise<Skill | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockSkills.find(skill => skill.slug === slug) || null;
  },

  // Create new skill (admin only)
  async createSkill(request: CreateSkillRequest): Promise<Skill> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const skill: Skill = {
      id: `skill_${Date.now()}`,
      slug: request.slug || generateSkillSlug(request.name),
      subcategories: request.subcategories || [],
      aliases: request.aliases || [],
      levelScale: ['Beginner', 'Intermediate', 'Advanced'],
      icon: request.icon,
      verifiedTestId: request.verifiedTestId,
      isFeatured: request.isFeatured || false,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: request.description,
      trendingScore: 0,
      ...request,
    };
    
    mockSkills.push(skill);
    return skill;
  },

  // Update skill (admin only)
  async updateSkill(request: UpdateSkillRequest): Promise<Skill> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = mockSkills.findIndex(skill => skill.id === request.id);
    if (index === -1) {
      throw new Error('Skill not found');
    }
    
    const updated = {
      ...mockSkills[index],
      ...request,
      updatedAt: new Date().toISOString(),
    };
    
    mockSkills[index] = updated;
    return updated;
  },

  // Bulk import skills (admin only)
  async bulkImportSkills(request: BulkSkillImportRequest): Promise<{ created: number; errors: string[] }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let created = 0;
    const errors: string[] = [];
    
    for (const skillData of request.skills) {
      try {
        await this.createSkill(skillData);
        created++;
      } catch (error) {
        errors.push(`Failed to create ${skillData.name}: ${error}`);
      }
    }
    
    return { created, errors };
  },

  // Suggest new skill
  async suggestSkill(request: CreateSkillSuggestionRequest): Promise<SkillSuggestion> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const suggestion: SkillSuggestion = {
      id: `suggestion_${Date.now()}`,
      userId: 'current_user', // TODO: Get from auth
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...request,
    };
    
    mockSuggestions.push(suggestion);
    return suggestion;
  },

  // Get skill suggestions (admin only)
  async getSkillSuggestions(status?: 'pending' | 'approved' | 'rejected'): Promise<SkillSuggestion[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (status) {
      return mockSuggestions.filter(s => s.status === status);
    }
    return mockSuggestions;
  },

  // Approve/reject skill suggestion (admin only)
  async reviewSkillSuggestion(
    suggestionId: string, 
    action: 'approve' | 'reject',
    reason?: string
  ): Promise<SkillSuggestion> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = mockSuggestions.findIndex(s => s.id === suggestionId);
    if (index === -1) {
      throw new Error('Suggestion not found');
    }
    
    const updated = {
      ...mockSuggestions[index],
      status: action === 'approve' ? 'approved' : 'rejected' as const,
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'current_admin', // TODO: Get from auth
      rejectionReason: action === 'reject' ? reason : undefined,
    };
    
    mockSuggestions[index] = updated;
    
    // If approved, create the actual skill
    if (action === 'approve') {
      await this.createSkill({
        name: updated.name,
        category: updated.category,
        description: updated.description,
      });
    }
    
    return updated;
  },

  // Get skill analytics
  async getSkillAnalytics(skillId: string): Promise<SkillAnalytics> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock analytics data
    return {
      skillId,
      totalMentors: Math.floor(Math.random() * 100) + 5,
      totalCourses: Math.floor(Math.random() * 20) + 1,
      avgPriceCreditsPerHour: Math.floor(Math.random() * 50) + 15,
      totalSessions: Math.floor(Math.random() * 500) + 50,
      avgRating: 4.2 + Math.random() * 0.7,
      trendingScore: Math.floor(Math.random() * 100),
      lastWeekSessions: Math.floor(Math.random() * 50) + 5,
      growthRate: Math.random() * 0.4 - 0.1, // -10% to +30%
    };
  },

  // Get categories
  async getCategories(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return SKILL_CATEGORIES;
  },

  // Get trending skills
  async getTrendingSkills(limit = 10): Promise<Skill[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockSkills
      .filter(skill => skill.status === 'active')
      .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
      .slice(0, limit);
  },

  // Get featured skills
  async getFeaturedSkills(limit = 6): Promise<Skill[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockSkills
      .filter(skill => skill.status === 'active' && skill.isFeatured)
      .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
      .slice(0, limit);
  },

  // Global search that includes skills
  async globalSearch(query: string): Promise<{
    skills: Skill[];
    hasMore: boolean;
  }> {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const response = await this.searchSkills({ query, limit: 5 });
    
    return {
      skills: response.skills,
      hasMore: response.hasMore,
    };
  },
};

// User skills API (for managing user's skill relationships)
export const userSkillsApi = {
  // Get user's skills
  async getUserSkills(userId: string): Promise<UserSkill[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock user skills
    return [
      {
        userId,
        skillId: 'skill_react',
        skill: mockSkills[0],
        level: 'Advanced',
        priceCreditsPerHour: 25,
        verified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        yearsExperience: 5,
      },
      {
        userId,
        skillId: 'skill_figma',
        skill: mockSkills[2],
        level: 'Intermediate',
        priceCreditsPerHour: 20,
        verified: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        yearsExperience: 2,
      },
    ];
  },

  // Add skills to user
  async addUserSkills(userId: string, skills: SelectedSkill[]): Promise<UserSkill[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Mock response
    return skills.map(skill => ({
      userId,
      skillId: skill.skillId,
      skill: skill.skill,
      level: skill.level,
      priceCreditsPerHour: skill.priceCreditsPerHour,
      verified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  },

  // Update user skill
  async updateUserSkill(
    userId: string, 
    skillId: string, 
    updates: Partial<Pick<UserSkill, 'level' | 'priceCreditsPerHour' | 'yearsExperience'>>
  ): Promise<UserSkill> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock response
    const skill = mockSkills.find(s => s.id === skillId);
    return {
      userId,
      skillId,
      skill,
      level: 'Intermediate',
      priceCreditsPerHour: 20,
      verified: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
      ...updates,
    };
  },

  // Remove user skill
  async removeUserSkill(userId: string, skillId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Mock deletion
  },
};

export default skillsApi;
