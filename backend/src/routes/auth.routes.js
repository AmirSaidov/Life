const router = require('express').Router()
const auth = require('../middleware/auth')
const c = require('../controllers/auth.controller')

router.post('/register', c.register)
router.post('/login', c.login)
router.post('/logout', c.logout)
router.get('/me', auth, c.me)
router.patch('/me', auth, c.updateMe)

module.exports = router
