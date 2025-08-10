import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkillCard } from "@/components/SkillCard";
import { Rating } from "@/components/ui/rating";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight, Users, Zap, Shield, Search, Calendar, Star } from "lucide-react";
import { skills, users } from "@/mock/skillswap-data";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <Card className="glass">
    <CardContent className="p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </CardContent>
  </Card>
);

const Index = () => {
  const navigate = useNavigate();
  const featuredSkills = skills.slice(0, 6);
  const testimonials = users.slice(0, 3);

  useEffect(() => {
    document.title = "SkillSwap — Trade skills, not cash";
  }, []);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-20 mb-16">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold mb-6">
            Trade skills,{" "}
            <span className="text-gradient">not cash.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Teach what you know. Learn what you want. Your time and talent are the currency.
            Connect with passionate learners and teachers in our global skill-sharing community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="px-8 py-4 text-lg bg-gradient-brand hover:opacity-90"
              onClick={() => navigate('/matches')}
            >
              Find a Match
              <Search className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg"
              onClick={() => navigate('/dashboard')}
            >
              Offer a Skill
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-secondary" />
              <span>50k+ active learners</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-brand-amber" />
              <span>4.9 average rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-green" />
              <span>Verified teachers</span>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
              How SkillSwap Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start trading skills and building your expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-brand/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-gradient-brand/20 transition-colors">
                <Search className="h-8 w-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">1. Find Your Match</h3>
              <p className="text-muted-foreground">
                Our AI matches you with compatible teachers and learners based on skills,
                schedule, location, and learning style.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-brand/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-gradient-brand/20 transition-colors">
                <Calendar className="h-8 w-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">2. Book & Learn</h3>
              <p className="text-muted-foreground">
                Schedule 1:1 sessions, join group classes, or collaborate async.
                Credits are held in escrow until completion.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-brand/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-gradient-brand/20 transition-colors">
                <Zap className="h-8 w-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">3. Earn & Grow</h3>
              <p className="text-muted-foreground">
                Rate your experience, build your reputation, and earn credits
                to learn new skills. The cycle continues!
              </p>
            </div>
          </div>
        </div>

        {/* Featured Skills */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
                Trending Skills
              </h2>
              <p className="text-muted-foreground">
                Discover the most in-demand skills in our community
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/matches')}>
              Browse All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                variant="featured"
                onClick={() => navigate('/matches')}
              />
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
              What Our Community Says
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from learners and teachers who found their perfect skill match.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((user, index) => {
              const testimonialTexts = [
                "SkillSwap transformed how I learn. I traded my design skills for guitar lessons and built amazing friendships along the way!",
                "The AI matching is incredible. Found the perfect Spanish tutor who fits my schedule and learning pace. ¡Gracias SkillSwap!",
                "As a yoga instructor, I love the community here. Teaching brings me joy, and learning web dev with my earned credits is exciting!"
              ];

              return (
                <Card key={user.id} className="glass-card p-6">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-foreground">{user.name}</h4>
                        <div className="flex items-center gap-2">
                          <Rating rating={user.ratingAvg} size="sm" showNumber={false} />
                          <span className="text-sm text-muted-foreground">
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

        {/* CTA Section */}
        <div className="text-center glass-card p-12 mb-16">
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
              className="px-8 py-4 text-lg bg-gradient-brand hover:opacity-90"
              onClick={() => navigate('/dashboard')}
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg"
              onClick={() => navigate('/matches')}
            >
              Explore Skills
            </Button>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge variant="secondary" className="text-xs">✓ Free to start</Badge>
            <Badge variant="secondary" className="text-xs">✓ No subscription required</Badge>
            <Badge variant="secondary" className="text-xs">✓ Global community</Badge>
            <Badge variant="secondary" className="text-xs">✓ Verified teachers</Badge>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
