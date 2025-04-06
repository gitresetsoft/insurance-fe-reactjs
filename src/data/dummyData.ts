
import { User, Insurance, Claim } from '../store/store';

export const dummyUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'user',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    role: 'user',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: '3',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    id: '4',
    firstName: 'George', 
    lastName: 'Brown',
    email: 'george.brown@example.com',
    role: 'user',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
  {
    id: '5',
    firstName: 'Alice',
    lastName: 'Wilson',
    email: 'alice.wilson@example.com',
    role: 'user',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
  },
];

export const dummyInsurances: Insurance[] = [
  {
    id: '1',
    type: 'home',
    premium: 1200,
    coverage: 250000,
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    status: 'active',
  },
  {
    id: '2',
    type: 'auto',
    premium: 800,
    coverage: 50000,
    startDate: '2024-02-15',
    endDate: '2025-02-15',
    status: 'active',
  },
  {
    id: '3',
    type: 'life',
    premium: 350,
    coverage: 500000,
    startDate: '2024-03-10',
    endDate: '2025-03-10',
    status: 'pending',
  },
  {
    id: '4',
    type: 'health',
    premium: 450,
    coverage: 100000,
    startDate: '2023-12-01',
    endDate: '2024-12-01',
    status: 'active',
  },
];

export const dummyClaims: Claim[] = [
  {
    id: '1',
    insuranceId: '1',
    date: '2024-03-15',
    description: 'Water damage from burst pipe',
    amount: 5000,
    status: 'approved',
  },
  {
    id: '2',
    insuranceId: '2',
    date: '2024-04-02',
    description: 'Minor car accident',
    amount: 2500,
    status: 'pending',
  },
];
