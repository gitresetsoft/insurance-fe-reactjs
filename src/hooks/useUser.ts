import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { LoginData, User } from '@/store/interface';
import { useAppStore } from '@/store/store';

const API_URL = import.meta.env.VITE_API_URL;

interface UserLoginRequest {
  email: string;
  password: string;
}

export const useUser = () => {
  const login = useAppStore((state) => state.login);
  const logout = useAppStore((state) => state.logout);

  const userLogin = useMutation({
    mutationFn: async (data: UserLoginRequest) => {
      try {
        const response = await axios.post<LoginData>(`${API_URL}/auth/login`, data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.response?.data?.message || 'Failed to fetch user');
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      // Store the access token in localStorage
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        const userData = JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          googleId: data.user.googleId,
          createdAt: data.user.createdAt,
          updatedAt: data.user.updatedAt,
          lastLogin: data.user.lastLogin,
          avatar: data.user.avatar,
        });
        localStorage.setItem('userData', userData);
      }
      login(data.user);
    },
  });

  const userLogout = useMutation({
    mutationFn: async () => {
      try {
        const token = localStorage.getItem('access_token');

         await axios.post(
          `${API_URL}/auth/logout`, 
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.response?.data?.message || 'Failed to logout');
        }
        throw error;
      }
    },
    onSuccess: () => {
      // Clear the access token from localStorage
      localStorage.removeItem('access_token');
      logout();
    },
  });

  return {
    userLogin,
    userLogout,
    isLoading: userLogin.isPending || userLogout.isPending,
    error: userLogin.error || userLogout.error,
  };
};

export const useGetAllUsers = () => {
  const getAllUsers = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axios.get<User[]>(`${API_URL}/users`);
      return response.data;
    },
    // onError: (error) => {
    //   console.error('Error fetching users:', error);
    // },
  });

  return {
    users: getAllUsers.data,
    isLoading: getAllUsers.isLoading,
    error: getAllUsers.error,
  };
};