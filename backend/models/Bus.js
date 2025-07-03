const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: true,
    unique: true
  },
  routeNumber: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  stops: [String],
  currentLocation: {
    lat: Number,
    lng: Number
  },
  status: {
    type: String,
    enum: ['on_time', 'delayed'],
    default: 'on_time'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  arrivalTime: {
    type: String,
    default: 'Not Available'
  },
  currentDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
});

module.exports = mongoose.model('Bus', busSchema);
