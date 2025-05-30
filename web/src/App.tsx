import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationBell from "./components/NotificationBell";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Unauthorized from "./pages/auth/Unauthorized";
import Dashboard from "./pages/Dashboard";
import StationManagement from "./pages/main-admin/stations/StationManagement";
import BusManagement from "./pages/main-admin/buses/BusManagement";
import ScheduleManagement from "./pages/main-admin/schedules/ScheduleManagement";
import PaymentManagement from "./pages/main-admin/payments/PaymentManagement";
import BookTicket from "./pages/passenger/BookTicket";
import MyTickets from "./pages/passenger/MyTickets";
import Payment from "./pages/passenger/Payment";
import JourneyTracking from "./pages/passenger/JourneyTracking";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center">
                      <span className="text-xl font-bold text-indigo-600">
                        Bus Tracker
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <NotificationBell />
                  </div>
                </div>
              </div>
            </nav>

            <main>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin routes */}
                <Route
                  path="/admin/stations"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <StationManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/buses"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <BusManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/schedules"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <ScheduleManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/payments"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <PaymentManagement />
                    </ProtectedRoute>
                  }
                />

                {/* Passenger routes */}
                <Route
                  path="/passenger/book"
                  element={
                    <ProtectedRoute requiredRole="passenger">
                      <BookTicket />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/passenger/tickets"
                  element={
                    <ProtectedRoute requiredRole="passenger">
                      <MyTickets />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/passenger/payment/:ticketId"
                  element={
                    <ProtectedRoute requiredRole="passenger">
                      <Payment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/passenger/tracking/:ticketId"
                  element={
                    <ProtectedRoute requiredRole="passenger">
                      <JourneyTracking />
                    </ProtectedRoute>
                  }
                />

                {/* Redirect root to dashboard */}
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />

                {/* Catch all route */}
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </main>
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
