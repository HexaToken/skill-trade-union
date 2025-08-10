import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Star, 
  Users, 
  Shield, 
  Search,
  Calendar,
  Zap,
  Play,
  CheckCircle,
  TrendingUp,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { skills, users, reviews } from '@/data/mockData';

export default function Home() {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Featured skills for carousel
  const featuredSkills = skills.filter(s => s.demandScore > 80).slice(0, 6);
  
  // Sample testimonials
  const testimonials = [
    {
      text: "SkillSwap transformed how I learn. I traded my design skills for guitar lessons and built amazing friendships along the way!",
      author: users[0],
      skill: "Logo Design"
    },
    {
      text: "The AI matching is incredible. Found the perfect Spanish tutor who fits my schedule and learning pace. ¡Gracias SkillSwap!",
      author: users[1],
      skill: "Web Development"
    },
    {
      text: "As a yoga instructor, I love the community here. Teaching brings me joy, and learning web dev with my earned credits is exciting!",
      author: users[2],
      skill: "Yoga"
    }
  ];

  // Trust indicators
  const trustStats = [
    { icon: Users, label: "50k+ active learners", value: "50,000+" },
    { icon: Star, label: "4.9 average rating", value: "4.9" },
    { icon: Shield, label: "Verified teachers", value: "98%" }
  ];

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative section-spacing overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5" />
        
        <div className="page-container relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold mb-6 animate-fade-in">
              Trade skills,{" "}
              <span className="text-gradient">not cash.</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in [animation-delay:200ms]">
              Teach what you know. Learn what you want. Your time and talent are the currency.
              Connect with passionate learners and teachers in our global skill-sharing community.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in [animation-delay:400ms]">
              <Button 
                size="lg" 
                className="btn-neo text-lg px-8 py-4"
                onClick={() => navigate('/matches')}
              >
                Find a Match
                <Search className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="btn-glass text-lg px-8 py-4"
                onClick={() => navigate('/dashboard')}
              >
                Offer a Skill
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground animate-fade-in [animation-delay:600ms]">
              {trustStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-brand-secondary" />
                    <span>{stat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-spacing bg-muted/30">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
              How SkillSwap Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start trading skills and building your expertise.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Find Your Match",
                description: "Our AI matches you with compatible teachers and learners based on skills, schedule, location, and learning style.",
                icon: Search,
                color: "from-brand-primary to-brand-secondary"
              },
              {
                step: "2", 
                title: "Book & Learn",
                description: "Schedule 1:1 sessions, join group classes, or collaborate async. Credits are held in escrow until completion.",
                icon: Calendar,
                color: "from-brand-secondary to-brand-success"
              },
              {
                step: "3",
                title: "Earn & Grow", 
                description: "Rate your experience, build your reputation, and earn credits to learn new skills. The cycle continues!",
                icon: Zap,
                color: "from-brand-success to-brand-warning"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center group">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300",
                    item.color
                  )}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="mb-4">
                    <span className="inline-block w-8 h-8 rounded-full bg-brand-primary text-white text-sm font-bold flex items-center justify-center mb-3">
                      {item.step}
                    </span>
                    <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Skills Section */}
      <section className="section-spacing">
        <div className="page-container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
                Trending Skills
              </h2>
              <p className="text-muted-foreground">
                Discover the most in-demand skills in our community
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/matches')} className="btn-glass">
              Browse All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSkills.map((skill) => (
              <Card 
                key={skill.id} 
                className="glass-card hover-lift cursor-pointer group"
                onClick={() => navigate('/matches')}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 group-hover:from-brand-primary/20 group-hover:to-brand-secondary/20 transition-colors">
                      <span className="text-3xl">{skill.icon}</span>
                    </div>
                    {skill.demandScore > 85 && (
                      <Badge variant="secondary" className="bg-brand-danger/10 text-brand-danger border-brand-danger/20">
                        🔥 Hot
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-brand-primary transition-colors">
                    {skill.name}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {skill.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" size="sm" className="text-xs">
                      {skill.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="w-3 h-3 text-brand-secondary" />
                      <span className="text-muted-foreground">{skill.demandScore}% demand</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-spacing bg-muted/30">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
              What Our Community Says
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from learners and teachers who found their perfect skill match.
            </p>
          </div>
          
          {/* Featured testimonial */}
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="glass-card p-8 text-center">
              <CardContent className="p-0">
                <Quote className="w-12 h-12 text-brand-primary mx-auto mb-6 opacity-50" />
                <blockquote className="text-xl lg:text-2xl font-medium text-foreground mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage 
                      src={testimonials[currentTestimonial].author.avatarUrl} 
                      alt={testimonials[currentTestimonial].author.name} 
                    />
                    <AvatarFallback>
                      {testimonials[currentTestimonial].author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">
                      {testimonials[currentTestimonial].author.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Teaching {testimonials[currentTestimonial].skill}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Testimonial indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentTestimonial 
                      ? "bg-brand-primary" 
                      : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Additional testimonials grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {users.slice(0, 3).map((user, index) => {
              const testimonialTexts = [
                "The platform made it so easy to find exactly what I was looking for. The community is supportive and encouraging.",
                "I've learned more in 3 months here than I did in years of traditional classes. The personalized approach works!",
                "Not only did I gain new skills, but I also built lasting professional relationships. Highly recommend!"
              ];
              
              return (
                <Card key={user.id} className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-foreground">{user.name}</h4>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={cn(
                                "w-3 h-3",
                                i < Math.floor(user.ratingAvg) 
                                  ? "fill-brand-warning text-brand-warning" 
                                  : "text-muted-foreground"
                              )}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">
                            {user.ratingCount} sessions
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic mb-4">
                      "{testimonialTexts[index]}"
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {user.skillsOffered.slice(0, 2).map((skillOffer) => {
                        const skill = skills.find(s => s.id === skillOffer.skillId);
                        return skill ? (
                          <Badge key={skill.id} variant="outline" size="sm">
                            {skill.icon} {skill.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing">
        <div className="page-container">
          <Card className="glass-card bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 border-brand-primary/20 p-12 text-center">
            <CardContent className="p-0">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
                Ready to start trading skills?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of learners and teachers who are building skills, 
                earning credits, and creating meaningful connections.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  size="lg" 
                  className="btn-neo text-lg px-8 py-4"
                  onClick={() => navigate('/onboarding')}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="btn-glass text-lg px-8 py-4"
                  onClick={() => navigate('/matches')}
                >
                  Explore Skills
                  <Search className="ml-2 h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge variant="secondary" className="text-xs bg-white/10">✓ Free to start</Badge>
                <Badge variant="secondary" className="text-xs bg-white/10">✓ No subscription required</Badge>
                <Badge variant="secondary" className="text-xs bg-white/10">✓ Global community</Badge>
                <Badge variant="secondary" className="text-xs bg-white/10">✓ Verified teachers</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
