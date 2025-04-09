import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Claim, Policies, User } from './interface';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  policies: Policies[];
  claims: Claim[];
  login: (user: User) => void;
  logout: () => void;
  addInsurance: (insurance: Policies | Policies[]) => void;
  updateInsurance: (id: string, insurance: Partial<Policies>) => void;
  removeInsurance: (id: string) => void;
  addClaim: (claim: Claim | Claim[]) => void;
  updateClaim: (id: string, claim: Partial<Claim>) => void;
  removeClaim: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      policies: [],
      claims: [],
      
      login: (user) => set({ user, isAuthenticated: true }),
      
      logout: () => set({ user: null, isAuthenticated: false }),
      
      addInsurance: (insurance) => 
        set((state) => {
          const newPolicies = Array.isArray(insurance) ? insurance : [insurance];
          
          const updatedPolicies = [
            ...state.policies,
            ...newPolicies.filter(
              (newPolicy) => !state.policies.some(existingPolicy => existingPolicy.id === newPolicy.id)
            )
          ];
      
          return { policies: updatedPolicies };
        }),
      
      updateInsurance: (id, insurance) =>
        set((state) => ({
          policies: state.policies.map((policy) =>
            policy.id === id ? { ...policy, ...insurance } : policy
          ),
        })),
      
      removeInsurance: (id) =>
        set((state) => ({
          policies: state.policies.filter((policy) => policy.id !== id),
        })),
      
      addClaim: (claim) =>
        set((state) => ({ 
          claims: Array.isArray(claim) ? [...state.claims, ...claim] : [...state.claims, claim] 
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
