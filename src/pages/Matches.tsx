import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchTile } from "@/components/MatchTile";
import { Search, Filter, Map, List, SlidersHorizontal, Clock, Star, MapPin, Zap, Globe } from "lucide-react";
import { users, skills } from "@/data/mockData";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MatchesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMode, setSelectedMode] = useState("all");
  const [distance, setDistance] = useState([50]);
  const [minRating, setMinRating] = useState([4.0]);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // Filter users based on current filters
  const filteredUsers = users.filter(user => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = user.name.toLowerCase().includes(query);
      const matchesSkills = user.skillsOffered.some(skill => 
        skills.find(s => s.id === skill.skillId)?.name.toLowerCase().includes(query)
      );
      const matchesBio = user.bio.toLowerCase().includes(query);
      if (!matchesName && !matchesSkills && !matchesBio) return false;
    }
    
    if (selectedCategory !== "all") {
      const hasSkillInCategory = user.skillsOffered.some(skill => 
        skills.find(s => s.id === skill.skillId)?.category === selectedCategory
      );
      if (!hasSkillInCategory) return false;
    }
    
    if (user.ratingAvg < minRating[0]) return false;
    
    return true;
  });

  const skillCategories = [...new Set(skills.map(s => s.category))];

  return (
    <div className="page-container section-spacing">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Find Your Perfect Match</h1>
            <p className="text-muted-foreground">AI-powered skill matching based on your interests and schedule</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
              {viewMode === "grid" ? <List className="w-4 h-4" /> : <div className="w-4 h-4 grid grid-cols-2 gap-0.5"><div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div></div>}
            </Button>
            <Button variant="outline" size="sm">
              <Map className="w-4 h-4 mr-2" />
              Map View
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass-card p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search skills, names, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {skillCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedMode} onValueChange={setSelectedMode}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="async">Async</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Advanced Filters Row */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Distance: {distance[0]}km</label>
                <Slider
                  value={distance}
                  onValueChange={setDistance}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Min Rating: {minRating[0]}+</label>
                <Slider
                  value={minRating}
                  onValueChange={setMinRating}
                  max={5}
                  min={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch checked={showOnlineOnly} onCheckedChange={setShowOnlineOnly} />
                <label className="text-sm font-medium text-foreground">Available now</label>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-secondary" />
                <span className="text-sm text-muted-foreground">Global mode</span>
                <Switch />
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Found <span className="font-medium text-foreground">{filteredUsers.length}</span> matches
            </p>
            {searchQuery && (
              <Badge variant="secondary">
                Search: "{searchQuery}"
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary">
                {selectedCategory}
              </Badge>
            )}
          </div>
          
          <Select defaultValue="best-match">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="best-match">Best Match</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="distance">Nearest</SelectItem>
              <SelectItem value="available">Available Soon</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Recommended Skills Banner */}
        <Card className="glass-card bg-gradient-brand/5 border-brand-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-primary" />
              Hot Skills Right Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {skills.filter(s => s.demandScore > 80).slice(0, 6).map(skill => (
                <Badge 
                  key={skill.id} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-brand-primary/20 transition-colors"
                  onClick={() => setSearchQuery(skill.name)}
                >
                  {skill.icon} {skill.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results Grid */}
        <Tabs value={viewMode} onValueChange={setViewMode}>
          <TabsContent value="grid">
            {filteredUsers.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredUsers.map((user) => {
                  const userSkill = user.skillsOffered[0];
                  const skill = skills.find(s => s.id === userSkill.skillId);
                  
                  return skill ? (
                    <MatchTile
                      key={user.id}
                      user={user}
                      skill={skill}
                      matchScore={Math.floor(Math.random() * 30) + 70}
                      distance={`${(Math.random() * distance[0]).toFixed(1)} km`}
                      nextAvailable="Today, 3:00 PM"
                      onMessage={() => {}}
                      onBookSession={() => navigate('/sessions')}
                      onViewProfile={() => navigate('/profile')}
                    />
                  ) : null;
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No matches found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => setSearchQuery("")}>Clear Search</Button>
                  <Button onClick={() => {
                    setSelectedCategory("all");
                    setDistance([50]);
                    setMinRating([4.0]);
                    setShowOnlineOnly(false);
                  }}>Reset Filters</Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="list">
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const userSkill = user.skillsOffered[0];
                const skill = skills.find(s => s.id === userSkill.skillId);
                
                return skill ? (
                  <MatchTile
                    key={user.id}
                    user={user}
                    skill={skill}
                    matchScore={Math.floor(Math.random() * 30) + 70}
                    distance={`${(Math.random() * distance[0]).toFixed(1)} km`}
                    nextAvailable="Today, 3:00 PM"
                    className="w-full"
                    onMessage={() => {}}
                    onBookSession={() => navigate('/sessions')}
                    onViewProfile={() => navigate('/profile')}
                  />
                ) : null;
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Load More */}
        {filteredUsers.length > 0 && (
          <div className="text-center pt-8">
            <Button variant="outline" size="lg">
              Load More Matches
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
