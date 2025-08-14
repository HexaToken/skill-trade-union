import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Users, 
  CheckCircle, 
  Play, 
  Heart,
  ShieldCheck,
  Coins,
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
  Monitor,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Copy,
  Lock,
  MoreHorizontal
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

interface CourseDetailPageProps {
  className?: string;
}

export default function CourseDetailPage({ className }: CourseDetailPageProps) {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const [expandedModules, setExpandedModules] = useState<string[]>(['m1']);
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [expandAllModules, setExpandAllModules] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullInstructorBio, setShowFullInstructorBio] = useState(false);

  // In a real app, this would fetch based on courseSlug
  const course = courseDetailData;
  const instructor = course?.instructor;

  // Mock FAQs data
  const faqs = [
    {
      id: 'faq1',
      question: 'How long do I have access to the course?',
      answer: 'You have lifetime access to this course. Once enrolled, you can watch the videos and access materials anytime, anywhere.'
    },
    {
      id: 'faq2',
      question: 'Are there any prerequisites for this course?',
      answer: 'Basic design software knowledge (Figma, Sketch, or similar) and understanding of marketing fundamentals would be helpful but not required.'
    },
    {
      id: 'faq3',
      question: 'Will I receive a certificate of completion?',
      answer: 'Yes! Upon completing the course, you\'ll receive a certificate of completion that you can add to your LinkedIn profile and resume.'
    },
    {
      id: 'faq4',
      question: 'What if I\'m not satisfied with the course?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with the course content, you can request a full refund within 30 days of purchase.'
    }
  ];

  // Return loading state or 404 if course not found
  if (!course) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ink-head mb-4">
            Course Not Found
          </h1>
          <p className="text-ink-body">
            The course you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const toggleFaq = (faqId: string) => {
    setExpandedFaqs(prev => 
      prev.includes(faqId) 
        ? prev.filter(id => id !== faqId)
        : [...prev, faqId]
    );
  };

  const toggleAllModules = () => {
    if (expandAllModules) {
      setExpandedModules([]);
    } else {
      setExpandedModules(course.curriculum?.map(m => m.id) || []);
    }
    setExpandAllModules(!expandAllModules);
  };

  const totalDuration = course.curriculum?.reduce((total, module) => {
    const [hours, minutes] = module.duration.split('h ');
    const moduleMinutes = parseInt(hours) * 60 + parseInt(minutes.replace('m', ''));
    return total + moduleMinutes;
  }, 0) || 0;

  const totalLessons = course.curriculum?.reduce((total, module) => total + module.lessons.length, 0) || 0;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const ratingDistribution = [
    { stars: 5, percentage: 75 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 3 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 1 }
  ];

  return (
    <div className={cn("min-h-screen bg-canvas", className)}>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-600 to-secondary">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>
        
        <div className="relative page-container py-16 lg:py-24">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-white/70 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/classes" className="hover:text-white transition-colors">Classes</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/classes?category=${course.category}`} className="hover:text-white transition-colors">{course.category}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{course.title}</span>
          </nav>

          <div className="max-w-4xl">
            {/* Course Title with Gradient Underline */}
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {course.title}
              <div className="h-1 w-32 bg-brand-gradient rounded-full mt-2"></div>
            </h1>

            {/* Course Subtitle */}
            <p className="text-lg lg:text-xl text-white/90 mb-6 leading-relaxed max-w-3xl">
              {course.subtitle}
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-4 text-white/80 mb-6">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "w-4 h-4",
                        i < Math.floor(course.ratingAvg) 
                          ? "fill-warning text-warning" 
                          : "text-white/30"
                      )}
                    />
                  ))}
                </div>
                <span className="font-semibold text-white">{course.ratingAvg}</span>
                <span>({course.ratingCount.toLocaleString()} reviews)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{course.learners.toLocaleString()} learners</span>
              </div>
              <span>•</span>
              <Badge className="bg-success/20 text-success border-success/30">
                {course.level}
              </Badge>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>{course.language}</span>
              </div>
              <span>•</span>
              <span>Updated January 2025</span>
            </div>

            {/* Social Share Icons - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <span className="text-white/60 text-sm">Share:</span>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                <Copy className="w-4 h-4" />
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
            
            {/* What You'll Learn */}
            <Card className="bg-surface border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-ink-head">
                  What You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.outcomes.map((outcome, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 group cursor-pointer hover:bg-elevated p-3 rounded-lg transition-all duration-200"
                    >
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-ink-body group-hover:text-ink-head transition-colors">{outcome}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Description */}
            <Card className="bg-surface border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-ink-head">
                  Course Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Quick Tags */}
                <div className="flex flex-wrap gap-2 mb-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Beginner Friendly
                  </Badge>
                  <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                    Projects Included
                  </Badge>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    Certificate
                  </Badge>
                </div>

                <div 
                  className={cn(
                    "prose prose-slate dark:prose-invert max-w-none text-ink-body transition-all duration-300",
                    !showFullDescription && "line-clamp-6"
                  )}
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
                
                {course.description.length > 500 && (
                  <Button
                    variant="ghost"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-4 text-primary hover:text-primary-600 p-0"
                  >
                    {showFullDescription ? 'Show less' : 'Show more'}
                    <ChevronDown className={cn("w-4 h-4 ml-2 transition-transform", showFullDescription && "rotate-180")} />
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Curriculum */}
            <Card className="bg-surface border-border shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-ink-head">
                      Course Curriculum
                    </CardTitle>
                    <p className="text-ink-body mt-1">
                      {course.curriculum.length} modules • {totalLessons} lessons • {formatDuration(totalDuration)} total
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={toggleAllModules}
                      className="text-primary border-primary/20 hover:bg-primary/10"
                    >
                      {expandAllModules ? 'Collapse All' : 'Expand All'}
                    </Button>
                  </div>
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
                      <div className="flex items-center justify-between p-4 bg-elevated rounded-lg hover:shadow-sm transition-all duration-200 border border-border hover:border-primary/20">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-primary" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-semibold text-ink-head">
                              {module.title}
                            </h4>
                            <p className="text-sm text-ink-body">
                              {module.lessons.length} lessons • {module.duration}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={0} 
                            className="w-16 h-2" 
                          />
                          {expandedModules.includes(module.id) ? (
                            <ChevronUp className="w-5 h-5 text-ink-body" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-ink-body" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="ml-4 space-y-2">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-secondary/10 rounded flex items-center justify-center">
                                {lesson.preview ? (
                                  <Play className="w-3 h-3 text-secondary" />
                                ) : (
                                  <Lock className="w-3 h-3 text-ink-body" />
                                )}
                              </div>
                              <span className="text-ink-body">
                                {lesson.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {lesson.preview && (
                                <Button size="sm" variant="ghost" className="text-secondary hover:text-secondary/80 hover:bg-secondary/10">
                                  Preview
                                </Button>
                              )}
                              <span className="text-sm text-ink-body">{lesson.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>

            {/* Instructor Bio */}
            <Card className="bg-surface border-border shadow-sm">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <Avatar className="w-24 h-24 ring-4 ring-primary/20">
                    <AvatarImage src={instructor.avatar} alt={instructor.name} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                      {instructor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-ink-head mb-2">
                      {instructor.name}
                    </h3>
                    <p className="text-secondary font-medium mb-1">
                      {instructor.title}
                    </p>
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1 text-ink-body">
                        <MapPin className="w-4 h-4" />
                        <span>{instructor.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-ink-body">
                        <Globe className="w-4 h-4" />
                        <span>{instructor.languages.join(', ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-warning text-warning" />
                        <span className="font-semibold text-ink-head">{instructor.ratingAvg}</span>
                        <span className="text-ink-body">({instructor.ratingCount} reviews)</span>
                      </div>
                      <span className="text-ink-body">•</span>
                      <span className="text-ink-body">500+ students taught</span>
                    </div>
                    <div className={cn("text-ink-body leading-relaxed mb-6", !showFullInstructorBio && "line-clamp-3")}>
                      {instructor.bio}
                    </div>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-secondary text-secondary hover:bg-secondary hover:text-white"
                        asChild
                      >
                        <Link to={`/mentor/${instructor.slug}`}>View Mentor Profile</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFullInstructorBio(!showFullInstructorBio)}
                        className="text-primary hover:text-primary-600 p-0"
                      >
                        {showFullInstructorBio ? 'Show less' : 'Read more'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="bg-surface border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-ink-head">
                  Student Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Aggregate Rating */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-ink-head mb-2">
                      {course.ratingAvg}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-5 h-5",
                            i < Math.floor(course.ratingAvg) 
                              ? "fill-warning text-warning" 
                              : "text-border"
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-ink-body">
                      Based on {course.ratingCount.toLocaleString()} reviews
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {ratingDistribution.map((rating) => (
                      <div key={rating.stars} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-ink-body w-8">
                          {rating.stars}★
                        </span>
                        <Progress 
                          value={rating.percentage} 
                          className="flex-1 h-2" 
                        />
                        <span className="text-sm text-ink-body w-12">
                          {rating.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {course.reviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                      <div className="flex gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={review.userAvatar} alt={review.userName} />
                          <AvatarFallback>{review.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-ink-head">{review.userName}</h4>
                              <p className="text-sm text-ink-body">
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
                                      ? "fill-warning text-warning" 
                                      : "text-border"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <p className="text-ink-body leading-relaxed mb-4">
                            {review.text}
                          </p>
                          
                          <Button variant="ghost" size="sm" className="text-ink-body hover:text-primary hover:bg-primary/10 p-0">
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

            {/* FAQ */}
            <Card className="bg-surface border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-ink-head">
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq) => (
                  <Collapsible
                    key={faq.id}
                    open={expandedFaqs.includes(faq.id)}
                    onOpenChange={() => toggleFaq(faq.id)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 bg-elevated rounded-lg hover:shadow-sm transition-all duration-200 border border-border">
                        <h4 className="font-semibold text-ink-head text-left">
                          {faq.question}
                        </h4>
                        {expandedFaqs.includes(faq.id) ? (
                          <ChevronUp className="w-5 h-5 text-ink-body" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-ink-body" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="p-4 text-ink-body leading-relaxed">
                        {faq.answer}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              {/* Enrollment Card */}
              <Card className="bg-surface border-border shadow-lg">
                <CardContent className="p-6">
                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Coins className="w-6 h-6 text-secondary" />
                      <span className="text-3xl font-bold text-ink-head">
                        {course.credits}
                      </span>
                      <span className="text-lg text-ink-body">Credits</span>
                    </div>
                    <p className="text-sm text-ink-body">One-time payment</p>
                  </div>

                  {/* Primary CTA */}
                  <Button className="w-full bg-primary hover:bg-primary-600 text-white py-3 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 mb-3">
                    <Coins className="w-5 h-5 mr-2" />
                    Enroll Now
                  </Button>

                  {/* Secondary CTA */}
                  <Button 
                    variant="outline" 
                    className="w-full border-border text-ink-body hover:bg-elevated rounded-lg mb-6"
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Heart className={cn("w-4 h-4 mr-2", isSaved && "fill-current text-red-500")} />
                    {isSaved ? 'Saved' : 'Save for Later'}
                  </Button>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-4 mb-6 text-xs text-ink-body">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-success" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-success" />
                      <span>Guaranteed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span>Verified</span>
                    </div>
                  </div>

                  <Separator className="mb-6" />

                  {/* Course Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span className="text-sm text-ink-body">Duration</span>
                      </div>
                      <span className="text-sm font-medium text-ink-head">{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-secondary" />
                        <span className="text-sm text-ink-body">Students</span>
                      </div>
                      <span className="text-sm font-medium text-ink-head">{course.learners.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-secondary" />
                        <span className="text-sm text-ink-body">Language</span>
                      </div>
                      <span className="text-sm font-medium text-ink-head">{course.language}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-secondary" />
                        <span className="text-sm text-ink-body">Certificate</span>
                      </div>
                      <span className="text-sm font-medium text-ink-head">Yes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Share - Mobile */}
              <Card className="bg-surface border-border shadow-sm lg:hidden">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-ink-head mb-4">Share this course</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 border-border text-ink-body hover:border-primary hover:text-primary">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 border-border text-ink-body hover:border-secondary hover:text-secondary">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Discuss
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Courses Carousel */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-ink-head mb-8">
            You might also like
          </h2>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max lg:grid lg:grid-cols-4 lg:min-w-0">
              {relatedCourses.map((relatedCourse) => (
                <Card
                  key={relatedCourse.id}
                  className="min-w-[280px] lg:min-w-0 hover:shadow-lg cursor-pointer overflow-hidden bg-surface border-border transition-all duration-300 hover:scale-105 group"
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
                    <h3 className="font-semibold text-ink-head mb-2 line-clamp-2">
                      {relatedCourse.title}
                    </h3>
                    <p className="text-sm text-ink-body mb-3 line-clamp-2">
                      {relatedCourse.subtitle}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-warning text-warning" />
                        <span className="text-xs font-medium">{relatedCourse.ratingAvg}</span>
                        <span className="text-xs text-ink-body">
                          ({relatedCourse.ratingCount})
                        </span>
                      </div>
                      <div className="font-bold text-secondary">
                        {relatedCourse.credits} credits
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 shadow-lg">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 border-border"
            onClick={() => setIsSaved(!isSaved)}
          >
            <Heart className={cn("w-4 h-4", isSaved && "fill-current text-red-500")} />
          </Button>
          <Button className="flex-1 bg-primary hover:bg-primary-600 text-white font-semibold">
            Enroll Now - {course.credits} Credits
          </Button>
        </div>
      </div>
    </div>
  );
}
