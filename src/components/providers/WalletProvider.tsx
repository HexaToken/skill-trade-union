import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useWalletStore } from '@/stores/wallet-store';
import { creditService } from '@/services/credit-api';
import { walletHelpers } from '@/stores/wallet-store';

interface WalletContextType {
  // Exposed for easy access without needing to import the store
  balance: number;
  isLoading: boolean;
  error: string | null;
  // Helper functions
  refreshWallet: () => Promise<void>;
  spendCredits: (amount: number, title: string, metadata?: Record<string, any>) => Promise<void>;
  earnCredits: (amount: number, title: string, metadata?: Record<string, any>) => Promise<void>;
  hasSufficientBalance: (amount: number) => boolean;
  isLowBalance: () => boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

interface WalletProviderProps {
  children: ReactNode;
  autoFetch?: boolean;
}

export function WalletProvider({ children, autoFetch = true }: WalletProviderProps) {
  const {
    balance,
    isLoading,
    error,
    fetchWallet,
    refreshBalance,
    clearError,
  } = useWalletStore();

  // Initialize wallet data on mount
  useEffect(() => {
    if (autoFetch) {
      fetchWallet();
    }
  }, [fetchWallet, autoFetch]);

  // Enhanced spend function with API integration
  const spendCredits = async (amount: number, title: string, metadata: Record<string, any> = {}) => {
    try {
      // Check sufficient balance first
      if (!walletHelpers.hasSufficientBalance(amount)) {
        throw new Error('Insufficient balance');
      }

      // Optimistic update
      walletHelpers.optimisticSpend(amount, title, metadata);

      // Make API call (in real implementation)
      await creditService.spendCredits({
        reason: 'course_enroll', // This would be dynamic based on the use case
        amount,
        refId: 'ref_' + Date.now(),
        metadata: { title, ...metadata },
        hold: false,
      });

      // Refresh to get actual server state
      await refreshBalance();
    } catch (error) {
      // Refresh to revert optimistic update on error
      await refreshBalance();
      throw error;
    }
  };

  // Enhanced earn function with API integration
  const earnCredits = async (amount: number, title: string, metadata: Record<string, any> = {}) => {
    try {
      // Optimistic update
      walletHelpers.optimisticEarn(amount, title, metadata);

      // Make API call (in real implementation)
      await creditService.earnCredits({
        reason: 'teach_session', // This would be dynamic based on the use case
        amount,
        refId: 'ref_' + Date.now(),
        metadata: { title, ...metadata },
      });

      // Refresh to get actual server state
      await refreshBalance();
    } catch (error) {
      // Refresh to revert optimistic update on error
      await refreshBalance();
      throw error;
    }
  };

  const contextValue: WalletContextType = {
    balance,
    isLoading,
    error,
    refreshWallet: fetchWallet,
    spendCredits,
    earnCredits,
    hasSufficientBalance: walletHelpers.hasSufficientBalance,
    isLowBalance: walletHelpers.isLowBalance,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
      
      {/* Global error handling for wallet errors */}
      {error && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-destructive text-destructive-foreground p-3 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm">{error}</span>
              <button
                onClick={clearError}
                className="ml-2 text-xs opacity-70 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </WalletContext.Provider>
  );
}

// Hook to use wallet context
export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Higher-order component for components that need wallet data
export function withWallet<P extends object>(Component: React.ComponentType<P>) {
  return function WalletWrappedComponent(props: P) {
    return (
      <WalletProvider>
        <Component {...props} />
      </WalletProvider>
    );
  };
}

export default WalletProvider;
