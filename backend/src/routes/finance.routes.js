const router = require('express').Router()
const auth = require('../middleware/auth')
const c = require('../controllers/finance.controller')

router.use(auth)
router.get('/transactions', c.getTransactions)
router.post('/transactions', c.createTransaction)
router.patch('/transactions/:id', c.updateTransaction)
router.delete('/transactions/:id', c.deleteTransaction)

router.get('/budget-categories', c.getBudgetCategories)
router.post('/budget-categories', c.createBudgetCategory)
router.patch('/budget-categories/:id', c.updateBudgetCategory)
router.delete('/budget-categories/:id', c.deleteBudgetCategory)

module.exports = router
