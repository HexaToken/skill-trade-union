import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, MapPin, Zap, BookOpen, Award, Heart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SkillCard from '@/components/SkillCard';
import ClassCard from '@/components/ClassCard';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import InstantHelpDrawer from '@/components/InstantHelpDrawer';
import { skills, users } from '@/data/mockData';
import { courses } from '@/mock/enhanced-data';
import type { Skill } from '@/models/types';

const categories = [
  { id: 'technology', name: 'Technology', icon: '💻', popular: true },
  { id: 'design', name: 'Design', icon: '🎨', popular: true },
  { id: 'languages', name: 'Languages', icon: '🗣️', popular: true },
  { id: 'music', name: 'Music', icon: '🎵', popular: false },
  { id: 'business', name: 'Business', icon: '💼', popular: true },
  { id: 'wellness', name: 'Wellness', icon: '🧘', popular: false },
  { id: 'creative', name: 'Creative', icon: '🎭', popular: false },
  { id: 'lifestyle', name: 'Lifestyle', icon: '🏠', popular: false }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'UX Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    text: 'SkillSwap transformed my career! I learned React from Marcus and taught design in return. No money exchanged, just pure skill sharing.',
    rating: 5,
    skillsExchanged: 'React ↔ UX Design'
  },
  {
    name: 'David Kumar',
    role: 'Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    text: 'The instant expert help saved my project! Got React debugging help in minutes through ExpertMatch AI. Game changer!',
    rating: 5,
    skillsExchanged: 'Emergency React Help'
  },
  {
    name: 'Maria Santos',
    role: 'Marketing Manager',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    text: 'Built an amazing network while learning Spanish and teaching marketing. The community here is incredibly supportive.',
    rating: 5,
    skillsExchanged: 'Spanish ↔ Digital Marketing'
  }
];

