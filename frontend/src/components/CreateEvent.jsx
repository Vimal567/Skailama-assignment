import React, { useState } from "react";
import { useStore } from "../store/useStore";
import ProfilesDropdown from "./ProfilesDropdown";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export default function CreateEvent({ apiBase, fetchEvents, isAdmin= false }) {
  const profiles = useStore((s) => s.profiles);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [tz, setTz] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("09:00");

  const createProfile = async (searchValue) => {
    if (!searchValue.trim()) {
      return;
    }
    const result = await fetch(`${apiBase}/api/profiles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: searchValue }),
    }).then((r) => r.json());
    fetchEvents();
    if (result.name === searchValue) {
      setSelectedProfiles((prev) => [...prev, searchValue]);
    }
  };

  const submit = async () => {
    if (!startDate || !endDate || selectedProfiles.length === 0) {
      alert("select profiles & dates");
      return;
    }

    const startLocal = `${startDate}T${startTime}`;
    const endLocal = `${endDate}T${endTime}`;

    const startUTC = dayjs.tz(startLocal, tz).utc().format();
    const endUTC = dayjs.tz(endLocal, tz).utc().format();

    if (dayjs(startUTC).isAfter(dayjs(endUTC))) {
      alert("End must be after start");
      return;
    }

    const payload = {
      profiles: selectedProfiles,
      eventTimezone: tz,
      startUTC,
      endUTC,
    };

    await fetch(`${apiBase}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    fetchEvents();
    setSelectedProfiles([]);
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="ce-card">
      <h3 className="ce-title">Create Event</h3>

      {/* Profiles */}
      <label className="ce-label">Profiles</label>
      <ProfilesDropdown
        profiles={profiles}
        selectedProfiles={selectedProfiles}
        setSelectedProfiles={setSelectedProfiles}
        onAddProfile={(searchValue) => createProfile(searchValue)}
        isAdmin={isAdmin}
      />

      {/* Timezone */}
      <label className="ce-label">Timezone</label>
      <select
        value={tz}
        onChange={(e) => setTz(e.target.value)}
        className="ce-select"
      >
        <option value="Asia/Kolkata">India (IST)</option>
        <option value="America/New_York">Eastern Time (ET)</option>
        <option value="UTC">UTC</option>
        <option value="Europe/London">Europe/London</option>
      </select>

      {/* Start Date & Time */}
      <label className="ce-label">Start Date & Time</label>
      <div className="ce-row">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="ce-input"
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="ce-input"
        />
      </div>

      {/* End Date & Time */}
      <label className="ce-label">End Date & Time</label>
      <div className="ce-row">
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="ce-input"
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="ce-input"
        />
      </div>

      {/* Submit */}
      <button className="ce-btn primary" onClick={submit}>
        + Create Event
      </button>
    </div>
  );
}
