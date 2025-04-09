import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Policies, InsuranceProduct, PolicyStatus } from '@/store/interface';
import { useAppStore } from '@/store/store';
import { useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export interface CreateInsuranceRequest {
  policyNumber: string;
  status: PolicyStatus;
  startDate: Date;
  endDate: Date;
  premium: number;
  coverageLimit: number;
  userId: string;
  insuranceProductId: string;
}

export const useInsurance = () => {
  const { user, policies, addInsurance } = useAppStore();

  const createInsurance = useMutation({
    mutationFn: async (data: CreateInsuranceRequest) => {
      try {

        const allData = localStorage.getItem('insurance-app-storage');
        if (!allData) {
          throw new Error('No data not found in localStorage');
        }
        
        const parsedData = JSON.parse(allData);
        const user = parsedData.state.user;
    
        if (!user.id) {
          throw new Error('User ID not found in localStorage');
        }
        data.userId = user.id;
        
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('Access token not found in localStorage');
        }

        const response = await axios.post(`${API_URL}/policies`,
          data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return response.data.id;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.response?.data?.message || 'Failed to create insurance');
        }
        throw error;
      }
    },
    onSuccess: (data) => {
    },
  });

  const { data: insuranceProductsData, isLoading: productsLoading, error: productsError } = useQuery<InsuranceProduct[], Error>({
    queryKey: ['getInsuranceProduct'],
    queryFn: async () => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('Access token not found in localStorage');
      }
      const response = await axios.get<InsuranceProduct[]>(`${API_URL}/insurance-products`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    },
  });

  const GetInsurance = (id: string) => {
    return useQuery<Policies | null, Error>({
      queryKey: ['insurance', id],
      queryFn: async () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error('Access token not found');

        const url = `${API_URL}/policies/${id}`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        return res.data ?? null; // Return a single policy or null if not found
      },
      enabled: !!localStorage.getItem('access_token'),
    });
  };

  const GetAllInsurance = () => {
    return useQuery<Policies[] | null, Error>({
      queryKey: ['insurance', 'user'],
      queryFn: async () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error('Access token not found');

        const allData = localStorage.getItem('insurance-app-storage');
        const parsed = JSON.parse(allData || '{}');
        const userId = parsed?.state?.user?.id;
        if (!userId) throw new Error('User ID not found');

        const url = `${API_URL}/policies/user/${userId}`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        return res.data ?? null;
      },
      enabled: !!localStorage.getItem('access_token'),
    });
  };

  return {
    createInsurance,
    GetInsurance,
    GetAllInsurance,
    insuranceProducts: insuranceProductsData || [],
    productsLoading,
    productsError,
  }
};