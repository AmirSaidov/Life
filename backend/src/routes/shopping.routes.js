const router = require('express').Router()
const auth = require('../middleware/auth')
const c = require('../controllers/shopping.controller')

router.use(auth)
router.get('/shopping', c.getShoppingItems)
router.post('/shopping', c.createShoppingItem)
router.patch('/shopping/:id/toggle', c.toggleShoppingItem)
router.patch('/shopping/:id', c.updateShoppingItem)
router.delete('/shopping/:id', c.deleteShoppingItem)

router.get('/recipes', c.getRecipes)
router.post('/recipes', c.createRecipe)
router.post('/recipes/:id/generate', c.generateShoppingFromRecipe)
router.delete('/recipes/:id', c.deleteRecipe)

module.exports = router