const stats = [
  { label: 'Active Learners', value: '50K+', icon: Users },
  { label: 'Skills Shared', value: '500+', icon: BookOpen },
  { label: 'Success Stories', value: '10K+', icon: Star },
  { label: 'Countries', value: '80+', icon: MapPin }
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const popularSkills = skills.filter(skill => skill.demandScore > 80).slice(0, 6);
  const topMentors = users.filter(user => user.ratingAvg > 4.7).slice(0, 4);
  const featuredClasses = courses.slice(0, 3);

  const handleSkillSelect = (skill: Skill) => {
    console.log('Selected skill:', skill);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-background to-cyan-50 dark:from-slate-900 dark:via-background dark:to-cyan-900/20">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:50px_50px]" />
        <div className="relative page-container py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Hero Badge */}
            <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20 px-4 py-2 hover:bg-brand-primary/15 transition-colors">
              <Zap className="w-4 h-4 mr-2" />
              Now with ExpertMatch AI - Get instant help!
            </Badge>

            {/* Hero Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight text-foreground">
                Trade{' '}
                <span className="text-brand-primary">skills</span>,{' '}
                <span className="text-brand-secondary">not cash</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Learn anything, teach anything. Join the world's largest skill-sharing community where knowledge flows freely.
              </p>
            </div>

            {/* Hero Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-6 hover-scale bg-brand-primary hover:bg-gradient-to-r hover:from-brand-primary hover:to-brand-secondary text-white shadow-lg hover:shadow-glow" asChild>
                <Link to="/matches">
                  Find a Match
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>

              <Button size="lg" className="text-lg px-8 py-6 hover-scale bg-brand-secondary hover:bg-brand-secondary/90 text-foreground shadow-lg" asChild>
                <Link to="/onboarding">
                  Offer a Skill
                </Link>
              </Button>

              <InstantHelpDrawer
                trigger={
                  <Button size="lg" className="text-lg px-8 py-6 hover-scale bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary text-white shadow-lg hover:shadow-glow">
                    <Zap className="w-5 h-5 mr-2" />
                    Need Help Now?
                  </Button>
                }
              />
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-green-600" />
                </div>
                <span>ID Verified Members</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-blue-600" />
                </div>
                <span>Skill Tested Experts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-purple-600" />
                </div>
                <span>Community Driven</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-b bg-card">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colors = [
                'bg-brand-primary/10 text-brand-primary',
                'bg-brand-secondary/10 text-brand-secondary',
                'bg-brand-primary/10 text-brand-primary',
                'bg-brand-secondary/10 text-brand-secondary'
              ];
              return (
                <div key={stat.label} className="text-center space-y-3">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${colors[index % colors.length]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold font-heading text-brand-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Category Rail */}
      <section className="py-12 border-b">
        <div className="page-container">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-heading font-bold">Explore by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover skills across diverse categories or dive deep into your area of expertise
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="lg"
                className={`hover-scale transition-all duration-200 shadow-sm hover:shadow-md ${
                  selectedCategory === category.id
                    ? 'bg-brand-primary hover:bg-brand-primary/90 text-white'
                    : 'bg-card hover:bg-card/80 text-brand-neutral hover:text-foreground hover:border-brand-secondary hover:shadow-glow'
                }`}
                onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                asChild
              >
                <Link to={`/matches?category=${category.name}`}>
                  <span className="text-lg mr-2">{category.icon}</span>
                  {category.name}
                  {category.popular && (
                    <Badge size="sm" variant="secondary" className="ml-2 bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20">
                      Popular
                    </Badge>
                  )}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Skills */}
      <section className="py-16">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-heading font-bold">Popular Skills</h2>
              <p className="text-muted-foreground">
                Most in-demand skills in our community
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/matches">
                View All Skills
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                variant="featured"
                onSelect={handleSkillSelect}
                showActions
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Classes */}
      <section className="py-16 bg-muted/30">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-heading font-bold">Featured Classes</h2>
              <p className="text-muted-foreground">
                Join structured learning experiences with expert instructors
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/classes">
                Browse All Classes
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredClasses.map((course) => (
              <ClassCard
                key={course.id}
                course={course}
                variant="featured"
                onViewDetails={(id) => console.log('View course:', id)}
                onEnroll={(id) => console.log('Enroll in:', id)}
                onInstantHelp={(id) => console.log('Get help for:', id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Top Mentors */}
      <section className="py-16">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-heading font-bold">Top Mentors</h2>
              <p className="text-muted-foreground">
                Learn from the best in their fields with personalized guidance
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/mentors">
                Find Mentors
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topMentors.map((mentor) => (
              <Card key={mentor.id} className="hover-lift cursor-pointer group">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="relative">
                    <Avatar className="w-20 h-20 mx-auto border-4 border-muted group-hover:border-brand-primary transition-colors">
                      <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
                      <AvatarFallback className="text-lg">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {mentor.verification.idVerified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-white fill-white" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{mentor.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {mentor.bio}
                    </p>
                    
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{mentor.ratingAvg}</span>
                      <span className="text-sm text-muted-foreground">({mentor.ratingCount})</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-1">
                      {mentor.skillsOffered.slice(0, 2).map((skill) => {
                        const skillData = skills.find(s => s.id === skill.skillId);
                        return skillData ? (
                          <Badge key={skill.skillId} variant="secondary" size="sm">
                            {skillData.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <Button size="sm" className="w-full" asChild>
                    <Link to={`/profile/${mentor.id}`}>
                      View Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ExpertMatch AI Promo */}
      <section className="py-16 bg-gradient-to-r from-blue-50/50 via-background to-cyan-50/50 dark:from-slate-800/50 dark:via-background dark:to-cyan-900/20 border-y">
        <div className="page-container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                Instant Help with ExpertMatch AI
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get verified, instant expertise in minutes. Our AI finds available experts for immediate help — pay only for the time you need.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="space-y-3 p-6 bg-card rounded-xl shadow-soft border hover:shadow-elev transition-shadow">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="font-semibold text-foreground">AI-Powered Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced algorithms find the perfect expert for your specific need
                </p>
              </div>

              <div className="space-y-3 p-6 bg-card rounded-xl shadow-soft border hover:shadow-elev transition-shadow">
                <div className="w-12 h-12 bg-brand-secondary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6 text-brand-secondary" />
                </div>
                <h3 className="font-semibold text-foreground">Instant Availability</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with experts available right now, no waiting required
                </p>
              </div>

              <div className="space-y-3 p-6 bg-card rounded-xl shadow-soft border hover:shadow-elev transition-shadow">
                <div className="w-12 h-12 bg-brand-secondary/20 rounded-lg flex items-center justify-center mx-auto">
                  <Star className="w-6 h-6 text-brand-secondary" />
                </div>
                <h3 className="font-semibold text-foreground">Per-Minute Billing</h3>
                <p className="text-sm text-muted-foreground">
                  Fair pricing - pay only for actual time used during your session
                </p>
              </div>
            </div>

            <InstantHelpDrawer
              trigger={
                <Button size="lg" className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary text-white border-0 px-8 py-6 shadow-lg hover:shadow-glow transition-all duration-200">
                  <Zap className="w-5 h-5 mr-2" />
                  Try ExpertMatch AI
                </Button>
              }
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="page-container">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl font-heading font-bold">What Our Community Says</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real stories from learners and teachers who've transformed their skills through SkillSwap
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-lift">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <blockquote className="text-muted-foreground italic">
                    "{testimonial.text}"
                  </blockquote>
                  
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  
                  <Badge variant="outline" className="w-fit">
                    {testimonial.skillsExchanged}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="page-container">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl font-heading font-bold">How SkillSwap Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple steps to start sharing and learning skills in our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg hover:shadow-glow transition-shadow">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Offer Your Skills</h3>
              <p className="text-muted-foreground">
                Share what you know and earn credits for teaching others. Every skill has value in our community.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand-secondary rounded-2xl flex items-center justify-center mx-auto shadow-lg hover:shadow-glow transition-shadow">
                <span className="text-2xl font-bold text-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Earn Credits</h3>
              <p className="text-muted-foreground">
                Build up credits by helping others learn. Your knowledge becomes currency in the SkillSwap economy.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center mx-auto shadow-lg hover:shadow-glow transition-shadow">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Learn Anything</h3>
              <p className="text-muted-foreground">
                Use your credits to learn new skills from our global community of experts and enthusiasts.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/onboarding">
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
