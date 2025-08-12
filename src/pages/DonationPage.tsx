import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  CreditCard, 
  Calendar, 
  Coins, 
  Zap,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Target,
  CheckCircle,
  Copy,
  ChevronLeft,
  ChevronRight,
  Star,
  Shield,
  Lightbulb,
  Globe,
  QrCode,
  DollarSign,
  ArrowDown,
  Gift
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { users } from '@/data/mockData';

// Mock data for donations
const donationData = {
  monthlyRaised: 15420,
  impactBreakdown: [
    { category: 'Platform improvements & free tier', percentage: 60, amount: 9252 },
    { category: 'Community events & challenges', percentage: 25, amount: 3855 },
    { category: 'Emergency aid fund', percentage: 15, amount: 2313 }
  ],
  featuredStories: [
    {
      id: 1,
      image: '/placeholder.svg',
      title: 'How donations helped Alex become a certified mentor',
      description: 'Through community support, Alex accessed advanced training and now mentors 50+ students monthly.',
      link: '/stories/alex'
    },
    {
      id: 2,
      image: '/placeholder.svg',
      title: 'Maria\'s coding bootcamp scholarship success',
      description: 'Your donations made it possible for Maria to attend a full-stack development program.',
      link: '/stories/maria'
    },
    {
      id: 3,
      image: '/placeholder.svg',
      title: 'Community coding challenge reaches 1000 participants',
      description: 'Sponsored challenges are bringing together learners from around the world.',
      link: '/stories/challenge'
    }
  ],
  topDonors: [
    { name: 'Sarah Chen', amount: 250, avatar: '/placeholder.svg', badge: 'Platinum Supporter' },
    { name: 'Anonymous', amount: 200, avatar: null, badge: 'Community Builder' },
    { name: 'Mike Rodriguez', amount: 180, avatar: '/placeholder.svg', badge: 'Learning Champion' },
    { name: 'Lisa Wang', amount: 150, avatar: '/placeholder.svg', badge: 'Skill Advocate' },
    { name: 'Anonymous', amount: 120, avatar: null, badge: 'Growth Enabler' }
  ],
  cryptoWallets: {
    btc: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    eth: '0x742d35cc6634C0532925a3b8D404d0B8b6e8d866',
    usdc: '0x742d35cc6634C0532925a3b8D404d0B8b6e8d866'
  }
};

