import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ticketService, Ticket } from "../../services/ticket";
import { scheduleApi, Schedule } from "../../services/api";

const BookTicket = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<string>("");
  const [availableSeats, setAvailableSeats] = useState<number[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    if (selectedSchedule) {
      fetchAvailableSeats(selectedSchedule);
    }
  }, [selectedSchedule]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await scheduleApi.getSchedules();
      setSchedules(data);
    } catch (err) {
      setError("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSeats = async (scheduleId: string) => {
    try {
      setLoading(true);
      const seats = await ticketService.getAvailableSeats(scheduleId);
      setAvailableSeats(seats);
    } catch (err) {
      setError("Failed to load available seats");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchedule || !selectedSeat) {
      setError("Please select a schedule and seat");
      return;
    }

    try {
      setLoading(true);
      const ticket = await ticketService.createTicket({
        scheduleId: selectedSchedule,
        seatNumber: selectedSeat,
      });
      navigate(`/passenger/tickets/${ticket.id}`);
    } catch (err) {
      setError("Failed to book ticket");
    } finally {
      setLoading(false);
    }
  };

  const selectedScheduleData = schedules.find((s) => s.id === selectedSchedule);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">
                  Book a Ticket
                </h2>

                {error && (
                  <div className="rounded-md bg-red-50 p-4 mb-4">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Select Schedule
                    </label>
                    <select
                      value={selectedSchedule}
                      onChange={(e) => setSelectedSchedule(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="">Select a schedule</option>
                      {schedules.map((schedule) => (
                        <option key={schedule.id} value={schedule.id}>
                          {schedule.route.name} -{" "}
                          {new Date(schedule.departureTime).toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedScheduleData && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-lg font-medium text-gray-900">
                        Schedule Details
                      </h3>
                      <dl className="mt-2 space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Route
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {selectedScheduleData.route.name}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Departure
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {new Date(
                              selectedScheduleData.departureTime
                            ).toLocaleString()}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Price
                          </dt>
                          <dd className="text-sm text-gray-900">
                            ${selectedScheduleData.price}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  )}

                  {selectedSchedule && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Select Seat
                      </label>
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {Array.from({ length: 40 }, (_, i) => i + 1).map(
                          (seat) => (
                            <button
                              key={seat}
                              type="button"
                              onClick={() => setSelectedSeat(seat)}
                              disabled={!availableSeats.includes(seat)}
                              className={`p-2 text-sm rounded-md ${
                                selectedSeat === seat
                                  ? "bg-indigo-600 text-white"
                                  : availableSeats.includes(seat)
                                  ? "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
                                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              {seat}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading || !selectedSchedule || !selectedSeat}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? "Processing..." : "Book Ticket"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTicket;
