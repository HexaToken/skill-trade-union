import type { 
  Class, 
  User, 
  Skill, 
  SkillPath, 
  Mentor, 
  MentorTier,
  CourseSection,
  Lesson,
  Challenge,
  Organization,
  Review
} from '@/models/course-types';

// Enhanced Skills for academic context
export const skills: Skill[] = [
  {
    id: 'web-development',
    name: 'Web Development',
    category: 'Technology',
    difficulty: 2,
    demandScore: 95,
    description: 'Build modern, responsive websites and web applications using the latest technologies',
    icon: '💻',
    baseRateCredits: 25,
    relatedSkills: ['javascript', 'react', 'css'],
    prerequisites: ['html-basics']
  },
  {
    id: 'data-science',
    name: 'Data Science',
    category: 'Technology',
    difficulty: 3,
    demandScore: 92,
    description: 'Analyze data, build machine learning models, and extract insights from complex datasets',
    icon: '📊',
    baseRateCredits: 30,
    relatedSkills: ['python', 'statistics', 'machine-learning']
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    category: 'Design',
    difficulty: 2,
    demandScore: 85,
    description: 'Create visual content, brand identities, and digital graphics',
    icon: '🎨',
    baseRateCredits: 20,
    relatedSkills: ['adobe-suite', 'typography', 'branding']
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    category: 'Business',
    difficulty: 2,
    demandScore: 88,
    description: 'Develop and execute marketing strategies across digital channels',
    icon: '📈',
    baseRateCredits: 22,
    relatedSkills: ['seo', 'social-media', 'content-marketing']
  },
  {
    id: 'spanish',
    name: 'Spanish Language',
    category: 'Languages',
    difficulty: 1,
    demandScore: 78,
    description: 'Learn conversational and business Spanish from beginner to advanced levels',
    icon: '🇪🇸',
    baseRateCredits: 15,
    relatedSkills: ['conversation', 'grammar', 'business-spanish']
  },
  {
    id: 'photography',
    name: 'Photography',
    category: 'Creative',
    difficulty: 2,
    demandScore: 72,
    description: 'Master composition, lighting, and post-processing techniques',
    icon: '📸',
    baseRateCredits: 18,
    relatedSkills: ['lightroom', 'composition', 'portrait']
  },
  {
    id: 'project-management',
    name: 'Project Management',
    category: 'Business',
    difficulty: 2,
    demandScore: 83,
    description: 'Lead teams and deliver projects on time and within budget',
    icon: '📋',
    baseRateCredits: 24,
    relatedSkills: ['agile', 'scrum', 'leadership']
  },
  {
    id: 'music-production',
    name: 'Music Production',
    category: 'Creative',
    difficulty: 3,
    demandScore: 68,
    description: 'Create, record, and produce professional music tracks',
    icon: '🎵',
    baseRateCredits: 20,
    relatedSkills: ['ableton', 'mixing', 'mastering']
  }
];

