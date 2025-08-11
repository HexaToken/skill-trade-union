import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Star, 
  MapPin, 
  Globe, 
  Clock, 
  MessageCircle, 
  Zap, 
  CheckCircle, 
  FlaskConical,
  Award,
  Calendar,
  Users,
  Image,
  Play,
  FileText,
  ExternalLink,
  Github,
  Linkedin,
  Monitor,
  User,
  CreditCard,
  Info,
  Filter,
  ThumbsUp,
  Coins
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import BookingModalUnified from '@/components/BookingModalUnified';

// Mock mentor data
const mockMentors = [
  {
    id: 'm_42',
    slug: 'marcus-chen',
    name: 'Marcus Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face',
    location: 'San Francisco, USA',
    languages: ['English', 'Mandarin'],
    timezone: 'PST (UTC-8)',
    ratingAvg: 4.8,
    ratingCount: 128,
    verifiedID: true,
    skillTested: true,
    topMentor: true,
    instantAvailable: true,
    creditsPerHour: 25,
    responseTime: '< 2 min',
    completedSessions: 234,
    cancellationPolicy: 'Free cancellation up to 24h before',
    bio: 'Full-stack developer and tech educator with 8+ years of experience building scalable applications. I specialize in React, Node.js, and cloud architecture. My teaching approach focuses on practical, hands-on learning that gets you building real projects from day one.',
    highlights: [
      { label: 'Experience', value: '8+ years' },
      { label: 'Specialties', value: 'React, Node.js, AWS' },
      { label: 'Languages', value: 'English, Mandarin' },
      { label: 'Notable Clients', value: 'Startup CTO, Enterprise Dev' }
    ],
    socials: {
      linkedin: 'marcus-chen-dev',
      github: 'marcuscode',
      website: 'marcuschen.dev'
    },
    skills: [
      { 
        name: 'React Development', 
        category: 'Technology',
        level: 'Advanced', 
        demand: 'High',
        suggestedRate: 30,
        description: 'Modern React with hooks, context, and performance optimization'
      },
      { 
        name: 'Node.js Backend', 
        category: 'Technology',
        level: 'Advanced', 
        demand: 'High',
        suggestedRate: 32,
        description: 'Express, APIs, database integration, and microservices'
      },
      { 
        name: 'AWS Cloud Architecture', 
        category: 'Technology',
        level: 'Intermediate', 
        demand: 'Medium',
        suggestedRate: 28,
        description: 'EC2, Lambda, RDS, S3, and serverless deployments'
      },
      { 
        name: 'JavaScript Fundamentals', 
        category: 'Technology',
        level: 'Expert', 
        demand: 'High',
        suggestedRate: 25,
        description: 'ES6+, async programming, and modern JavaScript patterns'
      }
    ],
    portfolio: [
      {
        id: 'p1',
        title: 'E-commerce Platform Rebuild',
        type: 'web',
        category: 'Web Development',
        url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
        description: 'Complete React/Node.js rebuild of legacy e-commerce system, improving performance by 60%',
        tags: ['React', 'Node.js', 'MongoDB', 'AWS']
      },
      {
        id: 'p2',
        title: 'Real-time Dashboard',
        type: 'web',
        category: 'Data Visualization',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        description: 'WebSocket-powered analytics dashboard with real-time data updates',
        tags: ['React', 'WebSockets', 'D3.js', 'Express']
      },
      {
        id: 'p3',
        title: 'Mobile App Architecture',
        type: 'mobile',
        category: 'Mobile Development',
        url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
        description: 'React Native app with offline sync and cloud integration',
        tags: ['React Native', 'Redux', 'Firebase']
      }
    ],
    reviews: [
      {
        id: 'r1',
        user: { name: 'Ana Rivera', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b05b?w=40&h=40&fit=crop&crop=face' },
        rating: 5,
        date: '2024-01-15',
        text: 'Marcus is an exceptional mentor! He helped me understand React hooks and state management in a way that finally clicked. His teaching style is clear, patient, and practical.',
        helpful: 12
      },
      {
        id: 'r2',
        user: { name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
        rating: 5,
        date: '2024-01-10',
        text: 'Incredible session on Node.js APIs. Marcus walked me through building a complete REST API from scratch and explained best practices along the way.',
        helpful: 8
      },
      {
        id: 'r3',
        user: { name: 'Sofia Martinez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
        rating: 4,
        date: '2024-01-08',
        text: 'Great AWS session. Marcus helped me deploy my first serverless application and explained the cloud concepts very clearly.',
        helpful: 6
      }
    ],
    availability: [
      { date: '2024-01-25', slots: ['10:00', '14:00', '16:00'] },
      { date: '2024-01-26', slots: ['09:00', '11:00', '15:00'] },
      { date: '2024-01-27', slots: ['13:00', '17:00'] },
      { date: '2024-01-28', slots: ['10:00', '12:00', '14:00', '16:00'] }
    ]
  }
];

export default function MentorProfile() {
  const { mentorSlug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');
  const [sessionDuration, setSessionDuration] = useState(60);
  const [complexity, setComplexity] = useState('standard');
  const [escrowEnabled, setEscrowEnabled] = useState(true);
  const [portfolioFilter, setPortfolioFilter] = useState('all');
  const [reviewsFilter, setReviewsFilter] = useState('recent');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Find mentor by slug
  const mentor = mockMentors.find(m => m.slug === mentorSlug);

  useEffect(() => {
    if (!mentor) {
      navigate('/mentors');
    }
  }, [mentor, navigate]);

  if (!mentor) {
    return null;
  }

  // Pricing calculations
  const complexityMultipliers = {
    simple: 1.0,
    standard: 1.3,
    advanced: 1.6
  };

  const demandMultipliers = {
    'Low': 1.0,
    'Medium': 1.1,
    'High': 1.2
  };

  const averageDemand = mentor.skills.reduce((acc, skill) => {
    return acc + (demandMultipliers[skill.demand as keyof typeof demandMultipliers] || 1.0);
  }, 0) / mentor.skills.length;

  const baseRate = mentor.creditsPerHour;
  const complexityRate = baseRate * complexityMultipliers[complexity as keyof typeof complexityMultipliers];
  const finalHourlyRate = Math.round(complexityRate * averageDemand);
  const totalCredits = Math.round((finalHourlyRate * sessionDuration) / 60);

  // Filter portfolio items
  const filteredPortfolio = portfolioFilter === 'all' 
    ? mentor.portfolio 
    : mentor.portfolio.filter(item => item.category.toLowerCase().includes(portfolioFilter.toLowerCase()));

  // Filter and sort reviews
  const sortedReviews = [...mentor.reviews].sort((a, b) => {
    switch (reviewsFilter) {
      case 'rating':
        return b.rating - a.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      case 'recent':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  // Rating distribution
  const ratingDistribution = mentor.reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const portfolioCategories = ['all', 'web', 'mobile', 'data'];

  // Convert mentor data for BookingModal
  const mentorForBooking = {
    id: mentor.id,
    name: mentor.name,
    avatarUrl: mentor.avatarUrl,
    rate: mentor.creditsPerHour,
    availability: mentor.availability.flatMap(day =>
      day.slots.map(slot => `${day.date}T${slot}:00`)
    ),
    verified: mentor.verifiedID,
    skillTested: mentor.skillTested,
    topMentor: mentor.topMentor,
    location: mentor.location,
    timezone: mentor.timezone,
    skill: mentor.skills[0]?.name
  };

  const handleBookingConfirm = (bookingData: any) => {
    console.log('Booking confirmed:', bookingData);
    // Here you would typically send the booking data to your API
    // and handle the response
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white dark:bg-[#0F172A]">
        {/* Breadcrumb */}
        <div className="border-b border-[#06B6D4]/20">
          <div className="page-container py-4">
            <nav className="flex items-center gap-2 text-sm text-[#334155] dark:text-[#E2E8F0]">
              <Link to="/" className="hover:text-[#0056D2] transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/mentors" className="hover:text-[#0056D2] transition-colors">Mentors</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#0056D2] font-medium">{mentor.name}</span>
            </nav>
          </div>
        </div>

        <div className="page-container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-7 space-y-8">
              {/* Hero Section */}
              <div className="space-y-6">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col sm:flex-row gap-6">
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32 ring-4 ring-[#06B6D4]/20 mx-auto sm:mx-0">
                    <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
                    <AvatarFallback className="text-2xl font-bold bg-[#0056D2]/10 text-[#0056D2]">
                      {mentor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 text-center sm:text-left space-y-4">
                    {/* Name and Badges */}
                    <div className="space-y-3">
                      <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] dark:text-[#F1F5F9] font-heading">
                        {mentor.name}
                      </h1>
                      
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        {mentor.verifiedID && (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            ID Verified
                          </Badge>
                        )}
                        {mentor.skillTested && (
                          <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700">
                            <FlaskConical className="w-3 h-3 mr-1" />
                            Skill Tested
                          </Badge>
                        )}
                        {mentor.topMentor && (
                          <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700">
                            <Award className="w-3 h-3 mr-1" />
                            Top Mentor
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 justify-center sm:justify-start text-[#334155] dark:text-[#E2E8F0]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{mentor.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <span>{mentor.languages.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{mentor.timezone}</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={cn(
                              "w-5 h-5",
                              star <= Math.round(mentor.ratingAvg) 
                                ? "fill-amber-400 text-amber-400" 
                                : "text-slate-300"
                            )}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                        {mentor.ratingAvg}
                      </span>
                      <span className="text-[#334155] dark:text-[#E2E8F0]">
                        ({mentor.ratingCount} reviews)
                      </span>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        size="lg"
                        className="bg-[#0056D2] hover:bg-[#004BB8] text-white font-semibold"
                        onClick={() => setIsBookingModalOpen(true)}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Book with Credits
                      </Button>
                      
                      {mentor.instantAvailable && (
                        <Button 
                          size="lg" 
                          className="bg-gradient-to-r from-[#0056D2] to-[#06B6D4] hover:from-[#004BB8] hover:to-[#0891B2] text-white font-semibold"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Start Instant Call
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="sticky top-16 z-30 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl border-b border-[#06B6D4]/20 -mx-4 px-4 py-4">
                  <TabsList className="grid w-full grid-cols-5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <TabsTrigger 
                      value="about" 
                      className="data-[state=active]:bg-[#0056D2] data-[state=active]:text-white font-semibold rounded-lg"
                    >
                      About
                    </TabsTrigger>
                    <TabsTrigger 
                      value="skills" 
                      className="data-[state=active]:bg-[#0056D2] data-[state=active]:text-white font-semibold rounded-lg"
                    >
                      Skills
                    </TabsTrigger>
                    <TabsTrigger 
                      value="portfolio" 
                      className="data-[state=active]:bg-[#0056D2] data-[state=active]:text-white font-semibold rounded-lg"
                    >
                      Portfolio
                    </TabsTrigger>
                    <TabsTrigger 
                      value="reviews" 
                      className="data-[state=active]:bg-[#0056D2] data-[state=active]:text-white font-semibold rounded-lg"
                    >
                      Reviews
                    </TabsTrigger>
                    <TabsTrigger 
                      value="availability" 
                      className="data-[state=active]:bg-[#0056D2] data-[state=active]:text-white font-semibold rounded-lg"
                    >
                      Availability
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab Content */}
                <div className="pt-6">
                  {/* About Tab */}
                  <TabsContent value="about" className="space-y-8">
                    {/* Bio */}
                    <Card className="bg-white dark:bg-[#1E293B] border-[#06B6D4]/20">
                      <CardHeader>
                        <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9] font-heading">About</h3>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[#334155] dark:text-[#E2E8F0] leading-relaxed">
                          {mentor.bio}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Highlights */}
                    <Card className="bg-white dark:bg-[#1E293B] border-[#06B6D4]/20">
                      <CardHeader>
                        <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9] font-heading">Highlights</h3>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {mentor.highlights.map((highlight, index) => (
                            <div key={index} className="space-y-2">
                              <dt className="text-sm font-medium text-[#06B6D4]">{highlight.label}</dt>
                              <dd className="text-[#0F172A] dark:text-[#F1F5F9] font-semibold">{highlight.value}</dd>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Social Links */}
                    {mentor.socials && (
                      <Card className="bg-white dark:bg-[#1E293B] border-[#06B6D4]/20">
                        <CardHeader>
                          <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9] font-heading">Connect</h3>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-4">
                            {mentor.socials.linkedin && (
                              <Button variant="outline" size="sm" className="border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white">
                                <Linkedin className="w-4 h-4 mr-2" />
                                LinkedIn
                              </Button>
                            )}
                            {mentor.socials.github && (
                              <Button variant="outline" size="sm" className="border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white">
                                <Github className="w-4 h-4 mr-2" />
                                GitHub
                              </Button>
                            )}
                            {mentor.socials.website && (
                              <Button variant="outline" size="sm" className="border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Website
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  {/* Skills Tab */}
                  <TabsContent value="skills" className="space-y-6">
                    {mentor.skills.map((skill, index) => (
                      <Card key={index} className="bg-white dark:bg-[#1E293B] border-[#06B6D4]/20">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <h4 className="text-lg font-bold text-[#0F172A] dark:text-[#F1F5F9] font-heading">
                                    {skill.name}
                                  </h4>
                                  <Badge 
                                    className={cn(
                                      "text-xs",
                                      skill.level === 'Expert' && "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300",
                                      skill.level === 'Advanced' && "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300",
                                      skill.level === 'Intermediate' && "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300"
                                    )}
                                  >
                                    {skill.level}
                                  </Badge>
                                </div>
                                <p className="text-[#334155] dark:text-[#E2E8F0]">{skill.description}</p>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-lg font-bold text-[#06B6D4]">{skill.suggestedRate} credits/hr</div>
                                <div className="text-sm text-[#334155] dark:text-[#E2E8F0]">{skill.demand} demand</div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-[#334155] dark:text-[#E2E8F0]">Market Demand</span>
                                <span className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">{skill.demand}</span>
                              </div>
                              <Progress 
                                value={skill.demand === 'High' ? 85 : skill.demand === 'Medium' ? 60 : 35} 
                                className="h-2"
                              />
                            </div>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#0056D2] text-[#0056D2] hover:bg-[#0056D2] hover:text-white"
                              onClick={() => setIsBookingModalOpen(true)}
                            >
                              Book a Session
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  {/* Portfolio Tab */}
                  <TabsContent value="portfolio" className="space-y-6">
                    {/* Portfolio Filters */}
                    <div className="flex items-center gap-4">
                      <Label htmlFor="portfolio-filter" className="text-sm font-medium text-[#334155] dark:text-[#E2E8F0]">
                        Filter:
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {portfolioCategories.map(category => (
                          <Badge
                            key={category}
                            variant={portfolioFilter === category ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer transition-all duration-200 hover:scale-105 capitalize",
                              portfolioFilter === category
                                ? "bg-[#0056D2] text-white hover:bg-[#004BB8]"
                                : "border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white"
                            )}
                            onClick={() => setPortfolioFilter(category)}
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Portfolio Grid */}
                    {filteredPortfolio.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredPortfolio.map((item) => (
                          <Card 
                            key={item.id} 
                            className="bg-white dark:bg-[#1E293B] border-[#06B6D4]/20 cursor-pointer hover-lift transition-all duration-300"
                            onClick={() => {
                              setSelectedPortfolioItem(item);
                              setIsPortfolioOpen(true);
                            }}
                          >
                            <div className="relative aspect-video overflow-hidden rounded-t-xl">
                              <img 
                                src={item.url} 
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-3 left-3">
                                <Badge className="bg-black/70 text-white border-0">
                                  {item.type === 'web' && <Monitor className="w-3 h-3 mr-1" />}
                                  {item.type === 'mobile' && <User className="w-3 h-3 mr-1" />}
                                  {item.type === 'video' && <Play className="w-3 h-3 mr-1" />}
                                  {item.category}
                                </Badge>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h4 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2">{item.title}</h4>
                              <p className="text-sm text-[#334155] dark:text-[#E2E8F0] mb-3 line-clamp-2">
                                {item.description}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {item.tags.slice(0, 3).map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="outline" size="sm" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {item.tags.length > 3 && (
                                  <Badge variant="outline" size="sm" className="text-xs">
                                    +{item.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <Image className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2">
                          No portfolio items
                        </h3>
                        <p className="text-[#334155] dark:text-[#E2E8F0] mb-6">
                          No portfolio items found for this filter.
                        </p>
                        <Button
                          variant="outline"
                          className="border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white"
                          onClick={() => setPortfolioFilter('all')}
                        >
                          View All Items
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Reviews Tab */}
                  <TabsContent value="reviews" className="space-y-6">
                    {/* Overall Rating */}
                    <Card className="bg-white dark:bg-[#1E293B] border-[#06B6D4]/20">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2">
                              {mentor.ratingAvg}
                            </div>
                            <div className="flex justify-center items-center gap-1 mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star}
                                  className={cn(
                                    "w-5 h-5",
                                    star <= Math.round(mentor.ratingAvg) 
                                      ? "fill-amber-400 text-amber-400" 
                                      : "text-slate-300"
                                  )}
                                />
                              ))}
                            </div>
                            <div className="text-[#334155] dark:text-[#E2E8F0]">
                              Based on {mentor.ratingCount} reviews
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <div key={rating} className="flex items-center gap-2">
                                <span className="text-sm w-3">{rating}</span>
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <Progress 
                                  value={((ratingDistribution[rating] || 0) / mentor.ratingCount) * 100} 
                                  className="flex-1 h-2"
                                />
                                <span className="text-sm w-8 text-right">{ratingDistribution[rating] || 0}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Review Filters */}
                    <div className="flex items-center gap-4">
                      <Label htmlFor="reviews-filter" className="text-sm font-medium text-[#334155] dark:text-[#E2E8F0]">
                        Sort by:
                      </Label>
                      <Select value={reviewsFilter} onValueChange={setReviewsFilter}>
                        <SelectTrigger className="w-48 border-[#06B6D4]/20 focus:border-[#0056D2] focus:ring-[#0056D2]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recent">Most Recent</SelectItem>
                          <SelectItem value="rating">Highest Rating</SelectItem>
                          <SelectItem value="helpful">Most Helpful</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {sortedReviews.map((review) => (
                        <Card key={review.id} className="bg-white dark:bg-[#1E293B] border-[#06B6D4]/20">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-10 h-10">
                                    <AvatarImage src={review.user.avatar} alt={review.user.name} />
                                    <AvatarFallback className="text-sm bg-[#0056D2]/10 text-[#0056D2]">
                                      {review.user.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                                      {review.user.name}
                                    </div>
                                    <div className="text-sm text-[#334155] dark:text-[#E2E8F0]">
                                      {new Date(review.date).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star}
                                      className={cn(
                                        "w-4 h-4",
                                        star <= review.rating 
                                          ? "fill-amber-400 text-amber-400" 
                                          : "text-slate-300"
                                      )}
                                    />
                                  ))}
                                </div>
                              </div>
                              
                              <p className="text-[#334155] dark:text-[#E2E8F0] leading-relaxed">
                                {review.text}
                              </p>
                              
                              <div className="flex items-center gap-2 pt-2">
                                <Button variant="ghost" size="sm" className="text-[#334155] dark:text-[#E2E8F0] hover:text-[#0056D2]">
                                  <ThumbsUp className="w-4 h-4 mr-1" />
                                  Helpful ({review.helpful})
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Availability Tab */}
                  <TabsContent value="availability" className="space-y-6">
                    <Card className="bg-white dark:bg-[#1E293B] border-[#06B6D4]/20">
                      <CardHeader>
                        <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9] font-heading">Available Time Slots</h3>
                        <p className="text-[#334155] dark:text-[#E2E8F0]">All times shown in {mentor.timezone}</p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {mentor.availability.map((day, index) => (
                          <div key={index} className="space-y-3">
                            <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                              {new Date(day.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {day.slots.map((slot, slotIndex) => (
                                <Button
                                  key={slotIndex}
                                  variant={selectedSlot === `${day.date}-${slot}` ? "default" : "outline"}
                                  size="sm"
                                  className={cn(
                                    "transition-all duration-200",
                                    selectedSlot === `${day.date}-${slot}`
                                      ? "bg-[#0056D2] text-white hover:bg-[#004BB8]"
                                      : "border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white"
                                  )}
                                  onClick={() => {
                                    setSelectedSlot(`${day.date}-${slot}`);
                                    document.getElementById('booking-card')?.scrollIntoView({ behavior: 'smooth' });
                                  }}
                                >
                                  {slot}
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}
                        
                        {mentor.availability.length === 0 && (
                          <div className="text-center py-8">
                            <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                            <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-2">
                              No availability shown
                            </h4>
                            <p className="text-[#334155] dark:text-[#E2E8F0] mb-4">
                              Message {mentor.name} to request a time.
                            </p>
                            <Button
                              variant="outline"
                              className="border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white"
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Send Message
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-3 space-y-6">
              {/* Booking Card */}
              <Card id="booking-card" className="bg-white dark:bg-[#1E293B] border-[#06B6D4]/20 sticky top-32">
                <CardHeader>
                  <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9] font-heading">Book a Session</h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Rate Display */}
                  <div className="flex items-center gap-2 text-lg">
                    <Coins className="w-5 h-5 text-[#06B6D4]" />
                    <span className="font-bold text-[#06B6D4]">{mentor.creditsPerHour} credits/hour</span>
                  </div>

                  {/* Duration Picker */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-[#334155] dark:text-[#E2E8F0]">Duration</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[30, 60, 90].map((duration) => (
                        <Button
                          key={duration}
                          variant={sessionDuration === duration ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            sessionDuration === duration
                              ? "bg-[#0056D2] text-white hover:bg-[#004BB8]"
                              : "border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white"
                          )}
                          onClick={() => setSessionDuration(duration)}
                        >
                          {duration}min
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Complexity Selector */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-[#334155] dark:text-[#E2E8F0]">Complexity</Label>
                    <Select value={complexity} onValueChange={setComplexity}>
                      <SelectTrigger className="border-[#06B6D4]/20 focus:border-[#0056D2] focus:ring-[#0056D2]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Simple (1.0x)</SelectItem>
                        <SelectItem value="standard">Standard (1.3x)</SelectItem>
                        <SelectItem value="advanced">Advanced (1.6x)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#334155] dark:text-[#E2E8F0]">Base rate ({sessionDuration}min)</span>
                      <span className="font-medium">{Math.round((baseRate * sessionDuration) / 60)} credits</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#334155] dark:text-[#E2E8F0]">Complexity ({complexity})</span>
                      <span className="font-medium">×{complexityMultipliers[complexity as keyof typeof complexityMultipliers]}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#334155] dark:text-[#E2E8F0]">Demand adjustment</span>
                      <span className="font-medium">×{averageDemand.toFixed(1)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-[#0056D2]">
                      <span>Total</span>
                      <span>{totalCredits} credits</span>
                    </div>
                  </div>

                  {/* Escrow Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="escrow">Escrow Protection</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-[#06B6D4]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>We hold credits until both confirm the session went well.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Switch
                      id="escrow"
                      checked={escrowEnabled}
                      onCheckedChange={setEscrowEnabled}
                    />
                  </div>

                  {/* Book Button */}
                  <Button
                    size="lg"
                    className="w-full bg-[#0056D2] hover:bg-[#004BB8] text-white font-semibold"
                    onClick={() => setIsBookingModalOpen(true)}
                  >
                    Book with Credits
                  </Button>
                </CardContent>
              </Card>

              {/* Instant Call Card */}
              {mentor.instantAvailable && (
                <Card className="bg-gradient-to-r from-[#0056D2] to-[#06B6D4] text-white">
                  <CardContent className="p-6 text-center">
                    <Zap className="w-8 h-8 mx-auto mb-3" />
                    <h3 className="font-bold mb-2">Get help now</h3>
                    <p className="text-sm mb-4 opacity-90">Pay per minute. No scheduling needed.</p>
                    <Button 
                      size="lg" 
                      className="w-full bg-white text-[#0056D2] hover:bg-slate-100 font-semibold"
                    >
                      ⚡ Start Instant Call
                    </Button>
                    <p className="text-xs mt-3 opacity-75">
                      Est. response {mentor.responseTime} • Secure in-app video
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Key Facts */}
              <Card className="bg-white dark:bg-[#1E293B] border-[#06B6D4]/20">
                <CardHeader>
                  <h3 className="text-lg font-bold text-[#0F172A] dark:text-[#F1F5F9] font-heading">Key Facts</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#334155] dark:text-[#E2E8F0]">Response time</span>
                      <span className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">{mentor.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#334155] dark:text-[#E2E8F0]">Sessions completed</span>
                      <span className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">{mentor.completedSessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#334155] dark:text-[#E2E8F0]">Languages</span>
                      <span className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">{mentor.languages.join(', ')}</span>
                    </div>
                    <div className="pt-2 border-t border-[#06B6D4]/20">
                      <p className="text-xs text-[#334155] dark:text-[#E2E8F0]">
                        {mentor.cancellationPolicy}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Portfolio Lightbox Modal */}
        <Dialog open={isPortfolioOpen} onOpenChange={setIsPortfolioOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedPortfolioItem && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-[#0F172A] dark:text-[#F1F5F9]">
                    {selectedPortfolioItem.title}
                  </DialogTitle>
                  <DialogDescription className="text-[#334155] dark:text-[#E2E8F0]">
                    {selectedPortfolioItem.category}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <img 
                    src={selectedPortfolioItem.url} 
                    alt={selectedPortfolioItem.title}
                    className="w-full rounded-xl"
                  />
                  <p className="text-[#334155] dark:text-[#E2E8F0]">
                    {selectedPortfolioItem.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPortfolioItem.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
