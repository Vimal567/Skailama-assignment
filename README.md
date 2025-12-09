# Event Management System

A full-stack Event Management application built using the **MERN stack** where an admin or user can create, update, and view events across multiple timezones.  
The UI is clean, minimal, and closely matches the assignment reference design.

---

## 🚀 Tech Stack

### **Frontend**
- React
- Zustand (state management)
- Day.js with UTC + Timezone plugins

### **Backend**
- Node.js + Express.js
- MongoDB

### **Timezone Handling**
- Day.js `utc` and `timezone` plugins  
- All events stored in **UTC** in DB  
- Rendered in whichever timezone the user selects in UI

---

### Profiles
- Create user profiles (no delete required)
- Add profiles directly from the *Create Event* dropdown
- Multi-select searchable profile picker

### Event Creation
- Create events for one or multiple profiles
- Select event timezone
- Start & End date/time pickers
- Validation:
  - End cannot be earlier than start
  - Timezone-based date conversion handled automatically

### Event Viewing
- Display all events assigned to selected profiles
- View events in any timezone
- Beautiful card-style layout

### Event Updating
- Edit event in a modal dialog (matches reference UI)
- Update start/end date, time, and profiles
- Automatic timezone conversion & validation

### Event Logs
- Every update creates a log entry  
- Logs include:
  - What changed (profiles, start/end time, timezone)
  - Previous vs new values
  - Timestamp in user’s selected timezone  
- Shown in a dedicated **Update History Modal**

---

## 📁 Project Structure

