// Wallet State Management Store
// Manages credit wallet state with optimistic updates and error handling

import { create } from 'zustand';
import { creditService, type WalletResponse, type Transaction } from '@/services/credit-api';

interface WalletState {
  // State
  balance: number;
  holds: WalletResponse['holds'];
  recentTransactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchWallet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  updateBalanceOptimistic: (change: number) => void;
  addTransactionOptimistic: (transaction: Omit<Transaction, 'id' | 'balanceAfter'>) => void;
  clearError: () => void;
  reset: () => void;
}

// Initial state
const initialState = {
  balance: 0,
  holds: [],
  recentTransactions: [],
  isLoading: false,
  error: null,
};

export const useWalletStore = create<WalletState>((set, get) => ({
  ...initialState,

  fetchWallet: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const walletData = await creditService.getWallet();
      set({
        balance: walletData.balance,
        holds: walletData.holds,
        recentTransactions: walletData.recent,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch wallet data',
      });
    }
  },

  refreshBalance: async () => {
    try {
      const walletData = await creditService.getWallet();
      set({ 
        balance: walletData.balance,
        holds: walletData.holds,
        error: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to refresh balance',
      });
    }
  },

  updateBalanceOptimistic: (change: number) => {
    const currentBalance = get().balance;
    set({ balance: currentBalance + change });
  },

  addTransactionOptimistic: (transaction) => {
    const state = get();
    const newTransaction: Transaction = {
      ...transaction,
      id: `temp_${Date.now()}`,
      balanceAfter: state.balance,
    };
    
    set({
      recentTransactions: [newTransaction, ...state.recentTransactions].slice(0, 10), // Keep latest 10
    });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
}));

// Utility hooks for common wallet operations
export const useWalletBalance = () => {
  const { balance, isLoading } = useWalletStore();
  return { balance, isLoading };
};

export const useWalletTransactions = () => {
  const { recentTransactions, fetchWallet } = useWalletStore();
  return { transactions: recentTransactions, refreshTransactions: fetchWallet };
};

// Helper functions for optimistic updates
export const walletHelpers = {
  // Optimistically update balance and add transaction
  async optimisticSpend(amount: number, title: string, metadata: Record<string, any> = {}) {
    const store = useWalletStore.getState();
    
    // Optimistic update
    store.updateBalanceOptimistic(-amount);
    store.addTransactionOptimistic({
      type: 'spend',
      amount: -amount,
      title,
      meta: metadata,
      at: new Date().toISOString(),
    });
    
    // Refresh from server to ensure consistency
    setTimeout(() => {
      store.refreshBalance();
    }, 1000);
  },

  async optimisticEarn(amount: number, title: string, metadata: Record<string, any> = {}) {
    const store = useWalletStore.getState();
    
    // Optimistic update
    store.updateBalanceOptimistic(amount);
    store.addTransactionOptimistic({
      type: 'earn',
      amount,
      title,
      meta: metadata,
      at: new Date().toISOString(),
    });
    
    // Refresh from server to ensure consistency
    setTimeout(() => {
      store.refreshBalance();
    }, 1000);
  },

  // Check if user has sufficient balance
  hasSufficientBalance(requiredAmount: number): boolean {
    const { balance } = useWalletStore.getState();
    return balance >= requiredAmount;
  },

  // Get low balance threshold (configurable)
  isLowBalance(threshold = 20): boolean {
    const { balance } = useWalletStore.getState();
    return balance < threshold;
  },
};

export default useWalletStore;
