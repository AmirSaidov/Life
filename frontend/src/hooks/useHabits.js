import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import useUiStore from '@/store/uiStore'

const addToast = useUiStore.getState().addToast

export function useHabits() {
  return useQuery({
    queryKey: ['habits'],
    queryFn: () => api.get('/habits').then((r) => r.data)
  })
}

export function useCreateHabit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/habits', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['habits'] })
      addToast({ type: 'success', message: 'Привычка добавлена' })
    },
    onError: () => addToast({ type: 'error', message: 'Ошибка при добавлении' })
  })
}

export function useUpdateHabit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => api.patch(`/habits/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['habits'] }),
    onError: () => addToast({ type: 'error', message: 'Ошибка при обновлении' })
  })
}

export function useDeleteHabit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/habits/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['habits'] })
      addToast({ type: 'success', message: 'Привычка удалена' })
    },
    onError: () => addToast({ type: 'error', message: 'Ошибка при удалении' })
  })
}

export function useLogHabit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.post(`/habits/${id}/log`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['habits'] })
  })
}

export function useUnlogHabit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/habits/${id}/log`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['habits'] })
  })
}
