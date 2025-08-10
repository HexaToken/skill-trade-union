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
  Calendar
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { skills } from '@/data/mockData';
import type { OnboardingData, SkillOffered, SkillWanted, Availability } from '@/models/types';

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
  'Mandarin', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Hindi'
];

const TIMEZONES = [
  'America/New_York', 'America/Los_Angeles', 'America/Chicago', 'America/Denver',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Madrid',
  'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Mumbai', 'Asia/Dubai',
  'Australia/Sydney', 'Australia/Melbourne'
];

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<OnboardingData>({
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

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (step: keyof OnboardingData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: API integration
    await new Promise(resolve => setTimeout(resolve, 2000));
    navigate('/matches');
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.step1.location.city && 
               formData.step1.location.country && 
               formData.step1.languages.length > 0 &&
               formData.step1.bio.length >= 20 &&
               formData.step1.timezone;
      case 2:
        return formData.step2.skillsOffered.length > 0 || formData.step2.skillsWanted.length > 0;
      case 3:
        return formData.step3.availability.length > 0;
      default:
        return false;
    }
  };

  const handleSkillOfferedToggle = (skillId: string, level: number = 3) => {
    const currentSkills = formData.step2.skillsOffered;
    const exists = currentSkills.find(s => s.skillId === skillId);
    
    if (exists) {
      updateFormData('step2', {
        skillsOffered: currentSkills.filter(s => s.skillId !== skillId)
      });
    } else {
      updateFormData('step2', {
        skillsOffered: [...currentSkills, { skillId, level: level as 1 | 2 | 3 | 4 | 5 }]
      });
    }
  };

  const handleSkillWantedToggle = (skillId: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const currentSkills = formData.step2.skillsWanted;
    const exists = currentSkills.find(s => s.skillId === skillId);
    
    if (exists) {
      updateFormData('step2', {
        skillsWanted: currentSkills.filter(s => s.skillId !== skillId)
      });
    } else {
      updateFormData('step2', {
        skillsWanted: [...currentSkills, { skillId, priority }]
      });
    }
  };

  const handleAvailabilityToggle = (dayOfWeek: number, slot: string) => {
    const currentAvailability = formData.step3.availability;
    const dayAvailability = currentAvailability.find(a => a.dayOfWeek === dayOfWeek);
    
    if (dayAvailability) {
      const hasSlot = dayAvailability.slots.includes(slot);
      const newSlots = hasSlot 
        ? dayAvailability.slots.filter(s => s !== slot)
        : [...dayAvailability.slots, slot];
      
      if (newSlots.length === 0) {
        updateFormData('step3', {
          availability: currentAvailability.filter(a => a.dayOfWeek !== dayOfWeek)
        });
      } else {
        updateFormData('step3', {
          availability: currentAvailability.map(a => 
            a.dayOfWeek === dayOfWeek ? { ...a, slots: newSlots } : a
          )
        });
      }
    } else {
      updateFormData('step3', {
        availability: [...currentAvailability, { dayOfWeek, slots: [slot] }]
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="page-container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Welcome to <span className="text-gradient">SkillSwap</span>!
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let's set up your profile so you can start trading skills with our global community.
          </p>
        </div>

        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {currentStep === 1 && (
                  <>
                    <div className="p-2 rounded-lg bg-brand-primary/10">
                      <User className="w-6 h-6 text-brand-primary" />
                    </div>
                    Tell us about yourself
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <div className="p-2 rounded-lg bg-brand-secondary/10">
                      <Star className="w-6 h-6 text-brand-secondary" />
                    </div>
                    Choose your skills
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <div className="p-2 rounded-lg bg-brand-green/10">
                      <Calendar className="w-6 h-6 text-brand-green" />
                    </div>
                    Set your availability
                  </>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="city"
                          placeholder="San Francisco"
                          className="pl-10"
                          value={formData.step1.location.city}
                          onChange={(e) => updateFormData('step1', {
                            location: { ...formData.step1.location, city: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="country"
                          placeholder="United States"
                          className="pl-10"
                          value={formData.step1.location.country}
                          onChange={(e) => updateFormData('step1', {
                            location: { ...formData.step1.location, country: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <Label>Languages you speak</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select all languages you're comfortable using for teaching or learning.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {LANGUAGES.map((language) => (
                        <label key={language} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={formData.step1.languages.includes(language)}
                            onCheckedChange={(checked) => {
                              const currentLangs = formData.step1.languages;
                              if (checked) {
                                updateFormData('step1', {
                                  languages: [...currentLangs, language]
                                });
                              } else {
                                updateFormData('step1', {
                                  languages: currentLangs.filter(l => l !== language)
                                });
                              }
                            }}
                          />
                          <span className="text-sm">{language}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <Label htmlFor="bio">Tell us about yourself</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Share your background, interests, and what you're passionate about. This helps others connect with you.
                    </p>
                    <Textarea
                      id="bio"
                      placeholder="I'm a graphic designer who loves photography and wants to learn web development..."
                      rows={4}
                      value={formData.step1.bio}
                      onChange={(e) => updateFormData('step1', { bio: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.step1.bio.length}/500 characters (minimum 20)
                    </p>
                  </div>

                  {/* Timezone */}
                  <div>
                    <Label>Timezone</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      This helps us match you with people in compatible time zones.
                    </p>
                    <Select
                      value={formData.step1.timezone}
                      onValueChange={(value) => updateFormData('step1', { timezone: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMEZONES.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz.replace('_', ' ').replace('/', ' / ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Skills */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  {/* Skills offered */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-brand-primary" />
                      Skills you can teach
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select skills you're confident teaching others. You can always add more later.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {skills.map((skill) => {
                        const isSelected = formData.step2.skillsOffered.some(s => s.skillId === skill.id);
                        const selectedSkill = formData.step2.skillsOffered.find(s => s.skillId === skill.id);
                        
                        return (
                          <Card 
                            key={skill.id}
                            className={cn(
                              'cursor-pointer transition-all duration-200 hover-lift',
                              isSelected 
                                ? 'ring-2 ring-brand-primary bg-brand-primary/5' 
                                : 'hover:shadow-md'
                            )}
                            onClick={() => handleSkillOfferedToggle(skill.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{skill.icon}</span>
                                <div>
                                  <h4 className="font-medium">{skill.name}</h4>
                                  <Badge variant="outline" size="sm">{skill.category}</Badge>
                                </div>
                                {isSelected && (
                                  <Check className="w-5 h-5 text-brand-primary ml-auto" />
                                )}
                              </div>
                              
                              {isSelected && (
                                <div>
                                  <Label className="text-xs">Your level (1-5)</Label>
                                  <Slider
                                    value={[selectedSkill?.level || 3]}
                                    onValueChange={([value]) => {
                                      const currentSkills = formData.step2.skillsOffered;
                                      updateFormData('step2', {
                                        skillsOffered: currentSkills.map(s => 
                                          s.skillId === skill.id 
                                            ? { ...s, level: value as 1 | 2 | 3 | 4 | 5 }
                                            : s
                                        )
                                      });
                                    }}
                                    max={5}
                                    min={1}
                                    step={1}
                                    className="mt-2"
                                  />
                                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>Beginner</span>
                                    <span>Expert</span>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  {/* Skills wanted */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-brand-secondary" />
                      Skills you want to learn
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      What would you like to learn? We'll help you find the perfect teachers.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {skills.map((skill) => {
                        const isSelected = formData.step2.skillsWanted.some(s => s.skillId === skill.id);
                        const selectedSkill = formData.step2.skillsWanted.find(s => s.skillId === skill.id);
                        
                        return (
                          <Card 
                            key={skill.id}
                            className={cn(
                              'cursor-pointer transition-all duration-200 hover-lift',
                              isSelected 
                                ? 'ring-2 ring-brand-secondary bg-brand-secondary/5' 
                                : 'hover:shadow-md'
                            )}
                            onClick={() => handleSkillWantedToggle(skill.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{skill.icon}</span>
                                <div>
                                  <h4 className="font-medium">{skill.name}</h4>
                                  <Badge variant="outline" size="sm">{skill.category}</Badge>
                                </div>
                                {isSelected && (
                                  <Check className="w-5 h-5 text-brand-secondary ml-auto" />
                                )}
                              </div>
                              
                              {isSelected && (
                                <div>
                                  <Label className="text-xs">Priority</Label>
                                  <RadioGroup
                                    value={selectedSkill?.priority || 'medium'}
                                    onValueChange={(value: 'low' | 'medium' | 'high') => {
                                      const currentSkills = formData.step2.skillsWanted;
                                      updateFormData('step2', {
                                        skillsWanted: currentSkills.map(s => 
                                          s.skillId === skill.id 
                                            ? { ...s, priority: value }
                                            : s
                                        )
                                      });
                                    }}
                                    className="flex gap-4 mt-2"
                                  >
                                    <div className="flex items-center space-x-1">
                                      <RadioGroupItem value="low" id={`${skill.id}-low`} />
                                      <label htmlFor={`${skill.id}-low`} className="text-xs">Low</label>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <RadioGroupItem value="medium" id={`${skill.id}-med`} />
                                      <label htmlFor={`${skill.id}-med`} className="text-xs">Medium</label>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <RadioGroupItem value="high" id={`${skill.id}-high`} />
                                      <label htmlFor={`${skill.id}-high`} className="text-xs">High</label>
                                    </div>
                                  </RadioGroup>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Availability */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-brand-green" />
                      When are you available?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select your preferred time slots. This helps us find matches when you're both free.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {DAYS_OF_WEEK.map((day, dayIndex) => {
                      const dayAvailability = formData.step3.availability.find(a => a.dayOfWeek === dayIndex);
                      const selectedSlots = dayAvailability?.slots || [];
                      
                      return (
                        <div key={day} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">{day}</h4>
                          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                            {TIME_SLOTS.map((slot) => {
                              const isSelected = selectedSlots.includes(slot);
                              return (
                                <Button
                                  key={slot}
                                  variant={isSelected ? "default" : "outline"}
                                  size="sm"
                                  className={cn(
                                    "text-xs",
                                    isSelected && "bg-brand-green hover:bg-brand-green/90"
                                  )}
                                  onClick={() => handleAvailabilityToggle(dayIndex, slot)}
                                >
                                  {slot}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button 
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="btn-neo"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={!isStepValid(currentStep) || isSubmitting}
                className="btn-neo"
              >
                {isSubmitting ? 'Creating profile...' : 'Generate Matches'}
                <Zap className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
