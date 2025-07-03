const express = require('express');
const router = express.Router();

const {
  searchByVehicle,
  searchByRoute,
  searchBySourceDestination,
  addBus,
  updateBusLocation,
  updateBusDetails,
  deleteBus,
  getAllBuses,
  searchByStop
} = require('../controllers/busController');

const { authenticate } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole');

// Public routes
router.get('/search/vehicle', searchByVehicle);
router.get('/search/route', searchByRoute);
router.get('/search/source-destination', searchBySourceDestination);
router.get('/search/stop', searchByStop);
router.get('/test', async (req, res) => {
  try {
    const buses = await require('../models/Bus').find();
    res.json({ count: buses.length, buses: buses.map(b => ({ busNumber: b.busNumber, routeNumber: b.routeNumber })) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin routes
router.get('/all', authenticate, getAllBuses);
router.post('/add-bus', authenticate, authorizeRole('admin'), addBus);
router.put('/update-location', authenticate, authorizeRole(['admin', 'driver']), updateBusLocation);
router.put('/update/:busNumber', authenticate, authorizeRole('admin'), updateBusDetails);
router.delete('/delete/:busNumber', authenticate, authorizeRole('admin'), deleteBus);

module.exports = router;
