import 'server-only';
import { serverFetch } from '@/lib/api/server-fetch';
import type { Product } from '@/types/product.types';

export function listProducts(): Promise<Product[]> {
  return serverFetch<Product[]>('/products');
}