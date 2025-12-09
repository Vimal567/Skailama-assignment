import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezonePlugin from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezonePlugin);

export default function EditEventModal({
  event,
  apiBase,
  timezoneView,
  onClose,
  onUpdated,
}) {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("09:00");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!event) return;
    const s = dayjs.utc(event.startUTC).tz(timezoneView);
    const e = dayjs.utc(event.endUTC).tz(timezoneView);
    setStartDate(s.format("YYYY-MM-DD"));
    setStartTime(s.format("HH:mm"));
    setEndDate(e.format("YYYY-MM-DD"));
    setEndTime(e.format("HH:mm"));
  }, [event, timezoneView]);

  const submit = async () => {
    setSubmitting(true);
    try {
      const startLocal = `${startDate}T${startTime}`;
      const endLocal = `${endDate}T${endTime}`;
      const startUTC = dayjs.tz(startLocal, timezoneView).utc().format();
      const endUTC = dayjs.tz(endLocal, timezoneView).utc().format();

      await fetch(`${apiBase}/api/events/${event._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startUTC, endUTC, changedBy: "frontend-user" }),
      }).then((r) => r.json());

      if (onUpdated) await onUpdated();
    } catch (err) {
      console.error("update failed", err);
      alert("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!event) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <h4>Edit Event</h4>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <label className="field-label">Profiles</label>
          <div className="readonly-field">
            {event.profiles.map((p) => p.name).join(", ")}
          </div>

          <label className="field-label">Timezone</label>
          <div className="readonly-field">
            {event.eventTimezone || timezoneView}
          </div>

          <label className="field-label">Start Date & Time</label>
          <div className="row">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <label className="field-label">End Date & Time</label>
          <div className="row">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn primary"
            onClick={submit}
            disabled={submitting}
          >
            {submitting ? "Updating..." : "Update Event"}
          </button>
        </div>
      </div>
    </div>
  );
}
