import React, { useState, useEffect } from "react";
import { Plus, Search, MapPin, Edit, Trash2, MoreVertical } from "lucide-react";
import StationForm from "./StationForm";
import {
  stationApi,
  Station,
  CreateStationData,
  UpdateStationData,
} from "../../../services/api";

interface Station {
  id: number;
  name: string;
  location: string;
  status: "active" | "maintenance" | "closed";
  capacity: number;
  facilities: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  buses: number;
  activeRoutes: number;
}

// Sample data
const initialStations: Station[] = [
  {
    id: 1,
    name: "Central Station",
    location: "Downtown",
    status: "active",
    capacity: 1000,
    facilities: ["Parking", "Restrooms", "Waiting Area", "WiFi"],
    coordinates: { latitude: 40.7128, longitude: -74.006 },
    buses: 8,
    activeRoutes: 4,
  },
  {
    id: 2,
    name: "North Terminal",
    location: "North District",
    status: "active",
    capacity: 800,
    facilities: ["Parking", "Restrooms", "Waiting Area", "Ticket Counter"],
    coordinates: { latitude: 40.7589, longitude: -73.9851 },
    buses: 6,
    activeRoutes: 3,
  },
  // ... other stations
];

const StationManagement: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [formData, setFormData] = useState<
    CreateStationData | UpdateStationData
  >({
    name: "",
    location: {
      type: "Point",
      coordinates: [0, 0], // [longitude, latitude]
    },
    address: "",
    description: "",
  });

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const data = await stationApi.getStations();
      setStations(data);
    } catch (err) {
      setError("An error occurred while fetching stations");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedStation) {
        await stationApi.updateStation(
          selectedStation.id,
          formData as UpdateStationData
        );
      } else {
        await stationApi.createStation(formData as CreateStationData);
      }
      setIsModalOpen(false);
      setSelectedStation(null);
      setFormData({
        name: "",
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
        address: "",
        description: "",
      });
      fetchStations();
    } catch (err) {
      setError("An error occurred while saving station");
    }
  };

  const handleEdit = (station: Station) => {
    setSelectedStation(station);
    setFormData({
      name: station.name,
      location: station.location,
      address: station.address,
      description: station.description || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (stationId: string) => {
    if (window.confirm("Are you sure you want to delete this station?")) {
      try {
        await stationApi.deleteStation(stationId);
        fetchStations();
      } catch (err) {
        setError("An error occurred while deleting station");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Station Management</h1>
        <button
          onClick={() => {
            setSelectedStation(null);
            setFormData({
              name: "",
              location: {
                type: "Point",
                coordinates: [0, 0],
              },
              address: "",
              description: "",
            });
            setIsModalOpen(true);
          }}
          className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md text-sm flex items-center"
        >
          <Plus size={16} className="mr-2" />
          <span>Add Station</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search stations..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* Stations Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Station Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Buses
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Active Routes
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stations.map((station) => (
                <tr key={station.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-blue-700" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {station.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: ST-{String(station.id).padStart(3, "0")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {station.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {station.buses}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {station.activeRoutes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        station.status === "active"
                          ? "bg-green-100 text-green-800"
                          : station.status === "maintenance"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {station.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <button
                        onClick={() => handleEdit(station)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(station.id.toString())}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{stations.length}</span> of{" "}
                <span className="font-medium">{stations.length}</span> stations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Station Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-lg font-medium mb-4">
              {selectedStation ? "Edit Station" : "Add New Station"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Station Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="latitude"
                  className="block text-sm font-medium text-gray-700"
                >
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  value={formData.location.coordinates[1]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
                        coordinates: [
                          formData.location.coordinates[0],
                          Number(e.target.value),
                        ],
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                  step="0.000001"
                  min="-90"
                  max="90"
                />
              </div>

              <div>
                <label
                  htmlFor="longitude"
                  className="block text-sm font-medium text-gray-700"
                >
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  value={formData.location.coordinates[0]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
                        coordinates: [
                          Number(e.target.value),
                          formData.location.coordinates[1],
                        ],
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                  step="0.000001"
                  min="-180"
                  max="180"
                />
              </div>

              <div className="col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                />
              </div>

              <div className="col-span-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {selectedStation ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationManagement;
