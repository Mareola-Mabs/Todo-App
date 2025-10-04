const express = require('express')
const router = express.Router()
const Task = require('../models/Task')
const { ensureAuthenticated } = require('../middlewares/auth.middleware')

// list tasks (page)
router.get('/', ensureAuthenticated, async (req, res, next) => {
  try {
    const { status } = req.query
    const filter = { user: req.user._id }
    if (status && ['pending', 'completed'].includes(status)) {
      filter.status = status
    }
    const tasks = await Task.find(filter).sort({ createdAt: -1 })
    res.render('tasks', { user: req.user, tasks, filterStatus: status || '' })
  } catch (err) {
    next(err)
  }
})

// create task
router.post('/', ensureAuthenticated, async (req, res, next) => {
  try {
    const { title, description } = req.body
    const task = new Task({ title, description, user: req.user._id })
    await task.save()
    res.redirect('/tasks')
  } catch (err) {
    next(err)
  }
})

// update status
router.post('/:id/status', ensureAuthenticated, async (req, res, next) => {
  try {
    const { status } = req.body
    if (!['pending','completed','deleted'].includes(status)) return res.status(400).send('Bad status')
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id })
    if (!task) return res.status(404).send('Not found')
    task.status = status
    await task.save()
    res.redirect('/tasks')
  } catch (err) {
    next(err)
  }
})

// delete (soft-delete by setting status)
// delete (hard-delete)
router.post('/:id/delete', ensureAuthenticated, async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!task) return res.status(404).send('Not found')
    res.redirect('/tasks')
  } catch (err) {
    next(err)
  }
})

module.exports = router