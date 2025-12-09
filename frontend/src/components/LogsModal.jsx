import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezonePlugin from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezonePlugin);

export default function LogsModal({
  eventId,
  apiBase,
  timezoneView,
  logs = [],
  loading,
  onClose,
}) {
  const formatTime = (utc) =>
    dayjs.utc(utc).tz(timezoneView).format("MMM D, YYYY hh:mm A");

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card wide">
        <div className="modal-header">
          <h4>Event Update History</h4>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {loading && <div className="muted">Loading...</div>}

          {!loading && (!logs || logs.length === 0) && (
            <div className="empty-state">No update history yet</div>
          )}

          {!loading && logs && logs.length > 0 && (
            <div className="logs-list">
              {logs.map((l) => (
                <div key={l._id || l.timestampUTC} className="log-item">
                  <div className="log-time">{formatTime(l.timestampUTC)}</div>
                  <div className="log-content">
                    {/* Try to produce friendly message */}
                    {renderLogSummary(l)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* Helper to render a simple summary from log object */
function renderLogSummary(log) {
  const parts = [];
  if (log.prev && log.next) {
    // profiles change
    if (Array.isArray(log.prev.profiles) || Array.isArray(log.next.profiles)) {
      const prevNames = (log.prev.profiles || [])
        .map((p) => (p.name ? p.name : p))
        .join(", ");
      const nextNames = (log.next.profiles || [])
        .map((p) => (p.name ? p.name : p))
        .join(", ");
      if (prevNames !== nextNames)
        parts.push(
          `Profiles changed: ${prevNames || "(none)"} → ${
            nextNames || "(none)"
          }`
        );
    }
    // timezone change
    if (log.prev.eventTimezone !== log.next.eventTimezone) {
      parts.push(
        `Timezone changed: ${log.prev.eventTimezone || "(none)"} → ${
          log.next.eventTimezone || "(none)"
        }`
      );
    }
    // start/end change
    if (String(log.prev.startUTC) !== String(log.next.startUTC)) {
      parts.push(`Start updated`);
    }
    if (String(log.prev.endUTC) !== String(log.next.endUTC)) {
      parts.push(`End date/time updated`);
    }
  } else if (log.next) {
    parts.push("Updated");
  } else {
    parts.push("Change recorded");
  }

  return parts.map((p, i) => <div key={i}>{p}</div>);
}
