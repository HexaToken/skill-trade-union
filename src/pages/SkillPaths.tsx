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
  Filter,
  Search,
  Calendar,
  MapPin,
  Badge as BadgeIcon,
  Building2,
  Play,
  Download,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { skillPaths, users } from '@/data/mockData';
import type { SkillPath } from '@/models/types';
import { cn } from '@/lib/utils';

export default function SkillPaths() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Filter and sort paths
  const filteredPaths = skillPaths.filter(path => {
    if (searchQuery && !((path as any).title || path.name).toLowerCase().includes(searchQuery.toLowerCase()) &&
        !path.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory && path.category !== selectedCategory) {
      return false;
    }
    if (selectedLevel && ((path as any).level || path.difficulty) !== parseInt(selectedLevel)) {
      return false;
    }
    return true;
  }).filter(path => {
    // Additional advanced filters
    const featuredFilter = false; // Can be dynamic
    const studentsFilter = 0; // Can be dynamic 
    const ratingFilter = 0; // Can be dynamic
    const searchTerm = ''; // Can be dynamic
    
    if (featuredFilter && !(path as any).featured) return false;
    
    if (studentsFilter && ((path as any).studentsCount || 0) < studentsFilter) return false;
    
    if (ratingFilter && ((path as any).ratingAvg || 0) < ratingFilter) return false;
    
    if (searchTerm && new Date((path as any).createdAt || '2024-01-01') < new Date(searchTerm)) return false;
    
    return true;
  });

  const sortedPaths = [...filteredPaths];
  if (sortBy === 'name') {
    sortedPaths.sort((a, b) => ((a as any).title || a.name).localeCompare((b as any).title || b.name));
  } else if (sortBy === 'difficulty') {
    sortedPaths.sort((a, b) => ((a as any).level || a.difficulty) - ((b as any).level || b.difficulty));
  }

  const categories = [...new Set(skillPaths.map(path => path.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary via-purple-600 to-secondary text-white overflow-hidden">
        {/* Adaptive overlay for WCAG AA contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/20 to-black/25 dark:from-black/15 dark:via-black/10 dark:to-black/15" />
        <div className="relative page-container py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold tracking-tight">
              Master New Skills with
              <span className="bg-gradient-to-r from-warning to-secondary bg-clip-text text-transparent"> Guided Learning Paths</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Follow structured learning journeys designed by experts. Track your progress,
              unlock achievements, and connect with a community of learners.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 border-0 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg">
                <BookOpen className="mr-2 h-5 w-5" />
                Start Learning
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 px-8 py-3 text-lg font-semibold rounded-xl">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white dark:bg-slate-800 border-b">
        <div className="page-container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">250+</div>
              <div className="text-sm text-muted-foreground">Learning Paths</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600">50K+</div>
              <div className="text-sm text-muted-foreground">Active Learners</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-cyan-600">95%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-600">4.9</div>
              <div className="text-sm text-muted-foreground">Avg. Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-12">
        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search learning paths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 h-11 rounded-xl border-slate-200 dark:border-slate-600">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-40 h-11 rounded-xl border-slate-200 dark:border-slate-600">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                <SelectItem value="1">Beginner</SelectItem>
                <SelectItem value="2">Intermediate</SelectItem>
                <SelectItem value="3">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 h-11 rounded-xl border-slate-200 dark:border-slate-600">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="featured" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-slate-100 dark:bg-slate-700 rounded-xl h-12">
            <TabsTrigger value="featured" className="rounded-lg font-medium">Featured</TabsTrigger>
            <TabsTrigger value="trending" className="rounded-lg font-medium">Trending</TabsTrigger>
            <TabsTrigger value="all" className="rounded-lg font-medium">All Paths</TabsTrigger>
          </TabsList>

          {/* Featured Instructors Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 mb-12">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Learn from Industry Experts</h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  Our learning paths are crafted by professionals with real-world experience
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {users.slice(0, 3).map((user) => (
                  <Card key={user.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-blue-100 dark:ring-blue-900">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{(user as any).headline || user.bio}</p>
                      <div className="flex items-center justify-center gap-2 mt-3">
                        <Star className="w-4 h-4 fill-warning text-warning" />
                        <span className="text-sm font-medium">{user.ratingAvg}</span>
                        <span className="text-xs text-muted-foreground">({user.ratingCount} reviews)</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <TabsContent value="featured" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Featured Learning Paths</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Hand-picked courses recommended by our community and experts
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {filteredPaths.filter(path => (path as any).featured).map((path) => (
                <SkillPathCard 
                  key={path.id} 
                  path={path as any}
                  featured={(path as any).featured}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Trending This Week</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Most popular learning paths based on enrollments and completions
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {sortedPaths.slice(0, 6).map((path) => (
                <SkillPathCard key={path.id} path={path as any} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">All Learning Paths</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Browse our complete collection of structured learning journeys
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {sortedPaths.map((path) => (
                <SkillPathCard key={path.id} path={path as any} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface SkillPathCardProps {
  path: any; // Using any to avoid complex type conflicts
  featured?: boolean;
  className?: string;
}

function SkillPathCard({ path, featured = false, className }: SkillPathCardProps) {
  const navigate = useNavigate();

  return (
    <Card className={cn(
      "group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
      featured && "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900",
      className
    )} onClick={() => navigate(`/skill-paths/${path.id}`)}>
      <div className="relative overflow-hidden rounded-t-xl">
        {/* Thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-white/80" />
        </div>
        
        {/* Overlay badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {featured && (
            <Badge className="bg-gradient-to-r from-warning to-secondary text-white border-0 font-semibold shadow-lg">
              <Award className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          <Badge variant="secondary" className="bg-white/90 text-slate-700 backdrop-blur-sm">
            {path.category}
          </Badge>
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium">
            <Users className="w-3 h-3 inline mr-1" />
            <span className="text-muted-foreground">{(path as any).studentsCount || 0} students</span>
          </div>
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium">
            <Star className="w-3 h-3 inline mr-1 fill-warning text-warning" />
            <span className="text-warning">{(path as any).ratingAvg || 4.5}</span>
          </div>
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium">
            <Clock className="w-3 h-3 inline mr-1" />
            <span className="text-muted-foreground">{(path as any).estimatedHours || path.estimatedDuration}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {(path as any).title || path.name}
          </h3>
          <p className="text-muted-foreground line-clamp-2">
            {path.description}
          </p>
        </div>

        {/* Skills preview */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Skills you'll learn:</div>
          <div className="flex flex-wrap gap-1">
            {path.skills?.slice(0, 3).map((skill: any, index: number) => (
              <Badge key={index} variant="outline" size="sm" className="text-xs">
                {skill.skillId || `Skill ${index + 1}`}
              </Badge>
            ))}
            {path.skills?.length > 3 && (
              <Badge variant="outline" size="sm" className="text-xs">
                +{path.skills.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Progress bar for enrolled users */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">0%</span>
          </div>
          <Progress value={0} className="h-2" />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-xl">
            Start Learning
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
