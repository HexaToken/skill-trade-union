import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Globe, 
  User, 
  Star, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Check,
  Zap,
  Award,
  Calendar,
  Languages,
  Target,
  Users,
  BookOpen,
  Camera,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { skills } from '@/data/mockData';
import type { OnboardingData } from '@/models/types';

const steps = [
  { id: 'welcome', title: 'Welcome', icon: Sparkles },
  { id: 'basics', title: 'Tell us about yourself', icon: User },
  { id: 'skills', title: 'Your skills', icon: Award },
  { id: 'availability', title: 'Availability', icon: Calendar },
  { id: 'complete', title: 'Complete', icon: Check }
];

const languages = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 
  'Portuguese', 'Russian', 'Arabic', 'Hindi', 'Italian', 'Korean'
];

const timezones = [
  'America/Los_Angeles', 'America/Denver', 'America/Chicago', 'America/New_York',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Madrid',
  'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Seoul', 'Asia/Mumbai',
  'Australia/Sydney', 'Australia/Melbourne'
];

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
  'Spain', 'Italy', 'Japan', 'China', 'India', 'Brazil', 'Mexico', 'Argentina'
];

const skillCategories = Array.from(new Set(skills.map(s => s.category)));

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    step1: {
      location: { city: '', country: '', lat: 0, lng: 0 },
      languages: [],
      bio: '',
      timezone: ''
    },
    step2: {
      skillsOffered: [],
      skillsWanted: []
    },
    step3: {
      availability: []
    }
  });

  const [selectedSkillsOffered, setSelectedSkillsOffered] = useState<{[key: string]: number}>({});
  const [selectedSkillsWanted, setSelectedSkillsWanted] = useState<{[key: string]: 'low' | 'medium' | 'high'}>({});
  const [availabilityGrid, setAvailabilityGrid] = useState<{[key: string]: string[]}>({});

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      console.log('Onboarding completed:', onboardingData);
      navigate('/matches');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateStep1 = (field: keyof OnboardingData['step1'], value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      step1: { ...prev.step1, [field]: value }
    }));
  };

  const toggleLanguage = (language: string) => {
    const current = onboardingData.step1.languages;
    const updated = current.includes(language) 
      ? current.filter(l => l !== language)
      : [...current, language];
    updateStep1('languages', updated);
  };

  const toggleSkillOffered = (skillId: string, level: number) => {
    setSelectedSkillsOffered(prev => ({
      ...prev,
      [skillId]: level
    }));
  };

  const toggleSkillWanted = (skillId: string, priority: 'low' | 'medium' | 'high') => {
    setSelectedSkillsWanted(prev => ({
      ...prev,
      [skillId]: priority
    }));
  };

  const toggleAvailability = (day: number, time: string) => {
    setAvailabilityGrid(prev => {
      const dayKey = day.toString();
      const currentTimes = prev[dayKey] || [];
      const updated = currentTimes.includes(time)
        ? currentTimes.filter(t => t !== time)
        : [...currentTimes, time];
      
      return { ...prev, [dayKey]: updated };
    });
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center mx-auto">
        <Sparkles className="w-12 h-12 text-white" />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-3xl font-heading font-bold">Welcome to SkillSwap!</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join the world's largest skill-sharing community where knowledge flows freely and everyone can teach and learn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        <Card className="text-center">
          <CardContent className="p-6">
            <Award className="w-8 h-8 text-brand-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Share Your Skills</h3>
            <p className="text-sm text-muted-foreground">
              Teach what you know and earn credits for helping others learn
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <BookOpen className="w-8 h-8 text-brand-secondary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Learn Anything</h3>
            <p className="text-sm text-muted-foreground">
              Use your earned credits to learn new skills from expert mentors
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Zap className="w-8 h-8 text-brand-amber mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Instant Help</h3>
            <p className="text-sm text-muted-foreground">
              Get immediate expert assistance with our ExpertMatch AI
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">This should take about 5 minutes</p>
        <Button size="lg" onClick={handleNext} className="px-8">
          Get Started
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderBasicsStep = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <User className="w-12 h-12 text-brand-primary mx-auto" />
        <h2 className="text-2xl font-heading font-bold">Tell us about yourself</h2>
        <p className="text-muted-foreground">
          Help us create your SkillSwap profile and connect you with the right people
        </p>
      </div>

      <div className="grid gap-6">
        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="e.g., San Francisco"
              value={onboardingData.step1.location.city}
              onChange={(e) => updateStep1('location', { 
                ...onboardingData.step1.location, 
                city: e.target.value 
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={onboardingData.step1.location.country}
              onValueChange={(value) => updateStep1('location', { 
                ...onboardingData.step1.location, 
                country: value 
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select
            value={onboardingData.step1.timezone}
            onValueChange={(value) => updateStep1('timezone', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your timezone" />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz.replace('_', ' ').replace('/', ' / ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Languages */}
        <div className="space-y-3">
          <Label>Languages you speak</Label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {languages.map((language) => (
              <Badge
                key={language}
                variant={onboardingData.step1.languages.includes(language) ? "default" : "outline"}
                className="cursor-pointer hover-scale justify-center py-2"
                onClick={() => toggleLanguage(language)}
              >
                {language}
              </Badge>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Tell us about yourself</Label>
          <Textarea
            id="bio"
            placeholder="Share a bit about your background, interests, and what you're passionate about..."
            value={onboardingData.step1.bio}
            onChange={(e) => updateStep1('bio', e.target.value)}
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            {onboardingData.step1.bio.length}/500 characters
          </p>
        </div>
      </div>
    </div>
  );

  const renderSkillsStep = () => (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <Award className="w-12 h-12 text-brand-primary mx-auto" />
        <h2 className="text-2xl font-heading font-bold">What skills do you have?</h2>
        <p className="text-muted-foreground">
          Tell us what you can teach and what you'd like to learn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skills I Can Teach */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Skills I Can Teach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {skills.slice(0, 8).map((skill) => (
                <div key={skill.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{skill.icon}</span>
                      <span className="font-medium">{skill.name}</span>
                    </div>
                    <Badge variant="outline" size="sm">{skill.category}</Badge>
                  </div>
                  {selectedSkillsOffered[skill.id] && (
                    <div className="ml-6 space-y-2">
                      <Label className="text-sm">Skill Level (1-5)</Label>
                      <Slider
                        value={[selectedSkillsOffered[skill.id]]}
                        onValueChange={(value) => toggleSkillOffered(skill.id, value[0])}
                        max={5}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Beginner</span>
                        <span>Expert</span>
                      </div>
                    </div>
                  )}
                  <Button
                    variant={selectedSkillsOffered[skill.id] ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => selectedSkillsOffered[skill.id] 
                      ? setSelectedSkillsOffered(prev => {
                          const updated = {...prev};
                          delete updated[skill.id];
                          return updated;
                        })
                      : toggleSkillOffered(skill.id, 3)
                    }
                  >
                    {selectedSkillsOffered[skill.id] ? 'Selected' : 'Add Skill'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills I Want to Learn */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Skills I Want to Learn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {skills.slice(8, 16).map((skill) => (
                <div key={skill.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{skill.icon}</span>
                      <span className="font-medium">{skill.name}</span>
                    </div>
                    <Badge variant="outline" size="sm">{skill.category}</Badge>
                  </div>
                  {selectedSkillsWanted[skill.id] && (
                    <div className="ml-6">
                      <Label className="text-sm">Priority</Label>
                      <RadioGroup
                        value={selectedSkillsWanted[skill.id]}
                        onValueChange={(value) => toggleSkillWanted(skill.id, value as any)}
                        className="flex gap-4 mt-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="low" id={`${skill.id}-low`} />
                          <Label htmlFor={`${skill.id}-low`} className="text-sm">Low</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id={`${skill.id}-medium`} />
                          <Label htmlFor={`${skill.id}-medium`} className="text-sm">Medium</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="high" id={`${skill.id}-high`} />
                          <Label htmlFor={`${skill.id}-high`} className="text-sm">High</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                  <Button
                    variant={selectedSkillsWanted[skill.id] ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => selectedSkillsWanted[skill.id] 
                      ? setSelectedSkillsWanted(prev => {
                          const updated = {...prev};
                          delete updated[skill.id];
                          return updated;
                        })
                      : toggleSkillWanted(skill.id, 'medium')
                    }
                  >
                    {selectedSkillsWanted[skill.id] ? 'Selected' : 'Add Skill'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAvailabilityStep = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <Calendar className="w-12 h-12 text-brand-primary mx-auto" />
          <h2 className="text-2xl font-heading font-bold">When are you available?</h2>
          <p className="text-muted-foreground">
            Select your preferred time slots for teaching and learning
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {days.map((day, dayIndex) => (
                <div key={day} className="space-y-3">
                  <h4 className="font-medium">{day}</h4>
                  <div className="grid grid-cols-6 md:grid-cols-12 gap-1">
                    {timeSlots.map((time) => (
                      <Button
                        key={`${dayIndex}-${time}`}
                        variant={availabilityGrid[dayIndex]?.includes(time) ? "default" : "outline"}
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => toggleAvailability(dayIndex, time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Tip:</strong> More availability = better matches! You can always update this later in your profile.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCompleteStep = () => (
    <div className="text-center space-y-6 max-w-2xl mx-auto">
      <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-12 h-12 text-white" />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-3xl font-heading font-bold">Welcome to SkillSwap!</h2>
        <p className="text-xl text-muted-foreground">
          Your profile is complete and you're ready to start your skill-sharing journey.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold">What happens next?</h3>
            <div className="grid gap-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-brand-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-primary text-sm font-medium">1</span>
                </div>
                <div>
                  <p className="font-medium">Get matched with learners and teachers</p>
                  <p className="text-sm text-muted-foreground">Our AI will find the perfect skill matches for you</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-brand-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-primary text-sm font-medium">2</span>
                </div>
                <div>
                  <p className="font-medium">Start earning credits</p>
                  <p className="text-sm text-muted-foreground">Share your skills and build up your credit balance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-brand-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-primary text-sm font-medium">3</span>
                </div>
                <div>
                  <p className="font-medium">Learn anything you want</p>
                  <p className="text-sm text-muted-foreground">Use your credits to learn from our expert community</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">You've earned 100 welcome credits to get started!</p>
        <Button size="lg" onClick={handleNext} className="px-8">
          Start Exploring
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return onboardingData.step1.location.city && 
               onboardingData.step1.location.country && 
               onboardingData.step1.timezone &&
               onboardingData.step1.languages.length > 0 &&
               onboardingData.step1.bio.length > 10;
      case 2:
        return Object.keys(selectedSkillsOffered).length > 0 || Object.keys(selectedSkillsWanted).length > 0;
      case 3:
        return Object.keys(availabilityGrid).length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Header */}
      <div className="border-b bg-card">
        <div className="page-container py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-heading font-bold text-xl">SkillSwap Onboarding</h1>
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.id} className="flex items-center gap-2">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center border-2',
                      index <= currentStep 
                        ? 'bg-brand-primary border-brand-primary text-white' 
                        : 'border-muted-foreground/30 text-muted-foreground'
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={cn(
                      'text-xs font-medium hidden sm:block',
                      index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-container py-12">
        {currentStep === 0 && renderWelcomeStep()}
        {currentStep === 1 && renderBasicsStep()}
        {currentStep === 2 && renderSkillsStep()}
        {currentStep === 3 && renderAvailabilityStep()}
        {currentStep === 4 && renderCompleteStep()}
      </div>

      {/* Navigation */}
      {currentStep > 0 && currentStep < steps.length - 1 && (
        <div className="border-t bg-card">
          <div className="page-container py-4">
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <Button onClick={handleNext} disabled={!isStepValid()}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
