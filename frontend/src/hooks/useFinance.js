import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import useUiStore from '@/store/uiStore'

const addToast = useUiStore.getState().addToast

export function useTransactions(year, month) {
  return useQuery({
    queryKey: ['transactions', year, month],
    queryFn: () =>
      api
        .get('/transactions', { params: { year, month } })
        .then((r) => r.data)
  })
}

export function useCreateTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/transactions', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      addToast({ type: 'success', message: 'Транзакция добавлена' })
    },
    onError: () => addToast({ type: 'error', message: 'Ошибка при добавлении' })
  })
}

export function useUpdateTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => api.patch(`/transactions/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
    onError: () => addToast({ type: 'error', message: 'Ошибка при обновлении' })
  })
}

export function useDeleteTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/transactions/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      addToast({ type: 'success', message: 'Транзакция удалена' })
    },
    onError: () => addToast({ type: 'error', message: 'Ошибка при удалении' })
  })
}

export function useBudgetCategories() {
  return useQuery({
    queryKey: ['budgetCategories'],
    queryFn: () => api.get('/budget-categories').then((r) => r.data)
  })
}

export function useCreateBudgetCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/budget-categories', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['budgetCategories'] })
      addToast({ type: 'success', message: 'Категория добавлена' })
    },
    onError: () => addToast({ type: 'error', message: 'Ошибка при добавлении' })
  })
}

export function useDeleteBudgetCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/budget-categories/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['budgetCategories'] })
      addToast({ type: 'success', message: 'Категория удалена' })
    },
    onError: () => addToast({ type: 'error', message: 'Ошибка при удалении' })
  })
}
