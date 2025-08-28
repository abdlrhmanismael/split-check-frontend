export interface Session {
  sessionId: string;
  sessionLink?: string;
  totalOrderAmount: number;
  taxPercentage?: number;
  servicePercentage?: number;
  deliveryFee?: number;
  numberOfFriends?: number;
  instaPayURL?: string;
  billImage?: string;
  friends?: Friend[];
  createdAt: string;
  updatedAt?: string;
}

export interface SessionResponse {
  session: Session;
}

export interface CreateSessionResponse {
  message: string;
  session: Session;
}

export interface Product {
  id: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface Friend {
  id: string;
  name: string;
  products: Product[];
  paymentMethod: boolean | string; // boolean for join request, string for summary response
  subtotal: number;
  taxAmount: number;
  serviceAmount: number;
  deliveryShare: number;
  totalAmount: number;
  hasPaid: boolean;
  createdAt?: string;
  joinedAt?: string;
}

export interface JoinSessionResponse {
  message: string;
  friend: Friend;
}

export interface SessionSummary {
  sessionId: string;
  totalOrderAmount: number;
  totalPaidInstaPay: number;
  totalPaidCash: number;
  totalUnpaid: number;
  friendsCount: number;
  expectedFriendsCount: number;
  billImage?: string;
  friends: Friend[];
}

export interface SessionSummaryResponse {
  summary: SessionSummary;
}

export interface CreateSessionRequest {
  totalAmount: number; // We keep this for frontend, but send as totalOrderAmount to API
  taxPercentage?: number;
  servicePercentage?: number;
  deliveryFee?: number;
  numberOfFriends?: number;
  instaPayUrl?: string; // We keep this for frontend, but send as instaPayURL to API
  billImage?: File;
}

export interface JoinSessionRequest {
  name: string;
  products: Omit<Product, "id">[];
  paymentMethod: boolean; // true for InstaPay, false for Cash
}

export interface UpdatePaymentRequest {
  hasPaid: boolean;
}
