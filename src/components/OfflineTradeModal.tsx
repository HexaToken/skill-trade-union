import React, { useState, useCallback, useMemo } from 'react';
import { X, Search, Clock, MapPin, Upload, DollarSign, QrCode, Hash, Shield, CheckCircle, Camera, Users, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  TradeDetailsForm, 
  TradeVerificationForm, 
  ComplexityLevel, 
  VerificationMethod,
  calculateTotalCredits,
  BASE_CREDITS_PER_HOUR,
  COMPLEXITY_MULTIPLIERS,
  isHighValueTrade
} from '@/models/offline-trade-types';
import { mockTradeUsers, mockSkills, getUserById, generatePin, generateQRToken } from '@/mock/offline-trade-data';
import { Step2Verification, Step3Review } from './OfflineTradeModalSteps';

interface OfflineTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledCounterparty?: string;
  currentUserId?: string;
}

type WizardStep = 1 | 2 | 3;

const OfflineTradeModal: React.FC<OfflineTradeModalProps> = ({
  isOpen,
  onClose,
  prefilledCounterparty,
  currentUserId = 'u_1' // Mock current user
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [detailsForm, setDetailsForm] = useState<TradeDetailsForm>({
    counterpartyId: prefilledCounterparty || '',
    skill: '',
    skillTags: [],
    role: 'taught',
    startedAt: new Date().toISOString().slice(0, 16),
    durationMins: 60,
    location: '',
    isInPerson: true,
    creditsProposed: 0,
    complexity: 'standard',
    notes: '',
    attachments: []
  });

  const [verificationForm, setVerificationForm] = useState<TradeVerificationForm>({
    method: 'qr',
    escrowEnabled: true,
    agreeToTerms: false
  });

  // User search state
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [showUserResults, setShowUserResults] = useState(false);
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [showSkillResults, setShowSkillResults] = useState(false);

  // Computed values
  const selectedCounterparty = useMemo(() => {
    return detailsForm.counterpartyId ? getUserById(detailsForm.counterpartyId) : null;
  }, [detailsForm.counterpartyId]);

  const calculatedCredits = useMemo(() => {
    return calculateTotalCredits(
      BASE_CREDITS_PER_HOUR,
      detailsForm.durationMins,
      detailsForm.complexity,
      1.1 // Mock demand multiplier
    );
  }, [detailsForm.durationMins, detailsForm.complexity]);

  const isHighValue = useMemo(() => {
    return isHighValueTrade(calculatedCredits);
  }, [calculatedCredits]);

  // Filter functions
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery) return [];
    return mockTradeUsers
      .filter(user => user.id !== currentUserId)
      .filter(user => 
        user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
      );
  }, [userSearchQuery, currentUserId]);

  const filteredSkills = useMemo(() => {
    if (!skillSearchQuery) return [];
    return mockSkills.filter(skill =>
      skill.toLowerCase().includes(skillSearchQuery.toLowerCase())
    );
  }, [skillSearchQuery]);

  // Event handlers
  const handleDetailsChange = useCallback((field: keyof TradeDetailsForm, value: any) => {
    setDetailsForm(prev => ({ ...prev, [field]: value }));
    
    // Auto-calculate credits when duration or complexity changes
    if (field === 'durationMins' || field === 'complexity') {
      const newCredits = calculateTotalCredits(
        BASE_CREDITS_PER_HOUR,
        field === 'durationMins' ? value : prev.durationMins,
        field === 'complexity' ? value : prev.complexity,
        1.1
      );
      setDetailsForm(p => ({ ...p, creditsProposed: newCredits }));
    }
  }, []);

  const handleSkillTagAdd = useCallback((skill: string) => {
    if (!detailsForm.skillTags.includes(skill)) {
      setDetailsForm(prev => ({
        ...prev,
        skillTags: [...prev.skillTags, skill]
      }));
    }
    setSkillSearchQuery('');
    setShowSkillResults(false);
  }, [detailsForm.skillTags]);

  const handleSkillTagRemove = useCallback((skill: string) => {
    setDetailsForm(prev => ({
      ...prev,
      skillTags: prev.skillTags.filter(tag => tag !== skill)
    }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep(prev => (prev + 1) as WizardStep);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => (prev - 1) as WizardStep);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async () => {
    if (!verificationForm.agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Mock submission delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const pin = verificationForm.method === 'pin' ? generatePin() : undefined;
      const qrToken = verificationForm.method === 'qr' ? generateQRToken() : undefined;
      
      // Mock success
      toast({
        title: "Trade Created Successfully",
        description: `Waiting for ${selectedCounterparty?.name} to confirm. ${
          verificationForm.method === 'pin' ? `PIN: ${pin}` : 'QR code generated.'
        }`,
      });
      
      onClose();
      
    } catch (error) {
      toast({
        title: "Error Creating Trade",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [verificationForm, selectedCounterparty, toast, onClose]);

  const resetForm = useCallback(() => {
    setCurrentStep(1);
    setDetailsForm({
      counterpartyId: prefilledCounterparty || '',
      skill: '',
      skillTags: [],
      role: 'taught',
      startedAt: new Date().toISOString().slice(0, 16),
      durationMins: 60,
      location: '',
      isInPerson: true,
      creditsProposed: 0,
      complexity: 'standard',
      notes: '',
      attachments: []
    });
    setVerificationForm({
      method: 'qr',
      escrowEnabled: true,
      agreeToTerms: false
    });
  }, [prefilledCounterparty]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  // Validation
  const isStep1Valid = useMemo(() => {
    return !!(
      detailsForm.counterpartyId &&
      detailsForm.skill &&
      detailsForm.location &&
      detailsForm.durationMins > 0
    );
  }, [detailsForm]);

  const isStep2Valid = useMemo(() => {
    return true; // Step 2 is always valid as it has defaults
  }, []);

  const isStep3Valid = useMemo(() => {
    return verificationForm.agreeToTerms;
  }, [verificationForm.agreeToTerms]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#0F172A] dark:text-[#F1F5F9]">
            <Users className="h-5 w-5 text-[#0056D2]" />
            Log Offline Trade
          </DialogTitle>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mt-4">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step 
                    ? 'bg-[#0056D2] text-white' 
                    : 'bg-[#E2E8F0] text-[#64748B]'
                  }
                `}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`
                    w-12 h-0.5 mx-2
                    ${currentStep > step ? 'bg-[#0056D2]' : 'bg-[#E2E8F0]'}
                  `} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h3 className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">
              {currentStep === 1 && 'Trade Details'}
              {currentStep === 2 && 'Verification Method'}
              {currentStep === 3 && 'Review & Submit'}
            </h3>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Step 1: Trade Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Counterparty Selection */}
              <div className="space-y-2">
                <Label htmlFor="counterparty" className="text-[#0F172A] dark:text-[#F1F5F9] font-medium">
                  Who did you trade with? *
                </Label>
                {selectedCounterparty ? (
                  <Card className="border-[#0056D2]/20">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedCounterparty.avatar} alt={selectedCounterparty.name} />
                          <AvatarFallback className="bg-[#0056D2]/10 text-[#0056D2] font-bold">
                            {selectedCounterparty.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                            {selectedCounterparty.name}
                          </div>
                          <div className="text-sm text-[#64748B] dark:text-[#94A3B8] flex items-center gap-2">
                            {selectedCounterparty.email}
                            {selectedCounterparty.verifiedId && (
                              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDetailsChange('counterpartyId', '')}
                          className="text-[#64748B] hover:text-[#0056D2]"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="relative">
                    <Input
                      placeholder="Search by name or email"
                      value={userSearchQuery}
                      onChange={(e) => {
                        setUserSearchQuery(e.target.value);
                        setShowUserResults(true);
                      }}
                      onFocus={() => setShowUserResults(true)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-3 h-4 w-4 text-[#64748B]" />
                    
                    {showUserResults && filteredUsers.length > 0 && (
                      <Card className="absolute top-12 left-0 right-0 z-50 max-h-48 overflow-y-auto">
                        <CardContent className="p-2">
                          {filteredUsers.map(user => (
                            <div
                              key={user.id}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#0056D2]/5 cursor-pointer"
                              onClick={() => {
                                handleDetailsChange('counterpartyId', user.id);
                                setUserSearchQuery('');
                                setShowUserResults(false);
                              }}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="bg-[#0056D2]/10 text-[#0056D2] text-xs">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm text-[#0F172A] dark:text-[#F1F5F9]">
                                  {user.name}
                                </div>
                                <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>

              {/* Skill and Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="skill" className="text-[#0F172A] dark:text-[#F1F5F9] font-medium">
                    What skill was traded? *
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="e.g., React Development, Guitar, Spanish"
                      value={skillSearchQuery}
                      onChange={(e) => {
                        setSkillSearchQuery(e.target.value);
                        setShowSkillResults(true);
                        handleDetailsChange('skill', e.target.value);
                      }}
                      onFocus={() => setShowSkillResults(true)}
                    />
                    
                    {showSkillResults && filteredSkills.length > 0 && (
                      <Card className="absolute top-12 left-0 right-0 z-50 max-h-32 overflow-y-auto">
                        <CardContent className="p-2">
                          {filteredSkills.slice(0, 5).map(skill => (
                            <div
                              key={skill}
                              className="p-2 rounded hover:bg-[#0056D2]/5 cursor-pointer text-sm"
                              onClick={() => {
                                handleDetailsChange('skill', skill);
                                handleSkillTagAdd(skill);
                                setSkillSearchQuery('');
                                setShowSkillResults(false);
                              }}
                            >
                              {skill}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-[#0F172A] dark:text-[#F1F5F9] font-medium">
                    Your role *
                  </Label>
                  <Select value={detailsForm.role} onValueChange={(value) => handleDetailsChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="taught">I taught</SelectItem>
                      <SelectItem value="learned">I learned</SelectItem>
                      <SelectItem value="both">Both (exchange)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags */}
              {detailsForm.skillTags.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-[#0F172A] dark:text-[#F1F5F9] font-medium">Skills Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {detailsForm.skillTags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="bg-[#0056D2]/10 text-[#0056D2] border-[#0056D2]/20"
                      >
                        {tag}
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => handleSkillTagRemove(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Date, Duration, Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startedAt" className="text-[#0F172A] dark:text-[#F1F5F9] font-medium">
                    Date & Time *
                  </Label>
                  <div className="relative">
                    <Input
                      type="datetime-local"
                      value={detailsForm.startedAt}
                      onChange={(e) => handleDetailsChange('startedAt', e.target.value)}
                      className="pl-10"
                    />
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-[#64748B]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-[#0F172A] dark:text-[#F1F5F9] font-medium">
                    Duration (minutes) *
                  </Label>
                  <Input
                    type="number"
                    value={detailsForm.durationMins}
                    onChange={(e) => handleDetailsChange('durationMins', parseInt(e.target.value) || 0)}
                    min="15"
                    max="480"
                    step="15"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complexity" className="text-[#0F172A] dark:text-[#F1F5F9] font-medium">
                    Complexity *
                  </Label>
                  <Select value={detailsForm.complexity} onValueChange={(value) => handleDetailsChange('complexity', value as ComplexityLevel)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple (1.0x)</SelectItem>
                      <SelectItem value="standard">Standard (1.3x)</SelectItem>
                      <SelectItem value="advanced">Advanced (1.6x)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-[#0F172A] dark:text-[#F1F5F9] font-medium">
                  Location *
                </Label>
                <div className="relative">
                  <Input
                    placeholder="e.g., Brooklyn Coffee Shop, Central Park"
                    value={detailsForm.location}
                    onChange={(e) => handleDetailsChange('location', e.target.value)}
                    className="pl-10"
                  />
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#64748B]" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={detailsForm.isInPerson}
                    onCheckedChange={(checked) => handleDetailsChange('isInPerson', checked)}
                  />
                  <Label className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                    In-person meeting
                  </Label>
                </div>
              </div>

              {/* Credits Calculation */}
              <Card className="border-[#0056D2]/20 bg-[#0056D2]/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-[#0056D2]">
                    <DollarSign className="h-5 w-5" />
                    Credit Calculation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                    <strong>Formula:</strong> {BASE_CREDITS_PER_HOUR} credits/hr × {detailsForm.durationMins/60}h × {COMPLEXITY_MULTIPLIERS[detailsForm.complexity]}x complexity × 1.1x demand
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[#0F172A] dark:text-[#F1F5F9] font-medium">Calculated Credits:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-[#0056D2]">{calculatedCredits}</span>
                      {isHighValue && (
                        <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                          High Value
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Input
                    type="number"
                    value={detailsForm.creditsProposed}
                    onChange={(e) => handleDetailsChange('creditsProposed', parseInt(e.target.value) || 0)}
                    min="1"
                    max="500"
                    className="text-center font-bold text-lg"
                  />
                  
                  {isHighValue && (
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        High value trades (≥100 credits) require additional verification and may need admin approval.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-[#0F172A] dark:text-[#F1F5F9] font-medium">
                  Notes (optional)
                </Label>
                <Textarea
                  placeholder="Describe what was taught/learned, how it went, etc."
                  value={detailsForm.notes}
                  onChange={(e) => handleDetailsChange('notes', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {/* Attachments */}
              <div className="space-y-2">
                <Label className="text-[#0F172A] dark:text-[#F1F5F9] font-medium">
                  Proof Photos (optional)
                </Label>
                <div className="border-2 border-dashed border-[#0056D2]/30 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-[#0056D2] mx-auto mb-2" />
                  <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                    Upload photos as proof of your trade session
                  </div>
                  <Button variant="outline" className="mt-2" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Add Photos
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Verification Method */}
          {currentStep === 2 && (
            <Step2Verification
              verificationForm={verificationForm}
              onVerificationChange={(field, value) =>
                setVerificationForm(prev => ({ ...prev, [field]: value }))
              }
              detailsForm={detailsForm}
              isHighValue={isHighValue}
              pin={generatePin()}
              qrToken={generateQRToken()}
            />
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && selectedCounterparty && (
            <Step3Review
              detailsForm={detailsForm}
              verificationForm={verificationForm}
              onVerificationChange={(field, value) =>
                setVerificationForm(prev => ({ ...prev, [field]: value }))
              }
              initiator={getUserById(currentUserId)!}
              counterparty={selectedCounterparty}
              calculatedCredits={calculatedCredits}
              isHighValue={isHighValue}
            />
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? handleClose : handleBack}
              className="text-[#64748B] border-[#64748B]/30"
            >
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Button>
            
            <Button
              onClick={currentStep === 3 ? handleSubmit : handleNext}
              disabled={
                (currentStep === 1 && !isStep1Valid) ||
                (currentStep === 2 && !isStep2Valid) ||
                (currentStep === 3 && !isStep3Valid) ||
                isSubmitting
              }
              className="bg-[#0056D2] hover:bg-[#004BB8] text-white"
            >
              {isSubmitting ? 'Creating...' : currentStep === 3 ? 'Submit Trade' : 'Continue'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfflineTradeModal;
