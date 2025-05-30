import axios from 'axios';

export interface Notification {
  id: string;
  userId: string;
  type: 'ticket' | 'journey' | 'payment' | 'system';
  title: string;
  message: string;
  read: boolean;
  data?: {
    ticketId?: string;
    journeyId?: string;
    paymentId?: string;
    [key: string]: any;
  };
  createdAt: string;
}

class NotificationService {
  private readonly API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  async getNotifications(): Promise<Notification[]> {
    const response = await axios.get(`${this.API_URL}/notifications`);
    return response.data;
  }

  async markAsRead(notificationId: string): Promise<void> {
    await axios.patch(`${this.API_URL}/notifications/${notificationId}/read`);
  }

  async markAllAsRead(): Promise<void> {
    await axios.patch(`${this.API_URL}/notifications/read-all`);
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await axios.delete(`${this.API_URL}/notifications/${notificationId}`);
  }

  async subscribeToNotifications(onNotification: (notification: Notification) => void): Promise<() => void> {
    const eventSource = new EventSource(`${this.API_URL}/notifications/subscribe`);

    eventSource.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      onNotification(notification);
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }

  async getUnreadCount(): Promise<number> {
    const response = await axios.get(`${this.API_URL}/notifications/unread-count`);
    return response.data.count;
  }
}

export const notificationService = new NotificationService(); 