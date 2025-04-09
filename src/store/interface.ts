export type UserRole = 'user' | 'admin';

export interface LoginData {
  access_token: string;
  user: User;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  googleId?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  role: UserRole;
  avatar?: string;
}

export interface Policies {
  id: string;
  type: PolicyType;
  premium: number;
  coverageLimit: number;
  startDate: string;
  endDate: string;
  status: PolicyStatus;
  insuranceProduct: InsuranceProduct;
}

export enum PolicyType {
  CAR = 'CAR',
  HOME = 'HOME',
  HEALTH = 'HEALTH',
  LIFE = 'LIFE',
  TRAVEL = 'TRAVEL',
  BUSINESS = 'BUSINESS',
}

export enum PolicyStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
}

export interface InsuranceProduct {
  id: string;
  name: string;
  type: PolicyType;
  description: string;
  basePrice: number;
  coverageDetails: string;
  isActive?: boolean;
}

export interface Claim {
  id: string;
  insuranceId: string;
  date: string;
  description: string;
  amount: number;
  status: ClaimStatus;
  documents?: string[];
}

export enum ClaimStatus {
  SUBMITTED,
  UNDER_REVIEW,
  APPROVED,
  REJECTED,
  CLOSED
}