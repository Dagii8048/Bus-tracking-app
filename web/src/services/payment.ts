import axios from 'axios';

export interface Payment {
  id: string;
  ticketId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'credit_card' | 'debit_card' | 'mobile_payment';
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentData {
  ticketId: string;
  paymentMethod: 'credit_card' | 'debit_card' | 'mobile_payment';
  cardDetails?: {
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  };
}

class PaymentService {
  private readonly API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  async getPayments(): Promise<Payment[]> {
    const response = await axios.get(`${this.API_URL}/payments`);
    return response.data;
  }

  async getPayment(id: string): Promise<Payment> {
    const response = await axios.get(`${this.API_URL}/payments/${id}`);
    return response.data;
  }

  async createPayment(data: CreatePaymentData): Promise<Payment> {
    const response = await axios.post(`${this.API_URL}/payments`, data);
    return response.data;
  }

  async getPaymentMethods(): Promise<string[]> {
    const response = await axios.get(`${this.API_URL}/payments/methods`);
    return response.data;
  }

  async verifyPayment(paymentId: string): Promise<Payment> {
    const response = await axios.post(`${this.API_URL}/payments/${paymentId}/verify`);
    return response.data;
  }
}

export const paymentService = new PaymentService(); 