// Enhanced Users with instructor/mentor capabilities
export const users: User[] = [
  {
    id: 'user-1',
    name: 'Dr. Sarah Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    location: { city: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194 },
    languages: ['English', 'Mandarin'],
    bio: 'Former Google engineer with 8+ years of experience teaching web development. I believe in hands-on learning and real-world projects.',
    headline: 'Senior Software Engineer & Web Development Instructor',
    skillsOffered: [
      { skillId: 'web-development', level: 5 },
      { skillId: 'data-science', level: 4 }
    ],
    skillsWanted: [
      { skillId: 'graphic-design', priority: 'medium' }
    ],
    portfolio: [
      {
        title: 'E-commerce Platform',
        mediaUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
        description: 'Full-stack e-commerce platform built with React and Node.js',
        type: 'image'
      },
      {
        title: 'Machine Learning Course',
        mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        description: 'Comprehensive ML course with 50+ students',
        type: 'video'
      }
    ],
    badges: ['top-instructor', 'verified-expert', 'course-creator'],
    verification: { idVerified: true, testsPassed: ['react-expert', 'javascript-advanced'] },
    ratingAvg: 4.9,
    ratingCount: 247,
    availability: [
      { dayOfWeek: 1, slots: ['09:00', '14:00', '16:00'] },
      { dayOfWeek: 3, slots: ['10:00', '15:00'] },
      { dayOfWeek: 5, slots: ['09:00', '11:00', '14:00'] }
    ],
    wallet: { credits: 1250, txHistory: [] },
    socials: {
      twitter: '@sarahcodes',
      linkedin: 'sarah-chen-dev',
      github: 'sarahdev',
      website: 'sarahchen.dev'
    },
    joinedAt: '2023-01-15T00:00:00Z',
    lastActive: '2024-01-20T14:30:00Z',
    timezone: 'America/Los_Angeles',
    yearsExperience: 8,
    totalStudents: 1200,
    totalClasses: 15,
    specializations: ['React', 'Node.js', 'Machine Learning'],
    teachingStyle: 'Hands-on project-based learning with real-world applications',
    certifications: ['AWS Certified', 'Google Cloud Professional']
  },
  {
    id: 'user-2',
    name: 'Marcus Rodriguez',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    location: { city: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734 },
    languages: ['Spanish', 'English', 'French'],
    bio: 'Creative director with 10+ years in brand design and digital marketing. Passionate about helping others build stunning visual identities.',
    headline: 'Creative Director & Brand Design Expert',
    skillsOffered: [
      { skillId: 'graphic-design', level: 5 },
      { skillId: 'digital-marketing', level: 4 }
    ],
    skillsWanted: [
      { skillId: 'web-development', priority: 'high' },
      { skillId: 'photography', priority: 'medium' }
    ],
    portfolio: [
      {
        title: 'Brand Identity Collection',
        mediaUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop',
        description: 'Complete brand identities for tech startups',
        type: 'image'
      }
    ],
    badges: ['design-master', 'brand-expert', 'top-mentor'],
    verification: { idVerified: true, testsPassed: ['adobe-certified', 'design-fundamentals'] },
    ratingAvg: 4.8,
    ratingCount: 189,
    availability: [
      { dayOfWeek: 2, slots: ['14:00', '16:00', '18:00'] },
      { dayOfWeek: 4, slots: ['15:00', '17:00'] },
      { dayOfWeek: 6, slots: ['10:00', '12:00'] }
    ],
    wallet: { credits: 890, txHistory: [] },
    socials: {
      twitter: '@marcusdesigns',
      linkedin: 'marcus-rodriguez-design',
      website: 'marcusdesigns.co'
    },
    joinedAt: '2023-03-20T00:00:00Z',
    lastActive: '2024-01-20T16:45:00Z',
    timezone: 'Europe/Madrid',
    yearsExperience: 10,
    totalStudents: 850,
    totalClasses: 12,
    specializations: ['Brand Design', 'Adobe Creative Suite', 'Digital Marketing'],
    teachingStyle: 'Visual storytelling with emphasis on practical design principles'
  },
  {
    id: 'user-3',
    name: 'Dr. Elena Vasquez',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    location: { city: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332 },
    languages: ['Spanish', 'English', 'Portuguese'],
    bio: 'Linguistics professor and certified language instructor. Specialized in business Spanish and cultural communication.',
    headline: 'Linguistics Professor & Spanish Language Expert',
    skillsOffered: [
      { skillId: 'spanish', level: 5 }
    ],
    skillsWanted: [
      { skillId: 'digital-marketing', priority: 'medium' }
    ],
    portfolio: [
      {
        title: 'Business Spanish Curriculum',
        mediaUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
        description: 'Comprehensive business Spanish course for professionals',
        type: 'document'
      }
    ],
    badges: ['language-expert', 'certified-instructor', 'cultural-ambassador'],
    verification: { idVerified: true, testsPassed: ['spanish-certified', 'teaching-credential'] },
    ratingAvg: 4.95,
    ratingCount: 156,
    availability: [
      { dayOfWeek: 1, slots: ['08:00', '10:00', '16:00'] },
      { dayOfWeek: 3, slots: ['09:00', '11:00', '17:00'] },
      { dayOfWeek: 5, slots: ['08:00', '14:00'] }
    ],
    wallet: { credits: 740, txHistory: [] },
    socials: {
      linkedin: 'elena-vasquez-linguistics',
      website: 'elenaspanish.com'
    },
    joinedAt: '2023-02-10T00:00:00Z',
    lastActive: '2024-01-20T12:20:00Z',
    timezone: 'America/Mexico_City',
    yearsExperience: 12,
    totalStudents: 2100,
    totalClasses: 25,
    specializations: ['Business Spanish', 'Grammar', 'Cultural Communication'],
    teachingStyle: 'Immersive conversation practice with cultural context'
  }
];

