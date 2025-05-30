import axios from 'axios';
import { authService } from './auth';

export interface Ticket {
  id: string;
  scheduleId: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  seatNumber: number;
  price: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketData {
  scheduleId: string;
  seatNumber: number;
}

class TicketService {
  private readonly API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  async getTickets(): Promise<Ticket[]> {
    const response = await axios.get(`${this.API_URL}/tickets`);
    return response.data;
  }

  async getTicket(id: string): Promise<Ticket> {
    const response = await axios.get(`${this.API_URL}/tickets/${id}`);
    return response.data;
  }

  async createTicket(data: CreateTicketData): Promise<Ticket> {
    const response = await axios.post(`${this.API_URL}/tickets`, data);
    return response.data;
  }

  async cancelTicket(id: string): Promise<Ticket> {
    const response = await axios.post(`${this.API_URL}/tickets/${id}/cancel`);
    return response.data;
  }

  async getAvailableSeats(scheduleId: string): Promise<number[]> {
    const response = await axios.get(`${this.API_URL}/schedules/${scheduleId}/available-seats`);
    return response.data;
  }
}

export const ticketService = new TicketService(); 