const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/User')

// Home
router.get('/', (req, res) => {
  res.render('index', { user: req.user })
})

// signup
router.get('/signup', (req, res) => res.render('signup'))
router.post('/signup', async (req, res, next) => {
  try {
    const { username, password } = req.body
    const existing = await User.findOne({ username })
    if (existing) return res.status(400).render('signup', { error: 'Username already taken' })
    const user = new User({ username, password })
    await user.save()
    req.login(user, (err) => {
      if (err) return next(err)
      res.redirect('/tasks')
    })
  } catch (err) {
    next(err)
  }
})

// login
router.get('/login', (req, res) => res.render('login'))
router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/tasks')
})

// logout
router.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err)
    res.redirect('/')
  })
})

module.exports = router