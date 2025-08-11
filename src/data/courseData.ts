// Enhanced course data for the detail page with Builder.io specifications
export interface CourseDetailData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  thumbnail: string;
  ratingAvg: number;
  ratingCount: number;
  learners: number;
  level: string;
  duration: string;
  language: string;
  credits: number;
  outcomes: string[];
  description: string;
  curriculum: {
    id: string;
    title: string;
    duration: string;
    lessons: {
      id: string;
      title: string;
      duration: string;
      preview: boolean;
    }[];
  }[];
  cohort?: {
    nextStart: string;
  };
  isSelfPaced: boolean;
  prerequisites: string[];
  materials: string[];
  accessLength: string;
  certificate: boolean;
  instructor: {
    slug: string;
    name: string;
    avatar: string;
    title: string;
    location: string;
    languages: string[];
    ratingAvg: number;
    ratingCount: number;
    bio: string;
    website?: string;
    linkedin?: string;
    portfolio?: string;
  };
  reviews: {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    rating: number;
    date: string;
    text: string;
    helpful: number;
    images?: string[];
  }[];
}

// Sample course detail data
export const courseDetailData: CourseDetailData = {
  id: "c_88",
  slug: "brand-strategy-essentials",
  title: "Brand Strategy Essentials",
  subtitle: "Master the art of creating compelling brand strategies that resonate with your target audience and drive business growth",
  category: "Design",
  thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=675&fit=crop",
  ratingAvg: 4.8,
  ratingCount: 1260,
  learners: 18450,
  level: "Intermediate",
  duration: "5h 10m",
  language: "English",
  credits: 150,
  outcomes: [
    "Define brand positioning and value proposition",
    "Build messaging pillars and tone of voice",
    "Create a lightweight brand strategy deck",
    "Conduct competitive brand analysis",
    "Design customer journey maps",
    "Develop brand guidelines and visual systems"
  ],
  description: `
    <p>This comprehensive brand strategy course will transform you into a strategic thinking designer who understands how to build brands that truly connect with audiences.</p>
    
    <p>You'll learn the essential frameworks used by top agencies and in-house teams to create brand strategies that drive business results. Through hands-on exercises and real-world case studies, you'll master the art of brand positioning, messaging, and visual identity development.</p>
    
    <h3>What makes this course different?</h3>
    <ul>
      <li>Practical, hands-on approach with real client work</li>
      <li>Templates and frameworks you can use immediately</li>
      <li>Feedback from industry professionals</li>
      <li>Access to exclusive brand strategy tools</li>
    </ul>
    
    <p>Whether you're a designer looking to expand into strategy, a marketer wanting to understand brand fundamentals, or an entrepreneur building your own brand, this course provides the essential knowledge and practical skills you need to succeed.</p>
  `,
  curriculum: [
    {
      id: "m1",
      title: "Foundations of Brand Strategy",
      duration: "1h 40m",
      lessons: [
        { id: "l1", title: "What is a Brand?", duration: "12m", preview: true },
        { id: "l2", title: "Brand vs. Marketing: Understanding the Difference", duration: "15m", preview: false },
        { id: "l3", title: "The Business Impact of Strong Branding", duration: "18m", preview: false },
        { id: "l4", title: "Brand Strategy Framework Overview", duration: "20m", preview: true },
        { id: "l5", title: "Case Study: Successful Brand Transformations", duration: "35m", preview: false }
      ]
    },
    {
      id: "m2",
      title: "Brand Research & Analysis",
      duration: "1h 15m",
      lessons: [
        { id: "l6", title: "Understanding Your Audience", duration: "25m", preview: false },
        { id: "l7", title: "Competitive Landscape Analysis", duration: "20m", preview: false },
        { id: "l8", title: "Market Positioning Maps", duration: "18m", preview: false },
        { id: "l9", title: "Brand Audit Techniques", duration: "12m", preview: false }
      ]
    },
    {
      id: "m3",
      title: "Brand Positioning & Messaging",
      duration: "1h 30m",
      lessons: [
        { id: "l10", title: "Defining Your Brand Position", duration: "22m", preview: false },
        { id: "l11", title: "Crafting Your Value Proposition", duration: "20m", preview: false },
        { id: "l12", title: "Messaging Architecture", duration: "25m", preview: false },
        { id: "l13", title: "Tone of Voice Development", duration: "23m", preview: false }
      ]
    },
    {
      id: "m4",
      title: "Visual Identity & Guidelines",
      duration: "45m",
      lessons: [
        { id: "l14", title: "Logo Design Principles", duration: "18m", preview: false },
        { id: "l15", title: "Color Psychology in Branding", duration: "12m", preview: false },
        { id: "l16", title: "Typography for Brand Identity", duration: "15m", preview: false }
      ]
    }
  ],
  cohort: {
    nextStart: "2025-02-15"
  },
  isSelfPaced: true,
  prerequisites: [
    "Basic design software knowledge (Figma, Sketch, or similar)",
    "Understanding of marketing fundamentals",
    "Creative mindset and willingness to experiment"
  ],
  materials: [
    "Brand strategy templates and frameworks",
    "Case study examples and analysis",
    "Design assets and resources",
    "Brand audit checklist"
  ],
  accessLength: "Lifetime access",
  certificate: true,
  instructor: {
    slug: "marcus-chen",
    name: "Marcus Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face",
    title: "Brand Designer & Educator",
    location: "San Francisco, USA",
    languages: ["English", "Chinese"],
    ratingAvg: 4.8,
    ratingCount: 128,
    bio: "Brand designer and educator focused on practical, hands-on skill-building. With over 8 years of experience working with startups and Fortune 500 companies, I specialize in creating brand strategies that drive real business results. My approach combines strategic thinking with creative execution, helping students develop both the mindset and skills needed to succeed in brand design.",
    website: "marcuschen.design",
    linkedin: "marcus-chen-design",
    portfolio: "behance.net/marcuschen"
  },
  reviews: [
    {
      id: "r1",
      userId: "user-1",
      userName: "Sofia Rodriguez",
      userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      date: "2025-01-15",
      text: "Absolutely fantastic course! Marcus breaks down complex brand strategy concepts into digestible, actionable steps. The templates and frameworks are incredibly valuable for real client work. I've already implemented several techniques with great success.",
      helpful: 24,
      images: []
    },
    {
      id: "r2",
      userId: "user-3",
      userName: "Isabella Thompson",
      userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      date: "2025-01-10",
      text: "Great content and well-structured curriculum. The case studies were particularly helpful in understanding how to apply the concepts in real-world scenarios. Would have loved to see more advanced techniques, but perfect for intermediate level.",
      helpful: 12
    },
    {
      id: "r3",
      userId: "user-4",
      userName: "Kenji Nakamura",
      userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      date: "2025-01-05",
      text: "As someone coming from a business background, this course gave me the design perspective I was missing. Marcus explains everything clearly and the hands-on exercises really help cement the learning. Highly recommend!",
      helpful: 18
    },
    {
      id: "r4",
      userId: "user-5",
      userName: "Amara Okafor",
      userAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      date: "2024-12-28",
      text: "This course exceeded my expectations. The brand strategy framework is solid and the instructor provides excellent feedback. I feel confident applying these skills to client projects now.",
      helpful: 15
    }
  ]
};

