import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Monitor, 
  Users, 
  Coins, 
  Check, 
  Info, 
  Gift,
  CreditCard,
  Wallet,
  Plus,
  CheckCircle,
  Zap,
  Globe
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface MentorData {
  id: string;
  name: string;
  avatarUrl: string;
  rate: number;
  availability: string[];
  verified: boolean;
  skillTested?: boolean;
  topMentor?: boolean;
  location: string;
  timezone: string;
  skill?: string;
}

interface CourseData {
  id: string;
  title: string;
  image: string;
  credits: number;
  instructor: string;
  category: string;
  duration: string;
  nextCohortDate?: string;
  selfPaced?: boolean;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'mentor' | 'course';
  mentor?: MentorData;
  course?: CourseData;
  userBalance: number;
  onBookingConfirm?: (bookingData: any) => void;
}

export default function BookingModalUnified({
  isOpen,
  onClose,
  mode,
  mentor,
  course,
  userBalance,
  onBookingConfirm
}: BookingModalProps) {
  // Booking configuration state
  const [sessionDuration, setSessionDuration] = useState(60);
  const [complexity, setComplexity] = useState('standard');
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [sessionMode, setSessionMode] = useState('video');
  const [escrowEnabled, setEscrowEnabled] = useState(true);
  const [enrollmentType, setEnrollmentType] = useState('self-paced');
  const [giftCourse, setGiftCourse] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credits');
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setShowSuccess(false);
      setAgreeToTerms(false);
      setPromoCode('');
    }
  }, [isOpen]);

  // Pricing calculations
  const complexityMultipliers = {
    simple: 1.0,
    standard: 1.3,
    advanced: 1.6
  };

  const baseRate = mentor?.rate || 0;
  const complexityRate = baseRate * complexityMultipliers[complexity as keyof typeof complexityMultipliers];
  const escrowFee = escrowEnabled ? Math.round(complexityRate * 0.05) : 0; // 5% escrow fee
  const sessionCredits = Math.round((complexityRate * sessionDuration) / 60);
  const totalCredits = mode === 'mentor' ? sessionCredits + escrowFee : course?.credits || 0;
  
  const canAfford = userBalance >= totalCredits;

  const handleConfirmBooking = () => {
    if (!agreeToTerms) return;

    const bookingData = {
      mode,
      ...(mode === 'mentor' && {
        mentorId: mentor?.id,
        duration: sessionDuration,
        complexity,
        dateTime: selectedDateTime,
        sessionMode,
        escrow: escrowEnabled
      }),
      ...(mode === 'course' && {
        courseId: course?.id,
        enrollmentType,
        gift: giftCourse
      }),
      totalCredits,
      paymentMethod,
      promoCode: promoCode || undefined
    };

    onBookingConfirm?.(bookingData);
    setShowSuccess(true);
  };

  const getAvailabilitySlots = () => {
    if (!mentor?.availability) return [];
    return mentor.availability.map(slot => ({
      value: slot,
      label: new Date(slot).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#1E293B] border-[#06B6D4]/20">
          <div className="text-center py-8 space-y-6">
            {/* Success Animation */}
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center animate-scale-in">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#0F172A] dark:text-[#F1F5F9] font-heading">
                {mode === 'mentor' ? "You're booked!" : "Enrollment successful!"}
              </h3>
              <p className="text-[#334155] dark:text-[#E2E8F0]">
                {mode === 'mentor' 
                  ? `Session with ${mentor?.name} confirmed for ${selectedDateTime ? new Date(selectedDateTime).toLocaleDateString() : 'your selected time'}`
                  : `You're now enrolled in ${course?.title}`
                }
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex-1 bg-[#0056D2] hover:bg-[#004BB8] text-white font-semibold"
                onClick={() => {
                  onClose();
                  window.location.href = '/dashboard';
                }}
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white"
                onClick={() => {
                  onClose();
                  window.location.href = mode === 'mentor' ? `/session/${mentor?.id}` : `/classes/${course?.id}`;
                }}
              >
                {mode === 'mentor' ? 'View Session Details' : 'View Course Details'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1E293B] border-[#06B6D4]/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9] font-heading">
              {mode === 'mentor' 
                ? `Book Session with ${mentor?.name || 'Mentor'}`
                : `Enroll in ${course?.title || 'Course'}`
              }
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Booking Details Section */}
            <div className="space-y-4">
              {mode === 'mentor' && mentor && (
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <Avatar className="w-16 h-16 ring-2 ring-[#06B6D4]/20">
                    <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
                    <AvatarFallback className="text-lg font-bold bg-[#0056D2]/10 text-[#0056D2]">
                      {mentor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[#0F172A] dark:text-[#F1F5F9]">{mentor.name}</h3>
                      {mentor.verified && (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          ID Verified
                        </Badge>
                      )}
                      {mentor.skillTested && (
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          Skill Tested
                        </Badge>
                      )}
                    </div>
                    
                    {mentor.skill && (
                      <Badge variant="outline" className="text-xs">
                        {mentor.skill}
                      </Badge>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-[#334155] dark:text-[#E2E8F0]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{mentor.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <span>{mentor.timezone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {mode === 'course' && course && (
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-20 h-14 object-cover rounded-xl"
                  />
                  
                  <div className="flex-1 space-y-2">
                    <h3 className="font-bold text-[#0F172A] dark:text-[#F1F5F9]">{course.title}</h3>
                    <p className="text-sm text-[#334155] dark:text-[#E2E8F0]">by {course.instructor}</p>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-[#334155] dark:text-[#E2E8F0]">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Session/Enrollment Configuration */}
            <div className="space-y-6">
              {mode === 'mentor' && (
                <>
                  {/* Duration Picker */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-[#334155] dark:text-[#E2E8F0]">Session Duration</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[30, 60, 90].map((duration) => (
                        <Button
                          key={duration}
                          variant={sessionDuration === duration ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            sessionDuration === duration
                              ? "bg-[#0056D2] text-white hover:bg-[#004BB8]"
                              : "border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white"
                          )}
                          onClick={() => setSessionDuration(duration)}
                        >
                          {duration} min
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Complexity Selector */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-[#334155] dark:text-[#E2E8F0]">Session Complexity</Label>
                    <Select value={complexity} onValueChange={setComplexity}>
                      <SelectTrigger className="border-[#06B6D4]/20 focus:border-[#0056D2] focus:ring-[#0056D2]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Simple (1.0x rate)</SelectItem>
                        <SelectItem value="standard">Standard (1.3x rate)</SelectItem>
                        <SelectItem value="advanced">Advanced (1.6x rate)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date/Time Picker */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-[#334155] dark:text-[#E2E8F0]">Select Date & Time</Label>
                    <Select value={selectedDateTime} onValueChange={setSelectedDateTime}>
                      <SelectTrigger className="border-[#06B6D4]/20 focus:border-[#0056D2] focus:ring-[#0056D2]">
                        <SelectValue placeholder="Choose available slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailabilitySlots().map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Session Mode */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-[#334155] dark:text-[#E2E8F0]">Session Mode</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'in-person', label: 'In-Person', icon: Users },
                        { value: 'video', label: 'Video Call', icon: Monitor },
                        { value: 'async', label: 'Async', icon: Calendar }
                      ].map((mode) => {
                        const Icon = mode.icon;
                        return (
                          <Button
                            key={mode.value}
                            variant={sessionMode === mode.value ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "flex items-center gap-2",
                              sessionMode === mode.value
                                ? "bg-[#0056D2] text-white hover:bg-[#004BB8]"
                                : "border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white"
                            )}
                            onClick={() => setSessionMode(mode.value)}
                          >
                            <Icon className="w-3 h-3" />
                            {mode.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {mode === 'course' && (
                <>
                  {/* Enrollment Type */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-[#334155] dark:text-[#E2E8F0]">Enrollment Type</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="self-paced"
                          checked={enrollmentType === 'self-paced'}
                          onCheckedChange={() => setEnrollmentType('self-paced')}
                        />
                        <Label htmlFor="self-paced" className="text-sm">
                          Self-paced (start immediately)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="cohort"
                          checked={enrollmentType === 'cohort'}
                          onCheckedChange={() => setEnrollmentType('cohort')}
                        />
                        <Label htmlFor="cohort" className="text-sm">
                          Cohort-based (next start: {course?.nextCohortDate || 'Feb 15, 2024'})
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Gift Course */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-[#06B6D4]" />
                      <Label htmlFor="gift-course" className="text-sm">Gift this course</Label>
                    </div>
                    <Switch
                      id="gift-course"
                      checked={giftCourse}
                      onCheckedChange={setGiftCourse}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Pricing Breakdown */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-3">
              <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#06B6D4]" />
                Price Breakdown
              </h4>
              
              {mode === 'mentor' && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#334155] dark:text-[#E2E8F0]">
                      Base rate ({sessionDuration} min)
                    </span>
                    <span className="font-medium">{Math.round((baseRate * sessionDuration) / 60)} credits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#334155] dark:text-[#E2E8F0]">
                      Complexity ({complexity})
                    </span>
                    <span className="font-medium">×{complexityMultipliers[complexity as keyof typeof complexityMultipliers]}</span>
                  </div>
                  {escrowEnabled && (
                    <div className="flex justify-between">
                      <span className="text-[#334155] dark:text-[#E2E8F0]">Escrow fee (5%)</span>
                      <span className="font-medium">{escrowFee} credits</span>
                    </div>
                  )}
                </div>
              )}

              {mode === 'course' && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#334155] dark:text-[#E2E8F0]">Course enrollment</span>
                    <span className="font-medium">{course?.credits} credits</span>
                  </div>
                  {giftCourse && (
                    <div className="flex justify-between">
                      <span className="text-[#334155] dark:text-[#E2E8F0]">Gift processing</span>
                      <span className="font-medium">Free</span>
                    </div>
                  )}
                </div>
              )}

              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#0F172A] dark:text-[#F1F5F9]">Total</span>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-[#06B6D4]" />
                  <span className="text-xl font-bold text-[#0056D2]">{totalCredits} credits</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-4">
              <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">Payment Method</h4>
              
              <div className="space-y-3">
                <div className={cn(
                  "flex items-center justify-between p-3 border rounded-xl transition-all",
                  paymentMethod === 'credits' 
                    ? "border-[#0056D2] bg-[#0056D2]/5" 
                    : "border-[#06B6D4]/20 hover:border-[#06B6D4]/40"
                )}>
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-[#06B6D4]" />
                    <div>
                      <div className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">SkillSwap Credits</div>
                      <div className="text-sm text-[#334155] dark:text-[#E2E8F0]">
                        Balance: {userBalance} credits
                        {!canAfford && (
                          <span className="text-red-500 ml-2">
                            (Insufficient balance)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Checkbox 
                    checked={paymentMethod === 'credits'}
                    onCheckedChange={() => setPaymentMethod('credits')}
                  />
                </div>

                {!canAfford && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Credits
                  </Button>
                )}

                {/* Future crypto payment option */}
                <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-xl opacity-50">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Crypto Payment</div>
                      <div className="text-sm text-slate-500">Coming soon</div>
                    </div>
                  </div>
                  <Checkbox disabled />
                </div>
              </div>

              {/* Promo Code */}
              <div className="space-y-2">
                <Label htmlFor="promo-code" className="text-sm">Promo Code (optional)</Label>
                <Input
                  id="promo-code"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="border-[#06B6D4]/20 focus:border-[#0056D2] focus:ring-[#0056D2]"
                />
              </div>
            </div>

            {/* Escrow Toggle (Mentor mode only) */}
            {mode === 'mentor' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="escrow">Escrow Protection</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-[#06B6D4]" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Credits are held until both confirm completion</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Switch
                  id="escrow"
                  checked={escrowEnabled}
                  onCheckedChange={setEscrowEnabled}
                />
              </div>
            )}

            {/* Terms Agreement */}
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={setAgreeToTerms}
                className="mt-0.5"
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I agree to the{' '}
                <a href="/terms" className="text-[#0056D2] hover:underline">
                  session terms
                </a>{' '}
                and{' '}
                <a href="/terms" className="text-[#0056D2] hover:underline">
                  Terms of Service
                </a>
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#0056D2] hover:bg-[#004BB8] text-white font-semibold"
                onClick={handleConfirmBooking}
                disabled={!agreeToTerms || !canAfford || (mode === 'mentor' && !selectedDateTime)}
              >
                {mode === 'mentor' ? 'Confirm Booking' : 'Enroll Now'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
