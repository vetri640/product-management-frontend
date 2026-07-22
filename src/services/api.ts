import axios from 'axios';
import { User, AuthResponse, Product } from '../types';

export const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Map backend ProductDto to frontend Product model
const mapProduct = (p: any): Product => ({
  id: String(p.id),
  name: p.name,
  description: p.description,
  price: p.price,
  category: p.category || 'General',
  modelNumber: p.modelNumber || `MOD-${p.id}`,
  stock: p.stock || 0,
  status: p.status || 'ACTIVE',
  owner: p.owner || `User ${p.userId}`,
  createdDate: p.createdDate || new Date().toISOString().split('T')[0],
  imageUrl: p.imageUrl,
});

// Map backend UserDto to frontend User model
const mapUser = (u: any): User => ({
  id: String(u.id),
  name: u.name,
  email: u.email,
  role: u.role,
  createdDate: u.createdDate || new Date().toISOString().split('T')[0],
  status: u.status || 'ACTIVE',
});

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return {
      token: response.data.token,
      user: mapUser(response.data.user)
    };
  },
  register: async (name: string, email: string, password: string, role: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', { 
      name, 
      email, 
      password,
      role 
    });
    return {
      token: response.data.token,
      user: mapUser(response.data.user)
    };
  }
};

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data.map(mapProduct);
  },
  getById: async (id: string): Promise<Product> => {
    // Backend doesn't have getById yet, but getAll works since data is small
    const response = await api.get('/products');
    const prod = response.data.find((p: any) => String(p.id) === id);
    if (!prod) throw new Error('Product not found');
    return mapProduct(prod);
  },
  create: async (product: Omit<Product, 'id' | 'createdDate'>): Promise<Product> => {
    const response = await api.post('/products', {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      status: product.status,
      category: product.category,
      modelNumber: product.modelNumber,
    });
    return mapProduct(response.data);
  },
  update: async (id: string, updates: Partial<Product>): Promise<Product> => {
    // Get existing product first to satisfy backend NotNull constraints if needed
    const all = await api.get('/products');
    const existing = all.data.find((p: any) => String(p.id) === id);
    
    const response = await api.put(`/products/${id}`, {
      ...existing,
      name: updates.name || existing.name,
      description: updates.description || existing.description,
      price: updates.price || existing.price,
      stock: updates.stock !== undefined ? updates.stock : existing.stock,
      status: updates.status || existing.status,
      category: updates.category || existing.category,
      modelNumber: updates.modelNumber || existing.modelNumber,
    });
    return mapProduct(response.data);
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
  uploadImage: async (id: string, file: File): Promise<Product> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/products/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return mapProduct(response.data);
  }
};

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data.map(mapUser);
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  }
};