// Additional sample courses for "You might also like" section
export const relatedCourses = [
  {
    id: "c_89",
    slug: "logo-design-mastery",
    title: "Logo Design Mastery",
    subtitle: "Create memorable and impactful logos that stand the test of time",
    thumbnail: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400&h=300&fit=crop",
    credits: 120,
    ratingAvg: 4.7,
    ratingCount: 892,
    instructor: "Sofia Rodriguez",
    category: "Design",
    duration: "4h 20m",
    level: "Beginner"
  },
  {
    id: "c_90",
    slug: "ux-design-fundamentals",
    title: "UX Design Fundamentals",
    subtitle: "Learn the principles of user experience design from industry experts",
    thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=300&fit=crop",
    credits: 180,
    ratingAvg: 4.9,
    ratingCount: 1456,
    instructor: "Alex Martinez",
    category: "Design",
    duration: "6h 45m",
    level: "Intermediate"
  },
  {
    id: "c_91",
    slug: "adobe-illustrator-advanced",
    title: "Adobe Illustrator Advanced",
    subtitle: "Master professional illustration techniques and vector graphics",
    thumbnail: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=400&h=300&fit=crop",
    credits: 140,
    ratingAvg: 4.6,
    ratingCount: 743,
    instructor: "Lisa Chen",
    category: "Design",
    duration: "5h 30m",
    level: "Advanced"
  },
  {
    id: "c_92",
    slug: "brand-identity-systems",
    title: "Brand Identity Systems",
    subtitle: "Build comprehensive brand systems that scale across all touchpoints",
    thumbnail: "https://images.unsplash.com/photo-1558655146-364adaf25e54?w=400&h=300&fit=crop",
    credits: 200,
    ratingAvg: 4.8,
    ratingCount: 567,
    instructor: "Marcus Chen",
    category: "Design",
    duration: "7h 15m",
    level: "Advanced"
  }
];
