
import { Claim, ClaimStatus } from '@/store/interface';

export const dummyClaims: Claim[] = [
  {
    id: '1',
    insuranceId: '1',
    date: '2024-03-15',
    description: 'Water damage from burst pipe',
    amount: 5000,
    status: ClaimStatus.APPROVED,
  },
  {
    id: '2',
    insuranceId: '2',
    date: '2024-04-02',
    description: 'Minor car accident',
    amount: 2500,
    status: ClaimStatus.SUBMITTED,
  },
];
