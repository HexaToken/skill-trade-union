import { useState } from 'react';
import { creditService, type PricingBreakdownRequest } from '@/services/credit-api';
import { useWallet } from '@/components/providers/WalletProvider';
import { useToast } from '@/hooks/use-toast';

// Hook for pricing calculations
export function usePricingCalculator() {
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePricing = async (request: PricingBreakdownRequest) => {
    setIsCalculating(true);
    setError(null);
    
    try {
      const breakdown = await creditService.getPricingBreakdown(request);
      return breakdown;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate pricing';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsCalculating(false);
    }
  };

  return {
    calculatePricing,
    isCalculating,
    error,
    clearError: () => setError(null),
  };
}

// Hook for session booking with credit hold
export function useSessionBooking() {
  const [isBooking, setIsBooking] = useState(false);
  const { spendCredits, hasSufficientBalance } = useWallet();
  const { toast } = useToast();

  const bookSession = async (sessionId: string, amount: number, metadata: Record<string, any> = {}) => {
    if (!hasSufficientBalance(amount)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough credits for this session.",
        variant: "destructive",
      });
      return false;
    }

    setIsBooking(true);
    
    try {
      // Use escrow hold for sessions
      await creditService.spendCredits({
        reason: 'session_hold',
        amount,
        refId: sessionId,
        metadata: {
          title: `Session booking: ${metadata.title || 'Untitled'}`,
          ...metadata,
        },
        hold: true, // This creates a hold instead of immediate spend
      });

      toast({
        title: "Session Booked",
        description: "Credits have been held in escrow until session completion.",
      });

      return true;
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : 'Failed to book session',
        variant: "destructive",
      });
      return false;
    } finally {
      setIsBooking(false);
    }
  };

  const completeSession = async (holdId: string) => {
    try {
      await creditService.releaseHold({
        holdId,
        reason: 'session_completed',
      });

      toast({
        title: "Session Completed",
        description: "Credits have been released from escrow.",
      });

      return true;
    } catch (error) {
      toast({
        title: "Failed to Complete",
        description: error instanceof Error ? error.message : 'Failed to complete session',
        variant: "destructive",
      });
      return false;
    }
  };

  const cancelSession = async (holdId: string) => {
    try {
      await creditService.cancelHold({
        holdId,
        reason: 'session_canceled',
      });

      toast({
        title: "Session Canceled",
        description: "Credits have been returned to your wallet.",
      });

      return true;
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: error instanceof Error ? error.message : 'Failed to cancel session',
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    bookSession,
    completeSession,
    cancelSession,
    isBooking,
  };
}

// Hook for course enrollment
export function useCourseEnrollment() {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { spendCredits, hasSufficientBalance } = useWallet();
  const { toast } = useToast();

  const enrollInCourse = async (courseId: string, amount: number, courseName: string) => {
    if (!hasSufficientBalance(amount)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough credits for this course.",
        variant: "destructive",
      });
      return false;
    }

    setIsEnrolling(true);
    
    try {
      await spendCredits(amount, `Enrolled: ${courseName}`, {
        courseId,
        type: 'course_enrollment',
      });

      toast({
        title: "Enrollment Successful",
        description: `You've successfully enrolled in ${courseName}`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Enrollment Failed",
        description: error instanceof Error ? error.message : 'Failed to enroll in course',
        variant: "destructive",
      });
      return false;
    } finally {
      setIsEnrolling(false);
    }
  };

  return {
    enrollInCourse,
    isEnrolling,
  };
}

// Hook for earning credits from teaching
export function useTeachingEarnings() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { earnCredits } = useWallet();
  const { toast } = useToast();

  const recordTeachingSession = async (
    sessionId: string, 
    amount: number, 
    sessionTitle: string,
    metadata: Record<string, any> = {}
  ) => {
    setIsProcessing(true);
    
    try {
      await earnCredits(amount, `Taught: ${sessionTitle}`, {
        sessionId,
        type: 'teaching_session',
        ...metadata,
      });

      toast({
        title: "Credits Earned",
        description: `You earned ${amount} credits for teaching!`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Failed to Record",
        description: error instanceof Error ? error.message : 'Failed to record teaching session',
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const recordSprintParticipation = async (amount: number, sprintName: string) => {
    setIsProcessing(true);
    
    try {
      await earnCredits(amount, `Skill Sprint: ${sprintName}`, {
        type: 'sprint_participation',
        sprintName,
      });

      toast({
        title: "Sprint Rewards",
        description: `You earned ${amount} credits from the sprint!`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Failed to Record",
        description: error instanceof Error ? error.message : 'Failed to record sprint participation',
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    recordTeachingSession,
    recordSprintParticipation,
    isProcessing,
  };
}

// Hook for donations
export function useDonations() {
  const [isDonating, setIsDonating] = useState(false);
  const { hasSufficientBalance } = useWallet();
  const { toast } = useToast();

  const donateCredits = async (
    amount: number, 
    recipient: { type: 'platform' | 'mentor' | 'cause'; id?: string },
    note?: string
  ) => {
    if (!hasSufficientBalance(amount)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough credits to make this donation.",
        variant: "destructive",
      });
      return false;
    }

    setIsDonating(true);
    
    try {
      await creditService.donateCredits({
        to: recipient,
        amount,
        note,
      });

      toast({
        title: "Donation Successful",
        description: `Thank you for donating ${amount} credits!`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Donation Failed",
        description: error instanceof Error ? error.message : 'Failed to process donation',
        variant: "destructive",
      });
      return false;
    } finally {
      setIsDonating(false);
    }
  };

  return {
    donateCredits,
    isDonating,
  };
}
