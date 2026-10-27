const express = require('express');
const router = express.Router();
const {
  getShows,
  getShowsByMovie,
  getShowById,
  createShow,
  updateShow,
  deleteShow,
} = require('../controllers/showController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(getShows)
  .post(protect, admin, createShow);

router.get('/movie/:movieId', getShowsByMovie);

router.route('/:id')
  .get(getShowById)
  .put(protect, admin, updateShow)
  .delete(protect, admin, deleteShow);

module.exports = router;
