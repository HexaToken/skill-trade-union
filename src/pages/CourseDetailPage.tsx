import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Users, 
  CheckCircle, 
  Play, 
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
  MessageCircle,
  Share2,
  ChevronRight,
  Download,
  Zap,
  Coins,
  Monitor,
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
import { courseDetailData, relatedCourses } from '@/data/courseData';
import BookingModalUnified from '@/components/BookingModalUnified';
import InstantHelpDrawer from '@/components/InstantHelpDrawer';

interface CourseDetailPageProps {
  className?: string;
}

export default function CourseDetailPage({ className }: CourseDetailPageProps) {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState<string[]>(['m1']);
  const [isSaved, setIsSaved] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showInstantHelp, setShowInstantHelp] = useState(false);
  const [expandAllModules, setExpandAllModules] = useState(false);

  // In a real app, this would fetch based on courseSlug
  const course = courseDetailData;
  const instructor = course.instructor;

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const toggleAllModules = () => {
    if (expandAllModules) {
      setExpandedModules([]);
    } else {
      setExpandedModules(course.curriculum.map(m => m.id));
    }
    setExpandAllModules(!expandAllModules);
  };

  const totalDuration = course.curriculum.reduce((total, module) => {
    const [hours, minutes] = module.duration.split('h ');
    const moduleMinutes = parseInt(hours) * 60 + parseInt(minutes.replace('m', ''));
    return total + moduleMinutes;
  }, 0);

  const totalLessons = course.curriculum.reduce((total, module) => total + module.lessons.length, 0);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleRelatedCourseClick = (courseSlug: string) => {
    navigate(`/classes/${courseSlug}`);
  };

  return (
    <div className={cn("min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A]", className)}>
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A]">
        {/* Background Image with Overlay */}
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
          <nav className="flex items-center space-x-2 text-sm text-slate-300 mb-6 animate-fade-in">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/classes" className="hover:text-white transition-colors">Classes</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/classes?category=${course.category}`} className="hover:text-white transition-colors">{course.category}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{course.title}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column - Hero Content */}
            <div className="lg:col-span-8 animate-fade-in">
              {/* Course Title */}
              <h1 className="text-educational-h1 lg:text-[3rem] lg:leading-[3.5rem] font-heading font-extrabold text-white mb-4">
                {course.title}
              </h1>

              {/* Course Subtitle */}
              <p className="text-lg lg:text-xl text-slate-200 mb-6 leading-relaxed max-w-4xl">
                {course.subtitle}
              </p>

              {/* Meta Row */}
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
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>{course.language}</span>
                </div>
              </div>

              {/* CTAs - Mobile Only */}
              <div className="flex flex-col sm:flex-row gap-4 lg:hidden">
                <Button
                  className="bg-gradient-to-r from-[#0056D2] to-[#06B6D4] hover:from-[#004BB8] hover:to-[#0891B2] text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform"
                  onClick={() => setShowBookingModal(true)}
                >
                  <Coins className="w-5 h-5 mr-2" />
                  Enroll with {course.credits} Credits
                </Button>
                <Button
                  variant="outline"
                  className="border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 transition-all duration-300 hover:scale-105 transform"
                  onClick={() => setIsSaved(!isSaved)}
                >
                  <Heart className={cn("w-4 h-4 mr-2", isSaved && "fill-current")} />
                  {isSaved ? 'Saved' : 'Save for Later'}
                </Button>
              </div>

              {/* Need Help Now CTA */}
              <div className="mt-6 lg:hidden">
                <Button 
                  variant="ghost" 
                  className="text-[#06B6D4] hover:text-[#0891B2] hover:bg-[#06B6D4]/10 p-0"
                  onClick={() => setShowInstantHelp(true)}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Need help now? Get instant expert assistance
                </Button>
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
            <Card className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)] shadow-lg animate-fade-in">
              <CardHeader>
                <CardTitle className="text-educational-h2 font-heading text-[#0F172A] dark:text-[#F1F5F9]">
                  What You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#0056D2] mt-0.5 flex-shrink-0" />
                      <span className="text-educational-body text-[#334155] dark:text-[#E2E8F0]">{outcome}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Description */}
            <Card className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)] shadow-lg">
              <CardHeader>
                <CardTitle className="text-educational-h2 font-heading text-[#0F172A] dark:text-[#F1F5F9]">
                  Course Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-slate dark:prose-invert max-w-none text-educational-body"
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
              </CardContent>
            </Card>

            {/* Instructor Bio */}
            <Card className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)] shadow-lg">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <Avatar className="w-24 h-24 ring-4 ring-[#06B6D4]/20">
                    <AvatarImage src={instructor.avatar} alt={instructor.name} />
                    <AvatarFallback className="text-2xl bg-[#0056D2]/10 text-[#0056D2] font-heading">
                      {instructor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="text-educational-h2 font-heading text-[#0F172A] dark:text-[#F1F5F9] mb-2">
                      {instructor.name}
                    </h3>
                    <p className="text-[#06B6D4] font-medium mb-1">
                      {instructor.title}
                    </p>
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1 text-[#334155] dark:text-[#E2E8F0]">
                        <MapPin className="w-4 h-4" />
                        <span>{instructor.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#334155] dark:text-[#E2E8F0]">
                        <Globe className="w-4 h-4" />
                        <span>{instructor.languages.join(', ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">{instructor.ratingAvg}</span>
                        <span className="text-[#334155] dark:text-[#E2E8F0]">({instructor.ratingCount} reviews)</span>
                      </div>
                    </div>
                    <p className="text-educational-body text-[#334155] dark:text-[#E2E8F0] leading-relaxed mb-6">
                      {instructor.bio}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white"
                        asChild
                      >
                        <Link to={`/mentor/${instructor.slug}`}>View Mentor Profile</Link>
                      </Button>
                      {instructor.website && (
                        <Button variant="ghost" size="sm" className="text-[#334155] dark:text-[#E2E8F0]">
                          Website
                        </Button>
                      )}
                      {instructor.linkedin && (
                        <Button variant="ghost" size="sm" className="text-[#334155] dark:text-[#E2E8F0]">
                          LinkedIn
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Curriculum */}
            <Card className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)] shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-educational-h2 font-heading text-[#0F172A] dark:text-[#F1F5F9]">
                      Course Curriculum
                    </CardTitle>
                    <p className="text-educational-body text-[#334155] dark:text-[#E2E8F0] mt-1">
                      {course.curriculum.length} modules • {totalLessons} lessons • {formatDuration(totalDuration)} total
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={toggleAllModules}
                    className="text-[#06B6D4] hover:text-[#0891B2] hover:bg-[#06B6D4]/10"
                  >
                    {expandAllModules ? 'Collapse all' : 'Expand all'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.curriculum.map((module) => (
                  <Collapsible
                    key={module.id}
                    open={expandedModules.includes(module.id)}
                    onOpenChange={() => toggleModule(module.id)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 border border-slate-200 dark:border-slate-700 hover:border-[#06B6D4]/30">
                        <div className="flex items-center gap-4">
                          <div className="text-left">
                            <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9] text-educational-body">
                              {module.title}
                            </h4>
                            <p className="text-sm text-[#334155] dark:text-[#E2E8F0]">
                              {module.lessons.length} lessons • {module.duration}
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
                    <CollapsibleContent className="mt-2 animate-accordion-down">
                      <div className="ml-4 space-y-2">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                              <Play className="w-4 h-4 text-[#06B6D4]" />
                              <span className="text-educational-body text-[#334155] dark:text-[#E2E8F0]">
                                {lesson.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {lesson.preview && (
                                <Button size="sm" variant="ghost" className="text-[#06B6D4] hover:text-[#0891B2] hover:bg-[#06B6D4]/10">
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

            {/* Reviews */}
            <Card className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)] shadow-lg">
              <CardHeader>
                <CardTitle className="text-educational-h2 font-heading text-[#0F172A] dark:text-[#F1F5F9]">
                  Student Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Overall Rating */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
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
                    <p className="text-educational-body text-[#334155] dark:text-[#E2E8F0]">
                      Based on {course.ratingCount.toLocaleString()} reviews
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-[#334155] dark:text-[#E2E8F0] w-8">
                          {rating}★
                        </span>
                        <Progress 
                          value={rating === 5 ? 75 : rating === 4 ? 20 : rating === 3 ? 3 : rating === 2 ? 1 : 1} 
                          className="flex-1 h-2" 
                        />
                        <span className="text-sm text-[#334155] dark:text-[#E2E8F0] w-12">
                          {rating === 5 ? '75%' : rating === 4 ? '20%' : rating === 3 ? '3%' : rating === 2 ? '1%' : '1%'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {course.reviews.map((review) => (
                    <div key={review.id} className="border-b border-slate-200 dark:border-slate-700 pb-6 last:border-b-0">
                      <div className="flex gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={review.userAvatar} alt={review.userName} />
                          <AvatarFallback>{review.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">{review.userName}</h4>
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
                          
                          <p className="text-educational-body text-[#334155] dark:text-[#E2E8F0] leading-relaxed mb-4">
                            {review.text}
                          </p>
                          
                          <Button variant="ghost" size="sm" className="text-[#334155] dark:text-[#E2E8F0] hover:text-[#0056D2] hover:bg-[#0056D2]/10 p-0">
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Helpful ({review.helpful})
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Enrollment Card */}
            <Card className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)] shadow-lg lg:sticky lg:top-6 animate-fade-in">
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

                {/* Cohort/Self-paced Info */}
                {course.isSelfPaced ? (
                  <Badge className="w-full mb-6 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800 py-2 justify-center">
                    Start anytime
                  </Badge>
                ) : course.cohort && (
                  <Badge className="w-full mb-6 bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20 py-2 justify-center">
                    Next cohort: {new Date(course.cohort.nextStart).toLocaleDateString()}
                  </Badge>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <Button
                    className="w-full bg-gradient-to-r from-[#0056D2] to-[#06B6D4] hover:from-[#004BB8] hover:to-[#0891B2] text-white py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
                    onClick={() => setShowBookingModal(true)}
                  >
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

                <Separator className="mb-6" />

                {/* Key Facts */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">Key Facts</h4>
                  <ul className="space-y-2 text-sm text-[#334155] dark:text-[#E2E8F0]">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#0056D2] mt-0.5 flex-shrink-0" />
                      <span>{course.accessLength}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#0056D2] mt-0.5 flex-shrink-0" />
                      <span>Works on mobile and desktop</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#0056D2] mt-0.5 flex-shrink-0" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#0056D2] mt-0.5 flex-shrink-0" />
                      <span>Download resources and materials</span>
                    </li>
                  </ul>
                </div>

                <Separator className="mb-6" />

                {/* Guarantee */}
                <div className="flex items-center gap-2 text-sm text-[#334155] dark:text-[#E2E8F0] mb-4">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Credit-back guarantee</span>
                </div>
              </CardContent>
            </Card>

            {/* Instant Expert Help */}
            <Card className="bg-gradient-to-r from-[#0056D2]/10 to-[#06B6D4]/10 border border-[#06B6D4]/20 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-[#0056D2] to-[#06B6D4] rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">Need help now?</h3>
                    <p className="text-sm text-[#334155] dark:text-[#E2E8F0]">Get instant expert assistance</p>
                  </div>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-[#0056D2] to-[#06B6D4] hover:from-[#004BB8] hover:to-[#0891B2] text-white font-semibold rounded-xl"
                  onClick={() => setShowInstantHelp(true)}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Get help now — pay per minute
                </Button>
              </CardContent>
            </Card>

            {/* Share Card */}
            <Card className="bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)] shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-4">Share this course</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-[#06B6D4]/20 text-[#334155] dark:text-[#E2E8F0] hover:border-[#06B6D4] hover:text-[#06B6D4]">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-[#06B6D4]/20 text-[#334155] dark:text-[#E2E8F0] hover:border-[#06B6D4] hover:text-[#06B6D4]">
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
          <h2 className="text-educational-h1 font-heading text-[#0F172A] dark:text-[#F1F5F9] mb-8">
            You might also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4 lg:overflow-x-visible lg:pb-0">
            {relatedCourses.map((relatedCourse) => (
              <Card
                key={relatedCourse.id}
                className="hover-lift cursor-pointer overflow-hidden bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                onClick={() => handleRelatedCourseClick(relatedCourse.slug)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={relatedCourse.thumbnail}
                    alt={relatedCourse.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute bottom-3 right-3">
                    <Badge className="bg-black/70 text-white border-0" size="sm">
                      <Clock className="w-3 h-3 mr-1" />
                      {relatedCourse.duration}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-2 line-clamp-2">
                    {relatedCourse.title}
                  </h3>
                  <p className="text-sm text-[#334155] dark:text-[#E2E8F0] mb-3 line-clamp-2">
                    {relatedCourse.subtitle}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium">{relatedCourse.ratingAvg}</span>
                      <span className="text-xs text-[#334155] dark:text-[#E2E8F0]">
                        ({relatedCourse.ratingCount})
                      </span>
                    </div>
                    <div className="font-bold text-[#06B6D4]">
                      {relatedCourse.credits} credits
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModalUnified
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        mode="course"
        course={{
          id: course.id,
          title: course.title,
          image: course.thumbnail,
          credits: course.credits,
          instructor: instructor.name,
          category: course.category,
          duration: course.duration,
          nextCohortDate: course.cohort?.nextStart,
          selfPaced: course.isSelfPaced
        }}
        userBalance={720} // Mock user balance
        onBookingConfirm={(bookingData) => {
          console.log('Booking confirmed:', bookingData);
          setShowBookingModal(false);
        }}
      />

      {/* Instant Help Drawer */}
      <InstantHelpDrawer
        isOpen={showInstantHelp}
        onClose={() => setShowInstantHelp(false)}
        context={{
          type: 'course',
          courseId: course.id,
          courseTitle: course.title,
          topic: course.category
        }}
      />
    </div>
  );
}
