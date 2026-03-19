const prisma = require('../config/db')

exports.getShoppingItems = async (req, res, next) => {
  try {
    const items = await prisma.shoppingItem.findMany({
      where: { userId: req.userId },
      include: { recipe: true },
      orderBy: { addedAt: 'desc' }
    })
    res.json(items)
  } catch (err) { next(err) }
}

exports.createShoppingItem = async (req, res, next) => {
  try {
    const { name, category, qty, unit, price, note, store } = req.body
    if (!name) return res.status(400).json({ message: 'Name is required' })
    const item = await prisma.shoppingItem.create({
      data: {
        name,
        category: category || 'other',
        qty: parseFloat(qty || 1),
        unit: unit || 'шт',
        price: price ? parseFloat(price) : null,
        note: note || null,
        store: store || null,
        userId: req.userId
      }
    })
    res.status(201).json(item)
  } catch (err) { next(err) }
}

exports.updateShoppingItem = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = { ...req.body }
    if (data.qty !== undefined) data.qty = parseFloat(data.qty)
    if (data.price !== undefined) data.price = data.price ? parseFloat(data.price) : null
    delete data.userId

    const result = await prisma.shoppingItem.updateMany({ where: { id, userId: req.userId }, data })
    if (result.count === 0) return res.status(404).json({ message: 'Item not found' })
    const updated = await prisma.shoppingItem.findUnique({ where: { id } })
    res.json(updated)
  } catch (err) { next(err) }
}

exports.toggleShoppingItem = async (req, res, next) => {
  try {
    const { id } = req.params
    const item = await prisma.shoppingItem.findFirst({ where: { id, userId: req.userId } })
    if (!item) return res.status(404).json({ message: 'Item not found' })
    const updated = await prisma.shoppingItem.update({ where: { id }, data: { checked: !item.checked } })
    res.json(updated)
  } catch (err) { next(err) }
}

exports.deleteShoppingItem = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await prisma.shoppingItem.deleteMany({ where: { id, userId: req.userId } })
    if (result.count === 0) return res.status(404).json({ message: 'Item not found' })
    res.status(204).send()
  } catch (err) { next(err) }
}

exports.getRecipes = async (req, res, next) => {
  try {
    const recipes = await prisma.recipe.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    })
    res.json(recipes)
  } catch (err) { next(err) }
}

exports.createRecipe = async (req, res, next) => {
  try {
    const { name, description, servings, ingredients } = req.body
    if (!name) return res.status(400).json({ message: 'Name is required' })
    const recipe = await prisma.recipe.create({
      data: {
        name,
        description: description || null,
        servings: parseInt(servings || 2),
        ingredients: ingredients || [],
        userId: req.userId
      }
    })
    res.status(201).json(recipe)
  } catch (err) { next(err) }
}

exports.generateShoppingFromRecipe = async (req, res, next) => {
  try {
    const { id } = req.params
    const recipe = await prisma.recipe.findFirst({ where: { id, userId: req.userId } })
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' })

    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : []
    const items = await prisma.$transaction(
      ingredients.map((ing) =>
        prisma.shoppingItem.create({
          data: {
            name: ing.name,
            category: ing.category || 'other',
            qty: parseFloat(ing.qty) || 1,
            unit: ing.unit || 'шт',
            recipeId: id,
            userId: req.userId
          }
        })
      )
    )
    res.status(201).json(items)
  } catch (err) { next(err) }
}

exports.deleteRecipe = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await prisma.recipe.deleteMany({ where: { id, userId: req.userId } })
    if (result.count === 0) return res.status(404).json({ message: 'Recipe not found' })
    res.status(204).send()
  } catch (err) { next(err) }
}
