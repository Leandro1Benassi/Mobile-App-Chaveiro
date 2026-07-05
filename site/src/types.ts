/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface KeyProduct {
  id: string;
  name: string;
  code: string;
  category: 'Residencial' | 'Automotivo' | 'Segurança';
  stock: number;
  price: number;
  securityLevel: 'Alta' | 'Média' | 'Básica';
  description: string;
}

export interface ServiceBooking {
  id?: string;
  clientName: string;
  phone: string;
  serviceType: string;
  location: string;
  status: 'Pendente' | 'Confirmado' | 'Em Andamento' | 'Concluído';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  avatarUrl: string;
  date: string;
}

export interface QuickSale {
  product: KeyProduct;
  quantity: number;
  paymentMethod: 'PIX' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro';
  amount: number;
  signature: string; // Base64 image data or path
  customerName: string;
  timestamp: string;
}
