import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Waves, Home } from 'lucide-react'
import Button from '@/components/UI/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center">
            <Waves size={36} className="text-muted" />
          </div>
        </div>
        <div>
          <h1 className="text-6xl font-black font-display text-white">404</h1>
          <p className="text-muted mt-2">Страница не найдена</p>
        </div>
        <Link to="/">
          <Button>
            <Home size={16} /> На главную
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
