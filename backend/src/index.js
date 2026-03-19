require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const errorHandler = require('./middleware/errorHandler')

const authRoutes = require('./routes/auth.routes')
const tasksRoutes = require('./routes/tasks.routes')
const habitsRoutes = require('./routes/habits.routes')
const financeRoutes = require('./routes/finance.routes')
const shoppingRoutes = require('./routes/shopping.routes')

const app = express()

app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/habits', habitsRoutes)
app.use('/api', financeRoutes)
app.use('/api', shoppingRoutes)

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
