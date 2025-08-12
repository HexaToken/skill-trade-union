import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  TrendingUp, 
  Users, 
  Target,
  Globe,
  Zap,
  Award,
  Calendar,
  ChevronDown,
  ChevronRight,
  X,
  Eye,
  EyeOff,
  Star,
  Clock,
  Music,
  Laptop,
  Paintbrush,
  Languages,
  Dumbbell,
  Book,
  Menu,
  ArrowRight,
  Flame,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { skills, users } from '@/data/mockData';

// Mock data for map
const mapData = {
  markers: [
    { id: 1, skill: 'Web Development', icon: Laptop, lat: 37.7749, lng: -122.4194, city: 'San Francisco', count: 892, growth: 38 },
    { id: 2, skill: 'Music', icon: Music, lat: 51.5074, lng: -0.1278, city: 'London', count: 634, growth: 25 },
    { id: 3, skill: 'Design', icon: Paintbrush, lat: 52.5200, lng: 13.4050, city: 'Berlin', count: 421, growth: 42 },
    { id: 4, skill: 'Languages', icon: Languages, lat: 35.6762, lng: 139.6503, city: 'Tokyo', count: 356, growth: 18 },
    { id: 5, skill: 'Fitness', icon: Dumbbell, lat: -33.8688, lng: 151.2093, city: 'Sydney', count: 289, growth: 31 },
    { id: 6, skill: 'Business', icon: Book, lat: 43.6532, lng: -79.3832, city: 'Toronto', count: 245, growth: 15 }
  ],
  trendingSkills: [
    { name: 'AI & Machine Learning', growth: 156, mentors: 2847, icon: Lightbulb },
    { name: 'React Development', growth: 89, mentors: 1923, icon: Laptop },
    { name: 'Digital Marketing', growth: 73, mentors: 1456, icon: TrendingUp },
    { name: 'Guitar & Music Theory', growth: 52, mentors: 892, icon: Music },
    { name: 'UI/UX Design', growth: 45, mentors: 734, icon: Paintbrush }
  ],
  nearbyMentors: users.slice(0, 6),
  challenges: [
    { id: 1, title: '30-Day Coding Challenge', skill: 'Web Development', participants: 1284, endDate: '2024-02-15' },
    { id: 2, title: 'Design Sprint Week', skill: 'UI/UX Design', participants: 892, endDate: '2024-02-12' },
    { id: 3, title: 'Language Exchange Marathon', skill: 'Languages', participants: 567, endDate: '2024-02-20' }
  ],
  activeCities: [
    { name: 'San Francisco', country: 'USA', mentors: 2847, growth: 23 },
    { name: 'London', country: 'UK', mentors: 2156, growth: 18 },
    { name: 'Berlin', country: 'Germany', mentors: 1892, growth: 31 },
    { name: 'Tokyo', country: 'Japan', mentors: 1634, growth: 15 },
    { name: 'Sydney', country: 'Australia', mentors: 1289, growth: 28 }
  ],
  fastestGrowingSkills: [
    { name: 'AI/ML', growth: 156 },
    { name: 'Blockchain', growth: 134 },
    { name: 'React', growth: 89 },
    { name: 'Flutter', growth: 76 },
    { name: 'Data Science', growth: 73 },
    { name: 'Cybersecurity', growth: 68 }
  ]
};

