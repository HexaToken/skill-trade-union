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
      <section className="relative overflow-hidden bg-canvas">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
        <div className="relative page-container py-24 md:py-36">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Hero Badge */}
            <Badge className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20 px-6 py-3 hover:bg-gradient-to-r hover:from-primary/15 hover:to-secondary/15 transition-all duration-300 rounded-full shadow-lg hover:shadow-xl animate-float">
              <Zap className="w-4 h-4 mr-2" />
              Now with ExpertMatch AI - Get instant help!
            </Badge>

            {/* Hero Title */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-tight text-foreground tracking-tight">
                Trade{' '}
                <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text animate-gradient-shift">skills</span>,{' '}
                <span className="text-transparent bg-gradient-to-r from-secondary to-primary bg-clip-text">not cash</span>
              </h1>
              <p className="text-xl md:text-2xl text-ink-body max-w-3xl mx-auto leading-relaxed font-medium">
                Learn anything, teach anything. Join the world's largest skill-sharing community where knowledge flows freely.
              </p>
            </div>

            {/* Hero Actions */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="text-lg px-10 py-7 hover-scale bg-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary text-white shadow-xl hover:shadow-2xl rounded-2xl transition-all duration-300 font-semibold" asChild>
                <Link to="/matches">
                  Find a Match
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>

              <Button size="lg" className="text-lg px-10 py-7 hover-scale bg-secondary hover:bg-secondary/90 text-white shadow-xl hover:shadow-2xl rounded-2xl transition-all duration-300 font-semibold" asChild>
                <Link to="/onboarding">
                  Offer a Skill
                </Link>
              </Button>

              <InstantHelpDrawer
                trigger={
                  <Button size="lg" className="text-lg px-10 py-7 hover-scale bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white shadow-xl hover:shadow-2xl rounded-2xl transition-all duration-300 font-semibold animate-pulse-glow">
                    <Zap className="w-5 h-5 mr-2" />
                    Need Help Now?
                  </Button>
                }
              />
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-10 pt-12 text-sm text-ink-body">
              <div className="flex items-center gap-3 bg-surface/70 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-surface/20">
                <div className="w-10 h-10 bg-gradient-to-br from-success to-success rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">ID Verified Members</span>
              </div>
              <div className="flex items-center gap-3 bg-surface/70 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-surface/20">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary rounded-xl flex items-center justify-center shadow-lg">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">Skill Tested Experts</span>
              </div>
              <div className="flex items-center gap-3 bg-surface/70 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-surface/20">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">Community Driven</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-b bg-canvas">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colors = [
                'bg-gradient-to-br from-primary to-primary text-white',
                'bg-gradient-to-br from-secondary to-secondary text-white',
                'bg-gradient-to-br from-primary to-secondary text-white',
                'bg-gradient-to-br from-success to-success text-white'
              ];
              return (
                <div key={stat.label} className="text-center space-y-4 hover-lift group">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ${colors[index % colors.length]} group-hover:scale-110`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="text-4xl font-bold font-heading text-ink-head group-hover:text-primary transition-colors">{stat.value}</div>
                  <div className="text-sm font-medium text-ink-body uppercase tracking-wide">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Category Rail */}
      <section className="py-16 border-b bg-canvas">
        <div className="page-container">
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-heading font-bold text-ink-head">Explore by Category</h2>
            <p className="text-lg text-ink-body max-w-2xl mx-auto">
              Discover skills across diverse categories or dive deep into your area of expertise
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="lg"
                className={`hover-scale transition-all duration-300 shadow-lg hover:shadow-xl rounded-2xl border-2 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white border-transparent shadow-xl'
                    : 'bg-surface/80 backdrop-blur-sm hover:bg-surface text-ink-body hover:text-primary border-border hover:border-secondary/50 hover:shadow-2xl hover:-translate-y-1'
                }`}
                onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                asChild
              >
                <Link to={`/matches?category=${category.name}`}>
                  <span className="text-xl mr-3">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                  {category.popular && (
                    <Badge size="sm" variant="secondary" className="ml-3 bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700 font-medium">
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
      <section className="py-20 bg-canvas">
        <div className="page-container">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-3">
              <h2 className="text-4xl font-heading font-bold text-ink-head">Popular Skills</h2>
              <p className="text-lg text-ink-body">
                Most in-demand skills in our community
              </p>
            </div>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
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
      <section className="py-20 bg-canvas">
        <div className="page-container">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-3">
              <h2 className="text-4xl font-heading font-bold text-ink-head">Featured Classes</h2>
              <p className="text-lg text-ink-body">
                Join structured learning experiences with expert instructors
              </p>
            </div>
            <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
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
      <section className="py-20 bg-canvas">
        <div className="page-container">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-3">
              <h2 className="text-4xl font-heading font-bold text-ink-head">Top Mentors</h2>
              <p className="text-lg text-ink-body">
                Learn from the best in their fields with personalized guidance
              </p>
            </div>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
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
                    <Avatar className="w-20 h-20 mx-auto border-4 border-muted group-hover:border-primary transition-colors">
                      <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
                      <AvatarFallback className="text-lg">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {mentor.verification.idVerified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success border-2 border-surface rounded-full flex items-center justify-center">
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
                      <Star className="w-4 h-4 fill-warning text-warning" />
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
      <section className="py-16 bg-canvas border-y">
        <div className="page-container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
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
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">AI-Powered Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced algorithms find the perfect expert for your specific need
                </p>
              </div>

              <div className="space-y-3 p-6 bg-card rounded-xl shadow-soft border hover:shadow-elev transition-shadow">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground">Instant Availability</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with experts available right now, no waiting required
                </p>
              </div>

              <div className="space-y-3 p-6 bg-card rounded-xl shadow-soft border hover:shadow-elev transition-shadow">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mx-auto">
                  <Star className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground">Per-Minute Billing</h3>
                <p className="text-sm text-muted-foreground">
                  Fair pricing - pay only for actual time used during your session
                </p>
              </div>
            </div>

            <InstantHelpDrawer
              trigger={
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white border-0 px-8 py-6 shadow-lg hover:shadow-glow transition-all duration-200">
                  <Zap className="w-5 h-5 mr-2" />
                  Try ExpertMatch AI
                </Button>
              }
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-canvas">
        <div className="page-container">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl font-heading font-bold text-ink-head">What Our Community Says</h2>
            <p className="text-lg text-ink-body max-w-2xl mx-auto">
              Real stories from learners and teachers who've transformed their skills through SkillSwap
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-lift">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warning text-warning" />
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
      <section className="py-20 bg-canvas">
        <div className="page-container">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl font-heading font-bold text-ink-head">How SkillSwap Works</h2>
            <p className="text-lg text-ink-body max-w-2xl mx-auto">
              Simple steps to start sharing and learning skills in our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg hover:shadow-glow transition-shadow">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Offer Your Skills</h3>
              <p className="text-muted-foreground">
                Share what you know and earn credits for teaching others. Every skill has value in our community.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto shadow-lg hover:shadow-glow transition-shadow">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Earn Credits</h3>
              <p className="text-muted-foreground">
                Build up credits by helping others learn. Your knowledge becomes currency in the SkillSwap economy.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto shadow-lg hover:shadow-glow transition-shadow">
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
