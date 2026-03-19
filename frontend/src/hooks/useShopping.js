import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import useUiStore from '@/store/uiStore'

const addToast = useUiStore.getState().addToast

export function useShoppingItems() {
  return useQuery({
    queryKey: ['shopping'],
    queryFn: () => api.get('/shopping').then((r) => r.data)
  })
}

export function useCreateShoppingItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/shopping', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shopping'] })
      addToast({ type: 'success', message: 'Товар добавлен' })
    },
    onError: () => addToast({ type: 'error', message: 'Ошибка при добавлении' })
  })
}

export function useToggleShoppingItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.patch(`/shopping/${id}/toggle`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['shopping'] })
  })
}

export function useDeleteShoppingItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/shopping/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shopping'] })
      addToast({ type: 'success', message: 'Товар удалён' })
    },
    onError: () => addToast({ type: 'error', message: 'Ошибка при удалении' })
  })
}

export function useRecipes() {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: () => api.get('/recipes').then((r) => r.data)
  })
}

export function useCreateRecipe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/recipes', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recipes'] })
      addToast({ type: 'success', message: 'Рецепт сохранён' })
    },
    onError: () => addToast({ type: 'error', message: 'Ошибка при сохранении' })
  })
}

export function useGenerateShoppingFromRecipe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.post(`/recipes/${id}/generate`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shopping'] })
      addToast({ type: 'success', message: 'Ингредиенты добавлены в список' })
    },
    onError: () => addToast({ type: 'error', message: 'Ошибка при генерации списка' })
  })
}

export function useDeleteRecipe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/recipes/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recipes'] })
      addToast({ type: 'success', message: 'Рецепт удалён' })
    },
    onError: () => addToast({ type: 'error', message: 'Ошибка при удалении' })
  })
}
