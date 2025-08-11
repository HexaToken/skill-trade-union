import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Globe, 
  Calendar, 
  Clock,
  MessageCircle,
  UserPlus,
  Share2,
  MoreHorizontal,
  Award,
  CheckCircle,
  ExternalLink,
  ArrowLeft,
  Zap,
  Heart,
  Users,
  BookOpen,
  TrendingUp,
  Badge as BadgeIcon,
  Languages,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import StickyPanel from '@/components/StickyPanel';
import InstantHelpDrawer from '@/components/InstantHelpDrawer';
import { CreditDisplay } from '@/components/CreditDisplay';
import { cn } from '@/lib/utils';
import { users, skills, reviews, sessions } from '@/data/mockData';
import type { User } from '@/models/types';

const tierConfig = {
  Silver: { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: '🥈', rate: 15 },
  Gold: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: '🥇', rate: 25 },
  Platinum: { color: 'bg-purple-100 text-purple-800 border-purple-300', icon: '💎', rate: 40 }
};

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('about');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);

  // Mock mentor tier assignment
  const getMentorTier = (userId: string) => {
    const index = users.findIndex(u => u.id === userId);
    return index % 3 === 0 ? 'Platinum' : index % 2 === 0 ? 'Gold' : 'Silver';
  };

  useEffect(() => {
    if (id) {
      const foundUser = users.find(u => u.id === id);
      setUser(foundUser || null);
    }
  }, [id]);

  if (!user) {
    return (
      <div className="page-container py-16 text-center">
        <div className="space-y-4">
          <Users className="w-16 h-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">Profile not found</h2>
          <p className="text-muted-foreground">The user profile you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/matches')}>
            Find People
          </Button>
        </div>
      </div>
    );
  }

  const mentorTier = getMentorTier(user.id);
  const tierInfo = tierConfig[mentorTier as keyof typeof tierConfig];
  const userReviews = reviews.slice(0, 5); // Mock reviews
  const userSessions = sessions.filter(s => s.teacherId === user.id || s.learnerIds.includes(user.id));
  
  const skillsAsTeacher = user.skillsOffered.map(skill => ({
    ...skill,
    skillData: skills.find(s => s.id === skill.skillId)
  })).filter(skill => skill.skillData);

  const skillsAsLearner = user.skillsWanted.map(skill => ({
    ...skill,
    skillData: skills.find(s => s.id === skill.skillId)
  })).filter(skill => skill.skillData);

  const handleMessage = () => {
    navigate(`/messages?user=${user.id}`);
  };

  const handleBookSession = () => {
    navigate(`/booking?teacher=${user.id}`);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleInstantHelp = () => {
    console.log('Starting instant help with user');
  };

  const formatLastActive = (lastActive: string) => {
    const diff = Date.now() - new Date(lastActive).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Active now';
    if (hours < 24) return `Active ${hours}h ago`;
    return `Active ${Math.floor(hours / 24)}d ago`;
  };

  const canInstantHelp = user.id === 'user-1' || user.id === 'user-2'; // Mock availability

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="page-container py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="border-b">
        <div className="page-container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center md:items-start">
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-muted">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="text-2xl">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Online status */}
                    <div className={cn(
                      'absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white',
                      canInstantHelp ? 'bg-green-500' : 'bg-gray-400'
                    )} />

                    {/* Mentor tier badge */}
                    <div className="absolute -top-2 -right-2">
                      <Badge className={cn('text-sm px-3 py-1', tierInfo.color)} variant="outline">
                        <span className="mr-1">{tierInfo.icon}</span>
                        {mentorTier}
                      </Badge>
                    </div>
                  </div>

                  {/* Quick actions - mobile */}
                  <div className="flex md:hidden gap-2 mt-4">
                    <Button size="sm" onClick={handleMessage}>
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleFollow}>
                      <UserPlus className="w-4 h-4 mr-1" />
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  </div>
                </div>

                {/* Main Info */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-heading font-bold">{user.name}</h1>
                      
                      {/* Desktop actions */}
                      <div className="hidden md:flex items-center gap-2">
                        <Button size="sm" onClick={handleMessage}>
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleFollow}>
                          <UserPlus className="w-4 h-4 mr-1" />
                          {isFollowing ? 'Following' : 'Follow'}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleShare}>
                              <Share2 className="w-4 h-4 mr-2" />
                              Share Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Heart className="w-4 h-4 mr-2" />
                              Add to Favorites
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{user.location.city}, {user.location.country}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <span>{user.timezone.replace('_', ' ').replace('/', ' / ')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatLastActive(user.lastActive)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{user.ratingAvg}</span>
                        <span className="text-muted-foreground">({user.ratingCount} reviews)</span>
                      </div>
                      <div className="text-muted-foreground">
                        Member since {new Date(user.joinedAt).getFullYear()}
                      </div>
                      <div className="text-muted-foreground">
                        {userSessions.length} sessions completed
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <p className={cn(
                      'text-muted-foreground leading-relaxed',
                      !showFullBio && 'line-clamp-3'
                    )}>
                      {user.bio}
                    </p>
                    {user.bio.length > 200 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowFullBio(!showFullBio)}
                      >
                        {showFullBio ? 'Show less' : 'Show more'}
                      </Button>
                    )}
                  </div>

                  {/* Languages */}
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Languages className="w-4 h-4" />
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.languages.map((language) => (
                        <Badge key={language} variant="secondary">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Verification & Badges */}
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <BadgeIcon className="w-4 h-4" />
                      Verification & Achievements
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.verification.idVerified && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          ID Verified
                        </Badge>
                      )}
                      {user.verification.testsPassed.map((test) => (
                        <Badge key={test} className="bg-blue-100 text-blue-800">
                          <Award className="w-3 h-3 mr-1" />
                          {test}
                        </Badge>
                      ))}
                      {user.badges.map((badge) => (
                        <Badge key={badge} variant="outline">
                          {badge.replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  {Object.keys(user.socials).length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Connect</h3>
                      <div className="flex gap-2">
                        {user.socials.website && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={user.socials.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Website
                            </a>
                          </Button>
                        )}
                        {user.socials.linkedin && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`https://linkedin.com/in/${user.socials.linkedin}`} target="_blank" rel="noopener noreferrer">
                              LinkedIn
                            </a>
                          </Button>
                        )}
                        {user.socials.github && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`https://github.com/${user.socials.github}`} target="_blank" rel="noopener noreferrer">
                              GitHub
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Action Panel */}
            <div className="lg:col-span-1">
              <StickyPanel
                type="mentor"
                title={`Book with ${user.name.split(' ')[0]}`}
                creditsPerHour={tierInfo.rate}
                rating={user.ratingAvg}
                ratingCount={user.ratingCount}
                responseTime="< 4 hours"
                nextAvailable={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()}
                onPrimaryAction={handleBookSession}
                onSecondaryAction={() => navigate(`/mentors?filter=${user.id}`)}
                onInstantHelp={handleInstantHelp}
                onAddToWishlist={handleFollow}
                onShare={handleShare}
                primaryActionLabel="Book Session"
                secondaryActionLabel="View as Mentor"
                isInWishlist={isFollowing}
                canInstantHelp={canInstantHelp}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                {/* Skills Offered */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Skills I Teach
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {skillsAsTeacher.map((skill) => (
                        <div key={skill.skillId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{skill.skillData?.icon}</span>
                            <div>
                              <h4 className="font-medium">{skill.skillData?.name}</h4>
                              <p className="text-sm text-muted-foreground">{skill.skillData?.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Level {skill.level}</Badge>
                            <div className="text-sm text-muted-foreground">
                              {skill.skillData?.baseRateCredits} credits/hr
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Learning */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Skills I'm Learning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {skillsAsLearner.map((skill) => (
                        <div key={skill.skillId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{skill.skillData?.icon}</span>
                            <div>
                              <h4 className="font-medium">{skill.skillData?.name}</h4>
                              <p className="text-sm text-muted-foreground">{skill.skillData?.category}</p>
                            </div>
                          </div>
                          <Badge 
                            variant={skill.priority === 'high' ? 'destructive' : skill.priority === 'medium' ? 'default' : 'secondary'}
                          >
                            {skill.priority} priority
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Availability */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Availability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {user.availability.map((slot) => {
                        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        return (
                          <div key={slot.dayOfWeek} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <span className="font-medium">{days[slot.dayOfWeek]}</span>
                            <div className="flex gap-2">
                              {slot.slots.map((time) => (
                                <Badge key={time} variant="outline" size="sm">
                                  {time}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skill Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      {skillsAsTeacher.map((skill) => (
                        <div key={skill.skillId} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{skill.skillData?.icon}</span>
                              <div>
                                <h4 className="font-medium">{skill.skillData?.name}</h4>
                                <p className="text-sm text-muted-foreground">{skill.skillData?.description}</p>
                              </div>
                            </div>
                            <Badge variant="outline">Level {skill.level}</Badge>
                          </div>
                          <Progress value={skill.level * 20} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Proficiency Level</span>
                            <span>{skill.level}/5</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Portfolio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.portfolio.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {user.portfolio.map((item, index) => (
                          <div key={index} className="space-y-3">
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                              <img 
                                src={item.mediaUrl} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                              <Badge variant="outline" size="sm" className="mt-2">
                                {item.type}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No portfolio items yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        Reviews & Feedback
                      </span>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{user.ratingAvg}</span>
                        <span className="text-muted-foreground">({user.ratingCount} reviews)</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Rating breakdown */}
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="text-sm w-4">{rating}</span>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <Progress value={rating === 5 ? 80 : rating === 4 ? 15 : 5} className="flex-1 h-2" />
                          <span className="text-sm text-muted-foreground w-8">
                            {rating === 5 ? '80%' : rating === 4 ? '15%' : '5%'}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Individual reviews */}
                    <div className="space-y-6">
                      {userReviews.map((review, index) => {
                        const reviewer = users.find(u => u.id === review.reviewerId);
                        return (
                          <div key={review.id} className="space-y-3">
                            <div className="flex items-start gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={reviewer?.avatarUrl} alt={reviewer?.name} />
                                <AvatarFallback>
                                  {reviewer?.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{reviewer?.name}</span>
                                  <div className="flex items-center">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm">{review.text}</p>
                              </div>
                            </div>
                            {index < userReviews.length - 1 && <Separator />}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Instant Help CTA */}
            {canInstantHelp && (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-amber to-brand-green rounded-lg flex items-center justify-center mx-auto">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Available for Instant Help</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {user.name.split(' ')[0]} is online and ready to help
                      </p>
                    </div>
                    <InstantHelpDrawer
                      trigger={
                        <Button className="w-full bg-gradient-to-r from-brand-amber to-brand-green hover:from-brand-amber/90 hover:to-brand-green/90 text-white border-0">
                          <Zap className="w-4 h-4 mr-2" />
                          Start Instant Call
                        </Button>
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Sessions</span>
                  <span className="font-medium">{userSessions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Skills Offered</span>
                  <span className="font-medium">{user.skillsOffered.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response Rate</span>
                  <span className="font-medium">98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-medium">{new Date(user.joinedAt).getFullYear()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Similar Mentors */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Mentors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {users.slice(1, 4).map((similarUser) => (
                  <div 
                    key={similarUser.id}
                    className="flex gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                    onClick={() => navigate(`/profile/${similarUser.id}`)}
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={similarUser.avatarUrl} alt={similarUser.name} />
                      <AvatarFallback>
                        {similarUser.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{similarUser.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{similarUser.bio}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs">{similarUser.ratingAvg}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
