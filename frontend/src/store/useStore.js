import create from 'zustand';

export const useStore = create((set) => ({
  userRole: null,
  currentProfileId: null,
  profiles: [],
  events: [],
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  setRole: (role) => set(() => ({ userRole: role })),
  setProfiles: (p) => set(() => ({ profiles: p })),
  setEvents: (events) => set(() => ({ events })),
  setTimezone: (tz) => set(() => ({ timezone: tz })),
  setCurrentProfileId: (id) => set(() => ({ currentProfileId: id }))
}));
