const router = require('express').Router()
const auth = require('../middleware/auth')
const c = require('../controllers/habits.controller')

router.use(auth)
router.get('/', c.getHabits)
router.post('/', c.createHabit)
router.patch('/:id', c.updateHabit)
router.delete('/:id', c.deleteHabit)
router.post('/:id/log', c.logHabit)
router.delete('/:id/log', c.unlogHabit)
router.get('/:id/logs', c.getHabitLogs)

module.exports = router
