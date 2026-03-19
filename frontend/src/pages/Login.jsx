import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigate, useNavigate } from 'react-router-dom'
import { Waves } from 'lucide-react'
import Button from '@/components/UI/Button'
import useAuthStore from '@/store/authStore'
import api from '@/lib/api'

export default function Login() {
  const { token, login } = useAuthStore()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email: '', name: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  if (token) return <Navigate to="/" replace />

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Введите корректный email'
    if (!form.password || form.password.length < 6) e.password = 'Минимум 6 символов'
    if (mode === 'register' && !form.name.trim()) e.name = 'Введите имя'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError('')
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { email: form.email, name: form.name.trim(), password: form.password }
      const res = await api.post(endpoint, payload)
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Ошибка сервера')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 left-1/4 w-80 h-80 rounded-full opacity-15 animate-blob" style={{ background: '#00D4AA', filter: 'blur(80px)' }} aria-hidden="true" />
      <div className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full opacity-10 animate-blob" style={{ background: '#7C3AED', filter: 'blur(80px)', animationDelay: '6s' }} aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-sm p-8 relative z-10"
      >
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center">
            <Waves size={24} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold font-display text-white">LifeFlow</h1>
          <p className="text-sm text-muted text-center">
            {mode === 'login' ? 'Войдите в аккаунт' : 'Создайте аккаунт'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {mode === 'register' && (
            <div>
              <input
                className="input-field"
                placeholder="Ваше имя"
                value={form.name}
                autoComplete="name"
                onChange={(e) => set('name', e.target.value)}
              />
              {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <input
              type="email"
              className="input-field"
              placeholder="Email"
              value={form.email}
              autoComplete="email"
              onChange={(e) => set('email', e.target.value)}
            />
            {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              className="input-field"
              placeholder="Пароль (мин. 6 символов)"
              value={form.password}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              onChange={(e) => set('password', e.target.value)}
            />
            {errors.password && <p className="text-danger text-xs mt-1">{errors.password}</p>}
          </div>

          {serverError && (
            <p className="text-danger text-sm text-center bg-danger/10 rounded-xl py-2 px-3">{serverError}</p>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
          <button
            type="button"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrors({}); setServerError('') }}
            className="text-accent hover:underline"
          >
            {mode === 'login' ? 'Регистрация' : 'Войти'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
