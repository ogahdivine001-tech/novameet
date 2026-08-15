const express = require('express');
const {
  getProfile,
  updateProfile,
  updatePassword,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/profile').get(getProfile).put(updateProfile);
router.put('/password', updatePassword);

module.exports = router;
