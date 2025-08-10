import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Users, 
  Globe, 
  Award, 
  CheckCircle,
  Play,
  Download,
  Calendar,
  MapPin,
  Share2,
  Heart,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Zap,
  BookOpen,
  Target,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import StickyPanel from '@/components/StickyPanel';
import InstantHelpDrawer from '@/components/InstantHelpDrawer';
import { cn } from '@/lib/utils';
import { courses } from '@/mock/enhanced-data';
import { users, skills, reviews } from '@/data/mockData';
import type { Course } from '@/models/expert-types';

const difficultyLabels = {
  1: { label: 'Beginner', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', description: 'No prior experience required' },
  2: { label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', description: 'Some basic knowledge helpful' },
  3: { label: 'Advanced', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', description: 'Significant experience required' }
};

export default function ClassDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [instructor, setInstructor] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const foundCourse = courses.find(c => c.id === id);
      if (foundCourse) {
        setCourse(foundCourse);
        const foundInstructor = users.find(u => u.id === foundCourse.teacherId);
        setInstructor(foundInstructor);
      }
    }
  }, [id]);

  if (!course || !instructor) {
    return (
      <div className="page-container py-16 text-center">
        <div className="space-y-4">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">Class not found</h2>
          <p className="text-muted-foreground">The class you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/classes')}>
            Browse All Classes
          </Button>
        </div>
      </div>
    );
  }

  const difficulty = difficultyLabels[course.level];
  const seatsRemaining = course.maxSeats - course.currentSeats;
  const seatsPercentage = (course.currentSeats / course.maxSeats) * 100;
  const totalDuration = course.lessons?.reduce((total, lesson) => total + lesson.durationMins, 0) || 
                       course.schedule.length * 120;

  const handleEnroll = () => {
    navigate(`/booking?class=${course.id}`);
  };

  const handleAddToPath = () => {
    console.log('Adding to skill path');
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleInstantHelp = () => {
    console.log('Starting instant help for course');
  };

  const handleMessageInstructor = () => {
    navigate(`/messages?user=${instructor.id}`);
  };

  const relatedClasses = courses.filter(c => c.id !== course.id).slice(0, 3);
  const courseReviews = reviews.slice(0, 5); // Mock reviews

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="page-container py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/classes')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Classes
          </Button>
        </div>
      </div>

      {/* Course Header */}
      <div className="border-b">
        <div className="page-container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and Meta */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={difficulty.color}>
                    {difficulty.label}
                  </Badge>
                  <Badge variant="outline">{course.language}</Badge>
                  {course.badges.map((badge) => {
                    const badgeConfig = {
                      group: { label: 'Group Class', color: 'bg-blue-500 text-white' },
                      materials: { label: 'Materials Included', color: 'bg-green-500 text-white' },
                      recorded: { label: 'Recorded Sessions', color: 'bg-purple-500 text-white' },
                      certificate: { label: 'Certificate', color: 'bg-yellow-500 text-white' }
                    }[badge];
                    
                    return badgeConfig ? (
                      <Badge key={badge} className={badgeConfig.color} variant="secondary">
                        {badgeConfig.label}
                      </Badge>
                    ) : null;
                  })}
                </div>

                <h1 className="text-3xl md:text-4xl font-heading font-bold leading-tight">
                  {course.title}
                </h1>
                
                <p className="text-xl text-muted-foreground">
                  {course.subtitle}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{course.ratingAvg}</span>
                    <span>({course.ratingCount} ratings)</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.enrolled?.toLocaleString()} students</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{Math.round(totalDuration / 60)}h {totalDuration % 60}m total</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span>{course.language}</span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={instructor.avatarUrl} alt={instructor.name} />
                    <AvatarFallback>
                      {instructor.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium">Instructor: {instructor.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{instructor.ratingAvg} instructor rating</span>
                      </div>
                      <span>{instructor.ratingCount} reviews</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleMessageInstructor}>
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                </div>
              </div>

              {/* Course Video/Image */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img 
                  src={course.thumbnailUrl} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button size="lg" className="rounded-full w-16 h-16 p-0">
                    <Play className="w-6 h-6" />
                  </Button>
                </div>
                <Badge className="absolute top-4 left-4 bg-black/80 text-white">
                  Preview
                </Badge>
              </div>
            </div>

            {/* Sticky Enrollment Panel */}
            <div className="lg:col-span-1">
              <StickyPanel
                type="course"
                title="Enroll in this Class"
                price={course.pricePerSeat}
                seatsLeft={seatsRemaining}
                maxSeats={course.maxSeats}
                schedule={course.schedule}
                enrolled={course.enrolled}
                onPrimaryAction={handleEnroll}
                onSecondaryAction={handleAddToPath}
                onInstantHelp={handleInstantHelp}
                onAddToWishlist={handleWishlist}
                onShare={handleShare}
                primaryActionLabel="Enroll Now"
                secondaryActionLabel="Add to Path"
                isInWishlist={isWishlisted}
                canInstantHelp={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* What you'll learn */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      What you'll learn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.outcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Course Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>About this class</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none">
                    <p>{course.description}</p>
                    
                    <h4>Who this class is for:</h4>
                    <ul>
                      <li>Beginners looking to get started in {course.title.toLowerCase()}</li>
                      <li>Professionals seeking to enhance their skills</li>
                      <li>Anyone interested in hands-on learning with expert guidance</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {course.requirements.map((requirement, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{requirement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Course Curriculum
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {course.lessons?.length || 0} lessons • {Math.round(totalDuration / 60)}h {totalDuration % 60}m
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {course.lessons && course.lessons.length > 0 ? (
                      <Accordion type="single" collapsible>
                        {course.lessons.map((lesson, index) => (
                          <AccordionItem key={lesson.id} value={lesson.id}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center justify-between w-full mr-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full text-sm font-medium">
                                    {index + 1}
                                  </div>
                                  <div className="text-left">
                                    <h4 className="font-medium">{lesson.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {lesson.durationMins} minutes
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {lesson.previewable && (
                                    <Badge variant="outline" size="sm">Preview</Badge>
                                  )}
                                  {lesson.materials && lesson.materials.length > 0 && (
                                    <Download className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="ml-11 space-y-3">
                                <p className="text-sm text-muted-foreground">
                                  Detailed lesson content and learning objectives will be covered in this section.
                                </p>
                                {lesson.materials && lesson.materials.length > 0 && (
                                  <div className="space-y-2">
                                    <h5 className="text-sm font-medium">Materials:</h5>
                                    {lesson.materials.map((material, idx) => (
                                      <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Download className="w-3 h-3" />
                                        <span>{material}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {lesson.previewable && (
                                  <Button variant="outline" size="sm">
                                    <Play className="w-4 h-4 mr-2" />
                                    Preview Lesson
                                  </Button>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Curriculum details will be available soon</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      About the Instructor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={instructor.avatarUrl} alt={instructor.name} />
                        <AvatarFallback className="text-lg">
                          {instructor.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <h3 className="text-xl font-semibold">{instructor.name}</h3>
                        <p className="text-muted-foreground">{instructor.bio}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{instructor.ratingAvg}</span>
                            <span className="text-muted-foreground">({instructor.ratingCount} reviews)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>1,200+ students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>5 classes</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Skills & Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {instructor.skillsOffered.map((skill: any) => {
                          const skillData = skills.find(s => s.id === skill.skillId);
                          return skillData ? (
                            <Badge key={skill.skillId} variant="secondary">
                              {skillData.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Verification</h4>
                      <div className="flex flex-wrap gap-2">
                        {instructor.verification.idVerified && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            ID Verified
                          </Badge>
                        )}
                        {instructor.verification.testsPassed.map((test: string) => (
                          <Badge key={test} className="bg-blue-100 text-blue-800">
                            <Award className="w-3 h-3 mr-1" />
                            {test}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button onClick={handleMessageInstructor} className="w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message Instructor
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        Student Reviews
                      </span>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{course.ratingAvg}</span>
                        <span className="text-muted-foreground">({course.ratingCount} reviews)</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Rating breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm w-4">{rating}</span>
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <Progress value={rating === 5 ? 80 : rating === 4 ? 15 : 5} className="flex-1 h-2" />
                            <span className="text-sm text-muted-foreground w-8">
                              {rating === 5 ? '80%' : rating === 4 ? '15%' : '5%'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Individual reviews */}
                    <div className="space-y-6">
                      {courseReviews.map((review, index) => {
                        const reviewer = users.find(u => u.id === review.reviewerId);
                        return (
                          <div key={review.id} className="space-y-3">
                            <div className="flex items-start gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={reviewer?.avatarUrl} alt={reviewer?.name} />
                                <AvatarFallback>
                                  {reviewer?.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{reviewer?.name}</span>
                                  <div className="flex items-center">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm">{review.text}</p>
                              </div>
                            </div>
                            {index < courseReviews.length - 1 && <Separator />}
                          </div>
                        );
                      })}
                    </div>

                    <Button variant="outline" className="w-full">
                      View All Reviews
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Instant Help CTA */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-amber to-brand-green rounded-lg flex items-center justify-center mx-auto">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Need Help Right Now?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get instant expert help with ExpertMatch AI
                    </p>
                  </div>
                  <InstantHelpDrawer
                    trigger={
                      <Button className="w-full bg-gradient-to-r from-brand-amber to-brand-green hover:from-brand-amber/90 hover:to-brand-green/90 text-white border-0">
                        <Zap className="w-4 h-4 mr-2" />
                        Get Instant Help
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Related Classes */}
            <Card>
              <CardHeader>
                <CardTitle>Related Classes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedClasses.map((relatedClass) => (
                  <div 
                    key={relatedClass.id}
                    className="flex gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                    onClick={() => navigate(`/classes/${relatedClass.id}`)}
                  >
                    <img 
                      src={relatedClass.thumbnailUrl} 
                      alt={relatedClass.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-2 mb-1">
                        {relatedClass.title}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{relatedClass.ratingAvg}</span>
                        <span>���</span>
                        <span>{relatedClass.pricePerSeat} credits</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
