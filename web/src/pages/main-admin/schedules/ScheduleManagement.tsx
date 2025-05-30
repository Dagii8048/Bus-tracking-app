import React, { useState, useEffect } from "react";
import {
  scheduleApi,
  Schedule,
  CreateScheduleData,
  UpdateScheduleData,
} from "../../../services/api";
import { busApi, Bus } from "../../../services/api";
import { routeApi, Route } from "../../../services/api";

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [formData, setFormData] = useState<
    CreateScheduleData | UpdateScheduleData
  >({
    routeId: "",
    busId: "",
    driverId: "",
    departureTime: "",
    arrivalTime: "",
    status: "scheduled",
    price: 0,
  });

  useEffect(() => {
    fetchSchedules();
    fetchBuses();
    fetchRoutes();
  }, []);

  const fetchSchedules = async () => {
    try {
      const data = await scheduleApi.getSchedules();
      setSchedules(data);
    } catch (err) {
      setError("An error occurred while fetching schedules");
    } finally {
      setLoading(false);
    }
  };

  const fetchBuses = async () => {
    try {
      const data = await busApi.getBuses();
      setBuses(data);
    } catch (err) {
      setError("An error occurred while fetching buses");
    }
  };

  const fetchRoutes = async () => {
    try {
      const data = await routeApi.getRoutes();
      setRoutes(data);
    } catch (err) {
      setError("An error occurred while fetching routes");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedSchedule) {
        await scheduleApi.updateSchedule(
          selectedSchedule.id,
          formData as UpdateScheduleData
        );
      } else {
        await scheduleApi.createSchedule(formData as CreateScheduleData);
      }
      setIsModalOpen(false);
      setSelectedSchedule(null);
      setFormData({
        routeId: "",
        busId: "",
        driverId: "",
        departureTime: "",
        arrivalTime: "",
        status: "scheduled",
        price: 0,
      });
      fetchSchedules();
    } catch (err) {
      setError("An error occurred while saving schedule");
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      routeId: schedule.routeId,
      busId: schedule.busId,
      driverId: schedule.driverId,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      status: schedule.status,
      price: schedule.price,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (scheduleId: string) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await scheduleApi.deleteSchedule(scheduleId);
        fetchSchedules();
      } catch (err) {
        setError("An error occurred while deleting schedule");
      }
    }
  };

  const handleStatusChange = async (
    scheduleId: string,
    newStatus: "scheduled" | "in_progress" | "completed" | "cancelled"
  ) => {
    try {
      await scheduleApi.updateScheduleStatus(scheduleId, newStatus);
      fetchSchedules();
    } catch (err) {
      setError("An error occurred while updating schedule status");
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
            Schedule Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all bus schedules in the system including their routes,
            buses, and timings.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setSelectedSchedule(null);
              setFormData({
                routeId: "",
                busId: "",
                driverId: "",
                departureTime: "",
                arrivalTime: "",
                status: "scheduled",
                price: 0,
              });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add schedule
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
                      Route
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Bus
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Departure
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Arrival
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
                      Price
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
                  {schedules.map((schedule) => {
                    const route = routes.find((r) => r.id === schedule.routeId);
                    const bus = buses.find((b) => b.id === schedule.busId);
                    return (
                      <tr key={schedule.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {route?.name || "Unknown Route"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {bus?.plateNumber || "Unknown Bus"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(schedule.departureTime).toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(schedule.arrivalTime).toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <select
                            value={schedule.status}
                            onChange={(e) =>
                              handleStatusChange(
                                schedule.id,
                                e.target.value as
                                  | "scheduled"
                                  | "in_progress"
                                  | "completed"
                                  | "cancelled"
                              )
                            }
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              schedule.status === "scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : schedule.status === "in_progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : schedule.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            <option value="scheduled">Scheduled</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          ${schedule.price.toFixed(2)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => handleEdit(schedule)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(schedule.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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
              {selectedSchedule ? "Edit Schedule" : "Add New Schedule"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="routeId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Route
                </label>
                <select
                  id="routeId"
                  value={formData.routeId}
                  onChange={(e) =>
                    setFormData({ ...formData, routeId: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                >
                  <option value="">Select a route</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="busId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bus
                </label>
                <select
                  id="busId"
                  value={formData.busId}
                  onChange={(e) =>
                    setFormData({ ...formData, busId: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                >
                  <option value="">Select a bus</option>
                  {buses.map((bus) => (
                    <option key={bus.id} value={bus.id}>
                      {bus.plateNumber} - {bus.model}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="departureTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Departure Time
                </label>
                <input
                  type="datetime-local"
                  id="departureTime"
                  value={new Date(formData.departureTime)
                    .toISOString()
                    .slice(0, 16)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      departureTime: new Date(e.target.value).toISOString(),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="arrivalTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Arrival Time
                </label>
                <input
                  type="datetime-local"
                  id="arrivalTime"
                  value={new Date(formData.arrivalTime)
                    .toISOString()
                    .slice(0, 16)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      arrivalTime: new Date(e.target.value).toISOString(),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
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
                        | "scheduled"
                        | "in_progress"
                        | "completed"
                        | "cancelled",
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                  min="0"
                  step="0.01"
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
                  {selectedSchedule ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
