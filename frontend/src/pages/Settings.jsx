import { useState } from 'react'
import { User, Bell, Globe, LogOut, Save } from 'lucide-react'
import Card from '@/components/UI/Card'
import Button from '@/components/UI/Button'
import useAuthStore from '@/store/authStore'
import { useToast } from '@/components/UI/Toast'
import api from '@/lib/api'
import { useNavigate } from 'react-router-dom'

const CURRENCIES = [
  { value: 'RUB', label: 'Российский рубль (₽)' },
  { value: 'USD', label: 'Доллар США ($)' },
  { value: 'EUR', label: 'Евро (€)' },
  { value: 'KZT', label: 'Казахстанский тенге (₸)' }
]

export default function Settings() {
  const user = useAuthStore((s) => s.user)
  const { login, logout } = useAuthStore()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: user?.name || '',
    currency: user?.currency || 'RUB'
  })
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await api.patch('/auth/me', form)
      login(useAuthStore.getState().token, res.data)
      toast.success('Настройки сохранены')
    } catch {
      toast.error('Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold font-display text-white">Настройки</h1>

      <Card>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <User size={18} className="text-accent" />
          </div>
          <p className="font-semibold font-display text-white">Профиль</p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted block mb-1.5">Имя</label>
            <input
              className="input-field"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1.5">Email</label>
            <input
              className="input-field opacity-50"
              value={user?.email || ''}
              disabled
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center">
            <Globe size={18} className="text-warning" />
          </div>
          <p className="font-semibold font-display text-white">Регион и валюта</p>
        </div>
        <div>
          <label className="text-xs text-muted block mb-1.5">Валюта</label>
          <select
            className="input-field"
            value={form.currency}
            onChange={(e) => set('currency', e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value} style={{ background: '#141720' }}>{c.label}</option>
            ))}
          </select>
        </div>
      </Card>

      <Button className="w-full" onClick={handleSave} loading={saving}>
        <Save size={15} /> Сохранить изменения
      </Button>

      <Card>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-danger hover:text-red-300 transition-colors text-sm w-full"
        >
          <LogOut size={16} />
          Выйти из аккаунта
        </button>
      </Card>
    </div>
  )
}
