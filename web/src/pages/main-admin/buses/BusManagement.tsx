import React, { useState, useEffect } from "react";
import {
  busApi,
  Bus,
  CreateBusData,
  UpdateBusData,
} from "../../../services/api";

const BusManagement = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [formData, setFormData] = useState<CreateBusData | UpdateBusData>({
    plateNumber: "",
    model: "",
    capacity: 0,
    status: "active",
    currentLocation: {
      type: "Point",
      coordinates: [0, 0], // [longitude, latitude]
    },
    lastMaintenance: new Date().toISOString(),
    nextMaintenance: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(), // 30 days from now
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const data = await busApi.getBuses();
      setBuses(data);
    } catch (err) {
      setError("An error occurred while fetching buses");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedBus) {
        await busApi.updateBus(selectedBus.id, formData as UpdateBusData);
      } else {
        await busApi.createBus(formData as CreateBusData);
      }
      setIsModalOpen(false);
      setSelectedBus(null);
      setFormData({
        plateNumber: "",
        model: "",
        capacity: 0,
        status: "active",
        currentLocation: {
          type: "Point",
          coordinates: [0, 0],
        },
        lastMaintenance: new Date().toISOString(),
        nextMaintenance: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });
      fetchBuses();
    } catch (err) {
      setError("An error occurred while saving bus");
    }
  };

  const handleEdit = (bus: Bus) => {
    setSelectedBus(bus);
    setFormData({
      plateNumber: bus.plateNumber,
      model: bus.model,
      capacity: bus.capacity,
      status: bus.status,
      currentLocation: bus.currentLocation,
      lastMaintenance: bus.lastMaintenance,
      nextMaintenance: bus.nextMaintenance,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (busId: string) => {
    if (window.confirm("Are you sure you want to delete this bus?")) {
      try {
        await busApi.deleteBus(busId);
        fetchBuses();
      } catch (err) {
        setError("An error occurred while deleting bus");
      }
    }
  };

  const handleStatusChange = async (
    busId: string,
    newStatus: "active" | "maintenance" | "inactive"
  ) => {
    try {
      await busApi.updateBusStatus(busId, newStatus);
      fetchBuses();
    } catch (err) {
      setError("An error occurred while updating bus status");
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
            Bus Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all buses in the system including their plate numbers,
            models, and current status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setSelectedBus(null);
              setFormData({
                plateNumber: "",
                model: "",
                capacity: 0,
                status: "active",
                currentLocation: {
                  type: "Point",
                  coordinates: [0, 0],
                },
                lastMaintenance: new Date().toISOString(),
                nextMaintenance: new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000
                ).toISOString(),
              });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add bus
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
                      Plate Number
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Model
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Capacity
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Last Maintenance
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Next Maintenance
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
                  {buses.map((bus) => (
                    <tr key={bus.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {bus.plateNumber}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {bus.model}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {bus.capacity}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <select
                          value={bus.status}
                          onChange={(e) =>
                            handleStatusChange(
                              bus.id,
                              e.target.value as
                                | "active"
                                | "maintenance"
                                | "inactive"
                            )
                          }
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            bus.status === "active"
                              ? "bg-green-100 text-green-800"
                              : bus.status === "maintenance"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(bus.lastMaintenance).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(bus.nextMaintenance).toLocaleDateString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(bus)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(bus.id)}
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
              {selectedBus ? "Edit Bus" : "Add New Bus"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="plateNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Plate Number
                </label>
                <input
                  type="text"
                  id="plateNumber"
                  value={formData.plateNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, plateNumber: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="model"
                  className="block text-sm font-medium text-gray-700"
                >
                  Model
                </label>
                <input
                  type="text"
                  id="model"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="capacity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Capacity
                </label>
                <input
                  type="number"
                  id="capacity"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacity: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                  min="1"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as
                        | "active"
                        | "maintenance"
                        | "inactive",
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="lastMaintenance"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Maintenance
                </label>
                <input
                  type="date"
                  id="lastMaintenance"
                  value={
                    new Date(formData.lastMaintenance)
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastMaintenance: new Date(e.target.value).toISOString(),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="nextMaintenance"
                  className="block text-sm font-medium text-gray-700"
                >
                  Next Maintenance
                </label>
                <input
                  type="date"
                  id="nextMaintenance"
                  value={
                    new Date(formData.nextMaintenance)
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nextMaintenance: new Date(e.target.value).toISOString(),
                    })
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
                  value={formData.currentLocation.coordinates[1]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentLocation: {
                        ...formData.currentLocation,
                        coordinates: [
                          formData.currentLocation.coordinates[0],
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
                  value={formData.currentLocation.coordinates[0]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentLocation: {
                        ...formData.currentLocation,
                        coordinates: [
                          Number(e.target.value),
                          formData.currentLocation.coordinates[1],
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
                  {selectedBus ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusManagement;
