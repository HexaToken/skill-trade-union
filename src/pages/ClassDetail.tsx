import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Users, 
  CheckCircle, 
  Play, 
  Download, 
  Share2, 
  Heart,
  ShieldCheck,
  Wallet,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Calendar,
  Globe,
  BookOpen,
  Award,
  MessageCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { courses } from '@/mock/enhanced-data';
import { users } from '@/data/mockData';
import ClassCard from '@/components/ClassCard';

interface CourseModule {
  id: string;
  title: string;
  duration: number;
  lessons: Array<{
    id: string;
    title: string;
    duration: number;
    isPreview?: boolean;
    isCompleted?: boolean;
  }>;
}

interface Review {
  id: string;
  userId: string;
  rating: number;
  text: string;
  date: string;
  helpful: number;
}

export default function ClassDetail() {
  const { id } = useParams<{ id: string }>();
  const [expandedModules, setExpandedModules] = useState<string[]>(['module-1']);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'reviews' | 'instructor'>('overview');
  const [isSaved, setIsSaved] = useState(false);

  // Mock data - in real app this would come from API
  const course = courses.find(c => c.id === id) || courses[0];
  const instructor = users.find(u => u.id === course.teacherId) || users[0];
  const relatedCourses = courses.filter(c => c.id !== course.id && c.category === course.category).slice(0, 4);

  const modules: CourseModule[] = [
    {
      id: 'module-1',
      title: 'Introduction to Web Development',
      duration: 45,
      lessons: [
        { id: 'lesson-1', title: 'What is Web Development?', duration: 10, isPreview: true },
        { id: 'lesson-2', title: 'Setting up your development environment', duration: 15 },
        { id: 'lesson-3', title: 'Understanding HTML basics', duration: 20 },
      ]
    },
    {
      id: 'module-2',
      title: 'CSS Fundamentals',
      duration: 60,
      lessons: [
        { id: 'lesson-4', title: 'CSS Selectors and Properties', duration: 25 },
        { id: 'lesson-5', title: 'Layout with Flexbox', duration: 20 },
        { id: 'lesson-6', title: 'CSS Grid System', duration: 15 },
      ]
    },
    {
      id: 'module-3',
      title: 'JavaScript Essentials',
      duration: 90,
      lessons: [
        { id: 'lesson-7', title: 'Variables and Data Types', duration: 30 },
        { id: 'lesson-8', title: 'Functions and Scope', duration: 30 },
        { id: 'lesson-9', title: 'DOM Manipulation', duration: 30 },
      ]
    }
  ];

  const reviews: Review[] = [
    {
      id: 'review-1',
      userId: 'user-2',
      rating: 5,
      text: 'Excellent course! The instructor explains complex concepts in a very clear and understandable way. The hands-on projects really helped solidify my understanding.',
      date: '2025-01-15',
      helpful: 24
    },
    {
      id: 'review-2',
      userId: 'user-3',
      rating: 4,
      text: 'Great content and well-structured curriculum. Would have liked more advanced topics, but perfect for beginners.',
      date: '2025-01-10',
      helpful: 12
    }
  ];

  const learningOutcomes = [
    'Build responsive websites using HTML, CSS, and JavaScript',
    'Understand modern web development best practices',
    'Create interactive user interfaces',
    'Deploy websites to production environments',
    'Debug and troubleshoot common web development issues',
    'Work with version control systems like Git'
  ];

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const totalDuration = modules.reduce((total, module) => total + module.duration, 0);
  const totalLessons = modules.reduce((total, module) => total + module.lessons.length, 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={course.thumbnailUrl} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/80 via-[#0F172A]/60 to-transparent dark:from-[#0F172A]/90 dark:via-[#0F172A]/70 dark:to-[#0F172A]/20" />
        </div>
        
        <div className="relative page-container py-16 lg:py-24">
          <div className="max-w-4xl">
            {/* Course Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge className="bg-emerald-500 text-white border-0 px-3 py-1">
                {course.difficulty === 1 ? 'Beginner' : course.difficulty === 2 ? 'Intermediate' : 'Advanced'}
              </Badge>
              {course.badges.includes('live') && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-3 py-1 animate-pulse">
                  Live
                </Badge>
              )}
              {course.badges.includes('recorded') && (
                <Badge className="bg-blue-500 text-white border-0 px-3 py-1">
                  Self-Paced
                </Badge>
              )}
            </div>

            {/* Course Title */}
            <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-white mb-4 leading-tight">
              {course.title}
            </h1>

            {/* Course Subtitle */}
            <p className="text-lg lg:text-xl text-slate-200 mb-6 max-w-3xl leading-relaxed">
              {course.subtitle || course.description}
            </p>

            {/* Instructor and Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-slate-300 mb-8">
              <div className="flex items-center gap-2">
                <span>By</span>
                <Link to={`/profile/${instructor.id}`} className="font-semibold text-white hover:text-[#06B6D4] transition-colors">
                  {instructor.name}
                </Link>
              </div>
              <span>•</span>
              <span>Updated January 2025</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{course.ratingAvg}</span>
                <span>({course.ratingCount} reviews)</span>
              </div>
            </div>

            {/* Action Buttons - Mobile */}
            <div className="flex flex-col sm:flex-row gap-4 lg:hidden">
              <Button className="bg-[#0056D2] hover:bg-[#004BB8] text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                Enroll Now - {course.pricePerSeat} Credits
              </Button>
              <Button 
                variant="outline" 
                className="border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white bg-white/10 backdrop-blur-sm rounded-xl"
                onClick={() => setIsSaved(!isSaved)}
              >
                <Heart className={cn("w-4 h-4 mr-2", isSaved && "fill-current")} />
                {isSaved ? 'Saved' : 'Save for Later'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-container py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Navigation Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-700">
              <div className="flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'reviews', label: 'Reviews' },
                  { id: 'instructor', label: 'Instructor' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={cn(
                      "py-4 px-2 border-b-2 font-medium text-sm transition-colors",
                      selectedTab === tab.id
                        ? "border-[#0056D2] text-[#0056D2]"
                        : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {selectedTab === 'overview' && (
              <div className="space-y-8">
                {/* What You'll Learn */}
                <Card className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)]">
                  <CardHeader>
                    <CardTitle className="text-2xl font-heading font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                      What You'll Learn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {learningOutcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#0056D2] mt-0.5 flex-shrink-0" />
                          <span className="text-[#334155] dark:text-[#E2E8F0]">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Course Description */}
                <Card className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)]">
                  <CardHeader>
                    <CardTitle className="text-2xl font-heading font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                      Course Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <p className="text-[#334155] dark:text-[#E2E8F0] leading-relaxed mb-4">
                        This comprehensive web development course will take you from complete beginner to confident developer. 
                        You'll learn the fundamental technologies that power the modern web: HTML for structure, CSS for styling, 
                        and JavaScript for interactivity.
                      </p>
                      <p className="text-[#334155] dark:text-[#E2E8F0] leading-relaxed mb-4">
                        Through hands-on projects and real-world examples, you'll build a strong foundation in web development 
                        best practices. By the end of this course, you'll have created several complete websites and web applications 
                        that you can add to your portfolio.
                      </p>
                      <p className="text-[#334155] dark:text-[#E2E8F0] leading-relaxed">
                        Whether you're looking to start a career in web development or add new skills to your toolkit, 
                        this course provides everything you need to succeed in today's digital landscape.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Curriculum */}
                <Card className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)]">
                  <CardHeader>
                    <CardTitle className="text-2xl font-heading font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                      Course Curriculum
                    </CardTitle>
                    <p className="text-[#334155] dark:text-[#E2E8F0]">
                      {modules.length} modules • {totalLessons} lessons • {Math.floor(totalDuration / 60)}h {totalDuration % 60}m total
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {modules.map((module) => (
                      <Collapsible
                        key={module.id}
                        open={expandedModules.includes(module.id)}
                        onOpenChange={() => toggleModule(module.id)}
                      >
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="text-left">
                                <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">{module.title}</h4>
                                <p className="text-sm text-[#334155] dark:text-[#E2E8F0]">
                                  {module.lessons.length} lessons • {module.duration}m
                                </p>
                              </div>
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
                                  <span className="text-[#334155] dark:text-[#E2E8F0]">{lesson.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {lesson.isPreview && (
                                    <Button size="sm" variant="ghost" className="text-[#06B6D4] hover:text-[#0891B2]">
                                      Preview
                                    </Button>
                                  )}
                                  <span className="text-sm text-slate-500">{lesson.duration}m</span>
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
            )}

            {selectedTab === 'instructor' && (
              <Card className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)]">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <Avatar className="w-24 h-24 ring-4 ring-slate-100 dark:ring-slate-700">
                      <AvatarImage src={instructor.avatarUrl} alt={instructor.name} />
                      <AvatarFallback className="text-2xl bg-[#0056D2]/10 text-[#0056D2]">
                        {instructor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-heading font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2">
                        {instructor.name}
                      </h3>
                      <p className="text-[#06B6D4] font-medium mb-3">
                        Senior Full-Stack Developer • San Francisco, CA
                      </p>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">{instructor.ratingAvg}</span>
                          <span className="text-[#334155] dark:text-[#E2E8F0]">({instructor.ratingCount} reviews)</span>
                        </div>
                        <span className="text-[#334155] dark:text-[#E2E8F0]">•</span>
                        <span className="text-[#334155] dark:text-[#E2E8F0]">500+ students</span>
                      </div>
                      <p className="text-[#334155] dark:text-[#E2E8F0] leading-relaxed mb-6">
                        {instructor.bio} With over 8 years of experience in web development, I'm passionate about 
                        teaching others how to build amazing web applications using modern technologies.
                      </p>
                      <Button variant="outline" className="border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white">
                        View More Courses
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedTab === 'reviews' && (
              <div className="space-y-6">
                {/* Overall Rating */}
                <Card className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)]">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2">
                          {course.ratingAvg}
                        </div>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-5 h-5",
                                i < Math.floor(course.ratingAvg) 
                                  ? "fill-amber-400 text-amber-400" 
                                  : "text-slate-300"
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-[#334155] dark:text-[#E2E8F0]">
                          Based on {course.ratingCount} reviews
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm font-medium text-[#334155] dark:text-[#E2E8F0] w-8">
                              {rating}★
                            </span>
                            <Progress value={rating === 5 ? 75 : rating === 4 ? 20 : 5} className="flex-1 h-2" />
                            <span className="text-sm text-[#334155] dark:text-[#E2E8F0] w-12">
                              {rating === 5 ? '75%' : rating === 4 ? '20%' : '5%'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {reviews.map((review) => {
                    const reviewer = users.find(u => u.id === review.userId) || users[0];
                    return (
                      <Card key={review.id} className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)]">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={reviewer.avatarUrl} alt={reviewer.name} />
                              <AvatarFallback>{reviewer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">{reviewer.name}</h4>
                                  <p className="text-sm text-[#334155] dark:text-[#E2E8F0]">
                                    {new Date(review.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={cn(
                                        "w-4 h-4",
                                        i < review.rating 
                                          ? "fill-amber-400 text-amber-400" 
                                          : "text-slate-300"
                                      )}
                                    />
                                  ))}
                                </div>
                              </div>
                              
                              <p className="text-[#334155] dark:text-[#E2E8F0] leading-relaxed mb-4">
                                {review.text}
                              </p>
                              
                              <Button variant="ghost" size="sm" className="text-[#334155] dark:text-[#E2E8F0] hover:text-[#0056D2] hover:bg-[#0056D2]/10">
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                Helpful ({review.helpful})
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Enrollment Card */}
            <Card className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)] sticky top-24">
              <CardContent className="p-6">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Wallet className="w-6 h-6 text-[#06B6D4]" />
                    <span className="text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                      {course.pricePerSeat}
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
                      {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#06B6D4]" />
                    <span className="text-sm text-[#334155] dark:text-[#E2E8F0]">
                      {course.enrolled || course.currentSeats} students
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

                <Badge className="w-full mb-6 bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20 py-2 justify-center">
                  {course.category}
                </Badge>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <Button className="w-full bg-gradient-to-r from-[#0056D2] to-[#06B6D4] hover:from-[#004BB8] hover:to-[#0891B2] text-white py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Enroll Now
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

                <Separator className="mb-6" />

                {/* Guarantee */}
                <div className="flex items-center gap-2 text-sm text-[#334155] dark:text-[#E2E8F0] mb-4">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Credit-back guarantee</span>
                </div>

                {/* Crypto Support */}
                <div className="flex items-center gap-2 text-sm text-[#06B6D4] hover:text-[#0891B2] cursor-pointer transition-colors">
                  <Wallet className="w-4 h-4" />
                  <span>Support instructor with crypto</span>
                </div>
              </CardContent>
            </Card>

            {/* Share Card */}
            <Card className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)]">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-4">Share this course</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Discuss
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Courses */}
        <div className="mt-16">
          <h2 className="text-3xl font-heading font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-8">
            You might also like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedCourses.map((relatedCourse) => (
              <ClassCard
                key={relatedCourse.id}
                course={relatedCourse}
                variant="default"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
