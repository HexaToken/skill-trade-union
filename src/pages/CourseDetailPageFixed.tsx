import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Users, 
  CheckCircle, 
  Play, 
  Heart,
  Wallet,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Calendar,
  Globe,
  BookOpen,
  Award,
  MessageCircle,
  Share2,
  ChevronRight,
  Zap,
  Coins,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

// Simple mock data to avoid import issues
const mockCourse = {
  id: "c_88",
  slug: "brand-strategy-essentials", 
  title: "Brand Strategy Essentials",
  subtitle: "Master the art of creating compelling brand strategies that resonate with your target audience",
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
    "Create a lightweight brand strategy deck"
  ],
  description: "This comprehensive brand strategy course will transform you into a strategic thinking designer.",
  curriculum: [
    {
      id: "m1",
      title: "Foundations of Brand Strategy",
      duration: "1h 40m",
      lessons: [
        { id: "l1", title: "What is a Brand?", duration: "12m", preview: true },
        { id: "l2", title: "Brand Positioning", duration: "18m", preview: false }
      ]
    }
  ],
  instructor: {
    slug: "marcus-chen",
    name: "Marcus Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face",
    title: "Brand Designer & Educator",
    location: "San Francisco, USA",
    languages: ["English", "Chinese"],
    ratingAvg: 4.8,
    ratingCount: 128,
    bio: "Brand designer and educator with 8+ years of experience."
  },
  reviews: [
    {
      id: "r1",
      userId: "user-1",
      userName: "Sofia Rodriguez",
      userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      date: "2025-01-15",
      text: "Excellent course! Marcus explains concepts clearly.",
      helpful: 24
    }
  ]
};

export default function CourseDetailPageFixed() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState<string[]>(['m1']);
  const [isSaved, setIsSaved] = useState(false);

  const course = mockCourse;
  const instructor = course.instructor;

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const totalDuration = 310; // 5h 10m in minutes
  const totalLessons = course.curriculum.reduce((total, module) => total + module.lessons.length, 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A]">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A]">
        <div className="absolute inset-0">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/80 to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-slate-300 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/classes" className="hover:text-white transition-colors">Classes</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{course.title}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-8">
              <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-white mb-4">
                {course.title}
              </h1>

              <p className="text-lg lg:text-xl text-slate-200 mb-6 leading-relaxed">
                {course.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-slate-300 mb-8">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-white">{course.ratingAvg}</span>
                  <span>({course.ratingCount.toLocaleString()} reviews)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.learners.toLocaleString()} learners</span>
                </div>
                <span>•</span>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  {course.level}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* What You'll Learn */}
            <Card className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)] shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-heading text-[#0F172A] dark:text-[#F1F5F9]">
                  What You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#0056D2] mt-0.5 flex-shrink-0" />
                      <span className="text-[#334155] dark:text-[#E2E8F0]">{outcome}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Description */}
            <Card className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)] shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-heading text-[#0F172A] dark:text-[#F1F5F9]">
                  Course Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#334155] dark:text-[#E2E8F0] leading-relaxed">
                  {course.description}
                </p>
              </CardContent>
            </Card>

            {/* Curriculum */}
            <Card className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)] shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-heading text-[#0F172A] dark:text-[#F1F5F9]">
                  Course Curriculum
                </CardTitle>
                <p className="text-[#334155] dark:text-[#E2E8F0]">
                  {course.curriculum.length} modules • {totalLessons} lessons • {course.duration} total
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.curriculum.map((module) => (
                  <Collapsible
                    key={module.id}
                    open={expandedModules.includes(module.id)}
                    onOpenChange={() => toggleModule(module.id)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700">
                        <div className="text-left">
                          <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                            {module.title}
                          </h4>
                          <p className="text-sm text-[#334155] dark:text-[#E2E8F0]">
                            {module.lessons.length} lessons • {module.duration}
                          </p>
                        </div>
                        {expandedModules.includes(module.id) ? (
                          <ChevronUp className="w-5 h-5 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="ml-4 space-y-2">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                              <Play className="w-4 h-4 text-[#06B6D4]" />
                              <span className="text-[#334155] dark:text-[#E2E8F0]">
                                {lesson.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {lesson.preview && (
                                <Button size="sm" variant="ghost" className="text-[#06B6D4]">
                                  Preview
                                </Button>
                              )}
                              <span className="text-sm text-slate-500">{lesson.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Enrollment Card */}
            <Card className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)] shadow-lg lg:sticky lg:top-6">
              <CardContent className="p-6">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Coins className="w-6 h-6 text-[#06B6D4]" />
                    <span className="text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                      {course.credits}
                    </span>
                    <span className="text-lg text-[#334155] dark:text-[#E2E8F0]">Credits</span>
                  </div>
                  <p className="text-sm text-[#334155] dark:text-[#E2E8F0]">One-time payment</p>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#06B6D4]" />
                    <span className="text-sm text-[#334155] dark:text-[#E2E8F0]">
                      {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#06B6D4]" />
                    <span className="text-sm text-[#334155] dark:text-[#E2E8F0]">
                      {course.learners.toLocaleString()} students
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#06B6D4]" />
                    <span className="text-sm text-[#334155] dark:text-[#E2E8F0]">
                      {course.language}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#06B6D4]" />
                    <span className="text-sm text-[#334155] dark:text-[#E2E8F0]">
                      Certificate
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <Button className="w-full bg-gradient-to-r from-[#0056D2] to-[#06B6D4] hover:from-[#004BB8] hover:to-[#0891B2] text-white py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <Coins className="w-5 h-5 mr-2" />
                    Enroll with {course.credits} Credits
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white rounded-xl"
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Heart className={cn("w-4 h-4 mr-2", isSaved && "fill-current")} />
                    {isSaved ? 'Saved' : 'Save for Later'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
