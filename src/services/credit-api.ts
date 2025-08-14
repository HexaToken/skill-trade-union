// Credit System API Service
// Implements the API contract for Credits + Pricing + Transactions

const API_BASE = '/api/v1';

// Types matching the API contract
export interface WalletResponse {
  userId: string;
  balance: number;
  holds: Hold[];
  recent: Transaction[];
}

export interface Hold {
  id: string;
  amount: number;
  reason: string;
  refId: string;
  releaseAt: string;
}

export interface Transaction {
  id: string;
  type: 'earn' | 'spend' | 'hold' | 'release' | 'adjust' | 'refund';
  amount: number;
  title: string;
  meta?: Record<string, any>;
  balanceAfter: number;
  at: string;
}

export interface TransactionsResponse {
  items: Transaction[];
  nextCursor?: string;
}

export interface PricingBreakdownRequest {
  kind: 'session' | 'course' | 'offline_trade';
  basePerHour: number;
  durationMins: number;
  complexity: number;
  demand: number;
  fees: Array<{ label: string; pct: number }>;
  sprintBonus: number;
  rounding: 'half_up' | 'banker\'s' | 'none';
}

export interface PricingBreakdownResponse {
  lines: Array<{
    label: string;
    value: number;
    calc: string;
  }>;
  total: number;
}

export interface SpendRequest {
  reason: 'course_enroll' | 'session_hold' | 'donation' | 'offline_trade_hold';
  amount: number;
  refId: string;
  metadata: Record<string, any>;
  hold: boolean;
}

export interface SpendResponse {
  transactionId: string;
  balance: number;
  status: 'success';
}

export interface HoldReleaseRequest {
  holdId: string;
  reason: string;
}

export interface HoldReleaseResponse {
  transactionId: string;
  balance: number;
  status: 'released' | 'canceled';
}

export interface EarnRequest {
  reason: 'teach_session' | 'sprint_participation' | 'referral' | 'skill_test' | 'offline_trade';
  amount: number;
  refId: string;
  metadata: Record<string, any>;
}

export interface EarnResponse {
  transactionId: string;
  balance: number;
  status: 'success';
}

export interface DonationRequest {
  to: { type: 'platform' | 'mentor' | 'cause'; id?: string };
  amount: number;
  note?: string;
}

