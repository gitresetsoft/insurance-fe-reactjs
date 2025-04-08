
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  role: UserRole;
  avatar?: string;
}

export interface Insurance {
  id: string;
  type: 'home' | 'auto' | 'life' | 'health';
  premium: number;
  coverage: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'pending';
}

export interface Claim {
  id: string;
  insuranceId: string;
  date: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  documents?: string[];
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  insurances: Insurance[];
  claims: Claim[];
  login: (user: User) => void;
  logout: () => void;
  addInsurance: (insurance: Insurance) => void;
  updateInsurance: (id: string, insurance: Partial<Insurance>) => void;
  removeInsurance: (id: string) => void;
  addClaim: (claim: Claim) => void;
  updateClaim: (id: string, claim: Partial<Claim>) => void;
  removeClaim: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      insurances: [],
      claims: [],
      
      login: (user) => set({ user, isAuthenticated: true }),
      
      logout: () => set({ user: null, isAuthenticated: false }),
      
      addInsurance: (insurance) => 
        set((state) => ({ 
          insurances: [...state.insurances, insurance] 
        })),
      
      updateInsurance: (id, insurance) =>
        set((state) => ({
          insurances: state.insurances.map((ins) =>
            ins.id === id ? { ...ins, ...insurance } : ins
          ),
        })),
      
      removeInsurance: (id) =>
        set((state) => ({
          insurances: state.insurances.filter((ins) => ins.id !== id),
        })),
      
      addClaim: (claim) =>
        set((state) => ({ 
          claims: [...state.claims, claim] 
        })),
      
      updateClaim: (id, claim) =>
        set((state) => ({
          claims: state.claims.map((c) =>
            c.id === id ? { ...c, ...claim } : c
          ),
        })),
      
      removeClaim: (id) =>
        set((state) => ({
          claims: state.claims.filter((c) => c.id !== id),
        })),
    }),
    {
      name: 'insurance-app-storage',
    }
  )
);
