const Bus = require('../models/Bus');
const mongoose = require('mongoose');

exports.searchByVehicle = async (req, res) => {
  const { busNumber } = req.query;

  try {
    if (!busNumber) {
      return res.status(400).json({ msg: 'Bus number is required' });
    }

    const bus = await Bus.findOne({ busNumber });

    if (!bus) {
      return res.status(404).json({ msg: 'Bus not found' });
    }

    res.status(200).json([bus]); 
  } catch (err) {
    console.error('Search by vehicle error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.searchByRoute = async (req, res) => {
  try {
    const { routeNumber } = req.query;
    const buses = await Bus.find({ routeNumber });
    res.json(buses);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.searchBySourceDestination = async (req, res) => {
  try {
    const { source, destination } = req.query;
    const buses = await Bus.find({
      source: { $regex: new RegExp(source, 'i') },
      destination: { $regex: new RegExp(destination, 'i') }
    });
    res.json(buses);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// controllers/busController.js
exports.addBus = async (req, res) => {
  try {
    const { busNumber, routeNumber, source, destination, stops, arrivalTime, currentLocation } = req.body;

    const newBus = new Bus({ 
      busNumber, 
      routeNumber, 
      source, 
      destination, 
      stops, 
      arrivalTime,
      currentLocation: currentLocation || { lat: 16.4649, lng: 80.5083 } // Default coordinates if not provided
    });

    await newBus.save();

    res.status(201).json({ message: 'Bus added successfully', bus: newBus });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// controllers/busController.js
// Update bus location manually
exports.updateBusLocation = async (req, res) => {
  const { busNumber, lat, lng, driverId } = req.body;

  try {
    const bus = await Bus.findOne({ busNumber });
    if (!bus) {
      return res.status(404).json({ msg: 'Bus not found' });
    }

    // Only allow one driver to track a bus at a time
    if (bus.currentDriver && bus.currentDriver.toString() !== driverId) {
      return res.status(409).json({ msg: 'Another driver is already tracking this bus.' });
    }

    // Defensive: Only set currentDriver if driverId is a valid ObjectId
    let driverObjId = null;
    if (driverId && mongoose.Types.ObjectId.isValid(driverId)) {
      driverObjId = new mongoose.Types.ObjectId(driverId);
    } else {
      return res.status(400).json({ msg: 'Invalid driverId' });
    }

    // Update location and set currentDriver
    bus.currentLocation = { lat, lng };
    bus.lastUpdated = Date.now();
    bus.currentDriver = driverObjId;
    await bus.save();

    res.status(200).json({ msg: 'Location updated', bus });
  } catch (err) {
    console.error('Update location error:', err); // Log error details
    res.status(500).json({ msg: 'Server error updating location', error: err.message });
  }
};

// Update full bus details by bus number
exports.updateBusDetails = async (req, res) => {
  const { busNumber } = req.params;
  const updates = req.body;

  try {
    const updatedBus = await Bus.findOneAndUpdate({ busNumber }, updates, { new: true });
    if (!updatedBus) return res.status(404).json({ message: 'Bus not found' });
    res.json(updatedBus);
  } catch (err) {
    res.status(500).json({ message: 'Error updating bus', error: err.message });
  }
};

// Get all buses (admin only)
exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ lastUpdated: -1 });
    res.json(buses);
  } catch (err) {
    console.error('Error fetching all buses:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a bus
exports.deleteBus = async (req, res) => {
  const { busNumber } = req.params;

  try {
    const deleted = await Bus.findOneAndDelete({ busNumber });
    if (!deleted) return res.status(404).json({ message: 'Bus not found' });
    res.json({ message: 'Bus deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting bus', error: err.message });
  }
};

// Search buses by any stop (including intermediate stops)
exports.searchByStop = async (req, res) => {
  try {
    let { stop } = req.query;
    if (!stop) {
      return res.status(400).json({ msg: 'Stop is required' });
    }
    stop = stop.trim();
    // Simpler query for array of strings
    const buses = await Bus.find({
      stops: { $regex: new RegExp(stop, 'i') }
    });
    res.json(buses);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