export default function DonationPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('one-time');
  const [amount, setAmount] = useState('25');
  const [customAmount, setCustomAmount] = useState('');
  const [recipient, setRecipient] = useState('platform');
  const [selectedMentor, setSelectedMentor] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStory, setCurrentStory] = useState(0);
  const [copiedWallet, setCopiedWallet] = useState('');

  const amountOptions = ['5', '10', '25', '50'];

  // Auto-scroll stories carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % donationData.featuredStories.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleDonation = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const copyWalletAddress = (currency: string, address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedWallet(currency);
    setTimeout(() => setCopiedWallet(''), 2000);
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const finalAmount = amount === 'custom' ? customAmount : amount;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-br from-brand-primary via-brand-primary/90 to-brand-secondary bg-cover bg-center"
        style={{
          background: `linear-gradient(135deg, hsl(var(--brand-primary)) 0%, hsl(var(--brand-secondary)) 100%)`,
          minHeight: '500px'
        }}
      >
        <div className="absolute inset-0 bg-black/10" />
        
        <div className="relative page-container py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-6">
                Support the SkillSwap Movement
              </h1>
              <p className="text-base md:text-lg text-white/85 mb-8 max-w-2xl">
                Help make skills accessible to everyone. Your donation empowers more learning, 
                more teaching, and stronger communities.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-brand-primary hover:bg-gray-100"
                  onClick={() => scrollToSection('donation-form')}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Donate Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => scrollToSection('impact-tracker')}
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Learn How We Use Donations
                </Button>
              </div>
            </div>
            
            {/* Right column illustration */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur">
                  <div className="w-60 h-60 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="w-32 h-32 text-white/80" />
                  </div>
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-white/20 rounded-full p-3 animate-float">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white/20 rounded-full p-3 animate-float" style={{ animationDelay: '1s' }}>
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Form Section */}
      <div id="donation-form" className="py-16 bg-white dark:bg-slate-900">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4">Make Your Contribution</h2>
              <p className="text-lg text-muted-foreground">
                Choose how you'd like to support the SkillSwap community
              </p>
            </div>

            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 bg-gray-100 dark:bg-slate-700 p-1">
                    <TabsTrigger value="one-time" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-white">
                      <CreditCard className="w-4 h-4 mr-2" />
                      One-Time
                    </TabsTrigger>
                    <TabsTrigger value="monthly" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-white">
                      <Calendar className="w-4 h-4 mr-2" />
                      Monthly
                    </TabsTrigger>
                    <TabsTrigger value="credits" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-white">
                      <Coins className="w-4 h-4 mr-2" />
                      Credits
                    </TabsTrigger>
                    <TabsTrigger value="crypto" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-white">
                      <Zap className="w-4 h-4 mr-2" />
                      Crypto
                    </TabsTrigger>
                  </TabsList>

                  {/* One-Time Donation Tab */}
                  <TabsContent value="one-time" className="space-y-6">
                    <div>
                      <Label className="text-base font-medium mb-4 block">Amount</Label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                        {amountOptions.map((option) => (
                          <Button
                            key={option}
                            variant={amount === option ? "default" : "outline"}
                            onClick={() => setAmount(option)}
                            className="h-12"
                          >
                            ${option}
                          </Button>
                        ))}
                        <Button
                          variant={amount === 'custom' ? "default" : "outline"}
                          onClick={() => setAmount('custom')}
                          className="h-12"
                        >
                          Custom
                        </Button>
                      </div>
                      {amount === 'custom' && (
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            className="pl-10 h-12"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-base font-medium mb-4 block">Recipient</Label>
                      <RadioGroup value={recipient} onValueChange={setRecipient}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="platform" id="platform" />
                          <Label htmlFor="platform">Support the Platform (Recommended)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mentor" id="mentor" />
                          <Label htmlFor="mentor">Support a Mentor</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cause" id="cause" />
                          <Label htmlFor="cause">Support a Cause</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-base font-medium mb-2 block">
                        Optional Message (200 characters)
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Share why you're supporting SkillSwap..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value.slice(0, 200))}
                        className="resize-none"
                        rows={3}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        {message.length}/200 characters
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Payment Method</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="h-12 justify-start">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Credit Card (Stripe)
                        </Button>
                        <Button variant="outline" className="h-12 justify-start">
                          <div className="w-4 h-4 mr-2 bg-blue-600 rounded" />
                          PayPal
                        </Button>
                      </div>
                    </div>

                    <Button 
                      onClick={handleDonation}
                      disabled={isSubmitting || !finalAmount}
                      className="w-full h-12 text-lg"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Processing...
                        </div>
                      ) : (
                        <>
                          <Heart className="w-5 h-5 mr-2" />
                          Donate ${finalAmount}
                        </>
                      )}
                    </Button>
                  </TabsContent>

                  {/* Monthly Support Tab */}
                  <TabsContent value="monthly" className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">Monthly Support</h3>
                      </div>
                      <p className="text-blue-800 dark:text-blue-200">
                        Join our community of monthly supporters and help us build a sustainable platform for skill sharing.
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-base font-medium mb-4 block">Monthly Amount</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {['10', '25', '50', '100'].map((option) => (
                          <Button
                            key={option}
                            variant={amount === option ? "default" : "outline"}
                            onClick={() => setAmount(option)}
                            className="h-12"
                          >
                            ${option}/mo
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={handleDonation}
                      disabled={isSubmitting || !amount}
                      className="w-full h-12 text-lg"
                      size="lg"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Start Monthly Support
                    </Button>
                  </TabsContent>

                  {/* Credits Tab */}
                  <TabsContent value="credits" className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Coins className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-green-900 dark:text-green-100">Donate Credits</h3>
                      </div>
                      <p className="text-green-800 dark:text-green-200">
                        Share your earned credits with other learners or support platform initiatives.
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-sm text-green-700 dark:text-green-300">Your Balance:</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          240 Credits
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium mb-4 block">Credits to Donate</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {['10', '25', '50', '100'].map((option) => (
                          <Button
                            key={option}
                            variant={amount === option ? "default" : "outline"}
                            onClick={() => setAmount(option)}
                            className="h-12"
                          >
                            {option} Credits
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={handleDonation}
                      disabled={isSubmitting || !amount}
                      className="w-full h-12 text-lg"
                      size="lg"
                    >
                      <Gift className="w-5 h-5 mr-2" />
                      Donate Credits
                    </Button>
                  </TabsContent>

                  {/* Crypto Tab */}
                  <TabsContent value="crypto" className="space-y-6">
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Zap className="w-5 h-5 text-purple-600" />
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100">Crypto Donations</h3>
                      </div>
                      <p className="text-purple-800 dark:text-purple-200">
                        Support SkillSwap with cryptocurrency. All major currencies accepted.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {Object.entries(donationData.cryptoWallets).map(([currency, address]) => (
                        <Card key={currency} className="p-4">
                          <div className="text-center space-y-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-full mx-auto">
                              <span className="font-bold text-sm uppercase">{currency}</span>
                            </div>
                            <div className="space-y-2">
                              <QrCode className="w-16 h-16 mx-auto text-muted-foreground" />
                              <p className="text-xs font-mono break-all">{address}</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyWalletAddress(currency, address)}
                                className="w-full"
                              >
                                {copiedWallet === currency ? (
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                ) : (
                                  <Copy className="w-4 h-4 mr-2" />
                                )}
                                {copiedWallet === currency ? 'Copied!' : 'Copy Address'}
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Success Message */}
                {showSuccess && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                    <Card className="mx-4 max-w-md w-full">
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Thank you!</h3>
                        <p className="text-muted-foreground mb-4">
                          Your contribution is powering skills for everyone.
                        </p>
                        <Button onClick={() => setShowSuccess(false)}>
                          Close
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Impact Tracker Section */}
      <div id="impact-tracker" className="py-16 bg-gray-50 dark:bg-slate-800">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Your Impact, in Real Time</h2>
            <div className="text-4xl font-bold text-brand-primary mb-2">
              ${donationData.monthlyRaised.toLocaleString()}
            </div>
            <p className="text-lg text-muted-foreground">raised this month</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {donationData.impactBreakdown.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-brand-primary mb-1">
                      {item.percentage}%
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      ${item.amount.toLocaleString()}
                    </div>
                  </div>
                  <Progress value={item.percentage} className="mb-4" />
                  <p className="text-sm text-center">{item.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              View Full Impact Report
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Stories Carousel */}
      <div className="py-16 bg-white dark:bg-slate-900">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Stories of Impact</h2>
            <p className="text-lg text-muted-foreground">
              See how your donations are changing lives
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentStory * 100}%)` }}
              >
                {donationData.featuredStories.map((story, index) => (
                  <div key={story.id} className="w-full flex-shrink-0">
                    <Card className="mx-4">
                      <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                          <div className="aspect-video bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                            <Users className="w-16 h-16 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-4">{story.title}</h3>
                            <p className="text-muted-foreground mb-6">{story.description}</p>
                            <Button variant="outline">
                              Read More
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
              onClick={() => setCurrentStory((prev) => (prev - 1 + donationData.featuredStories.length) % donationData.featuredStories.length)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
              onClick={() => setCurrentStory((prev) => (prev + 1) % donationData.featuredStories.length)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* Dots indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {donationData.featuredStories.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentStory ? "bg-brand-primary" : "bg-gray-300 dark:bg-slate-600"
                  )}
                  onClick={() => setCurrentStory(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Donor Recognition */}
      <div className="py-16 bg-gray-50 dark:bg-slate-800">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Our Amazing Supporters</h2>
            <p className="text-lg text-muted-foreground">
              Thank you to our top donors this month
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="space-y-4">
              {donationData.topDonors.map((donor, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-brand-primary">#{index + 1}</span>
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={donor.avatar} />
                            <AvatarFallback>
                              {donor.name === 'Anonymous' ? '?' : donor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <p className="font-medium">{donor.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {donor.badge}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${donor.amount}</p>
                        <p className="text-sm text-muted-foreground">this month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transparency Section */}
      <div className="py-16 bg-white dark:bg-slate-900">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">How We Use Donations</h2>
            <p className="text-lg text-muted-foreground">
              Complete transparency in how your contributions make an impact
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Platform Development</h3>
              <p className="text-sm text-muted-foreground">New features and improvements</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Free Skill Programs</h3>
              <p className="text-sm text-muted-foreground">Scholarships and free access</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Mentor Tools</h3>
              <p className="text-sm text-muted-foreground">Better teaching resources</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Community Challenges</h3>
              <p className="text-sm text-muted-foreground">Sponsored learning events</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              <Shield className="w-5 h-5 mr-2" />
              View Full Financial Transparency Report
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Donate Button */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <Button 
          size="lg" 
          className="w-full shadow-lg"
          onClick={() => scrollToSection('donation-form')}
        >
          <Heart className="w-5 h-5 mr-2" />
          Donate Now
        </Button>
      </div>
    </div>
  );
}
