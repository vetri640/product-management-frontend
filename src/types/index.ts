export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdDate: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export interface Product {
  id: string;
  name: string;
  category: string;
  modelNumber: string;
  description: string;
  price: number;
  stock: number;
  status: ProductStatus;
  owner: string;
  createdDate: string;
  imageUrl?: string;
  activities?: ProductActivity[];
}

export interface ProductActivity {
  id: string;
  action: string;
  description: string;
  date: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
