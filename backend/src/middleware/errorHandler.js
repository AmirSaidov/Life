module.exports = (err, req, res, next) => {
  console.error(err)

  if (err.name === 'ZodError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
    })
  }

  const status = err.status || 500
  const message = err.message || 'Internal Server Error'
  res.status(status).json({ message })
}
