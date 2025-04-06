import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { User } from '../store/store';
import { useAppStore } from '../store/store';

const API_URL = import.meta.env.VITE_API_URL;

interface FetchUserByEmailRequest {
  email: string;
}

export const useUser = () => {
  const login = useAppStore((state) => state.login);

  const fetchUserByEmail = useMutation({
    mutationFn: async (data: FetchUserByEmailRequest) => {
      try {
        const response = await axios.post<User>(`${API_URL}/users/email`, data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.response?.data?.message || 'Failed to fetch user');
        }
        throw error;
      }
    },
    onSuccess: (user) => {
      login(user);
    },
  });

  return {
    fetchUserByEmail,
    isLoading: fetchUserByEmail.isPending,
    error: fetchUserByEmail.error,
  };
};