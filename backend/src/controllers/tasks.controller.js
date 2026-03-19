const prisma = require('../config/db')

exports.getTasks = async (req, res, next) => {
  try {
    const { filter } = req.query
    let where = { userId: req.userId, done: false }

    if (filter === 'today') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      where.dueDate = { gte: today, lt: tomorrow }
      where.done = false
    } else if (filter === 'urgent') {
      where.priority = { in: ['high', 'urgent'] }
      where.done = false
    } else if (filter === 'done') {
      where.done = true
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    })
    res.json(tasks)
  } catch (err) { next(err) }
}

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, category, priority, dueDate, recurring } = req.body
    if (!title) return res.status(400).json({ message: 'Title is required' })

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        category: category || 'general',
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        recurring: recurring || null,
        userId: req.userId
      }
    })
    res.status(201).json(task)
  } catch (err) { next(err) }
}

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = { ...req.body }
    if (data.dueDate) data.dueDate = new Date(data.dueDate)
    delete data.userId

    const result = await prisma.task.updateMany({
      where: { id, userId: req.userId },
      data
    })
    if (result.count === 0) return res.status(404).json({ message: 'Task not found' })
    const updated = await prisma.task.findUnique({ where: { id } })
    res.json(updated)
  } catch (err) { next(err) }
}

exports.toggleTask = async (req, res, next) => {
  try {
    const { id } = req.params
    const task = await prisma.task.findFirst({ where: { id, userId: req.userId } })
    if (!task) return res.status(404).json({ message: 'Task not found' })

    const updated = await prisma.task.update({
      where: { id },
      data: {
        done: !task.done,
        completedAt: !task.done ? new Date() : null
      }
    })
    res.json(updated)
  } catch (err) { next(err) }
}

exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await prisma.task.deleteMany({ where: { id, userId: req.userId } })
    if (result.count === 0) return res.status(404).json({ message: 'Task not found' })
    res.status(204).send()
  } catch (err) { next(err) }
}
