import Modal from './Modal'
import Button from './Button'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Подтверждение',
  message = 'Вы уверены? Это действие нельзя отменить.',
  confirmLabel = 'Удалить',
  loading = false
}) {
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-danger/10 flex items-center justify-center">
          <AlertTriangle size={24} className="text-danger" />
        </div>
        <div>
          <p className="text-white font-semibold font-display">{title}</p>
          <p className="text-muted text-sm mt-1">{message}</p>
        </div>
        <div className="flex gap-3 w-full">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
            Отмена
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
