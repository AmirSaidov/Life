const prisma = require('../config/db')

exports.getTransactions = async (req, res, next) => {
  try {
    const { year, month } = req.query
    let where = { userId: req.userId }

    if (year && month) {
      const start = new Date(parseInt(year), parseInt(month) - 1, 1)
      const end = new Date(parseInt(year), parseInt(month), 1)
      where.date = { gte: start, lt: end }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: { budgetCategory: true },
      orderBy: { date: 'desc' }
    })
    res.json(transactions)
  } catch (err) { next(err) }
}

exports.createTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, date, note, recurring, budgetCategoryId } = req.body
    if (!title || !amount || !type || !date) {
      return res.status(400).json({ message: 'title, amount, type, date are required' })
    }
    const transaction = await prisma.transaction.create({
      data: {
        title,
        amount: parseFloat(amount),
        type,
        date: new Date(date),
        note: note || null,
        recurring: recurring || false,
        budgetCategoryId: budgetCategoryId || null,
        userId: req.userId
      },
      include: { budgetCategory: true }
    })
    res.status(201).json(transaction)
  } catch (err) { next(err) }
}

exports.updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = { ...req.body }
    if (data.date) data.date = new Date(data.date)
    if (data.amount) data.amount = parseFloat(data.amount)
    delete data.userId

    const result = await prisma.transaction.updateMany({ where: { id, userId: req.userId }, data })
    if (result.count === 0) return res.status(404).json({ message: 'Transaction not found' })
    const updated = await prisma.transaction.findUnique({ where: { id }, include: { budgetCategory: true } })
    res.json(updated)
  } catch (err) { next(err) }
}

exports.deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await prisma.transaction.deleteMany({ where: { id, userId: req.userId } })
    if (result.count === 0) return res.status(404).json({ message: 'Transaction not found' })
    res.status(204).send()
  } catch (err) { next(err) }
}

exports.getBudgetCategories = async (req, res, next) => {
  try {
    const categories = await prisma.budgetCategory.findMany({
      where: { userId: req.userId },
      orderBy: { name: 'asc' }
    })
    res.json(categories)
  } catch (err) { next(err) }
}

exports.createBudgetCategory = async (req, res, next) => {
  try {
    const { name, icon, color, limit, period, type } = req.body
    if (!name) return res.status(400).json({ message: 'Name is required' })
    const category = await prisma.budgetCategory.create({
      data: {
        name,
        icon: icon || 'circle',
        color: color || '#00D4AA',
        limit: parseFloat(limit || 0),
        period: period || 'monthly',
        type: type || 'expense',
        userId: req.userId
      }
    })
    res.status(201).json(category)
  } catch (err) { next(err) }
}

exports.updateBudgetCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = { ...req.body }
    if (data.limit !== undefined) data.limit = parseFloat(data.limit)
    delete data.userId

    const result = await prisma.budgetCategory.updateMany({ where: { id, userId: req.userId }, data })
    if (result.count === 0) return res.status(404).json({ message: 'Category not found' })
    const updated = await prisma.budgetCategory.findUnique({ where: { id } })
    res.json(updated)
  } catch (err) { next(err) }
}

exports.deleteBudgetCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await prisma.budgetCategory.deleteMany({ where: { id, userId: req.userId } })
    if (result.count === 0) return res.status(404).json({ message: 'Category not found' })
    res.status(204).send()
  } catch (err) { next(err) }
}
