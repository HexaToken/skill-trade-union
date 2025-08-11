import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  endAt: string; // ISO date string
  size?: 'sm' | 'md' | 'lg';
  variant?: 'pill' | 'inline';
  className?: string;
  onComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endAt,
  size = 'md',
  variant = 'inline',
  className,
  onComplete
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const endTime = new Date(endAt).getTime();
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        onComplete?.();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, total: difference });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endAt, onComplete]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const getTimerColor = () => {
    const hoursLeft = timeLeft.total / (1000 * 60 * 60);
    if (hoursLeft <= 2) return 'text-red-600 dark:text-red-400';
    if (hoursLeft <= 24) return 'text-amber-600 dark:text-amber-400';
    return 'text-[#0056D2] dark:text-[#06B6D4]';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-xl font-bold';
      default:
        return 'text-base font-semibold';
    }
  };

  const getVariantClasses = () => {
    if (variant === 'pill') {
      return cn(
        'px-3 py-1.5 rounded-full',
        'bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-sm',
        'border border-[#0056D2]/20 dark:border-[#06B6D4]/20',
        'shadow-sm'
      );
    }
    return '';
  };

  if (timeLeft.total <= 0) {
    return (
      <div className={cn('font-semibold text-gray-500 dark:text-gray-400', getSizeClasses(), className)}>
        Sprint Ended
      </div>
    );
  }

  return (
    <div className={cn(
      'font-mono transition-colors duration-300',
      getSizeClasses(),
      getTimerColor(),
      getVariantClasses(),
      className
    )}>
      {timeLeft.days > 0 && (
        <span>
          {formatNumber(timeLeft.days)}
          <span className="text-xs font-sans ml-0.5 mr-1 opacity-75">d</span>
        </span>
      )}
      <span>
        {formatNumber(timeLeft.hours)}
        <span className="text-xs font-sans ml-0.5 mr-1 opacity-75">h</span>
      </span>
      <span>
        {formatNumber(timeLeft.minutes)}
        <span className="text-xs font-sans ml-0.5 mr-1 opacity-75">m</span>
      </span>
      <span>
        {formatNumber(timeLeft.seconds)}
        <span className="text-xs font-sans ml-0.5 opacity-75">s</span>
      </span>
    </div>
  );
};

export default CountdownTimer;
