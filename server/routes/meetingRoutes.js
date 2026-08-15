const express = require('express');
const {
  createMeeting,
  getMeetings,
  getUpcomingMeetings,
  getMeetingHistory,
  getMeetingById,
  joinMeeting,
  endMeeting,
  deleteMeeting,
} = require('../controllers/meetingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// Specific routes must come before dynamic :id routes
router.get('/upcoming', getUpcomingMeetings);
router.get('/history', getMeetingHistory);

router.route('/').post(createMeeting).get(getMeetings);

router.post('/:id/join', joinMeeting);
router.post('/:id/end', endMeeting);

router.route('/:id').get(getMeetingById).delete(deleteMeeting);

module.exports = router;