export default function MapPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [inPersonOnly, setInPersonOnly] = useState(false);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [challengesOnly, setChallengesOnly] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('trending');

  const skillCategories = ['all', 'Tech', 'Design', 'Music', 'Languages', 'Business', 'Fitness', 'Arts'];

  const handleMarkerClick = (marker: any) => {
    setSelectedMarker(marker);
  };

  const closePopup = () => {
    setSelectedMarker(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div
        className="relative bg-gradient-to-br from-brand-primary via-brand-primary/90 to-brand-secondary bg-cover bg-center"
        style={{
          background: `linear-gradient(135deg, hsl(var(--brand-primary)) 0%, hsl(var(--brand-secondary)) 100%)`,
          minHeight: '400px'
        }}
      >
        <div className="absolute inset-0 bg-black/10" />
        
        <div className="relative page-container py-12 md:py-32">
          <div className="max-w-4xl">
            <h1 className="font-heading text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6">
              Explore Skills Around the World
            </h1>
            <p className="text-base md:text-xl text-white/85 mb-6 md:mb-8 max-w-2xl">
              Discover what people are teaching and learning in your city — or anywhere in the world.
            </p>

            {/* Search Input Overlay */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by skill, mentor, or location…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 md:h-14 text-base md:text-lg bg-white/98 backdrop-blur border-white/30 placeholder:text-slate-500 shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section - Desktop */}
      <div className="hidden md:block border-b border-border bg-white/95 dark:bg-slate-900/95 backdrop-blur sticky top-0 z-40">
        <div className="page-container py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Timeframe */}
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-40 bg-white border-gray-300 text-gray-900 focus:border-brand-primary focus:ring-brand-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="today" className="focus:bg-gray-100">Today</SelectItem>
                <SelectItem value="week" className="focus:bg-gray-100">This Week</SelectItem>
                <SelectItem value="month" className="focus:bg-gray-100">This Month</SelectItem>
              </SelectContent>
            </Select>

            {/* Skill Category */}
            <Select value={selectedCategories[0]} onValueChange={(value) => setSelectedCategories([value])}>
              <SelectTrigger className="w-48 bg-white border-gray-300 text-gray-900 focus:border-brand-primary focus:ring-brand-primary">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {skillCategories.map((category) => (
                  <SelectItem key={category} value={category} className="focus:bg-gray-100">
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Toggles */}
            <div className="flex items-center gap-4">
              <Button
                variant={inPersonOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setInPersonOnly(!inPersonOnly)}
                className={cn(
                  "text-sm",
                  inPersonOnly
                    ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                    : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-200 dark:border-slate-600"
                )}
              >
                In-person
              </Button>

              <Button
                variant={onlineOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setOnlineOnly(!onlineOnly)}
                className={cn(
                  "text-sm",
                  onlineOnly
                    ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                    : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-200 dark:border-slate-600"
                )}
              >
                Online
              </Button>

              <Button
                variant={verifiedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={cn(
                  "text-sm",
                  verifiedOnly
                    ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                    : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-200 dark:border-slate-600"
                )}
              >
                Verified Only
              </Button>

              <Button
                variant={challengesOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setChallengesOnly(!challengesOnly)}
                className={cn(
                  "text-sm",
                  challengesOnly
                    ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                    : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-200 dark:border-slate-600"
                )}
              >
                Challenges
              </Button>
            </div>

            {/* Heatmap Toggle */}
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant={showHeatmap ? "default" : "outline"}
              size="sm"
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={cn(
                "text-sm",
                showHeatmap
                  ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                  : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-200 dark:border-slate-600"
              )}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Heatmap
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Floating Filter Button */}
      <div className="md:hidden fixed top-32 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" className="rounded-full shadow-lg">
              <Filter className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="h-[70vh]">
            <div className="space-y-6 pt-6">
              <h3 className="text-lg font-semibold">Filters</h3>

              {/* Mobile Filters */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Timeframe</Label>
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <Select value={selectedCategories[0]} onValueChange={(value) => setSelectedCategories([value])}>
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Options</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="mobile-in-person" className="text-sm">In-person only</Label>
                      <Switch
                        id="mobile-in-person"
                        checked={inPersonOnly}
                        onCheckedChange={setInPersonOnly}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="mobile-online" className="text-sm">Online only</Label>
                      <Switch
                        id="mobile-online"
                        checked={onlineOnly}
                        onCheckedChange={setOnlineOnly}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="mobile-verified" className="text-sm">Verified mentors only</Label>
                      <Switch
                        id="mobile-verified"
                        checked={verifiedOnly}
                        onCheckedChange={setVerifiedOnly}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="mobile-challenges" className="text-sm">Show challenges only</Label>
                      <Switch
                        id="mobile-challenges"
                        checked={challengesOnly}
                        onCheckedChange={setChallengesOnly}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="mobile-heatmap" className="text-sm flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Show heatmap
                      </Label>
                      <Switch
                        id="mobile-heatmap"
                        checked={showHeatmap}
                        onCheckedChange={setShowHeatmap}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Map Container */}
      <div className="flex md:h-[calc(100vh-300px)] h-[calc(100vh-200px)] relative">
        {/* Map Component */}
        <div className="flex-1 relative bg-muted/30">
          {/* Map Placeholder with Interactive Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            {/* Mock World Map Overlay */}
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 1000 500" className="w-full h-full">
                <path d="M150,200 Q300,150 450,200 T750,200" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M100,300 Q250,250 400,300 T700,300" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="200" cy="180" r="3" fill="currentColor" />
                <circle cx="500" cy="220" r="3" fill="currentColor" />
                <circle cx="750" cy="190" r="3" fill="currentColor" />
              </svg>
            </div>

            {/* Skill Markers */}
            {mapData.markers.map((marker, index) => {
              const IconComponent = marker.icon;
              return (
                <div
                  key={marker.id}
                  className={cn(
                    "absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group",
                    "hover:scale-110 transition-all duration-200"
                  )}
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${30 + (index % 3) * 20}%`
                  }}
                  onClick={() => handleMarkerClick(marker)}
                >
                  <div className="relative">
                    {/* Pulse Animation for Live Activity */}
                    <div className="absolute inset-0 animate-ping bg-brand-primary/20 rounded-full" />

                    {/* Marker */}
                    <div className="relative bg-white dark:bg-slate-800 rounded-full p-3 shadow-lg border-2 border-brand-primary group-hover:border-brand-secondary">
                      <IconComponent className="w-6 h-6 text-brand-primary" />
                    </div>
                    
                    {/* Count Badge */}
                    <div className="absolute -top-2 -right-2 bg-brand-secondary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                      {Math.floor(marker.count / 100)}
                    </div>
                  </div>
                  
                  {/* Hover Label */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800/90 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                    {marker.city} - {marker.skill} ({marker.count} mentors)
                  </div>
                </div>
              );
            })}

            {/* Heatmap Overlay */}
            {showHeatmap && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/5 w-32 h-32 bg-red-500/20 rounded-full blur-xl" />
                <div className="absolute top-1/3 left-1/2 w-24 h-24 bg-orange-500/20 rounded-full blur-xl" />
                <div className="absolute top-2/3 left-2/3 w-20 h-20 bg-yellow-500/20 rounded-full blur-xl" />
              </div>
            )}
          </div>

          {/* Skill Popup Card */}
          {selectedMarker && (
            <div 
              className="absolute z-50 transform -translate-x-1/2 -translate-y-full"
              style={{
                left: `${20 + mapData.markers.findIndex(m => m.id === selectedMarker.id) * 15}%`,
                top: `${30 + (mapData.markers.findIndex(m => m.id === selectedMarker.id) % 3) * 20}%`
              }}
            >
              <Card className="w-80 shadow-xl border border-brand-primary/20 bg-white/98 backdrop-blur">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <selectedMarker.icon className="w-8 h-8 text-brand-primary" />
                      <div>
                        <CardTitle className="text-lg">{selectedMarker.skill}</CardTitle>
                        <p className="text-sm text-muted-foreground">#{Math.floor(Math.random() * 10) + 1} in {selectedMarker.city}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={closePopup}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-brand-primary">{selectedMarker.count}</div>
                      <div className="text-xs text-muted-foreground">Active Mentors</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-brand-secondary">{Math.floor(selectedMarker.count * 1.5)}</div>
                      <div className="text-xs text-muted-foreground">Learners</div>
                    </div>
                  </div>
                  
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{selectedMarker.growth}% this month
                  </Badge>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => navigate('/mentors')}>
                      View Mentors
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => navigate('/challenges')}>
                      Join Challenge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Side Panel - Desktop Only */}
        <div className={cn(
          "hidden md:block w-96 border-l border-border bg-white/95 backdrop-blur transition-all duration-300 overflow-hidden",
          sidePanelOpen ? "translate-x-0" : "translate-x-full w-0"
        )}>
          <div className="h-full overflow-y-auto">
            {/* Panel Header */}
            <div className="p-4 border-b border-border bg-gray-50/80">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Global Insights</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidePanelOpen(!sidePanelOpen)}
                >
                  {sidePanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-3 m-4 bg-gray-100 p-1">
                <TabsTrigger value="trending" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">Trending</TabsTrigger>
                <TabsTrigger value="mentors" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">Mentors</TabsTrigger>
                <TabsTrigger value="challenges" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">Events</TabsTrigger>
              </TabsList>

              {/* Trending Skills Tab */}
              <TabsContent value="trending" className="px-4 pb-4 space-y-4">
                <div className="space-y-3">
                  {mapData.trendingSkills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-100">
                      <div className="flex items-center gap-3">
                        <skill.icon className="w-5 h-5 text-brand-primary" />
                        <div>
                          <p className="font-medium text-sm">{skill.name}</p>
                          <p className="text-xs text-muted-foreground">{skill.mentors} mentors</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-green-700 bg-green-50 border-green-200">
                        +{skill.growth}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Mentors Nearby Tab */}
              <TabsContent value="mentors" className="px-4 pb-4 space-y-4">
                <div className="space-y-3">
                  {mapData.nearbyMentors.map((mentor) => (
                    <div
                      key={mentor.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-100"
                      onClick={() => navigate(`/profile/${mentor.id}`)}
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
                        <AvatarFallback>
                          {mentor.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{mentor.name}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{mentor.ratingAvg}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{mentor.location.city}, {mentor.location.country}</p>
                        <div className="flex gap-1 mt-1">
                          {mentor.skillsOffered.slice(0, 2).map((skill, idx) => {
                            const skillData = skills.find(s => s.id === skill.skillId);
                            return (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {skillData?.name}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Challenges & Events Tab */}
              <TabsContent value="challenges" className="px-4 pb-4 space-y-4">
                <div className="space-y-3">
                  {mapData.challenges.map((challenge) => (
                    <div key={challenge.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-100">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{challenge.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {challenge.skill}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {challenge.participants} participants
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Ends {new Date(challenge.endDate).toLocaleDateString()}
                        </div>
                      </div>
                      <Button size="sm" className="w-full">
                        Join Challenge
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Toggle Panel Button - Desktop */}
        {!sidePanelOpen && (
          <Button
            variant="outline"
            size="icon"
            className="hidden md:block absolute top-4 right-4 z-40"
            onClick={() => setSidePanelOpen(true)}
          >
            <Menu className="w-4 h-4" />
          </Button>
        )}

        {/* Mobile Bottom Sheet */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 rounded-full px-6 shadow-lg"
                size="lg"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-90" />
                Explore Skills
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
              <div className="h-full overflow-y-auto pb-6">
                {/* Mobile Panel Header */}
                <div className="sticky top-0 bg-background pb-4 mb-4">
                  <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />
                  <h3 className="font-semibold text-lg text-center">Global Insights</h3>
                </div>

                {/* Mobile Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 p-1">
                    <TabsTrigger value="trending" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">Trending</TabsTrigger>
                    <TabsTrigger value="mentors" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">Mentors</TabsTrigger>
                    <TabsTrigger value="challenges" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">Events</TabsTrigger>
                  </TabsList>

                  {/* Mobile Trending Skills Tab */}
                  <TabsContent value="trending" className="space-y-4">
                    <div className="space-y-3">
                      {mapData.trendingSkills.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-100">
                          <div className="flex items-center gap-3">
                            <skill.icon className="w-6 h-6 text-brand-primary" />
                            <div>
                              <p className="font-medium">{skill.name}</p>
                              <p className="text-sm text-muted-foreground">{skill.mentors} mentors</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-green-700 bg-green-50 border-green-200">
                            +{skill.growth}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Mobile Mentors Tab */}
                  <TabsContent value="mentors" className="space-y-4">
                    <div className="space-y-3">
                      {mapData.nearbyMentors.map((mentor) => (
                        <div
                          key={mentor.id}
                          className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-100"
                          onClick={() => navigate(`/profile/${mentor.id}`)}
                        >
                          <Avatar className="w-14 h-14">
                            <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
                            <AvatarFallback>
                              {mentor.name.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium truncate">{mentor.name}</p>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{mentor.ratingAvg}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground truncate mb-2">{mentor.location.city}, {mentor.location.country}</p>
                            <div className="flex gap-1 flex-wrap">
                              {mentor.skillsOffered.slice(0, 2).map((skill, idx) => {
                                const skillData = skills.find(s => s.id === skill.skillId);
                                return (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {skillData?.name}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Mobile Challenges Tab */}
                  <TabsContent value="challenges" className="space-y-4">
                    <div className="space-y-3">
                      {mapData.challenges.map((challenge) => (
                        <div key={challenge.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-100">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium">{challenge.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {challenge.skill}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {challenge.participants} participants
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Ends {new Date(challenge.endDate).toLocaleDateString()}
                            </div>
                          </div>
                          <Button className="w-full">
                            Join Challenge
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Community Highlight Section */}
      <div className="border-t border-border bg-gray-50/50">
        <div className="page-container py-12">
          <div className="space-y-8">
            {/* Most Active Cities */}
            <div>
              <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500" />
                This Month's Most Active Cities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {mapData.activeCities.map((city, index) => (
                  <Card key={index} className="hover-lift cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold text-lg">{city.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{city.country}</p>
                      <div className="text-2xl font-bold text-brand-primary mb-1">{city.mentors}</div>
                      <p className="text-xs text-muted-foreground mb-2">mentors</p>
                      <Badge variant="secondary" className="text-green-700 bg-green-50 border-green-200">
                        +{city.growth}%
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Fastest Growing Skills */}
            <div>
              <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
                Fastest Growing Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {mapData.fastestGrowingSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 hover:shadow-md transition-all cursor-pointer"
                  >
                    <span className="font-medium text-sm">{skill.name}</span>
                    <Badge variant="secondary" className="text-green-700 bg-green-50 border-green-200">
                      +{skill.growth}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
