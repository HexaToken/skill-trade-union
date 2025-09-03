import { useState } from "react";
import { Search, Filter, Grid, List, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CourseCard } from "@/components/CourseCard";
import { SiteHeader } from "@/components/layout/SiteHeader";

// Mock data
const mockCourses = [
  {
    id: "1",
    title: "Advanced React Development with TypeScript",
    instructor: { name: "Sarah Chen", avatar: "/api/placeholder/40/40" },
    rating: 4.8,
    reviewCount: 1234,
    tags: ["React", "TypeScript", "Frontend"],
    credits: 25,
    duration: "8 weeks",
    image: "/api/placeholder/400/225",
    level: "Advanced",
    enrolledCount: 2456,
  },
  {
    id: "2", 
    title: "Machine Learning Fundamentals",
    instructor: { name: "Dr. Alex Kumar", avatar: "/api/placeholder/40/40" },
    rating: 4.9,
    reviewCount: 892,
    tags: ["ML", "Python", "Data Science"],
    credits: 35,
    duration: "12 weeks",
    image: "/api/placeholder/400/225",
    level: "Intermediate",
    enrolledCount: 1876,
  },
  // Add more mock courses...
];

const categories = [
  "Development", "Design", "Business", "Marketing", "Data Science", "AI/ML"
];

const levels = ["Beginner", "Intermediate", "Advanced"];
const languages = ["English", "Spanish", "French", "German"];

export const ClassesPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
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
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
      
      <main className="page-container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ink-head mb-2">
            Explore Classes
          </h1>
          <p className="text-ink-body text-lg">
            Discover professional courses from industry experts
          </p>
        </div>

        {/* Search & Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-body" />
            <Input
              placeholder="Search courses, skills, or instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-surface border-border"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Select defaultValue="popular">
              <SelectTrigger className="w-48 bg-surface border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border border-border rounded-lg bg-surface">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-6">
            <div className="bg-surface rounded-xl border border-border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="h-5 w-5 text-ink-body" />
                <h2 className="text-lg font-semibold text-ink-head">Filters</h2>
              </div>

              <div className="space-y-6">
                <FilterSection
                  title="Category"
                  items={categories}
                  selected={selectedCategories}
                  onChange={handleCategoryChange}
                />
                <FilterSection
                  title="Level"
                  items={levels}
                  selected={selectedLevels}
                  onChange={(level, checked) => {
                    if (checked) {
                      setSelectedLevels([...selectedLevels, level]);
                    } else {
                      setSelectedLevels(selectedLevels.filter(l => l !== level));
                    }
                  }}
                />
                <FilterSection
                  title="Language"
                  items={languages}
                  selected={selectedLanguages}
                  onChange={(language, checked) => {
                    if (checked) {
                      setSelectedLanguages([...selectedLanguages, language]);
                    } else {
                      setSelectedLanguages(selectedLanguages.filter(l => l !== language));
                    }
                  }}
                />
              </div>

              <Button variant="outline" className="w-full mt-6">
                Clear All Filters
              </Button>
            </div>
          </aside>

          {/* Course Grid */}
          <div className="flex-1">
            {/* Active Filters */}
            {(selectedCategories.length > 0 || selectedLevels.length > 0 || selectedLanguages.length > 0) && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map(category => (
                    <Badge key={category} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {category}
                    </Badge>
                  ))}
                  {selectedLevels.map(level => (
                    <Badge key={level} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {level}
                    </Badge>
                  ))}
                  {selectedLanguages.map(language => (
                    <Badge key={language} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-ink-body">
                Showing {mockCourses.length} results
              </p>
            </div>

            {/* Course Cards */}
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6" 
              : "space-y-4"
            }>
              {mockCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <Button variant="outline">Previous</Button>
              <Button>1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};