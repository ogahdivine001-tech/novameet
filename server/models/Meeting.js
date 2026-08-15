const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a meeting title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    meetingId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    password: {
      type: String,
      default: null,
      select: false,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    meetingType: {
      type: String,
      enum: ['instant', 'scheduled'],
      default: 'instant',
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number, // minutes
      default: 60,
    },
    status: {
      type: String,
      enum: ['scheduled', 'active', 'ended', 'cancelled'],
      default: 'scheduled',
    },
    waitingRoom: {
      type: Boolean,
      default: false,
    },
    locked: {
      type: Boolean,
      default: false,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

MeetingSchema.index({ host: 1, createdAt: -1 });
MeetingSchema.index({ status: 1 });

MeetingSchema.methods.hasPassword = function () {
  return !!this.password;
};

module.exports = mongoose.model('Meeting', MeetingSchema);
