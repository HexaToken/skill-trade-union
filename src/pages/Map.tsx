import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Map as MapIcon, 
  Search, 
  Filter, 
  Layers, 
  Users, 
  TrendingUp, 
  MapPin, 
  Globe, 
  Zap,
  Target,
  BookOpen,
  Award,
  Eye,
  EyeOff
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
import { cn } from '@/lib/utils';
import { skills, users } from '@/data/mockData';
import { mapDataPoints } from '@/mock/enhanced-data';

const heatmapData = [
  { city: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, intensity: 95, skill: 'Web Development' },
  { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, intensity: 88, skill: 'Design' },
  { city: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, intensity: 82, skill: 'Data Science' },
  { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, intensity: 76, skill: 'Languages' },
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, intensity: 71, skill: 'Creative' },
  { city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, intensity: 68, skill: 'Business' }
];

export default function Map() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMentors, setShowMentors] = useState(true);
  const [showClasses, setShowClasses] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<any>(null);

  const skillOptions = ['all', ...Array.from(new Set(skills.map(s => s.name)))];
  
  const filteredMentors = users.filter(user => 
    selectedSkill === 'all' || 
    user.skillsOffered.some(skill => {
      const skillData = skills.find(s => s.id === skill.skillId);
      return skillData?.name === selectedSkill;
    })
  );

  const mockRegionData = {
    name: 'San Francisco Bay Area',
    country: 'United States',
    totalMentors: 2847,
    totalClasses: 156,
    topSkills: [
      { name: 'Web Development', mentors: 892, demand: 95 },
      { name: 'Data Science', mentors: 634, demand: 88 },
      { name: 'UI/UX Design', mentors: 421, demand: 82 }
    ],
    featuredMentors: users.slice(0, 3)
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="page-container py-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold">Global Skill Map</h1>
                <p className="text-muted-foreground text-lg">
                  Explore trending skills and find mentors by location
                </p>
              </div>
              
              <Button onClick={() => navigate('/matches')}>
                <Target className="w-4 h-4 mr-2" />
                Find Local Matches
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cities, countries, or regions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Filter by skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {skillOptions.slice(1).map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Legend and Controls */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="heatmap"
                    checked={showHeatmap}
                    onCheckedChange={setShowHeatmap}
                  />
                  <Label htmlFor="heatmap" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Heat Layer
                  </Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    id="mentors"
                    checked={showMentors}
                    onCheckedChange={setShowMentors}
                  />
                  <Label htmlFor="mentors" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Mentors
                  </Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    id="classes"
                    checked={showClasses}
                    onCheckedChange={setShowClasses}
                  />
                  <Label htmlFor="classes" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Classes
                  </Label>
                </div>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span>High Demand</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span>Medium Demand</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>Low Demand</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-200px)]">
        {/* Map Area */}
        <div className="flex-1 relative bg-muted/30">
          {/* Map Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="max-w-lg">
              <CardContent className="p-12 text-center">
                <MapIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Interactive Map Coming Soon</h3>
                <p className="text-muted-foreground mb-6">
                  We're building an interactive map to help you explore global skill trends and find local mentors.
                </p>
                
                <div className="space-y-4">
                  <div className="text-left space-y-2">
                    <h4 className="font-medium">Planned Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Real-time skill demand heatmaps</li>
                      <li>• Mentor location clustering</li>
                      <li>• Regional skill analytics</li>
                      <li>• Local class and event discovery</li>
                      <li>• Travel-based skill exchange</li>
                    </ul>
                  </div>
                  
                  <Button onClick={() => navigate('/matches')}>
                    Find Mentors Near You
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mock Hotspots */}
          <div className="absolute top-4 left-4 space-y-2">
            {heatmapData.slice(0, 3).map((point, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover-lift bg-white/90 backdrop-blur"
                onClick={() => setSelectedRegion(mockRegionData)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-3 h-3 rounded-full',
                      point.intensity > 90 ? 'bg-red-500' :
                      point.intensity > 80 ? 'bg-yellow-500' : 'bg-green-500'
                    )} />
                    <div>
                      <p className="font-medium text-sm">{point.city}</p>
                      <p className="text-xs text-muted-foreground">{point.skill} • {point.intensity}% demand</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l bg-card overflow-y-auto">
          {selectedRegion ? (
            <div className="p-6 space-y-6">
              {/* Region Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{selectedRegion.name}</h3>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedRegion(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span>{selectedRegion.country}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-brand-primary">{selectedRegion.totalMentors}</div>
                    <div className="text-xs text-muted-foreground">Mentors</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-brand-secondary">{selectedRegion.totalClasses}</div>
                    <div className="text-xs text-muted-foreground">Classes</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Top Skills */}
              <div className="space-y-4">
                <h4 className="font-medium">Top Skills</h4>
                <div className="space-y-3">
                  {selectedRegion.topSkills.map((skill: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{skill.name}</p>
                        <p className="text-xs text-muted-foreground">{skill.mentors} mentors</p>
                      </div>
                      <Badge variant="outline">
                        {skill.demand}% demand
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Featured Mentors */}
              <div className="space-y-4">
                <h4 className="font-medium">Featured Mentors</h4>
                <div className="space-y-3">
                  {selectedRegion.featuredMentors.map((mentor: any) => (
                    <div 
                      key={mentor.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => navigate(`/profile/${mentor.id}`)}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
                        <AvatarFallback>
                          {mentor.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{mentor.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{mentor.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full" onClick={() => navigate('/matches')}>
                <MapPin className="w-4 h-4 mr-2" />
                Find Mentors Here
              </Button>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Global Stats */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Global Overview</h3>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-xl font-bold text-brand-primary">50K+</div>
                    <div className="text-xs text-muted-foreground">Global Mentors</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-xl font-bold text-brand-secondary">80+</div>
                    <div className="text-xs text-muted-foreground">Countries</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Trending Regions */}
              <div className="space-y-4">
                <h4 className="font-medium">Trending Regions</h4>
                <div className="space-y-3">
                  {heatmapData.map((region, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer"
                      onClick={() => setSelectedRegion(mockRegionData)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-3 h-3 rounded-full',
                          region.intensity > 90 ? 'bg-red-500' :
                          region.intensity > 80 ? 'bg-yellow-500' : 'bg-green-500'
                        )} />
                        <div>
                          <p className="font-medium text-sm">{region.city}</p>
                          <p className="text-xs text-muted-foreground">{region.country}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{region.skill}</p>
                        <p className="text-xs text-muted-foreground">{region.intensity}% demand</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Recent Activity */}
              <div className="space-y-4">
                <h4 className="font-medium">Recent Activity</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div>
                      <p>New mentor joined in <span className="font-medium">Berlin</span></p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <div>
                      <p>Web Development class started in <span className="font-medium">Tokyo</span></p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <div>
                      <p>Skill demand spike in <span className="font-medium">Sydney</span></p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
