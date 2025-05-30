import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
  phoneNumber?: string;
  username: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface EmailVerificationRequest {
  email: string;
}

export interface EmailVerificationConfirm {
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'MAIN_ADMIN' | 'STATION_ADMIN' | 'DRIVER';
  status: 'active' | 'inactive';
  createdAt: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  username: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'MAIN_ADMIN' | 'STATION_ADMIN' | 'DRIVER';
  phoneNumber?: string;
  username: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: 'MAIN_ADMIN' | 'STATION_ADMIN' | 'DRIVER';
  status?: 'active' | 'inactive';
  phoneNumber?: string;
  username?: string;
}

export interface Station {
  id: string;
  name: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: string;
  description?: string;
}

export interface Route {
  id: string;
  name: string;
  routeNumber: string;
  description?: string;
  stations: Station[];
  totalDistance: number; // in kilometers
  estimatedDuration: number; // in minutes
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateRouteData {
  name: string;
  routeNumber: string;
  description?: string;
  stations: string[]; // Array of station IDs
  totalDistance: number;
  estimatedDuration: number;
}

export interface UpdateRouteData {
  name?: string;
  routeNumber?: string;
  description?: string;
  stations?: string[];
  totalDistance?: number;
  estimatedDuration?: number;
  status?: 'active' | 'inactive';
}

export interface CreateStationData {
  name: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: string;
  description?: string;
}

export interface UpdateStationData {
  name?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  address?: string;
  description?: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  sendVerificationEmail: async (data: EmailVerificationRequest) => {
    const response = await api.post('/email/send-verification', data);
    return response.data;
  },

  verifyEmail: async (data: EmailVerificationConfirm) => {
    const response = await api.post('/email/verify', data);
    return response.data;
  },

