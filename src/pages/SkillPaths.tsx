import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  Award,
  TrendingUp,
  ChevronRight,
  Play,
  Target,
  CheckCircle,
  ArrowRight,
  Filter,
  Search,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { skillPaths, users } from '@/data/mockData';
import type { SkillPath } from '@/models/course-types';

export default function SkillPaths() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Filter and sort paths
  const filteredPaths = skillPaths.filter(path => {
    if (searchQuery && !path.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !path.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory && path.category !== selectedCategory) {
      return false;
    }
    if (selectedLevel && path.level !== selectedLevel) {
      return false;
    }
    return true;
  });

  const sortedPaths = [...filteredPaths].sort((a, b) => {
    switch (sortBy) {
      case 'featured':
        return b.featured ? 1 : -1;
      case 'popular':
        return b.studentsCount - a.studentsCount;
      case 'rating':
        return b.ratingAvg - a.ratingAvg;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const PathCard = ({ path }: { path: SkillPath }) => {
    const creator = users.find(u => u.id === path.createdBy);
    const completionProgress = 0; // Would come from user progress data
    
    return (
      <Card className="course-card group cursor-pointer" onClick={() => navigate(`/paths/${path.id}`)}>
        <div className="relative">
          <img 
            src={path.thumbnailUrl} 
            alt={path.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-t-lg flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <Badge className="absolute top-4 left-4 bg-brand-primary text-white font-medium">
            Specialization
          </Badge>
          
          <Badge className="absolute top-4 right-4 bg-white/90 text-foreground">
            {path.level}
          </Badge>
          
          {path.featured && (
            <Badge className="absolute bottom-4 left-4 bg-brand-warning text-white">
              <Trophy className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
              {path.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {path.description}
            </p>
          </div>

          {creator && (
            <div className="flex items-center gap-2 mb-4">
              <Avatar className="w-6 h-6">
                <AvatarImage src={creator.avatarUrl} alt={creator.name} />
                <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{creator.name}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{path.steps.length} courses</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{path.estimatedHours} hours</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{(path.studentsCount || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-brand-warning text-brand-warning" />
              <span>{path.ratingAvg}</span>
            </div>
          </div>

          {/* Learning Path Steps Preview */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Learning Path</h4>
            <div className="space-y-2">
              {path.steps.slice(0, 3).map((step, index) => (
                <div key={step.id} className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-xs font-medium text-brand-primary">
                    {index + 1}
                  </div>
                  <span className="truncate">{step.title}</span>
                </div>
              ))}
              {path.steps.length > 3 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{path.steps.length - 3} more steps
                </div>
              )}
            </div>
          </div>

          {/* Outcomes Preview */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">What you'll achieve</h4>
            <div className="space-y-1">
              {path.outcomes.slice(0, 2).map((outcome, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-3 h-3 text-brand-green mt-0.5 shrink-0" />
                  <span className="line-clamp-1">{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <div className="text-lg font-bold text-brand-primary">
                {path.priceCredits} credits
              </div>
              <div className="text-xs text-muted-foreground">Full specialization</div>
            </div>
            
            <Button className="btn-neo">
              Start Learning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const FeaturedPathHero = ({ path }: { path: SkillPath }) => {
    const creator = users.find(u => u.id === path.createdBy);
    
    return (
      <Card className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border-brand-primary/20 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="p-8 lg:p-12">
              <Badge className="mb-4 bg-brand-primary text-white">
                🏆 Featured Specialization
              </Badge>
              
              <h2 className="text-3xl font-heading font-bold mb-4">
                {path.title}
              </h2>
              
              <p className="text-lg text-muted-foreground mb-6">
                {path.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-secondary" />
                  <span>{path.steps.length} courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-secondary" />
                  <span>{path.estimatedHours} hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-secondary" />
                  <span>{path.studentsCount.toLocaleString()} enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-brand-warning text-brand-warning" />
                  <span>{path.ratingAvg} ({path.ratingCount})</span>
                </div>
              </div>

              {creator && (
                <div className="flex items-center gap-3 mb-6">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={creator.avatarUrl} alt={creator.name} />
                    <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{creator.name}</p>
                    <p className="text-xs text-muted-foreground">{creator.headline}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button size="lg" className="btn-neo" onClick={() => navigate(`/paths/${path.id}`)}>
                  Start Specialization
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="relative h-64 lg:h-full">
              <img 
                src={path.thumbnailUrl} 
                alt={path.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const categories = Array.from(new Set(skillPaths.map(p => p.category)));
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 py-16">
        <div className="page-container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Skill Paths & <span className="text-gradient">Specializations</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Master new skills through structured learning journeys. Each specialization 
              includes multiple courses, hands-on projects, and expert mentorship.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-neo" onClick={() => navigate('/paths/browse')}>
                Browse All Paths
                <BookOpen className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/classes')}>
                Individual Classes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-12 border-b bg-card">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-brand-primary mb-2">
                {skillPaths.length}
              </div>
              <div className="text-sm text-muted-foreground">Specializations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-secondary mb-2">
                {skillPaths.reduce((acc, path) => acc + path.studentsCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Students Enrolled</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-green mb-2">
                {Math.round(skillPaths.reduce((acc, path) => acc + path.ratingAvg, 0) / skillPaths.length * 10) / 10}
              </div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-warning mb-2">
                {skillPaths.reduce((acc, path) => acc + path.estimatedHours, 0)}+
              </div>
              <div className="text-sm text-muted-foreground">Hours of Content</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Path */}
      {skillPaths.find(p => p.featured) && (
        <div className="py-16">
          <div className="page-container">
            <FeaturedPathHero path={skillPaths.find(p => p.featured)!} />
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="py-8 border-b bg-muted/30">
        <div className="page-container">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search specializations..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Paths Grid */}
      <div className="py-16">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-heading font-bold mb-2">All Specializations</h2>
              <p className="text-muted-foreground">
                {sortedPaths.length} specializations found
              </p>
            </div>
          </div>
          
          {sortedPaths.length > 0 ? (
            <div className="catalog-grid">
              {sortedPaths.map((path) => (
                <PathCard key={path.id} path={path} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No specializations found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters.
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSelectedLevel('');
              }}>
                Clear filters
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10">
        <div className="page-container">
          <Card className="border-brand-primary/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Award className="w-16 h-16 text-brand-primary mx-auto mb-6" />
              <h2 className="text-3xl font-heading font-bold mb-4">
                Ready to start your specialization?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of learners who are advancing their careers through 
                our comprehensive skill paths and specializations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="btn-neo" onClick={() => navigate('/onboarding')}>
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/classes')}>
                  Browse Individual Classes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
