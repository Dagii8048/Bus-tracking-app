import axios from 'axios';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'driver' | 'passenger';
  phoneNumber?: string;
  profilePicture?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'driver' | 'passenger';
  phoneNumber?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private readonly API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  private token: string | null = localStorage.getItem('token');

  constructor() {
    // Add token to all requests if it exists
    axios.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Handle token expiration
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${this.API_URL}/auth/login`, credentials);
    const { user, token } = response.data;
    this.setToken(token);
    return { user, token };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post(`${this.API_URL}/auth/register`, data);
    const { user, token } = response.data;
    this.setToken(token);
    return { user, token };
  }

  async getCurrentUser(): Promise<User> {
    const response = await axios.get(`${this.API_URL}/auth/me`);
    return response.data;
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    const response = await axios.put(`${this.API_URL}/users/${userId}`, data);
    return response.data;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    await axios.post(`${this.API_URL}/users/${userId}/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.token = null;
  }

  private setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const authService = new AuthService(); 