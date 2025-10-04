require('dotenv').config()
const express = require('express')
const path = require('path')
const helmet = require('helmet')
const morgan = require('morgan')
const sessionConfig = require('./configs/session.config')
const passportConfig = require('./configs/passport')
const connectToMongoose = require('./database')
const logger = require('./logger')
const authRoutes = require('./routes/auth.routes')
const tasksRoutes = require('./routes/tasks.routes')
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware')

const app = express()
const PORT = process.env.PORT || 8080

// connect to DB
connectToMongoose()

// view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// middlewares
app.use(helmet())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(morgan('combined', { stream: logger.stream }))
app.use(sessionConfig)

// passport
passportConfig(app)

app.use((req, res, next) => {
  res.locals.user = req.user || null
  next()
})

// routes
app.use('/', authRoutes)
app.use('/tasks', tasksRoutes)

// 404 handler
app.use(notFoundHandler)

// global error handler
app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`Server started on http://localhost:${PORT}`)})