export interface DonationResponse {
  donationId: string;
  transactionId: string;
  balance: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

// Generate UUID for idempotency keys
function generateIdempotencyKey(): string {
  return 'idem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Base API request function with auth and error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  idempotent = false
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`,
    ...options.headers,
  };

  // Add idempotency key for write operations
  if (idempotent && (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH')) {
    headers['Idempotency-Key'] = generateIdempotencyKey();
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      throw new Error(`Rate limited. Retry after ${retryAfter} seconds`);
    }
    
    const errorData: ApiError = await response.json();
    throw new Error(errorData.error.message || 'API request failed');
  }

  return response.json();
}

// Mock auth token getter - replace with actual auth implementation
function getAuthToken(): string {
  // TODO: Get from auth context/localStorage
  return 'mock_jwt_token';
}

// Credit API Service
export const creditApi = {
  // 1) Wallet operations
  async getWallet(): Promise<WalletResponse> {
    return apiRequest<WalletResponse>('/wallet');
  },

  async getTransactions(params: {
    type?: 'earn' | 'spend' | 'hold' | 'release' | 'adjust' | 'refund';
    from?: string;
    to?: string;
    cursor?: string;
    limit?: number;
  } = {}): Promise<TransactionsResponse> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    
    const queryString = searchParams.toString();
    return apiRequest<TransactionsResponse>(`/wallet/transactions${queryString ? `?${queryString}` : ''}`);
  },

  // 2) Pricing & Breakdown
  async getPricingBreakdown(request: PricingBreakdownRequest): Promise<PricingBreakdownResponse> {
    return apiRequest<PricingBreakdownResponse>('/pricing/breakdown', {
      method: 'POST',
      body: JSON.stringify(request),
    }, true);
  },

  // 3) Spend Credits
  async spendCredits(request: SpendRequest): Promise<SpendResponse> {
    return apiRequest<SpendResponse>('/spend', {
      method: 'POST',
      body: JSON.stringify(request),
    }, true);
  },

  async releaseHold(request: HoldReleaseRequest): Promise<HoldReleaseResponse> {
    return apiRequest<HoldReleaseResponse>('/holds/release', {
      method: 'POST',
      body: JSON.stringify(request),
    }, true);
  },

  async cancelHold(request: HoldReleaseRequest): Promise<HoldReleaseResponse> {
    return apiRequest<HoldReleaseResponse>('/holds/cancel', {
      method: 'POST',
      body: JSON.stringify(request),
    }, true);
  },

  // 4) Earn Credits
  async earnCredits(request: EarnRequest): Promise<EarnResponse> {
    return apiRequest<EarnResponse>('/earn', {
      method: 'POST',
      body: JSON.stringify(request),
    }, true);
  },

  // 5) Donations
  async donateCredits(request: DonationRequest): Promise<DonationResponse> {
    return apiRequest<DonationResponse>('/donations/credits', {
      method: 'POST',
      body: JSON.stringify(request),
    }, true);
  },
};

// Mock implementation for development (remove when backend is ready)
export const mockCreditApi = {
  async getWallet(): Promise<WalletResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      userId: 'u_123',
      balance: 245.0,
      holds: [
        {
          id: 'h_1',
          amount: 15,
          reason: 'session',
          refId: 'sess_901',
          releaseAt: '2025-08-16T18:00:00Z'
        }
      ],
      recent: [
        {
          id: 'tx_1',
          type: 'earn',
          amount: 10,
          title: 'Taught: Logo critique',
          meta: { skill: 'Design', partnerName: 'Sarah Wilson' },
          balanceAfter: 245,
          at: '2025-08-13T18:00:00Z'
        },
        {
          id: 'tx_2',
          type: 'spend',
          amount: -150,
          title: 'Enroll: Brand Strategy',
          meta: { courseId: 'c_88' },
          balanceAfter: 235,
          at: '2025-08-12T10:10:00Z'
        }
      ]
    };
  },

  async getTransactions(params: any = {}): Promise<TransactionsResponse> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      items: [
        {
          id: 'tx_3',
          type: 'hold',
          amount: -15,
          title: 'Escrow hold',
          meta: { sessId: 'sess_901' },
          balanceAfter: 230,
          at: '2025-08-12T10:05:00Z'
        }
      ],
      nextCursor: 'eyJvZmZzZXQiOjEwfQ=='
    };
  },

  async getPricingBreakdown(request: PricingBreakdownRequest): Promise<PricingBreakdownResponse> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const baseAmount = request.basePerHour * (request.durationMins / 60);
    const complexityAmount = baseAmount * (request.complexity - 1);
    const demandAmount = baseAmount * request.complexity * (request.demand - 1);
    
    let total = baseAmount * request.complexity * request.demand;
    const lines: PricingBreakdownResponse['lines'] = [
      {
        label: 'Base',
        value: baseAmount,
        calc: `${request.basePerHour} cr/hr × ${request.durationMins / 60} hr`
      }
    ];

    if (request.complexity !== 1) {
      lines.push({
        label: 'Complexity',
        value: complexityAmount,
        calc: `× ${request.complexity}`
      });
    }

    if (request.demand !== 1) {
      lines.push({
        label: 'Demand',
        value: demandAmount,
        calc: `× ${request.demand}`
      });
    }

    request.fees.forEach(fee => {
      const feeAmount = total * fee.pct;
      lines.push({
        label: fee.label,
        value: feeAmount,
        calc: `+${(fee.pct * 100).toFixed(1)}%`
      });
      total += feeAmount;
    });

    return {
      lines,
      total: Math.round(total * 100) / 100
    };
  },

  async spendCredits(request: SpendRequest): Promise<SpendResponse> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      transactionId: `tx_${Date.now()}`,
      balance: 95,
      status: 'success'
    };
  },

  async releaseHold(request: HoldReleaseRequest): Promise<HoldReleaseResponse> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      transactionId: `tx_${Date.now()}`,
      balance: 80,
      status: 'released'
    };
  },

  async cancelHold(request: HoldReleaseRequest): Promise<HoldReleaseResponse> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      transactionId: `tx_${Date.now()}`,
      balance: 95,
      status: 'canceled'
    };
  },

  async earnCredits(request: EarnRequest): Promise<EarnResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      transactionId: `tx_${Date.now()}`,
      balance: 255,
      status: 'success'
    };
  },

  async donateCredits(request: DonationRequest): Promise<DonationResponse> {
    await new Promise(resolve => setTimeout(resolve, 700));
    return {
      donationId: `dn_${Date.now()}`,
      transactionId: `tx_${Date.now()}`,
      balance: 235
    };
  }
};

// Use mock for development, switch to real API when ready
export const creditService = process.env.NODE_ENV === 'development' ? mockCreditApi : creditApi;

export default creditService;
