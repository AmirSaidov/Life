import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import useUiStore from '@/store/uiStore'

const addToast = useUiStore.getState().addToast

export function useTasks(filter = 'all') {
  return useQuery({
    queryKey: ['tasks', filter],
    queryFn: () => api.get(`/tasks?filter=${filter}`).then((r) => r.data)
  })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/tasks', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      addToast({ type: 'success', message: 'Задача добавлена' })
    },
    onError: () => addToast({ type: 'error', message: 'Ошибка при добавлении задачи' })
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => api.patch(`/tasks/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: () => addToast({ type: 'error', message: 'Ошибка при обновлении задачи' })
  })
}

export function useToggleTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.patch(`/tasks/${id}/toggle`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
    }
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      addToast({ type: 'success', message: 'Задача удалена' })
    },
    onError: () => addToast({ type: 'error', message: 'Ошибка при удалении' })
  })
}
