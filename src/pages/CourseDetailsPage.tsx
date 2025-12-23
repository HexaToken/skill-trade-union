import { useState } from "react";
import { Star, Users, Clock, Globe, Share2, Play, CheckCircle, ChevronDown, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const CourseDetailsPage = () => {
  const [isEnrolled, setIsEnrolled] = useState(false);

  const course = {
    title: "Advanced React Development with TypeScript",
    subtitle: "Master modern React patterns, hooks, and TypeScript integration for production-ready applications",
    instructor: {
      name: "Sarah Chen",
      title: "Senior Frontend Engineer at Meta",
      avatar: "/api/placeholder/80/80",
      rating: 4.9,
      students: 15420,
      courses: 8,
    },
    rating: 4.8,
    reviewCount: 1234,
    enrolledCount: 2456,
    level: "Advanced",
    duration: "8 weeks",
    credits: 25,
    language: "English",
    lastUpdated: "March 2024",
    image: "/api/placeholder/800/450",
  };

  const curriculum = [
    {
      title: "Introduction & Setup",
      lessons: 5,
      duration: "1h 30m",
      items: [
        "Course Overview and Goals",
        "Development Environment Setup", 
        "TypeScript Configuration",
        "Project Structure Best Practices",
        "First React + TypeScript Component"
      ]
    },
    {
      title: "Advanced React Patterns",
      lessons: 8,
      duration: "3h 45m", 
      items: [
        "Compound Components",
        "Render Props Pattern",
        "Higher-Order Components",
        "Custom Hooks Deep Dive",
        "Context API Patterns"
      ]
    }
  ];

  const learningOutcomes = [
    "Build scalable React applications with TypeScript",
    "Implement advanced React patterns and architectural decisions",
    "Master modern React hooks and custom hook creation",
    "Integrate TypeScript effectively in React projects",
    "Optimize React applications for production",
    "Write comprehensive tests for React components"
  ];

  return (
    <div className="min-h-screen bg-canvas">
      <SiteHeader />

      <main>
        {/* Hero Section */}
        <div className="bg-surface border-b border-border">
          <div className="page-container py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      {course.level}
                    </Badge>
                    <Badge variant="outline" className="border-border text-ink-body">
                      {course.duration}
                    </Badge>
                  </div>

                  <h1 className="text-3xl lg:text-4xl font-bold text-ink-head leading-tight">
                    {course.title}
                  </h1>

                  <p className="text-lg text-ink-body">
                    {course.subtitle}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current text-warning" />
                    <span className="font-medium text-ink-head">{course.rating}</span>
                    <span className="text-ink-body">({course.reviewCount} reviews)</span>
                  </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-ink-body" />
                      <span className="text-ink-body">{course.enrolledCount} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="h-4 w-4 text-ink-body" />
                      <span className="text-ink-body">{course.language}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-ink-body" />
                      <span className="text-ink-body">Updated {course.lastUpdated}</span>
                    </div>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center space-x-4 p-4 bg-elevated rounded-xl border border-border">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                      <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-ink-head">{course.instructor.name}</div>
                      <div className="text-sm text-ink-body">{course.instructor.title}</div>
                      <div className="flex items-center space-x-4 text-xs text-ink-body">
                        <span>⭐ {course.instructor.rating} instructor rating</span>
                        <span>👥 {course.instructor.students.toLocaleString()} students</span>
                        <span>📚 {course.instructor.courses} courses</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Preview Image */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-elevated border border-border">
                  <img 
                    src={course.image} 
                    alt="Course preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Button size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30">
                      <Play className="h-6 w-6 mr-2" />
                      Preview Course
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sticky Enrollment Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <div className="bg-surface rounded-xl border border-border p-6 shadow-card">
                    <div className="text-3xl font-bold text-ink-head mb-4">
                      {course.credits} Credits
                    </div>

                    <Button 
                      className="w-full mb-4"
                      size="lg"
                      onClick={() => setIsEnrolled(!isEnrolled)}
                    >
                      {isEnrolled ? "Continue Learning" : "Enroll Now"}
                    </Button>

                    <div className="text-center text-sm text-ink-body mb-4">
                      30-day money-back guarantee
                    </div>

                    {/* Course Includes */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-ink-head">This course includes:</h4>
                      <div className="space-y-2 text-sm text-ink-body">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span>8 weeks of content</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span>Downloadable resources</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span>Certificate of completion</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span>Lifetime access</span>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full mt-4">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Course
                    </Button>
                  </div>

                  {/* Trust Badges */}
                  <div className="bg-surface rounded-xl border border-border p-6">
                    <h4 className="font-semibold text-ink-head mb-4">Trusted by professionals at:</h4>
                    <div className="grid grid-cols-2 gap-4 text-slate-500 dark:text-slate-400">
                      <div className="text-center text-sm font-medium">Google</div>
                      <div className="text-center text-sm font-medium">Meta</div>
                      <div className="text-center text-sm font-medium">Netflix</div>
                      <div className="text-center text-sm font-medium">Stripe</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="page-container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* What You'll Learn */}
              <section>
                <h2 className="text-2xl font-bold text-ink-head mb-6">What you'll learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {learningOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-ink-body">{outcome}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Course Curriculum */}
              <section>
                <h2 className="text-2xl font-bold text-ink-head mb-6">Course curriculum</h2>
                <div className="bg-surface rounded-xl border border-border">
                  <Accordion type="multiple" className="w-full">
                    {curriculum.map((section, index) => (
                      <AccordionItem key={index} value={`section-${index}`} className="border-border">
                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                          <div className="flex items-center justify-between w-full">
                            <div className="text-left">
                              <div className="font-semibold text-ink-head">{section.title}</div>
                              <div className="text-sm text-ink-body">
                                {section.lessons} lessons • {section.duration}
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                          <div className="space-y-2">
                            {section.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-center space-x-3 py-2">
                                <Play className="h-4 w-4 text-ink-body" />
                                <span className="text-ink-body">{item}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </section>

              {/* Reviews */}
              <section>
                <h2 className="text-2xl font-bold text-ink-head mb-6">Student reviews</h2>
                <div className="bg-surface rounded-xl border border-border p-6">
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-ink-head">{course.rating}</div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current text-warning" />
                        ))}
                      </div>
                      <div className="text-sm text-ink-body">Course Rating</div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5,4,3,2,1].map(stars => (
                        <div key={stars} className="flex items-center space-x-3">
                          <span className="text-sm text-ink-body w-8">{stars}★</span>
                          <Progress value={stars === 5 ? 85 : stars === 4 ? 12 : 3} className="flex-1 h-2" />
                          <span className="text-sm text-ink-body w-8">{stars === 5 ? '85%' : stars === 4 ? '12%' : '3%'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Related Courses Sidebar */}
            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-bold text-ink-head mb-4">Related courses</h3>
                <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="bg-surface rounded-xl border border-border p-4">
                      <div className="aspect-video bg-elevated rounded-lg mb-3"></div>
                      <h4 className="font-medium text-ink-head mb-1">Related Course {i}</h4>
                      <div className="text-sm text-ink-body mb-2">Instructor Name</div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-current text-warning" />
                            <span className="text-sm">4.{8-i}</span>
                          </div>
                          <div className="text-sm font-medium text-ink-head">{20+i*5} Credits</div>
                        </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};