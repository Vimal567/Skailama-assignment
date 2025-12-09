import React, { useState } from "react";
import { useStore } from "../store/useStore";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import EditEventModal from "./EditEventModal";
import LogsModal from "./LogsModal";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function EventList({ apiBase }) {
  
  const events = useStore((s) => s.events);
  const timezoneView = useStore((s) => s.timezone);
  const setEvents = useStore((s) => s.setEvents);

  const [editingEvent, setEditingEvent] = useState(null);
  const [logsEventId, setLogsEventId] = useState(null);
  const [logsData, setLogsData] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const formatForView = (utcDate) => {
    return dayjs.utc(utcDate).tz(timezoneView).format("MMM D, YYYY, hh:mm A");
  };

  const openLogs = async (eventId) => {
    setLogsEventId(eventId);
    setLoadingLogs(true);
    try {
      const l = await fetch(`${apiBase}/api/events/${eventId}/logs`).then((r) =>
        r.json()
      );
      setLogsData(l || []);
    } catch (err) {
      console.error("Failed to fetch logs", err);
      setLogsData([]);
    } finally {
      setLoadingLogs(false);
    }
  };

  return (
    <div>
      {(!events || events.length === 0) && <p>No events found</p>}
      <div className="event-list">
        {events.map((ev) => (
          <div key={ev._id} className="card event-item">
            <div className="event-main">
              <strong className="event-title">
                {ev.profiles.map((p) => p.name).join(", ")}
              </strong>
              <div className="event-times">
                <div>
                  <span className="muted">Start:</span>{" "}
                  {formatForView(ev.startUTC)}
                </div>
                <div>
                  <span className="muted">End:</span> {formatForView(ev.endUTC)}
                </div>
                <div className="meta">
                  <small className="muted">
                    Created:{" "}
                    {formatForView(
                      ev.createdAtUTC || ev.createdAt || ev.startUTC
                    )}
                  </small>
                </div>
              </div>
            </div>

            <div className="actions">
              <button className="btn" onClick={() => setEditingEvent(ev)}>
                Edit
              </button>
              <button
                className="btn"
                onClick={() => {
                  openLogs(ev._id);
                }}
              >
                View Logs
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          apiBase={apiBase}
          timezoneView={timezoneView}
          onClose={() => setEditingEvent(null)}
          onUpdated={async () => {
            const all = await fetch(`${apiBase}/api/events`).then((r) =>
              r.json()
            );
            setEvents(all);
            setEditingEvent(null);
          }}
        />
      )}

      {logsEventId !== null && (
        <LogsModal
          eventId={logsEventId}
          apiBase={apiBase}
          timezoneView={timezoneView}
          logs={logsData}
          loading={loadingLogs}
          onClose={() => {
            setLogsEventId(null);
            setLogsData([]);
          }}
        />
      )}
    </div>
  );
}
