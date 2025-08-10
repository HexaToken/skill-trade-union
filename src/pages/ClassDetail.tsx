import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  Users, 
  Star,
  Globe,
  Award,
  Download,
  Share,
  Heart,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  PlayCircle,
  FileText,
  Code,
  Monitor,
  Wifi,
  Calendar,
  Shield,
  TrendingUp,
  MessageCircle,
  BookOpen,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { classes, users, reviews } from '@/data/courseData';
import type { Class, User, Review } from '@/models/course-types';

export default function ClassDetail() {
  const { id } = useParams<{ id: string }>();
  const [classData, setClassData] = useState<Class | null>(null);
  const [instructor, setInstructor] = useState<User | null>(null);
  const [classReviews, setClassReviews] = useState<Review[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string>('');

  useEffect(() => {
    // Find class data
    const foundClass = classes.find(c => c.id === id);
    if (foundClass) {
      setClassData(foundClass);
      
      // Find instructor
      const foundInstructor = users.find(u => u.id === foundClass.instructorId);
      setInstructor(foundInstructor || null);
      
      // Find reviews
      const foundReviews = reviews.filter(r => r.classId === foundClass.id);
      setClassReviews(foundReviews);
    }
  }, [id]);

  if (!classData || !instructor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-32 h-32 bg-muted rounded-lg mx-auto mb-4" />
            <div className="w-64 h-4 bg-muted rounded mx-auto mb-2" />
            <div className="w-48 h-4 bg-muted rounded mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const totalLessons = classData.sections.reduce((acc, section) => acc + section.lessons.length, 0);
  const enrollmentProgress = (classData.currentSeats || 0) / (classData.maxSeats || 1) * 100;

  const StickyEnrollmentPanel = () => (
    <div className="sticky-panel">
      <div className="mb-6">
        <div className="relative mb-4">
          <img 
            src={classData.thumbnailUrl} 
            alt={classData.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
            <Button
              size="lg"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
              onClick={() => setShowPreview(true)}
            >
              <Play className="w-6 h-6 mr-2" />
              Preview
            </Button>
          </div>
        </div>
        
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-brand-primary mb-1">
            {classData.priceCredits} credits
          </div>
          <p className="text-sm text-muted-foreground">One-time enrollment</p>
        </div>
        
        <Button 
          className="w-full btn-neo text-lg py-3 mb-3"
          disabled={isEnrolled}
        >
          {isEnrolled ? 'Enrolled' : 'Enroll Now'}
        </Button>
        
        <Button variant="outline" className="w-full mb-4">
          Add to Wishlist
          <Heart className="w-4 h-4 ml-2" />
        </Button>
        
        <div className="text-xs text-center text-muted-foreground mb-4">
          30-day money-back guarantee
        </div>
      </div>

      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Instructor</span>
          <span className="font-medium">{instructor.name}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Duration</span>
          <span className="font-medium">{formatDuration(classData.durationMins)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Lessons</span>
          <span className="font-medium">{totalLessons}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Level</span>
          <span className="font-medium">{classData.level}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Language</span>
          <span className="font-medium">{classData.language}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Students</span>
          <span className="font-medium">{classData.studentsCount.toLocaleString()}</span>
        </div>
      </div>

      {classData.type === 'live' && classData.maxSeats && (
        <div className="mt-6 p-4 bg-brand-warning/10 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Seats Available</span>
            <span className="text-sm">{(classData.maxSeats - (classData.currentSeats || 0))} left</span>
          </div>
          <Progress value={enrollmentProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {enrollmentProgress > 80 && 'Filling fast! '}
            Register early to secure your spot.
          </p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="outline" size="sm" className="flex-1">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );

  const InstructorSection = () => (
    <Card className="instructor-card">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={instructor.avatarUrl} alt={instructor.name} />
            <AvatarFallback className="text-xl">
              {instructor.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1">{instructor.name}</h3>
            <p className="text-muted-foreground mb-3">{instructor.headline}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-brand-warning text-brand-warning" />
                <span>{instructor.ratingAvg} Instructor Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-secondary" />
                <span>{instructor.ratingCount} Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-green" />
                <span>{instructor.totalStudents?.toLocaleString()} Students</span>
              </div>
              <div className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-brand-primary" />
                <span>{instructor.totalClasses} Classes</span>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {instructor.bio}
        </p>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/profile/${instructor.id}`}>
              View Profile
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Course Header */}
      <div className="course-header">
        <div className="course-content">
          <div className="course-layout">
            <div className="course-main">
              <div className="mb-4">
                <Badge variant="outline" className="mb-2">
                  {classData.category}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                  {classData.title}
                </h1>
                {classData.subtitle && (
                  <p className="text-xl text-muted-foreground mb-4">
                    {classData.subtitle}
                  </p>
                )}
                <p className="text-muted-foreground mb-6">
                  {classData.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={cn(
                          "w-4 h-4",
                          i < Math.floor(classData.ratingAvg) 
                            ? "fill-brand-warning text-brand-warning" 
                            : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-medium ml-2">{classData.ratingAvg}</span>
                  <span className="text-muted-foreground">
                    ({classData.ratingCount} ratings)
                  </span>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{classData.studentsCount.toLocaleString()} students</span>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(classData.durationMins)}</span>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span>{classData.language}</span>
                </div>

                <Badge className={cn(
                  classData.level === 'Beginner' && 'difficulty-1',
                  classData.level === 'Intermediate' && 'difficulty-2',
                  classData.level === 'Advanced' && 'difficulty-3'
                )}>
                  {classData.level}
                </Badge>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={instructor.avatarUrl} alt={instructor.name} />
                  <AvatarFallback>
                    {instructor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground">Created by</p>
                  <Link 
                    to={`/profile/${instructor.id}`}
                    className="font-medium hover:text-brand-primary transition-colors"
                  >
                    {instructor.name}
                  </Link>
                </div>
              </div>
            </div>

            {/* Desktop Sticky Panel */}
            <div className="course-sidebar hidden lg:block">
              <StickyEnrollmentPanel />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Enrollment Panel */}
      <div className="lg:hidden bg-card border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-brand-primary">
              {classData.priceCredits} credits
            </div>
            <p className="text-sm text-muted-foreground">One-time enrollment</p>
          </div>
          <Button className="btn-neo">
            Enroll Now
          </Button>
        </div>
      </div>

      {/* Course Content */}
      <div className="course-content py-8">
        <div className="course-layout">
          <div className="course-main">
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                {/* What You'll Learn */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-brand-primary" />
                      What you'll learn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {classData.outcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-brand-green mt-0.5 shrink-0" />
                          <span className="text-sm">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {classData.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" />
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Course Content Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Course content</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {classData.sections.length} sections • {totalLessons} lessons • {formatDuration(classData.durationMins)} total length
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible value={expandedSection} onValueChange={setExpandedSection}>
                      {classData.sections.slice(0, 3).map((section) => (
                        <AccordionItem key={section.id} value={section.id} className="curriculum-section">
                          <AccordionTrigger className="curriculum-header">
                            <div className="flex items-center justify-between w-full mr-4">
                              <span className="font-medium">{section.title}</span>
                              <span className="text-sm text-muted-foreground">
                                {section.lessons.length} lessons
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            {section.lessons.map((lesson) => (
                              <div key={lesson.id} className="lesson-item">
                                <div className="flex items-center gap-3">
                                  <PlayCircle className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">{lesson.title}</span>
                                  {lesson.previewable && (
                                    <Badge variant="outline" className="lesson-preview">
                                      Preview
                                    </Badge>
                                  )}
                                </div>
                                <span className="lesson-duration">
                                  {formatDuration(lesson.durationMins)}
                                </span>
                              </div>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    
                    {classData.sections.length > 3 && (
                      <div className="text-center mt-4">
                        <p className="text-sm text-muted-foreground mb-3">
                          {classData.sections.length - 3} more sections available after enrollment
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum">
                <Card>
                  <CardHeader>
                    <CardTitle>Complete Curriculum</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {classData.sections.length} sections • {totalLessons} lessons • {formatDuration(classData.durationMins)} total length
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      {classData.sections.map((section) => (
                        <AccordionItem key={section.id} value={section.id} className="curriculum-section">
                          <AccordionTrigger className="curriculum-header">
                            <div className="flex items-center justify-between w-full mr-4">
                              <div>
                                <h3 className="font-medium text-left">{section.title}</h3>
                                {section.description && (
                                  <p className="text-sm text-muted-foreground text-left mt-1">
                                    {section.description}
                                  </p>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {section.lessons.length} lessons
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            {section.lessons.map((lesson) => (
                              <div key={lesson.id} className="lesson-item">
                                <div className="flex items-center gap-3">
                                  <PlayCircle className="w-4 h-4 text-muted-foreground" />
                                  <div className="flex-1">
                                    <span className="text-sm font-medium">{lesson.title}</span>
                                    {lesson.description && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {lesson.description}
                                      </p>
                                    )}
                                  </div>
                                  {lesson.previewable && (
                                    <Badge variant="outline" className="lesson-preview">
                                      Preview
                                    </Badge>
                                  )}
                                </div>
                                <span className="lesson-duration">
                                  {formatDuration(lesson.durationMins)}
                                </span>
                              </div>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor">
                <InstructorSection />
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Student feedback</CardTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold text-brand-primary">
                          {classData.ratingAvg}
                        </div>
                        <div>
                          <div className="flex items-center mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={cn(
                                  "w-4 h-4",
                                  i < Math.floor(classData.ratingAvg) 
                                    ? "fill-brand-warning text-brand-warning" 
                                    : "text-muted-foreground/30"
                                )}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Class Rating
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {classData.ratingCount.toLocaleString()} ratings
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {classReviews.map((review) => {
                        const reviewer = users.find(u => u.id === review.reviewerId);
                        return (
                          <div key={review.id} className="border-b pb-6 last:border-b-0">
                            <div className="flex items-start gap-4">
                              {reviewer && (
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={reviewer.avatarUrl} alt={reviewer.name} />
                                  <AvatarFallback>
                                    {reviewer.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium">{reviewer?.name}</span>
                                  <div className="flex items-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={cn(
                                          "w-3 h-3",
                                          i < review.rating 
                                            ? "fill-brand-warning text-brand-warning" 
                                            : "text-muted-foreground/30"
                                        )}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                {review.title && (
                                  <h4 className="font-medium mb-2">{review.title}</h4>
                                )}
                                <p className="text-sm text-muted-foreground">
                                  {review.text}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Desktop Sticky Panel (repeated for correct layout) */}
          <div className="course-sidebar hidden lg:block">
            {/* Sticky panel is rendered above */}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
            <DialogDescription>
              Get a preview of what's inside this course
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Video preview would play here</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
