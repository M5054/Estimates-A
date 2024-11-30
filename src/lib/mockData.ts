export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
}

export interface EstimateItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Estimate {
  id: string;
  clientId: string;
  title: string;
  description: string;
  items: EstimateItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
  validUntil: string;
}

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    company: 'Tech Corp',
    email: 'john@techcorp.com',
    phone: '+1234567890'
  },
  {
    id: '2',
    name: 'Jane Smith',
    company: 'Design Studio',
    email: 'jane@designstudio.com',
    phone: '+1987654321'
  }
];

export const mockEstimates: Estimate[] = [
  {
    id: '1',
    clientId: '1',
    title: 'Website Development',
    description: 'Full website development project including design and implementation',
    items: [
      {
        description: 'UI/UX Design',
        quantity: 1,
        rate: 2000,
        amount: 2000
      },
      {
        description: 'Frontend Development',
        quantity: 1,
        rate: 3000,
        amount: 3000
      }
    ],
    subtotal: 5000,
    taxRate: 10,
    taxAmount: 500,
    total: 5500,
    status: 'pending',
    createdAt: '2024-03-19T10:00:00Z',
    validUntil: '2024-04-19'
  },
  {
    id: '2',
    clientId: '2',
    title: 'Logo Design',
    description: 'Brand identity design including logo and style guide',
    items: [
      {
        description: 'Logo Design',
        quantity: 1,
        rate: 1500,
        amount: 1500
      }
    ],
    subtotal: 1500,
    taxRate: 10,
    taxAmount: 150,
    total: 1650,
    status: 'approved',
    createdAt: '2024-03-18T15:00:00Z',
    validUntil: '2024-04-18'
  }
];