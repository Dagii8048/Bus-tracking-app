import React, { useState, useEffect } from "react";
import {
  routeApi,
  stationApi,
  Route,
  CreateRouteData,
  UpdateRouteData,
  Station,
} from "../../../services/api";

const RouteManagement = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [formData, setFormData] = useState<CreateRouteData | UpdateRouteData>({
    name: "",
    routeNumber: "",
    description: "",
    stations: [],
    totalDistance: 0,
    estimatedDuration: 0,
  });

  useEffect(() => {
    fetchRoutes();
    fetchStations();
  }, []);

  const fetchRoutes = async () => {
    try {
      const data = await routeApi.getRoutes();
      setRoutes(data);
    } catch (err) {
      setError("An error occurred while fetching routes");
    } finally {
      setLoading(false);
    }
  };

  const fetchStations = async () => {
    try {
      const data = await stationApi.getStations();
      setStations(data);
    } catch (err) {
      setError("An error occurred while fetching stations");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedRoute) {
        await routeApi.updateRoute(
          selectedRoute.id,
          formData as UpdateRouteData
        );
      } else {
        await routeApi.createRoute(formData as CreateRouteData);
      }
      setIsModalOpen(false);
      setSelectedRoute(null);
      setFormData({
        name: "",
        routeNumber: "",
        description: "",
        stations: [],
        totalDistance: 0,
        estimatedDuration: 0,
      });
      fetchRoutes();
    } catch (err) {
      setError("An error occurred while saving route");
    }
  };

  const handleEdit = (route: Route) => {
    setSelectedRoute(route);
    setFormData({
      name: route.name,
      routeNumber: route.routeNumber,
      description: route.description || "",
      stations: route.stations.map((station) => station.id),
      totalDistance: route.totalDistance,
      estimatedDuration: route.estimatedDuration,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (routeId: string) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      try {
        await routeApi.deleteRoute(routeId);
        fetchRoutes();
      } catch (err) {
        setError("An error occurred while deleting route");
      }
    }
  };

  const handleStatusChange = async (
    routeId: string,
    currentStatus: "active" | "inactive"
  ) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await routeApi.updateRouteStatus(routeId, newStatus);
      fetchRoutes();
    } catch (err) {
      setError("An error occurred while updating route status");
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
    <div className="p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Route Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all bus routes in the system including their name, route
            number, stations, and status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setSelectedRoute(null);
              setFormData({
                name: "",
                routeNumber: "",
                description: "",
                stations: [],
                totalDistance: 0,
                estimatedDuration: 0,
              });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add route
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Route Number
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Stations
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Distance
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Duration
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {routes.map((route) => (
                    <tr key={route.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {route.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {route.routeNumber}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="max-w-xs truncate">
                          {route.stations
                            .map((station) => station.name)
                            .join(" → ")}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {route.totalDistance} km
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {route.estimatedDuration} min
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <button
                          onClick={() =>
                            handleStatusChange(route.id, route.status)
                          }
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                            route.status === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {route.status}
                        </button>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(route)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(route.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-lg font-medium mb-4">
              {selectedRoute ? "Edit Route" : "Add New Route"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Route Name
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
                  htmlFor="routeNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Route Number
                </label>
                <input
                  type="text"
                  id="routeNumber"
                  value={formData.routeNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, routeNumber: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
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

              <div className="col-span-2">
                <label
                  htmlFor="stations"
                  className="block text-sm font-medium text-gray-700"
                >
                  Stations
                </label>
                <select
                  id="stations"
                  multiple
                  value={formData.stations}
                  onChange={(e) => {
                    const selectedOptions = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );
                    setFormData({ ...formData, stations: selectedOptions });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                >
                  {stations.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Hold Ctrl (or Cmd on Mac) to select multiple stations
                </p>
              </div>

              <div>
                <label
                  htmlFor="totalDistance"
                  className="block text-sm font-medium text-gray-700"
                >
                  Total Distance (km)
                </label>
                <input
                  type="number"
                  id="totalDistance"
                  value={formData.totalDistance}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalDistance: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <label
                  htmlFor="estimatedDuration"
                  className="block text-sm font-medium text-gray-700"
                >
                  Estimated Duration (minutes)
                </label>
                <input
                  type="number"
                  id="estimatedDuration"
                  value={formData.estimatedDuration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedDuration: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                  min="0"
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
                  {selectedRoute ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteManagement;
