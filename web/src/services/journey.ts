import axios from 'axios';

export interface Location {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface Journey {
  id: string;
  scheduleId: string;
  busId: string;
  driverId: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
  currentLocation?: Location;
  estimatedArrivalTime?: string;
  actualDepartureTime?: string;
  actualArrivalTime?: string;
  delay?: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

export interface JourneyUpdate {
  journeyId: string;
  location?: Location;
  status?: Journey['status'];
  estimatedArrivalTime?: string;
  delay?: number;
}

class JourneyService {
  private readonly API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  async getJourney(journeyId: string): Promise<Journey> {
    const response = await axios.get(`${this.API_URL}/journeys/${journeyId}`);
    return response.data;
  }

  async getJourneyBySchedule(scheduleId: string): Promise<Journey> {
    const response = await axios.get(`${this.API_URL}/journeys/schedule/${scheduleId}`);
    return response.data;
  }

  async getJourneyByTicket(ticketId: string): Promise<Journey> {
    const response = await axios.get(`${this.API_URL}/journeys/ticket/${ticketId}`);
    return response.data;
  }

  async subscribeToJourneyUpdates(journeyId: string, onUpdate: (journey: Journey) => void): Promise<() => void> {
    const eventSource = new EventSource(`${this.API_URL}/journeys/${journeyId}/updates`);

    eventSource.onmessage = (event) => {
      const journey = JSON.parse(event.data);
      onUpdate(journey);
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }

  async getJourneyHistory(journeyId: string): Promise<Location[]> {
    const response = await axios.get(`${this.API_URL}/journeys/${journeyId}/history`);
    return response.data;
  }
}

export const journeyService = new JourneyService(); 