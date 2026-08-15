const mongoose = require('mongoose');

const MeetingParticipantSchema = new mongoose.Schema(
  {
    meeting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meeting',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    leftAt: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number, // seconds
      default: 0,
    },
  },
  { timestamps: true }
);

MeetingParticipantSchema.index({ meeting: 1, user: 1 });

module.exports = mongoose.model('MeetingParticipant', MeetingParticipantSchema);
