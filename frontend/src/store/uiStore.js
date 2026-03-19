import { create } from 'zustand'

const useUiStore = create((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  notifications: [
    { id: 'welcome', title: 'Добро пожаловать!', text: 'Проверьте задачи на сегодня.', isNew: true }
  ],
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) =>
    set((s) => ({
      notifications: [{ id: Date.now() + Math.random(), isNew: true, ...notification }, ...s.notifications]
    })),
  markNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isNew: false }))
    })),
  toasts: [],
  addToast: (toast) =>
    set((s) => ({
      toasts: [...s.toasts, { id: Date.now() + Math.random(), ...toast }]
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
}))

export default useUiStore
