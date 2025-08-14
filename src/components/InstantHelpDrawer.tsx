import { useState } from 'react';
import { X, Zap, Star, Clock, DollarSign, Video, MessageCircle, CheckCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { CreditDisplay } from '@/components/CreditDisplay';
import type { ExpertProfile } from '@/models/expert-types';
import { expertProfiles } from '@/mock/enhanced-data';

interface InstantHelpDrawerProps {
  trigger: React.ReactNode;
  skillId?: string;
  className?: string;
  onSessionStart?: (expertId: string, requestData: any) => void;
}

type Step = 'request' | 'matching' | 'experts' | 'payment' | 'connecting';

const urgencyOptions = [
  { value: 'low', label: 'Low - Can wait a few hours', color: 'bg-brand-success/10 text-brand-success border-brand-success/20' },
  { value: 'medium', label: 'Medium - Need help today', color: 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20' },
  { value: 'high', label: 'High - Need help within 1 hour', color: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' },
  { value: 'critical', label: 'Critical - Emergency help needed', color: 'bg-brand-danger/10 text-brand-danger border-brand-danger/20' }
];

export default function InstantHelpDrawer({ 
  trigger, 
  skillId, 
  className,
  onSessionStart 
}: InstantHelpDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>('request');
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    topic: '',
    urgency: 'medium',
    description: '',
    estimatedDuration: '30',
    maxRate: '300'
  });

  const availableExperts = expertProfiles.filter(expert => 
    expert.expertStatus.instantAvailable &&
    expert.expertise.some(exp => !skillId || exp.skillId === skillId)
  );

  const handleRequestSubmit = () => {
    if (!formData.topic.trim() || !formData.description.trim()) return;
    
    setStep('matching');
    // Simulate AI matching
    setTimeout(() => {
      setStep('experts');
    }, 2000);
  };

  const handleExpertSelect = (expertId: string) => {
    setSelectedExpert(expertId);
    setStep('payment');
  };

  const handleStartSession = () => {
    if (!selectedExpert) return;
    
    setStep('connecting');
    onSessionStart?.(selectedExpert, formData);
    
    // Simulate connection
    setTimeout(() => {
      setIsOpen(false);
      setStep('request');
      setSelectedExpert(null);
    }, 3000);
  };

  const renderRequestForm = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center mx-auto">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold">Get Instant Expert Help</h3>
        <p className="text-muted-foreground">
          Our AI will find you a verified expert available right now
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="topic">What do you need help with?</Label>
          <Input
            id="topic"
            placeholder="e.g., Debug React component, Logo design feedback..."
            value={formData.topic}
            onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="urgency">How urgent is this?</Label>
          <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {urgencyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Badge className={option.color} variant="outline">
                      {option.value.toUpperCase()}
                    </Badge>
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Please describe your specific question or issue</Label>
          <Textarea
            id="description"
            placeholder="Provide context and details to help our experts understand what you need..."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="mt-1 min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration">Estimated Duration</Label>
            <Select value={formData.estimatedDuration} onValueChange={(value) => setFormData(prev => ({ ...prev, estimatedDuration: value }))}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="maxRate">Max Rate ($/min)</Label>
            <Select value={formData.maxRate} onValueChange={(value) => setFormData(prev => ({ ...prev, maxRate: value }))}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">$1.00/min</SelectItem>
                <SelectItem value="150">$1.50/min</SelectItem>
                <SelectItem value="200">$2.00/min</SelectItem>
                <SelectItem value="300">$3.00/min</SelectItem>
                <SelectItem value="500">$5.00/min</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={handleRequestSubmit} 
          className="flex-1"
          disabled={!formData.topic.trim() || !formData.description.trim()}
        >
          <Zap className="w-4 h-4 mr-2" />
          Find Expert
        </Button>
      </div>
    </div>
  );

  const renderMatching = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto animate-pulse" style={{ background: 'var(--gradient-brand)' }}>
        <Zap className="w-8 h-8 text-white" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Finding Perfect Expert...</h3>
        <p className="text-muted-foreground">
          Our AI is analyzing your request and matching you with available experts
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span>Analyzing request...</span>
          <CheckCircle className="w-4 h-4 text-green-500" />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Checking expert availability...</span>
          <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Ranking by compatibility...</span>
          <Clock className="w-4 h-4" />
        </div>
      </div>

      <Progress value={75} className="h-2" />
      
      <p className="text-xs text-muted-foreground">
        Average matching time: 30-60 seconds
      </p>
    </div>
  );

  const renderExperts = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Available Experts</h3>
        <p className="text-muted-foreground">
          {availableExperts.length} verified experts ready to help you now
        </p>
      </div>

      <div className="space-y-3">
        {availableExperts.map((expert) => {
          const expertise = expert.expertise[0];
          const responseTime = expert.expertStatus.responseTimeAvg;
          
          return (
            <Card key={expert.id} className={cn(
              'cursor-pointer hover-lift transition-all',
              selectedExpert === expert.id && 'ring-2 ring-brand-primary'
            )}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={expert.avatarUrl} alt={expert.name} />
                      <AvatarFallback>
                        {expert.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{expert.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {expert.expertStatus.specializations.slice(0, 2).join(', ')}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium">
                          ${(expertise.ratePerMinuteCents / 100).toFixed(2)}/min
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ~${((expertise.ratePerMinuteCents / 100) * parseInt(formData.estimatedDuration)).toFixed(0)} total
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{expert.expertStatus.instantRating}</span>
                        <span className="text-muted-foreground">
                          ({expert.expertStatus.completedInstantSessions})
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Responds in {responseTime}s</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleExpertSelect(expert.id)}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Select Expert
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderPayment = () => {
    const expert = availableExperts.find(e => e.id === selectedExpert);
    const expertise = expert?.expertise[0];
    const estimatedCost = expertise ? (expertise.ratePerMinuteCents / 100) * parseInt(formData.estimatedDuration) : 0;

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">Confirm & Start Session</h3>
          <p className="text-muted-foreground">
            Review details and start your instant session
          </p>
        </div>

        {expert && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={expert.avatarUrl} alt={expert.name} />
                  <AvatarFallback>
                    {expert.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{expert.name}</h4>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{expert.expertStatus.instantRating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({expert.expertStatus.completedInstantSessions} sessions)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Topic:</span>
            <span className="font-medium">{formData.topic}</span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span className="font-medium">{formData.estimatedDuration} minutes</span>
          </div>
          <div className="flex justify-between">
            <span>Rate:</span>
            <span className="font-medium">${(expertise?.ratePerMinuteCents || 0) / 100}/minute</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Estimated Total:</span>
            <span>${estimatedCost.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg text-sm">
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 mt-0.5 text-brand-primary" />
            <div>
              <p className="font-medium">Pay-per-minute billing</p>
              <p className="text-muted-foreground">
                You'll only pay for the actual time used. Timer starts when the call begins.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep('experts')} className="flex-1">
            Back to Experts
          </Button>
          <Button onClick={handleStartSession} className="flex-1">
            <Video className="w-4 h-4 mr-2" />
            Start Session
          </Button>
        </div>
      </div>
    );
  };

  const renderConnecting = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
        <Video className="w-8 h-8 text-white" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Connecting to Expert...</h3>
        <p className="text-muted-foreground">
          Setting up your video call, please wait a moment
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
        
        <p className="text-sm text-muted-foreground">
          Your session will begin momentarily...
        </p>
      </div>
    </div>
  );

  const stepContent = {
    request: renderRequestForm,
    matching: renderMatching,
    experts: renderExperts,
    payment: renderPayment,
    connecting: renderConnecting
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className={className}>
        {trigger}
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-primary" />
              ExpertMatch AI
            </SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto">
          {stepContent[step]()}
        </div>
      </SheetContent>
    </Sheet>
  );
}
