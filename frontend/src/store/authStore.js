import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      setUser: (user) => set({ user })
    }),
    {
      name: 'lifeflow-auth',
      partialize: (state) => ({ token: state.token, user: state.user })
    }
  )
)

export default useAuthStore