// Course Lessons and Sections
const webDevLessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'HTML Fundamentals',
    description: 'Learn the building blocks of web pages',
    durationMins: 45,
    previewable: true,
    videoUrl: 'https://example.com/video1',
    materials: ['slides.pdf', 'exercises.zip'],
    order: 1
  },
  {
    id: 'lesson-2',
    title: 'CSS Styling Basics',
    description: 'Style your HTML with CSS',
    durationMins: 60,
    previewable: false,
    order: 2
  },
  {
    id: 'lesson-3',
    title: 'JavaScript Introduction',
    description: 'Add interactivity to your websites',
    durationMins: 75,
    previewable: true,
    order: 3
  }
];

const webDevSections: CourseSection[] = [
  {
    id: 'section-1',
    title: 'Frontend Foundations',
    description: 'Master the core technologies of web development',
    lessons: webDevLessons,
    order: 1
  },
  {
    id: 'section-2',
    title: 'Interactive Development',
    description: 'Build dynamic and interactive web applications',
    lessons: [
      {
        id: 'lesson-4',
        title: 'DOM Manipulation',
        durationMins: 90,
        previewable: false,
        order: 1
      },
      {
        id: 'lesson-5',
        title: 'Event Handling',
        durationMins: 60,
        previewable: false,
        order: 2
      }
    ],
    order: 2
  }
];

