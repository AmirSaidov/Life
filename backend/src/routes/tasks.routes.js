const router = require('express').Router()
const auth = require('../middleware/auth')
const c = require('../controllers/tasks.controller')

router.use(auth)
router.get('/', c.getTasks)
router.post('/', c.createTask)
router.patch('/:id/toggle', c.toggleTask)
router.patch('/:id', c.updateTask)
router.delete('/:id', c.deleteTask)

module.exports = router
