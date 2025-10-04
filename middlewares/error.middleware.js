const logger = require('../logger')

exports.notFoundHandler = (req, res, next) => {
  res.status(404)
  if (req.accepts('html')) return res.render('404')
  if (req.accepts('json')) return res.json({ error: 'Not found' })
  res.type('txt').send('Not found')
}

exports.errorHandler = (err, req, res, next) => {
  logger.error(err.stack || err.message || err)
  const status = err.status || 500
  res.status(status)
  
  if (req.accepts('html')) {
    return res.render('error', { 
      error: err, 
      user: req.user || null   // <-- fix here
    })
  }

  if (req.accepts('json')) return res.json({ error: err.message })
  
  res.type('txt').send(err.message)
}