// Classes with full curriculum structure
export const classes: Class[] = [
  {
    id: 'class-1',
    title: 'Complete Web Development Bootcamp',
    subtitle: 'From Zero to Full-Stack Developer',
    description: 'Master web development from scratch with hands-on projects. Build real-world applications using HTML, CSS, JavaScript, React, and Node.js.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400&h=225&fit=crop',
    instructorId: 'user-1',
    skillId: 'web-development',
    level: 'Beginner',
    durationMins: 1800, // 30 hours
    language: 'English',
    ratingAvg: 4.8,
    ratingCount: 234,
    studentsCount: 1250,
    
    sections: webDevSections,
    requirements: [
      'No prior programming experience required',
      'Computer with internet connection',
      'Willingness to learn and practice'
    ],
    outcomes: [
      'Build responsive websites from scratch',
      'Create interactive web applications',
      'Understand modern JavaScript frameworks',
      'Deploy applications to the web',
      'Work with APIs and databases'
    ],
    
    type: 'recorded',
    maxSeats: 50,
    currentSeats: 42,
    schedule: {
      startDate: '2024-02-01T00:00:00Z',
      endDate: '2024-03-15T00:00:00Z',
      sessions: [
        {
          date: '2024-02-01T00:00:00Z',
          startTime: '18:00',
          endTime: '20:00'
        },
        {
          date: '2024-02-03T00:00:00Z',
          startTime: '18:00',
          endTime: '20:00'
        }
      ]
    },
    
    priceCredits: 150,
    status: 'active',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    tags: ['beginner-friendly', 'project-based', 'career-focused', 'full-stack'],
    category: 'Technology',
    
    materials: [
      {
        id: 'mat-1',
        title: 'Course Slides (PDF)',
        type: 'pdf',
        url: '/materials/slides.pdf',
        downloadable: true
      },
      {
        id: 'mat-2',
        title: 'Code Examples',
        type: 'code',
        url: '/materials/code.zip',
        downloadable: true
      }
    ],
    
    certificateTemplate: 'web-dev-certificate',
    passingGrade: 80
  },
  {
    id: 'class-2',
    title: 'Brand Identity Masterclass',
    subtitle: 'Create Memorable Brand Experiences',
    description: 'Learn to design compelling brand identities that tell powerful stories and connect with audiences.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=225&fit=crop',
    instructorId: 'user-2',
    skillId: 'graphic-design',
    level: 'Intermediate',
    durationMins: 720, // 12 hours
    language: 'English',
    ratingAvg: 4.9,
    ratingCount: 156,
    studentsCount: 680,
    
    sections: [
      {
        id: 'section-brand-1',
        title: 'Brand Strategy Foundation',
        description: 'Understanding brand principles and strategy',
        lessons: [
          {
            id: 'lesson-brand-1',
            title: 'What Makes a Great Brand',
            durationMins: 45,
            previewable: true,
            order: 1
          },
          {
            id: 'lesson-brand-2',
            title: 'Brand Research & Analysis',
            durationMins: 60,
            previewable: false,
            order: 2
          }
        ],
        order: 1
      }
    ],
    requirements: [
      'Basic knowledge of design principles',
      'Adobe Creative Suite (trial version available)',
      'Portfolio examples to work with'
    ],
    outcomes: [
      'Develop comprehensive brand strategies',
      'Create professional logo designs',
      'Build complete brand guidelines',
      'Present brand concepts effectively'
    ],
    
    type: 'live',
    maxSeats: 20,
    currentSeats: 18,
    
    priceCredits: 120,
    status: 'upcoming',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
    tags: ['intermediate', 'design', 'branding', 'adobe'],
    category: 'Design'
  },
  {
    id: 'class-3',
    title: 'Business Spanish Immersion',
    subtitle: 'Professional Spanish for Global Business',
    description: 'Master business Spanish through real-world scenarios, cultural insights, and professional communication strategies.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop',
    instructorId: 'user-3',
    skillId: 'spanish',
    level: 'Intermediate',
    durationMins: 900, // 15 hours
    language: 'Spanish/English',
    ratingAvg: 4.95,
    ratingCount: 89,
    studentsCount: 340,
    
    sections: [
      {
        id: 'section-spanish-1',
        title: 'Business Communication',
        description: 'Essential business Spanish vocabulary and phrases',
        lessons: [
          {
            id: 'lesson-spanish-1',
            title: 'Meeting & Presentations',
            durationMins: 60,
            previewable: true,
            order: 1
          }
        ],
        order: 1
      }
    ],
    requirements: [
      'Intermediate Spanish level (A2-B1)',
      'Business communication experience helpful',
      'Commitment to practice speaking'
    ],
    outcomes: [
      'Conduct business meetings in Spanish',
      'Write professional emails and documents',
      'Navigate cultural business norms',
      'Present and negotiate confidently'
    ],
    
    type: 'live',
    maxSeats: 15,
    currentSeats: 12,
    
    priceCredits: 100,
    status: 'active',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-19T00:00:00Z',
    tags: ['language', 'business', 'conversation', 'cultural'],
    category: 'Languages'
  }
];

