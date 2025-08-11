import React, { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OfflineTradeModal from './OfflineTradeModal';

interface OfflineTradeButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  prefilledCounterparty?: string;
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

const OfflineTradeButton: React.FC<OfflineTradeButtonProps> = ({
  variant = 'default',
  size = 'default',
  prefilledCounterparty,
  className = '',
  children,
  showIcon = true
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonContent = children || (
    <>
      {showIcon && <Users className="h-4 w-4 mr-2" />}
      Log Offline Trade
    </>
  );

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsModalOpen(true)}
        className={`${className} ${variant === 'default' ? 'bg-[#0056D2] hover:bg-[#004BB8] text-white' : ''}`}
      >
        {buttonContent}
      </Button>

      <OfflineTradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prefilledCounterparty={prefilledCounterparty}
      />
    </>
  );
};

export default OfflineTradeButton;
