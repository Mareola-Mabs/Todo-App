const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports = function configurePassport(app) {
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username })
      if (!user) return done(null, false, { message: 'Incorrect username' })
      const ok = await bcrypt.compare(password, user.password)
      if (!ok) return done(null, false, { message: 'Incorrect password' })
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  }))

  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (err) {
      done(err)
    }
  })

  // 👇 Mount passport middlewares here
  app.use(passport.initialize())
  app.use(passport.session())
}