// Skill Paths (Coursera-style specializations)
export const skillPaths: SkillPath[] = [
  {
    id: 'path-1',
    title: 'Full-Stack Developer',
    description: 'Complete journey from frontend to backend development',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=225&fit=crop',
    category: 'Technology',
    level: 'Beginner',
    
    steps: [
      {
        id: 'step-1',
        type: 'class',
        refId: 'class-1',
        title: 'Web Development Foundations',
        description: 'Master HTML, CSS, and JavaScript fundamentals',
        estimatedHours: 30,
        isOptional: false,
        order: 1
      },
      {
        id: 'step-2',
        type: 'class',
        refId: 'class-advanced-js',
        title: 'Advanced JavaScript & React',
        description: 'Build modern frontend applications',
        estimatedHours: 25,
        isOptional: false,
        prerequisites: ['step-1'],
        order: 2
      },
      {
        id: 'step-3',
        type: 'mentorship',
        refId: 'mentor-backend',
        title: 'Backend Development Mentorship',
        description: 'One-on-one guidance for server-side development',
        estimatedHours: 15,
        isOptional: false,
        prerequisites: ['step-2'],
        order: 3
      },
      {
        id: 'step-4',
        type: 'project',
        refId: 'project-fullstack',
        title: 'Capstone Project',
        description: 'Build and deploy a full-stack application',
        estimatedHours: 20,
        isOptional: false,
        prerequisites: ['step-3'],
        order: 4
      }
    ],
    
    estimatedHours: 90,
    outcomes: [
      'Build complete web applications',
      'Work with modern frameworks and tools',
      'Deploy applications to production',
      'Understand full development lifecycle'
    ],
    skills: ['web-development', 'javascript', 'react', 'node-js'],
    
    completionBadgeId: 'fullstack-developer',
    certificateTemplate: 'fullstack-path-cert',
    
    priceCredits: 350,
    studentsCount: 450,
    ratingAvg: 4.8,
    ratingCount: 67,
    
    createdBy: 'user-1',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    status: 'published',
    featured: true
  },
  {
    id: 'path-2',
    title: 'Digital Brand Designer',
    description: 'Master brand design from strategy to execution',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=225&fit=crop',
    category: 'Design',
    level: 'Intermediate',
    
    steps: [
      {
        id: 'step-d1',
        type: 'class',
        refId: 'class-2',
        title: 'Brand Identity Masterclass',
        description: 'Learn comprehensive brand design',
        estimatedHours: 12,
        isOptional: false,
        order: 1
      },
      {
        id: 'step-d2',
        type: 'class',
        refId: 'class-digital-marketing',
        title: 'Digital Marketing Fundamentals',
        description: 'Understand marketing strategy',
        estimatedHours: 8,
        isOptional: false,
        order: 2
      }
    ],
    
    estimatedHours: 25,
    outcomes: [
      'Design complete brand identities',
      'Create digital marketing campaigns',
      'Develop brand guidelines',
      'Present design concepts professionally'
    ],
    skills: ['graphic-design', 'digital-marketing', 'branding'],
    
    priceCredits: 200,
    studentsCount: 280,
    ratingAvg: 4.9,
    ratingCount: 42,
    
    createdBy: 'user-2',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
    status: 'published',
    featured: true
  }
];

// Mentor Tiers
export const mentorTiers: MentorTier[] = [
  {
    id: 'silver',
    name: 'Silver',
    creditsPerHour: 20,
    features: ['1:1 Sessions', 'Email Support', 'Basic Portfolio Review'],
    color: '#C0C0C0',
    requirements: {
      minRating: 4.0,
      minSessions: 10,
      minStudents: 25,
      verificationRequired: true
    }
  },
  {
    id: 'gold',
    name: 'Gold',
    creditsPerHour: 35,
    features: ['1:1 Sessions', 'Priority Support', 'Portfolio Review', 'Career Guidance', 'Resume Review'],
    color: '#FFD700',
    requirements: {
      minRating: 4.5,
      minSessions: 50,
      minStudents: 100,
      verificationRequired: true
    }
  },
  {
    id: 'platinum',
    name: 'Platinum',
    creditsPerHour: 50,
    features: ['All Gold Features', '24/7 Support', 'Industry Connections', 'Job Referrals', 'Ongoing Support'],
    color: '#E5E4E2',
    requirements: {
      minRating: 4.8,
      minSessions: 100,
      minStudents: 250,
      verificationRequired: true
    }
  }
];

