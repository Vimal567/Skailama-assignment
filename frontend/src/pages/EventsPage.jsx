import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import CreateEvent from "../components/CreateEvent";
import EventList from "../components/EventList";

const API = "http://localhost:4000";

export default function EventsPage() {
  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const setProfiles = useStore((s) => s.setProfiles);
  const setEvents = useStore((s) => s.setEvents);
  const timezone = useStore((s) => s.timezone);
  const setTimezone = useStore((s) => s.setTimezone);

  const fetchEvents = async () => {
    const p = await fetch(`${API}/api/profiles`).then((r) => r.json());
    setProfiles(p);
    const e = await fetch(`${API}/api/events`).then((r) => r.json());
    setEvents(e);
    setLoading(false);
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <h2>Loading please wait...</h2>
      </div>
    );
  }

  return (
    <div className="page container">
      <div className="action-container">
        <button className="btn warning" onClick={() => navigate("/")}>
          Logout
        </button>
      </div>
      <header className="topbar">
        <h2>Event Management</h2>
        <div className="time-zone-container">
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </option>
            <option value="UTC">UTC</option>
            <option value="Asia/Kolkata">India (IST)</option>
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="Europe/London">Europe/London</option>
          </select>
        </div>
      </header>

      <div className="event-grid">
        <aside>
          <CreateEvent apiBase={API} fetchEvents={fetchEvents} />
        </aside>
          <EventList apiBase={API} />
      </div>
    </div>
  );
}
