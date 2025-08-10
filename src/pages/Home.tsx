import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Star, 
  Users, 
  Play,
  Clock,
  Award,
  TrendingUp,
  BookOpen,
  Target,
  CheckCircle,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { classes, users, skills, skillPaths } from '@/data/courseData';

const CATEGORIES = [
  { id: 'technology', name: 'Technology', icon: '💻', count: 1200 },
  { id: 'design', name: 'Design', icon: '🎨', count: 800 },
  { id: 'business', name: 'Business', icon: '📊', count: 950 },
  { id: 'languages', name: 'Languages', icon: '🗣️', count: 400 },
  { id: 'creative', name: 'Creative', icon: '🎭', count: 350 },
  { id: 'marketing', name: 'Marketing', icon: '📈', count: 600 },
  { id: 'photography', name: 'Photography', icon: '📸', count: 300 },
  { id: 'music', name: 'Music', icon: '🎵', count: 250 }
];

export default function Home() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');

  // Get featured content
  const featuredClasses = classes.slice(0, 8);
  const topInstructors = users.slice(0, 6);
  const featuredPaths = skillPaths.filter(path => path.featured);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const CourseCard = ({ course }: { course: typeof classes[0] }) => {
    const instructor = users.find(u => u.id === course.instructorId);
    
    return (
      <Card className="course-card group cursor-pointer" onClick={() => navigate(`/classes/${course.id}`)}>
        <div className="relative">
          <img 
            src={course.thumbnailUrl} 
            alt={course.title}
            className="w-full h-40 object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-t-lg flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <Badge className="absolute top-3 left-3 bg-white/90 text-foreground">
            {course.level}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
            {course.title}
          </h3>
          
          {instructor && (
            <p className="text-xs text-muted-foreground mb-2">
              {instructor.name}
            </p>
          )}
          
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "w-3 h-3",
                    i < Math.floor(course.ratingAvg) 
                      ? "fill-brand-warning text-brand-warning" 
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {course.ratingAvg} ({course.ratingCount})
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatDuration(course.durationMins)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{course.studentsCount.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {course.category}
            </Badge>
            <div className="text-right">
              <div className="text-sm font-bold text-brand-primary">
                {course.priceCredits} credits
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const InstructorCard = ({ instructor }: { instructor: typeof users[0] }) => {
    return (
      <Card className="instructor-card group cursor-pointer hover:shadow-md transition-all" 
            onClick={() => navigate(`/profile/${instructor.id}`)}>
        <CardContent className="p-4 text-center">
          <Avatar className="w-16 h-16 mx-auto mb-3">
            <AvatarImage src={instructor.avatarUrl} alt={instructor.name} />
            <AvatarFallback>{instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          
          <h4 className="font-semibold text-sm mb-1 group-hover:text-brand-primary transition-colors">
            {instructor.name}
          </h4>
          
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {instructor.headline}
          </p>
          
          <div className="flex items-center justify-center gap-1 mb-2">
            <Star className="w-3 h-3 fill-brand-warning text-brand-warning" />
            <span className="text-xs font-medium">{instructor.ratingAvg}</span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {instructor.totalStudents?.toLocaleString()} students
          </div>
        </CardContent>
      </Card>
    );
  };

  const PathCard = ({ path }: { path: typeof skillPaths[0] }) => {
    return (
      <Card className="course-card group cursor-pointer" onClick={() => navigate(`/paths/${path.id}`)}>
        <div className="relative">
          <img 
            src={path.thumbnailUrl} 
            alt={path.title}
            className="w-full h-40 object-cover rounded-t-lg"
          />
          <Badge className="absolute top-3 left-3 bg-brand-primary text-white">
            Specialization
          </Badge>
          <Badge className="absolute top-3 right-3 bg-white/90 text-foreground">
            {path.level}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
            {path.title}
          </h3>
          
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {path.description}
          </p>
          
          <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>{path.steps.length} courses</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{path.estimatedHours}h</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-brand-warning text-brand-warning" />
              <span className="text-xs">{path.ratingAvg}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-brand-primary">
                {path.priceCredits} credits
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-muted/50 to-muted/30 py-16 lg:py-24">
        <div className="page-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              Trade skills, <span className="text-gradient">not cash.</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Learn from expert instructors, teach what you know, and build your career with our credit-based learning platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="btn-neo text-lg px-8 py-4" onClick={() => navigate('/matches')}>
                Find a Match
                <Search className="ml-2 h-5 w-5" />
              </Button>
              
              <Button size="lg" variant="outline" className="text-lg px-8 py-4" onClick={() => navigate('/classes')}>
                Browse Classes
                <BookOpen className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="What do you want to learn today?"
                className="pl-12 pr-4 h-14 text-lg rounded-xl border-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/classes?q=${encodeURIComponent(e.currentTarget.value)}`);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Rail */}
      <section className="py-12 border-b bg-card">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-heading font-bold">Explore Categories</h2>
            <Button variant="outline" asChild>
              <Link to="/classes">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {CATEGORIES.map((category) => (
              <Card 
                key={category.id} 
                className="cursor-pointer hover:shadow-md transition-all group"
                onClick={() => navigate(`/classes?category=${category.id}`)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="font-medium text-sm mb-1 group-hover:text-brand-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {category.count.toLocaleString()} classes
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Classes */}
      <section className="py-16">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">Featured Classes</h2>
              <p className="text-muted-foreground">Learn from top-rated instructors</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/classes">
                Browse All Classes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="academic-grid">
            {featuredClasses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Skill Paths */}
      <section className="py-16 bg-muted/30">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">Skill Paths</h2>
              <p className="text-muted-foreground">Structured learning journeys to master new skills</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/paths">
                View All Paths
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="catalog-grid">
            {featuredPaths.map((path) => (
              <PathCard key={path.id} path={path} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Instructors */}
      <section className="py-16">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">Top Instructors</h2>
              <p className="text-muted-foreground">Learn from industry experts and experienced educators</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/mentors">
                Find a Mentor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {topInstructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold mb-4">How SkillSwap Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start learning and earning credits
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Find Your Course",
                description: "Browse thousands of classes and skill paths from expert instructors",
                icon: Search,
                color: "from-brand-primary to-brand-secondary"
              },
              {
                step: "2", 
                title: "Learn & Practice",
                description: "Take classes, complete projects, and get personalized feedback",
                icon: BookOpen,
                color: "from-brand-secondary to-brand-green"
              },
              {
                step: "3",
                title: "Teach & Earn", 
                description: "Share your knowledge, teach others, and earn credits for learning more",
                icon: Award,
                color: "from-brand-green to-brand-warning"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="text-center group hover:shadow-lg transition-all">
                  <CardContent className="p-8">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform",
                      item.color
                    )}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="mb-4">
                      <Badge className="mb-3 bg-brand-primary text-white">
                        Step {item.step}
                      </Badge>
                      <h3 className="text-xl font-heading font-semibold mb-3">
                        {item.title}
                      </h3>
                    </div>
                    
                    <p className="text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust & Social Proof */}
      <section className="py-16">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Join Our Learning Community</h2>
            <p className="text-lg text-muted-foreground">
              Thousands of learners are already building their skills
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-brand-primary mb-2">50,000+</div>
              <div className="text-muted-foreground">Active Learners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-secondary mb-2">5,000+</div>
              <div className="text-muted-foreground">Expert Instructors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-green mb-2">15,000+</div>
              <div className="text-muted-foreground">Classes Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-warning mb-2">4.8</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10">
        <div className="page-container">
          <Card className="border-brand-primary/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-heading font-bold mb-4">
                Ready to start your learning journey?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of learners who are building skills, earning credits, 
                and advancing their careers on SkillSwap.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" className="btn-neo text-lg px-8 py-4" asChild>
                  <Link to="/onboarding">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button size="lg" variant="outline" className="text-lg px-8 py-4" asChild>
                  <Link to="/classes">
                    Explore Classes
                    <BookOpen className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge variant="secondary" className="bg-white/10">✓ Free to start</Badge>
                <Badge variant="secondary" className="bg-white/10">✓ Learn at your pace</Badge>
                <Badge variant="secondary" className="bg-white/10">✓ Expert instructors</Badge>
                <Badge variant="secondary" className="bg-white/10">✓ Earn while you teach</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
