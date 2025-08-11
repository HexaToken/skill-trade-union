import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { 
  Search, 
  Users, 
  BookOpen, 
  Award, 
  Target, 
  PlayCircle,
  CheckCircle,
  Zap,
  Shield,
  Star,
  ArrowRight,
  Coins,
  Crown,
  Globe,
  Heart,
  MessageCircle,
  Linkedin,
  Instagram,
  Twitter
} from 'lucide-react';
import { mockData } from '@/data/mockData';
import BookingModalUnified from '@/components/BookingModalUnified';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<{type: 'mentor' | 'course', id: string} | null>(null);
  const [activeSkillIcon, setActiveSkillIcon] = useState(0);

  // Animation for skill icons swapping
  const skillIcons = ['🎨', '🎸', '🚲', '💻', '👨‍🍳'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSkillIcon((prev) => (prev + 1) % skillIcons.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Featured people and courses
  const featuredPeople = mockData.users.slice(0, 3);
  const featuredCourses = mockData.classes.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <motion.div
              className="space-y-8"
              initial="initial"
              animate="animate"
              variants={staggerChildren}
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold font-['Poppins'] text-gray-900 dark:text-white leading-tight"
                variants={fadeInUp}
              >
                Trade Skills. Learn Anything.{' '}
                <span className="text-primary">Without Spending a Dollar.</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
                variants={fadeInUp}
              >
                SkillSwap connects people to exchange knowledge and services — powered by AI matching and a time-based credit system.
              </motion.p>

              {/* Search Bar */}
              <motion.div 
                className="relative max-w-md"
                variants={fadeInUp}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="What skill do you want to learn?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg border-2 border-gray-200 focus:border-primary"
                />
              </motion.div>

              {/* CTAs */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                variants={fadeInUp}
              >
                <Button asChild size="lg" className="h-12 px-8 text-lg">
                  <Link to="/search">
                    <Users className="mr-2 h-5 w-5" />
                    Find a Match
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-lg border-cyan-500 text-cyan-600 hover:bg-cyan-50">
                  <Link to="/classes">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Browse Courses
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Column - Animated Visual */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">You</div>
                      <div className="text-sm text-gray-500">Guitar Player</div>
                    </div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400" />
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="font-semibold">Marcus</div>
                      <div className="text-sm text-gray-500">Web Developer</div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💻</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <motion.div 
                    className="text-4xl mb-4"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {skillIcons[activeSkillIcon]}
                  </motion.div>
                  <div className="text-lg font-semibold text-primary">Skills Swapping!</div>
                  <div className="text-sm text-gray-500 mt-2">AI-powered matching in action</div>
                </div>

                <Button className="w-full mt-6" variant="ghost">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Watch How It Works (60s)
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust/Social Proof */}
      <section className="py-12 bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-600 dark:text-gray-400 mb-8">Trusted by learners and experts in 50+ countries</p>
            <div className="flex justify-center items-center space-x-12 opacity-50">
              <div className="text-2xl font-bold">TechCrunch</div>
              <div className="text-2xl font-bold">Forbes</div>
              <div className="text-2xl font-bold">Wired</div>
              <div className="text-2xl font-bold">Fast Company</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Three simple steps to start trading skills</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "List Your Skills",
                description: "Add what you can teach or help with",
                icon: <Award className="h-8 w-8" />
              },
              {
                step: 2,
                title: "Get Matched by AI",
                description: "Instantly find someone with the skill you want",
                icon: <Zap className="h-8 w-8" />
              },
              {
                step: 3,
                title: "Trade Using Credits",
                description: "No money, just time and talent",
                icon: <Coins className="h-8 w-8" />
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="text-center p-8 h-full hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-6">
                    {item.icon}
                  </div>
                  <div className="text-sm font-semibold text-primary mb-2">Step {item.step}</div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/onboarding">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Dual Discovery Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] mb-4">Discover & Learn</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Connect with people or join structured courses</p>
          </motion.div>

          <Tabs defaultValue="people" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-[300px] grid-cols-2">
                <TabsTrigger value="people" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>People</span>
                </TabsTrigger>
                <TabsTrigger value="courses" className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Courses</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="people">
              <div className="grid md:grid-cols-3 gap-6">
                {featuredPeople.map((person, index) => (
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="text-center">
                        <Avatar className="h-20 w-20 mx-auto mb-4">
                          <AvatarImage src={person.avatarUrl} alt={person.name} />
                          <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-xl">{person.name}</CardTitle>
                        <CardDescription>{person.location.city}, {person.location.country}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <Badge variant="secondary" className="mb-2">
                            {person.skillsOffered[0]?.skillId.replace('-', ' ')}
                          </Badge>
                          <div className="flex items-center justify-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{person.ratingAvg}</span>
                            <span className="text-gray-500">({person.ratingCount})</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {person.wallet.credits} credits/hour
                          </div>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => setSelectedBooking({type: 'mentor', id: person.id})}
                        >
                          Book Session
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button asChild variant="outline" size="lg">
                  <Link to="/search">
                    View All People
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="courses">
              <div className="grid md:grid-cols-3 gap-6">
                {featuredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-gray-400" />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={mockData.users.find(u => u.id === course.teacherId)?.avatarUrl} />
                              <AvatarFallback>T</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">
                              {mockData.users.find(u => u.id === course.teacherId)?.name}
                            </span>
                          </div>
                          <Badge variant="outline">{course.pricePerSeat} credits</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{course.currentSeats}/{course.maxSeats} enrolled</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>4.8</span>
                          </div>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => setSelectedBooking({type: 'course', id: course.id})}
                        >
                          Enroll Now
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button asChild variant="outline" size="lg">
                  <Link to="/classes">
                    View All Courses
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Community Challenges */}
      <section className="py-20 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] mb-4">Community Challenges</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Join challenges and climb the leaderboards</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {mockData.challenges.slice(0, 2).map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{challenge.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{challenge.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{challenge.rewardCredits} credits</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span>{challenge.participants} participants</span>
                    <span>12 days left</span>
                  </div>
                  
                  <Button className="w-full">
                    Join Challenge
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link to="/challenges">
                View All Challenges
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why SkillSwap is Different */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] mb-4">Why SkillSwap is Different</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">The future of skill exchange</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "No Money Required",
                description: "A pure talent-for-talent economy where your skills are your currency",
                icon: <Heart className="h-8 w-8" />,
                color: "from-red-500 to-pink-500"
              },
              {
                title: "AI Matching",
                description: "Get the best skill partner in seconds with our intelligent matching system",
                icon: <Zap className="h-8 w-8" />,
                color: "from-yellow-500 to-orange-500"
              },
              {
                title: "Verified Quality",
                description: "Ratings, portfolios, and optional ID checks ensure trusted interactions",
                icon: <Shield className="h-8 w-8" />,
                color: "from-green-500 to-emerald-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="text-center p-8 h-full hover:shadow-lg transition-shadow">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full mb-6`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] mb-4">What Our Community Says</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Real stories from skill swappers worldwide</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Ava Ramirez",
                avatar: "https://picsum.photos/seed/ava/80",
                skillSwapped: "Photography ↔ Marketing",
                review: "SkillSwap helped me start my freelance career! The community is incredibly supportive.",
                rating: 5
              },
              {
                name: "James Wilson",
                avatar: "https://picsum.photos/seed/james/80", 
                skillSwapped: "Guitar ↔ Web Design",
                review: "Found an amazing mentor who helped me build my first website. The credit system is genius!",
                rating: 5
              },
              {
                name: "Maria Santos",
                avatar: "https://picsum.photos/seed/maria/80",
                skillSwapped: "Spanish ↔ Data Science",
                review: "Learning data science while teaching my native language. Win-win for everyone!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.skillSwapped}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">"{testimonial.review}"</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Credits & Membership Teaser */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <motion.div
                  className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-8"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Coins className="h-16 w-16 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4">Credit System</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Earn credits by teaching, spend them learning. Simple, fair, and transparent.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <h3 className="text-3xl font-bold font-['Poppins']">Ready to Go Pro?</h3>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Unlock unlimited matches, priority support, and advanced tools
                </p>
                
                <div className="space-y-4">
                  {[
                    "Unlimited skill matches",
                    "Priority customer support", 
                    "Advanced analytics",
                    "Exclusive challenges",
                    "Early access to new features"
                  ].map((feature) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" variant="outline" className="border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                  <Crown className="mr-2 h-5 w-5" />
                  Upgrade to Pro
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] mb-4">Join Our Community</h2>
            <p className="text-xl text-blue-100 mb-8">
              Get skill-swap tips, free challenges, and insider events.
            </p>
            
            <div className="max-w-md mx-auto flex space-x-4 mb-8">
              <Input 
                placeholder="Enter your email"
                className="bg-white text-gray-900 border-0"
              />
              <Button variant="secondary" size="lg">
                Subscribe
              </Button>
            </div>

            <div className="flex justify-center space-x-6">
              <Button variant="ghost" size="sm" className="text-white hover:text-blue-200">
                <MessageCircle className="h-5 w-5" />
                <span className="sr-only">Discord</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:text-blue-200">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:text-blue-200">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedBooking && (
        <BookingModalUnified
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          mode={selectedBooking.type}
          targetId={selectedBooking.id}
        />
      )}
    </div>
  );
};

export default HomePage;
