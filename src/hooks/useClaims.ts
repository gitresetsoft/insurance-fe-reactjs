import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useAppStore } from '@/store/store';
import { ClaimStatus } from '@/store/interface';

const API_URL = import.meta.env.VITE_API_URL;

export interface Claim {
  id?: string;
  policyId: string;
  userId: string;
  description: string;
  amount: number;
  date: string;
  status: ClaimStatus;
  createdAt?: string;
  updatedAt?: string;
}

export const useClaims = () => {
  const { user, addClaim, updateClaim, removeClaim } = useAppStore();

  const createClaim = useMutation({
    mutationFn: async (data: Omit<Claim, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const response = await axios.post(`${API_URL}/claims`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Add to local store as well
      addClaim(response.data);
      return response.data;
    },
    onError: (error: AxiosError) => {
      throw new Error(error.response?.data?.message || 'Failed to create claim');
    },
  });

  const GetUserClaims = () => {
    return useQuery<Claim[], Error>({
      queryKey: ['claims', 'user'],
      queryFn: async () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error('Access token not found');

        const allData = localStorage.getItem('insurance-app-storage');
        const parsed = JSON.parse(allData || '{}');
        const userId = parsed?.state?.user?.id;
        if (!userId) throw new Error('User ID not found');

        const response = await axios.get(`${API_URL}/claims/user/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
      },
      enabled: !!localStorage.getItem('access_token'),
    });
  };

  const GetPolicyClaims = (policyId: string) => {
    return useQuery<Claim[], Error>({
      queryKey: ['claims', 'policy', policyId],
      queryFn: async () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error('Access token not found');

        const response = await axios.get(`${API_URL}/claims/policy/${policyId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
      },
      enabled: !!policyId && !!localStorage.getItem('access_token'),
    });
  };

  const GetClaim = (id: string) => {
    return useQuery<Claim, Error>({
      queryKey: ['claims', id],
      queryFn: async () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error('Access token not found');

        const response = await axios.get(`${API_URL}/claims/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
      },
      enabled: !!id && !!localStorage.getItem('access_token'),
    });
  };

  return {
    createClaim,
    GetUserClaims,
    GetPolicyClaims,
    GetClaim,
  };
}; 