// Organizations for donations and partnerships
export const organizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Code for Africa',
    logoUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=100&h=100&fit=crop',
    type: 'NGO',
    verified: true,
    description: 'Empowering African societies through technology and data journalism',
    website: 'codeforafrica.org',
    walletAddress: '0x1234...5678',
    totalDonationsReceived: 15420,
    classes: ['class-1'],
    scholarships: [
      {
        id: 'scholarship-1',
        title: 'Tech Education Scholarship',
        description: 'Full scholarship for underrepresented students in tech',
        creditsAwarded: 500,
        eligibility: ['Student status', 'Financial need', 'Underrepresented background']
      }
    ]
  },
  {
    id: 'org-2',
    name: 'Design Academy',
    logoUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop',
    type: 'School',
    verified: true,
    description: 'Supporting emerging designers with education and resources',
    website: 'designacademy.edu',
    totalDonationsReceived: 8930,
    classes: ['class-2']
  },
  {
    id: 'org-3',
    name: 'Global Language Institute',
    logoUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=100&h=100&fit=crop',
    type: 'School',
    verified: true,
    description: 'Breaking language barriers through accessible education',
    website: 'globallang.org',
    totalDonationsReceived: 12100,
    classes: ['class-3']
  }
];

// Reviews for classes and instructors
export const reviews: Review[] = [
  {
    id: 'review-1',
    reviewerId: 'student-1',
    classId: 'class-1',
    revieweeId: 'user-1',
    rating: 5,
    title: 'Excellent course for beginners!',
    text: 'Dr. Chen explains complex concepts in a very clear and understandable way. The projects are practical and helped me build a real portfolio.',
    aspects: {
      content: 5,
      instruction: 5,
      value: 4,
      engagement: 5
    },
    createdAt: '2024-01-18T00:00:00Z',
    helpful: 23,
    reported: false
  },
  {
    id: 'review-2',
    reviewerId: 'student-2',
    classId: 'class-2',
    revieweeId: 'user-2',
    rating: 5,
    title: 'Transformed my design skills',
    text: 'Marcus has an incredible eye for design and his feedback is invaluable. I learned more in this course than in years of self-study.',
    aspects: {
      content: 5,
      instruction: 5,
      value: 5,
      engagement: 4
    },
    createdAt: '2024-01-16T00:00:00Z',
    helpful: 18,
    reported: false
  }
];

// Challenges for community engagement
export const challenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: '30-Day Code Challenge',
    description: 'Code something new every day for 30 days',
    goal: 'Build 30 different projects or complete 30 coding exercises',
    startAt: '2024-02-01T00:00:00Z',
    endAt: '2024-03-02T23:59:59Z',
    rules: 'Submit daily progress, original work only, help others in community',
    rewardCredits: 100,
    status: 'upcoming',
    participants: 45,
    maxParticipants: 100,
    leaderboard: [],
    category: 'Technology',
    difficulty: 2,
    skillsRequired: ['web-development'],
    tasks: [
      {
        id: 'task-1',
        title: 'Build a Landing Page',
        description: 'Create a responsive landing page',
        points: 10,
        required: true
      },
      {
        id: 'task-2',
        title: 'JavaScript Calculator',
        description: 'Build a functional calculator app',
        points: 15,
        required: true
      }
    ]
  }
];

// Export all data
export const courseData = {
  skills,
  users,
  classes,
  skillPaths,
  mentorTiers,
  organizations,
  reviews,
  challenges
};

export default courseData;