  checkEmailVerification: async () => {
    const response = await api.get('/email/check-verification');
    return response.data;
  },
};

export const userApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserData): Promise<User> => {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserData): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  updateUserStatus: async (id: string, status: 'active' | 'inactive'): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}/status`, { status });
    return response.data;
  },
};

export const routeApi = {
  getRoutes: async (): Promise<Route[]> => {
    const response = await api.get<Route[]>('/routes');
    return response.data;
  },

  getRoute: async (id: string): Promise<Route> => {
    const response = await api.get<Route>(`/routes/${id}`);
    return response.data;
  },

  createRoute: async (data: CreateRouteData): Promise<Route> => {
    const response = await api.post<Route>('/routes', data);
    return response.data;
  },

  updateRoute: async (id: string, data: UpdateRouteData): Promise<Route> => {
    const response = await api.put<Route>(`/routes/${id}`, data);
    return response.data;
  },

  deleteRoute: async (id: string): Promise<void> => {
    await api.delete(`/routes/${id}`);
  },

  updateRouteStatus: async (id: string, status: 'active' | 'inactive'): Promise<Route> => {
    const response = await api.patch<Route>(`/routes/${id}/status`, { status });
    return response.data;
  },
};

export const stationApi = {
  getStations: async (): Promise<Station[]> => {
    const response = await api.get<Station[]>('/stations');
    return response.data;
  },

  getStation: async (id: string): Promise<Station> => {
    const response = await api.get<Station>(`/stations/${id}`);
    return response.data;
  },

  createStation: async (data: CreateStationData): Promise<Station> => {
    const response = await api.post<Station>('/stations', data);
    return response.data;
  },

  updateStation: async (id: string, data: UpdateStationData): Promise<Station> => {
    const response = await api.put<Station>(`/stations/${id}`, data);
    return response.data;
  },

  deleteStation: async (id: string): Promise<void> => {
    await api.delete(`/stations/${id}`);
  },
};

// Bus API
export interface Bus {
  id: string;
  plateNumber: string;
  model: string;
  capacity: number;
  status: 'active' | 'inactive' | 'maintenance';
  lastMaintenance: string;
  nextMaintenance: string;
  currentLocation: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface CreateBusData {
  plateNumber: string;
  model: string;
  capacity: number;
  status?: 'active' | 'inactive' | 'maintenance';
  lastMaintenance?: string;
  nextMaintenance?: string;
  currentLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface UpdateBusData {
  plateNumber?: string;
  model?: string;
  capacity?: number;
  status?: 'active' | 'inactive' | 'maintenance';
  lastMaintenance?: string;
  nextMaintenance?: string;
  currentLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export const busApi = {
  getBuses: async (): Promise<Bus[]> => {
    const response = await api.get<Bus[]>('/buses');
    return response.data;
  },
  getBus: async (id: string): Promise<Bus> => {
    const response = await api.get<Bus>(`/buses/${id}`);
    return response.data;
  },
  createBus: async (data: CreateBusData): Promise<Bus> => {
    const response = await api.post<Bus>('/buses', data);
    return response.data;
  },
  updateBus: async (id: string, data: UpdateBusData): Promise<Bus> => {
    const response = await api.put<Bus>(`/buses/${id}`, data);
    return response.data;
  },
  deleteBus: async (id: string): Promise<void> => {
    await api.delete(`/buses/${id}`);
  },
  updateBusStatus: async (id: string, status: 'active' | 'inactive' | 'maintenance'): Promise<Bus> => {
    const response = await api.patch<Bus>(`/buses/${id}/status`, { status });
    return response.data;
  },
};

// Schedule API
export interface Schedule {
  id: string;
  routeId: string;
  busId: string;
  departureTime: string;
  arrivalTime: string;
  status: 'active' | 'inactive' | 'cancelled';
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleData {
  routeId: string;
  busId: string;
  departureTime: string;
  arrivalTime: string;
  status?: 'active' | 'inactive' | 'cancelled';
  price: number;
}

export interface UpdateScheduleData {
  routeId?: string;
  busId?: string;
  departureTime?: string;
  arrivalTime?: string;
  status?: 'active' | 'inactive' | 'cancelled';
  price?: number;
}

export const scheduleApi = {
  getSchedules: async (): Promise<Schedule[]> => {
    const response = await api.get<Schedule[]>('/schedules');
    return response.data;
  },
  getSchedule: async (id: string): Promise<Schedule> => {
    const response = await api.get<Schedule>(`/schedules/${id}`);
    return response.data;
  },
  createSchedule: async (data: CreateScheduleData): Promise<Schedule> => {
    const response = await api.post<Schedule>('/schedules', data);
    return response.data;
  },
  updateSchedule: async (id: string, data: UpdateScheduleData): Promise<Schedule> => {
    const response = await api.put<Schedule>(`/schedules/${id}`, data);
    return response.data;
  },
  deleteSchedule: async (id: string): Promise<void> => {
    await api.delete(`/schedules/${id}`);
  },
  updateScheduleStatus: async (id: string, status: 'active' | 'inactive' | 'cancelled'): Promise<Schedule> => {
    const response = await api.patch<Schedule>(`/schedules/${id}/status`, { status });
    return response.data;
  },
};

// Payment API
export interface Payment {
  id: string;
  scheduleId: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId: string;
  paymentDate: string;
}

export interface CreatePaymentData {
  scheduleId: string;
  userId: string;
  amount: number;
  paymentMethod: string;
}

export interface UpdatePaymentData {
  scheduleId?: string;
  userId?: string;
  amount?: number;
  paymentMethod?: string;
  status?: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  paymentDate?: string;
}

export const paymentApi = {
  getPayments: async (): Promise<Payment[]> => {
    const response = await api.get<Payment[]>('/payments');
    return response.data;
  },
  getPayment: async (id: string): Promise<Payment> => {
    const response = await api.get<Payment>(`/payments/${id}`);
    return response.data;
  },
  createPayment: async (data: CreatePaymentData): Promise<Payment> => {
    const response = await api.post<Payment>('/payments', data);
    return response.data;
  },
  updatePayment: async (id: string, data: UpdatePaymentData): Promise<Payment> => {
    const response = await api.put<Payment>(`/payments/${id}`, data);
    return response.data;
  },
  deletePayment: async (id: string): Promise<void> => {
    await api.delete(`/payments/${id}`);
  },
  updatePaymentStatus: async (id: string, status: 'pending' | 'completed' | 'failed'): Promise<Payment> => {
    const response = await api.patch<Payment>(`/payments/${id}/status`, { status });
    return response.data;
  },
};

export default api; 