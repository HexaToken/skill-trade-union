// Skill System Data Models
// Canonical skill definitions and related types

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type SkillStatus = 'active' | 'hidden' | 'deprecated';

export type SkillCategory = 
  | 'Design' 
  | 'Development' 
  | 'Language' 
  | 'Music' 
  | 'Business' 
  | 'DIY' 
  | 'Health/Fitness' 
  | 'Life Skills';

// Core Skill object (canonical, global)
export interface Skill {
  id: string;                          // e.g., "skill_webflow"
  name: string;                        // e.g., "Webflow"
  slug: string;                        // e.g., "webflow" (kebab-case, unique)
  category: SkillCategory;
  subcategories: string[];             // e.g., ["No-Code", "Web Design"]
  aliases: string[];                   // e.g., ["web flow", "webflow.io"]
  levelScale: SkillLevel[];            // Available proficiency levels
  icon?: string;                       // e.g., "icons/webflow.svg"
  verifiedTestId?: string;             // e.g., "test_webflow_v1"
  isFeatured: boolean;
  status: SkillStatus;
  createdAt: string;
  updatedAt: string;
  description?: string;                // Optional skill description
  trendingScore?: number;              // For trending calculations
}

// User's relationship with a skill
export interface UserSkill {
  userId: string;
  skillId: string;
  skill?: Skill;                       // Populated skill object
  level: SkillLevel;
  priceCreditsPerHour?: number;        // Optional pricing for mentoring
  verified: boolean;                   // Whether user passed verification test
  createdAt: string;
  updatedAt: string;
  yearsExperience?: number;            // Optional experience level
  portfolioItems?: string[];           // Optional portfolio links
}

// Course's relationship with skills
export interface CourseSkill {
  courseId: string;
  skillId: string;
  skill?: Skill;                       // Populated skill object
  isPrimary: boolean;                  // Whether this is the main skill taught
  difficultyLevel: SkillLevel;         // Level this course teaches
  createdAt: string;
}

// Skill suggestion from users
export interface SkillSuggestion {
  id: string;
  userId: string;
  name: string;
  category: SkillCategory;
  description: string;                 // Why this skill matters
  references?: string[];               // Optional supporting links
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

// Selected skill (for forms and pickers)
export interface SelectedSkill {
  skillId: string;
  skill?: Skill;                       // Populated skill object
  level: SkillLevel;
  priceCreditsPerHour?: number;        // Optional for mentor pricing
}

// API Request/Response Types

export interface SkillSearchParams {
  query?: string;
  category?: SkillCategory;
  status?: SkillStatus;
  isFeatured?: boolean;
  limit?: number;
  offset?: number;
  sort?: 'name' | 'trending' | 'recent' | 'popular';
}

export interface SkillSearchResponse {
  skills: Skill[];
  total: number;
  hasMore: boolean;
  nextOffset?: number;
}

export interface CreateSkillRequest {
  name: string;
  slug?: string;                       // Auto-generated if not provided
  category: SkillCategory;
  subcategories?: string[];
  aliases?: string[];
  icon?: string;
  description?: string;
  isFeatured?: boolean;
  verifiedTestId?: string;
}

export interface UpdateSkillRequest extends Partial<CreateSkillRequest> {
  id: string;
  status?: SkillStatus;
}

export interface BulkSkillImportRequest {
  skills: Array<{
    name: string;
    slug?: string;
    category: SkillCategory;
    aliases?: string[];
    icon?: string;
    isFeatured?: boolean;
    status?: SkillStatus;
  }>;
}

export interface CreateSkillSuggestionRequest {
  name: string;
  category: SkillCategory;
  description: string;
  references?: string[];
}

export interface SkillAnalytics {
  skillId: string;
  totalMentors: number;
  totalCourses: number;
  avgPriceCreditsPerHour: number;
  totalSessions: number;
  avgRating: number;
  trendingScore: number;
  lastWeekSessions: number;
  growthRate: number;
}

// Component Props Types

export interface SkillPickerProps {
  maxSkills?: number;                  // Default 10
  allowCreate?: boolean;               // Default false
  selectedSkills?: SelectedSkill[];
  onSkillsChange: (skills: SelectedSkill[]) => void;
  variant?: 'modal' | 'compact';       // Default 'modal'
  placeholder?: string;
  categories?: SkillCategory[];        // Filter to specific categories
  requireLevel?: boolean;              // Whether level selection is required
  requirePrice?: boolean;              // Whether price is required
  className?: string;
}

export interface SkillBadgeProps {
  skill: Skill;
  variant?: 'default' | 'featured' | 'verified' | 'new';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showCategory?: boolean;
  onClick?: (skill: Skill) => void;
  className?: string;
}

export interface SuggestSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (suggestion: CreateSkillSuggestionRequest) => void;
  suggestedName?: string;              // Pre-fill if user typed something
}

// Utility Types

export interface SkillWithStats extends Skill {
  analytics: SkillAnalytics;
}

export interface SkillSearchResult extends Skill {
  matchScore?: number;                 // Relevance score for search
  highlightedName?: string;            // Name with search terms highlighted
  reasonForMatch?: string;             // Why this skill matched (alias, category, etc.)
}

// Validation schemas
export const SKILL_VALIDATION = {
  name: {
    minLength: 2,
    maxLength: 60,
    pattern: /^[a-zA-Z0-9\s\+\-&\.]+$/,
  },
  slug: {
    pattern: /^[a-z0-9\-]+$/,
  },
  aliases: {
    maxCount: 10,
    maxLength: 40,
  },
  description: {
    maxLength: 500,
  },
} as const;

// Constants
export const SKILL_CATEGORIES: SkillCategory[] = [
  'Design',
  'Development',
  'Language',
  'Music',
  'Business',
  'DIY',
  'Health/Fitness',
  'Life Skills',
];

export const SKILL_LEVELS: SkillLevel[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
];

export const SKILL_STATUSES: SkillStatus[] = [
  'active',
  'hidden',
  'deprecated',
];

// Helper functions
export function isValidSkillName(name: string): boolean {
  return name.length >= SKILL_VALIDATION.name.minLength &&
         name.length <= SKILL_VALIDATION.name.maxLength &&
         SKILL_VALIDATION.name.pattern.test(name);
}

export function generateSkillSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function isValidSkillSlug(slug: string): boolean {
  return slug.length > 0 && SKILL_VALIDATION.slug.pattern.test(slug);
}

export function getSkillCategoryColor(category: SkillCategory): string {
  const colors: Record<SkillCategory, string> = {
    'Design': '#EF4444',          // red-500
    'Development': '#3B82F6',     // blue-500
    'Language': '#10B981',        // emerald-500
    'Music': '#F59E0B',           // amber-500
    'Business': '#8B5CF6',        // violet-500
    'DIY': '#F97316',             // orange-500
    'Health/Fitness': '#06B6D4',  // cyan-500
    'Life Skills': '#84CC16',     // lime-500
  };
  return colors[category];
}

export default {
  SKILL_CATEGORIES,
  SKILL_LEVELS,
  SKILL_STATUSES,
  SKILL_VALIDATION,
  isValidSkillName,
  generateSkillSlug,
  isValidSkillSlug,
  getSkillCategoryColor,
};
