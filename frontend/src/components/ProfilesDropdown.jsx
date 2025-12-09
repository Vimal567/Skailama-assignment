import React, { useState } from "react";

export default function ProfilesDropdown({
  profiles,
  selectedProfiles,
  setSelectedProfiles,
  onAddProfile,
  isAdmin = false,
}) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggleSelect = (id) => {
    setSelectedProfiles((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredProfiles = profiles.filter((p) =>
    p.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSubmit = () => {
    setOpen(false);
    onAddProfile(searchValue);
  };

  const selectedLabel =
    selectedProfiles.length === 0
      ? "Select Profiles..."
      : `${selectedProfiles.length} profiles selected`;

  return (
    <div className="pd-container">
      <div className="pd-selector" onClick={() => setOpen(!open)}>
        <span>{selectedLabel}</span>
        <span className="pd-caret">▾</span>
      </div>

      {open && (
        <div className="pd-menu">
          <input
            type="text"
            placeholder="Search profiles..."
            className="pd-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          {/* Profile list */}
          <div className="pd-list">
            {filteredProfiles.map((p) => (
              <div
                key={p._id}
                className="pd-item"
                onClick={() => toggleSelect(p._id)}
              >
                <input
                  type="checkbox"
                  checked={selectedProfiles.includes(p._id)}
                  readOnly
                />
                <span>{p.name}</span>
              </div>
            ))}
          </div>

          {isAdmin ?? (
            <div className="pd-add" onClick={handleSubmit}>
              + Add Profile
            </div>
          )}
        </div>
      )}
    </div>
  );
}
