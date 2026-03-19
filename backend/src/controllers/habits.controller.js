const prisma = require('../config/db')

exports.getHabits = async (req, res, next) => {
  try {
    const habits = await prisma.habit.findMany({
      where: { userId: req.userId },
      include: {
        logs: {
          orderBy: { date: 'desc' },
          take: 365
        }
      },
      orderBy: { createdAt: 'asc' }
    })
    res.json(habits)
  } catch (err) { next(err) }
}

exports.createHabit = async (req, res, next) => {
  try {
    const { name, description, icon, color, targetDays, reminderTime, goal } = req.body
    if (!name) return res.status(400).json({ message: 'Name is required' })

    const habit = await prisma.habit.create({
      data: {
        name,
        description: description || null,
        icon: icon || 'zap',
        color: color || '#00D4AA',
        targetDays: targetDays || [0, 1, 2, 3, 4, 5, 6],
        reminderTime: reminderTime || null,
        goal: goal || 30,
        userId: req.userId
      },
      include: { logs: true }
    })
    res.status(201).json(habit)
  } catch (err) { next(err) }
}

exports.updateHabit = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = { ...req.body }
    delete data.userId

    const result = await prisma.habit.updateMany({
      where: { id, userId: req.userId },
      data
    })
    if (result.count === 0) return res.status(404).json({ message: 'Habit not found' })
    const updated = await prisma.habit.findUnique({ where: { id }, include: { logs: true } })
    res.json(updated)
  } catch (err) { next(err) }
}

exports.deleteHabit = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await prisma.habit.deleteMany({ where: { id, userId: req.userId } })
    if (result.count === 0) return res.status(404).json({ message: 'Habit not found' })
    res.status(204).send()
  } catch (err) { next(err) }
}

exports.logHabit = async (req, res, next) => {
  try {
    const { id } = req.params
    const habit = await prisma.habit.findFirst({ where: { id, userId: req.userId } })
    if (!habit) return res.status(404).json({ message: 'Habit not found' })

    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    await prisma.habitLog.upsert({
      where: { habitId_date: { habitId: id, date: today } },
      create: { habitId: id, date: today },
      update: {}
    })

    const logs = await prisma.habitLog.findMany({
      where: { habitId: id },
      orderBy: { date: 'desc' }
    })

    let streak = 0
    let cursor = new Date()
    cursor.setUTCHours(0, 0, 0, 0)

    for (const log of logs) {
      const logDate = new Date(log.date)
      logDate.setUTCHours(0, 0, 0, 0)
      const diff = Math.round((cursor.getTime() - logDate.getTime()) / 86400000)
      if (diff <= 1) {
        streak++
        cursor = logDate
      } else {
        break
      }
    }

    const maxStreak = Math.max(habit.maxStreak, streak)
    const updated = await prisma.habit.update({
      where: { id },
      data: { streak, maxStreak },
      include: { logs: { orderBy: { date: 'desc' }, take: 365 } }
    })
    res.json(updated)
  } catch (err) { next(err) }
}

exports.unlogHabit = async (req, res, next) => {
  try {
    const { id } = req.params
    const habit = await prisma.habit.findFirst({ where: { id, userId: req.userId } })
    if (!habit) return res.status(404).json({ message: 'Habit not found' })

    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    await prisma.habitLog.deleteMany({ where: { habitId: id, date: today } })

    const updated = await prisma.habit.update({
      where: { id },
      data: { streak: Math.max(0, habit.streak - 1) },
      include: { logs: { orderBy: { date: 'desc' }, take: 365 } }
    })
    res.json(updated)
  } catch (err) { next(err) }
}

exports.getHabitLogs = async (req, res, next) => {
  try {
    const { id } = req.params
    const { year, month } = req.query

    const habit = await prisma.habit.findFirst({ where: { id, userId: req.userId } })
    if (!habit) return res.status(404).json({ message: 'Habit not found' })

    let where = { habitId: id }
    if (year && month) {
      const start = new Date(parseInt(year), parseInt(month) - 1, 1)
      const end = new Date(parseInt(year), parseInt(month), 1)
      where.date = { gte: start, lt: end }
    }

    const logs = await prisma.habitLog.findMany({ where, orderBy: { date: 'asc' } })
    res.json(logs)
  } catch (err) { next(err) }
}
