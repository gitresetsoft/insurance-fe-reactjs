import { User } from '@/store/interface';

interface ApiUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface ApiResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: ApiUser[];
}

export const fetchAllUsers = async (): Promise<User[]> => {
  const allUsers: ApiUser[] = [];
  let currentPage = 1;
  let totalPages = 1;

  try {
    do {
      const response = await fetch(`https://reqres.in/api/users?page=${currentPage}`);
      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.statusText}`);
      }
      
      const data: ApiResponse = await response.json();
      allUsers.push(...data.data);
      totalPages = data.total_pages;
      currentPage++;
    } while (currentPage <= totalPages);

    // Convert API users to our app's user model and filter by names starting with G or W
    return allUsers
      .filter(user => 
        user.first_name.startsWith('G') || 
        user.last_name.startsWith('W')
      )
      .map(user => ({
        id: user.id.toString(),
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: 'user',
        avatar: user.avatar,
      }));
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
};

export const maskEmail = (email: string): string => {
  const [username, domain] = email.split('@');
  const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
  return `${maskedUsername}@${domain}`;
};
