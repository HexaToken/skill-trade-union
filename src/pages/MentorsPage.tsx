import { useState } from "react";
import { Search, Filter, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SimpleCard } from "@/components/SimpleCard";
import { SiteHeader } from "@/components/layout/SiteHeader";

// Mock data
const categories = ["Frontend", "Backend", "Data Science", "Design", "Product", "Leadership"];
const specialties = ["React", "Python", "Machine Learning", "UI/UX", "DevOps", "Strategy"];
const experience = ["1-2 years", "3-5 years", "5-10 years", "10+ years"];
const priceRanges = ["$50-100", "$100-150", "$150-200", "$200+"];

const mockMentors = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "Senior Frontend Engineer at Meta",
    location: "San Francisco, CA",
    avatar: "/api/placeholder/80/80",
    rating: 4.9,
    reviewCount: 127,
    skills: ["React", "TypeScript", "GraphQL", "Performance"],
    hourlyRate: 150,
    responseTime: "2 hours",
  },
  {
    id: "2", 
    name: "Dr. Alex Kumar",
    title: "ML Research Scientist at OpenAI",
    location: "Seattle, WA",
    avatar: "/api/placeholder/80/80",
    rating: 4.8,
    reviewCount: 89,
    skills: ["Machine Learning", "Python", "TensorFlow", "Research"],
    hourlyRate: 200,
    responseTime: "4 hours",
  },
  // Add more mock mentors...
];

const featuredMentors = mockMentors.slice(0, 3);

export const MentorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const categoryChips = categories.slice(0, 6);

  const handleViewProfile = (mentorId: string) => {
    setSelectedMentor(mentorId);
  };

  const handleBookSession = (mentorId: string) => {
    setSelectedMentor(mentorId);
    setIsBookingModalOpen(true);
  };

  const FilterSection = ({ title, items, selected, onChange }: {
    title: string;
    items: string[];
    selected: string[];
    onChange: (item: string, checked: boolean) => void;
  }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-left">
          <span className="font-medium text-ink-head">{title}</span>
          <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>↓</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pb-4">
          {items.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox
                id={`${title}-${item}`}
                checked={selected.includes(item)}
                onCheckedChange={(checked) => onChange(item, !!checked)}
              />
              <label 
                htmlFor={`${title}-${item}`}
                className="text-sm text-ink-body cursor-pointer"
              >
                {item}
              </label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className="min-h-screen bg-canvas">
      <SiteHeader />
      
      <main>
        {/* Hero Section */}
        <div className="bg-surface border-b border-border">
          <div className="page-container py-16">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl lg:text-5xl font-bold text-ink-head mb-4">
                Find Your <span className="text-gradient">Mentor</span>
              </h1>
              <p className="text-xl text-ink-body mb-8">
                Connect with industry experts for personalized guidance and accelerate your career growth
              </p>
              
              {/* Hero Search */}
              <div className="relative max-w-2xl mx-auto mb-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ink-body" />
                <Input
                  placeholder="Search mentors by skills, experience, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg bg-elevated border-border"
                />
                <Button className="absolute right-2 top-2 bg-primary hover:bg-primary-dark text-white">
                  Search
                </Button>
              </div>

              {/* Category Chips */}
              <div className="flex flex-wrap justify-center gap-3">
                {categoryChips.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => {
                      if (selectedCategories.includes(category)) {
                        setSelectedCategories(selectedCategories.filter(c => c !== category));
                      } else {
                        setSelectedCategories([...selectedCategories, category]);
                      }
                    }}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="page-container py-12">
          {/* Featured Mentors */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-ink-head mb-2">Featured Mentors</h2>
                <p className="text-ink-body">Hand-picked experts with exceptional track records</p>
              </div>
              <Button variant="outline" className="border-border">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredMentors.map((mentor) => (
                <div key={mentor.id} className="relative">
                  <div className="absolute -top-3 -right-3 z-10">
                    <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  </div>
                  <SimpleCard
                    {...mentor}
                    onViewProfile={handleViewProfile}
                    onBookSession={handleBookSession}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* All Mentors */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-ink-head">All Mentors</h2>
              <Select defaultValue="rating">
                <SelectTrigger className="w-48 bg-surface border-border">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="response">Fastest Response</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside className="lg:w-80 space-y-6">
                <div className="bg-surface rounded-xl border border-border p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Filter className="h-5 w-5 text-ink-body" />
                    <h3 className="text-lg font-semibold text-ink-head">Filters</h3>
                  </div>

                  <div className="space-y-6">
                    <FilterSection
                      title="Category"
                      items={categories}
                      selected={selectedCategories}
                      onChange={(category, checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, category]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(c => c !== category));
                        }
                      }}
                    />
                    <FilterSection
                      title="Specialty"
                      items={specialties}
                      selected={[]}
                      onChange={() => {}}
                    />
                    <FilterSection
                      title="Experience"
                      items={experience}
                      selected={[]}
                      onChange={() => {}}
                    />
                    <FilterSection
                      title="Hourly Rate"
                      items={priceRanges}
                      selected={[]}
                      onChange={() => {}}
                    />
                  </div>

                  <Button variant="outline" className="w-full mt-6 border-border">
                    Clear All Filters
                  </Button>
                </div>
              </aside>

              {/* Mentors Grid */}
              <div className="flex-1">
                <div className="mb-6">
                  <p className="text-ink-body">
                    Showing {mockMentors.length} mentors
                  </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                  {mockMentors.map((mentor) => (
                    <SimpleCard
                      key={mentor.id}
                      {...mentor}
                      onViewProfile={handleViewProfile}
                      onBookSession={handleBookSession}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-12">
                  <div className="flex space-x-2">
                    <Button variant="outline" className="border-border">Previous</Button>
                    <Button className="bg-primary hover:bg-primary-dark text-white">1</Button>
                    <Button variant="outline" className="border-border">2</Button>
                    <Button variant="outline" className="border-border">3</Button>
                    <Button variant="outline" className="border-border">Next</Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Booking Modal */}
        <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book a Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src="/api/placeholder/80/80" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold text-ink-head">Sarah Chen</h3>
                <p className="text-ink-body">Senior Frontend Engineer at Meta</p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="text-sm font-medium">4.9</span>
                  <span className="text-sm text-ink-body">(127 reviews)</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-ink-body">Session Rate:</span>
                  <span className="text-lg font-semibold text-ink-head">$150/hour</span>
                </div>
                
                <Button className="w-full bg-primary hover:bg-primary-dark text-white">
                  Continue to Booking
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};