import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { journeyService, Journey, Location } from "../../services/journey";
import { ticketService, Ticket } from "../../services/ticket";

const JourneyTracking = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [path, setPath] = useState<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (ticketId) {
      fetchTicketAndJourney();
    }
  }, [ticketId]);

  useEffect(() => {
    if (journey?.id) {
      const unsubscribe = journeyService.subscribeToJourneyUpdates(
        journey.id,
        handleJourneyUpdate
      );
      return () => unsubscribe();
    }
  }, [journey?.id]);

  const fetchTicketAndJourney = async () => {
    try {
      setLoading(true);
      const ticketData = await ticketService.getTicket(ticketId!);
      setTicket(ticketData);
      const journeyData = await journeyService.getJourneyByTicket(ticketId!);
      setJourney(journeyData);
      initializeMap(journeyData);
      fetchJourneyHistory(journeyData.id);
    } catch (err) {
      setError("Failed to load journey details");
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = (journeyData: Journey) => {
    if (!journeyData.currentLocation) return;

    const mapOptions: google.maps.MapOptions = {
      center: {
        lat: journeyData.currentLocation.latitude,
        lng: journeyData.currentLocation.longitude,
      },
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    const newMap = new google.maps.Map(
      document.getElementById("map")!,
      mapOptions
    );
    setMap(newMap);

    const newMarker = new google.maps.Marker({
      position: {
        lat: journeyData.currentLocation.latitude,
        lng: journeyData.currentLocation.longitude,
      },
      map: newMap,
      title: "Bus Location",
    });
    setMarker(newMarker);
  };

  const fetchJourneyHistory = async (journeyId: string) => {
    try {
      const history = await journeyService.getJourneyHistory(journeyId);
      drawPath(history);
    } catch (err) {
      console.error("Failed to load journey history:", err);
    }
  };

  const drawPath = (locations: Location[]) => {
    if (!map) return;

    const pathCoordinates = locations.map((loc) => ({
      lat: loc.latitude,
      lng: loc.longitude,
    }));

    const newPath = new google.maps.Polyline({
      path: pathCoordinates,
      geodesic: true,
      strokeColor: "#4F46E5",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    newPath.setMap(map);
    setPath(newPath);
  };

  const handleJourneyUpdate = (updatedJourney: Journey) => {
    setJourney(updatedJourney);
    if (updatedJourney.currentLocation && marker && map) {
      const newPosition = {
        lat: updatedJourney.currentLocation.latitude,
        lng: updatedJourney.currentLocation.longitude,
      };
      marker.setPosition(newPosition);
      map.panTo(newPosition);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !journey || !ticket) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Error</h2>
          <p className="mt-2 text-gray-600">{error || "Journey not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Journey Tracking
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Real-time bus location and status
            </p>
          </div>

          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <div id="map" className="h-96 rounded-lg shadow-sm"></div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Journey Status
                    </h4>
                    <p
                      className={`mt-1 text-sm font-semibold ${
                        journey.status === "in_progress"
                          ? "text-green-600"
                          : journey.status === "delayed"
                          ? "text-yellow-600"
                          : journey.status === "cancelled"
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      {journey.status
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </p>
                  </div>

                  {journey.delay && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Delay
                      </h4>
                      <p className="mt-1 text-sm text-yellow-600">
                        {journey.delay} minutes
                      </p>
                    </div>
                  )}

                  {journey.estimatedArrivalTime && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Estimated Arrival
                      </h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(
                          journey.estimatedArrivalTime
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Ticket Information
                    </h4>
                    <dl className="mt-2 text-sm text-gray-900">
                      <div className="grid grid-cols-3 gap-4">
                        <dt>Ticket ID:</dt>
                        <dd className="col-span-2">{ticket.id}</dd>
                        <dt>Seat:</dt>
                        <dd className="col-span-2">{ticket.seatNumber}</dd>
                        <dt>Status:</dt>
                        <dd className="col-span-2">{ticket.status}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyTracking;
