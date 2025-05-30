import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const adminLinks = [
    {
      name: "Stations",
      path: "/admin/stations",
      description: "Manage bus stations and their details",
    },
    {
      name: "Buses",
      path: "/admin/buses",
      description: "Manage bus fleet and maintenance",
    },
    {
      name: "Schedules",
      path: "/admin/schedules",
      description: "Manage bus schedules and routes",
    },
    {
      name: "Payments",
      path: "/admin/payments",
      description: "View and manage payment transactions",
    },
  ];

  const driverLinks = [
    {
      name: "My Schedule",
      path: "/driver/schedule",
      description: "View and manage your driving schedule",
    },
    {
      name: "Bus Status",
      path: "/driver/bus-status",
      description: "Update bus status and location",
    },
    {
      name: "Maintenance",
      path: "/driver/maintenance",
      description: "Report maintenance issues",
    },
  ];

  const passengerLinks = [
    {
      name: "Book Ticket",
      path: "/passenger/book",
      description: "Book a new bus ticket",
    },
    {
      name: "My Tickets",
      path: "/passenger/tickets",
      description: "View your booked tickets",
    },
    {
      name: "Track Bus",
      path: "/passenger/track",
      description: "Track your bus in real-time",
    },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case "admin":
        return adminLinks;
      case "driver":
        return driverLinks;
      case "passenger":
        return passengerLinks;
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back, {user?.name}!
          </p>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {getLinks().map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    {link.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {link.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
