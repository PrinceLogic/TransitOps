import Trip from '../models/Trip.js';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import Expense from '../models/Expense.js';

// @desc    Get all trips
// @route   GET /api/trips
// @access  Private
export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({})
      .populate('vehicle')
      .populate('driver')
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new trip (Draft status by default)
// @route   POST /api/trips
// @access  Private (Fleet Manager, Driver)
export const createTrip = async (req, res) => {
  const { source, destination, cargoWeight, plannedDistance, vehicleId, driverId, revenue } = req.body;

  try {
    // 1. Verify Vehicle exists and is valid
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (vehicle.status === 'Retired' || vehicle.status === 'In Shop') {
      return res.status(400).json({ message: `Vehicle is currently in '${vehicle.status}' status and cannot be assigned.` });
    }

    if (vehicle.status === 'On Trip') {
      return res.status(400).json({ message: 'Vehicle is currently assigned to another active trip.' });
    }

    // 2. Verify Driver exists and is valid
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    if (driver.status === 'Suspended' || driver.status === 'Off Duty') {
      return res.status(400).json({ message: `Driver is currently '${driver.status}' and cannot be assigned.` });
    }

    if (driver.status === 'On Trip') {
      return res.status(400).json({ message: 'Driver is currently assigned to another active trip.' });
    }

    // Check license expiry
    const today = new Date();
    if (new Date(driver.licenseExpiryDate) < today) {
      return res.status(400).json({ message: 'Driver license has expired and cannot be assigned to trips.' });
    }

    // 3. Validate Cargo Weight
    if (cargoWeight > vehicle.maxLoadCapacity) {
      return res.status(400).json({
        message: `Cargo weight (${cargoWeight} kg) exceeds vehicle's maximum load capacity (${vehicle.maxLoadCapacity} kg).`
      });
    }

    // Create the trip in Draft mode
    const trip = await Trip.create({
      source,
      destination,
      cargoWeight,
      plannedDistance,
      vehicle: vehicleId,
      driver: driverId,
      status: 'Draft',
      revenue: revenue || 0,
    });

    const populatedTrip = await Trip.findById(trip._id).populate('vehicle').populate('driver');
    res.status(201).json(populatedTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Dispatch a trip (Start trip, change statuses to On Trip)
// @route   PUT /api/trips/:id/dispatch
// @access  Private (Fleet Manager, Driver)
export const dispatchTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.status !== 'Draft') {
      return res.status(400).json({ message: `Trip cannot be dispatched from status '${trip.status}'` });
    }

    const vehicle = await Vehicle.findById(trip.vehicle);
    const driver = await Driver.findById(trip.driver);

    // Re-verify they are still available
    if (vehicle.status !== 'Available') {
      return res.status(400).json({ message: `Vehicle is no longer Available (Current: ${vehicle.status})` });
    }
    if (driver.status !== 'Available') {
      return res.status(400).json({ message: `Driver is no longer Available (Current: ${driver.status})` });
    }

    // Update vehicle and driver statuses
    vehicle.status = 'On Trip';
    await vehicle.save();

    driver.status = 'On Trip';
    await driver.save();

    // Update trip status
    trip.status = 'Dispatched';
    trip.dispatchDate = new Date();
    trip.odometerStart = vehicle.odometer;
    await trip.save();

    const populatedTrip = await Trip.findById(trip._id).populate('vehicle').populate('driver');
    res.json(populatedTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete a trip (record end odometer, fuel log, restore statuses to Available)
// @route   PUT /api/trips/:id/complete
// @access  Private (Fleet Manager, Driver)
export const completeTrip = async (req, res) => {
  const { odometerEnd, fuelConsumed, fuelCost, revenue } = req.body;

  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.status !== 'Dispatched') {
      return res.status(400).json({ message: `Trip cannot be completed from status '${trip.status}'` });
    }

    const vehicle = await Vehicle.findById(trip.vehicle);
    const driver = await Driver.findById(trip.driver);

    // Validate odometer readings
    if (odometerEnd < trip.odometerStart) {
      return res.status(400).json({
        message: `End odometer (${odometerEnd} km) cannot be less than start odometer (${trip.odometerStart} km)`
      });
    }

    // Restore vehicle status and update odometer
    vehicle.status = 'Available';
    vehicle.odometer = odometerEnd;
    await vehicle.save();

    // Restore driver status
    driver.status = 'Available';
    await driver.save();

    // Update trip details
    trip.status = 'Completed';
    trip.completionDate = new Date();
    trip.odometerEnd = odometerEnd;
    trip.fuelConsumed = fuelConsumed || 0;
    if (revenue !== undefined) {
      trip.revenue = revenue;
    }
    await trip.save();

    // Automatically record Fuel Expense if fuel details were provided
    if (fuelConsumed > 0 && fuelCost > 0) {
      await Expense.create({
        vehicle: vehicle._id,
        type: 'Fuel',
        cost: fuelCost,
        fuelLiters: fuelConsumed,
        date: new Date(),
        description: `Fuel for completed trip from ${trip.source} to ${trip.destination}`,
      });
    }

    const populatedTrip = await Trip.findById(trip._id).populate('vehicle').populate('driver');
    res.json(populatedTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a trip
// @route   PUT /api/trips/:id/cancel
// @access  Private (Fleet Manager, Driver)
export const cancelTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.status === 'Completed' || trip.status === 'Cancelled') {
      return res.status(400).json({ message: `Trip cannot be cancelled because it is already '${trip.status}'` });
    }

    // If trip was Dispatched, we must restore the vehicle and driver to Available
    if (trip.status === 'Dispatched') {
      const vehicle = await Vehicle.findById(trip.vehicle);
      if (vehicle && vehicle.status === 'On Trip') {
        vehicle.status = 'Available';
        await vehicle.save();
      }

      const driver = await Driver.findById(trip.driver);
      if (driver && driver.status === 'On Trip') {
        driver.status = 'Available';
        await driver.save();
      }
    }

    trip.status = 'Cancelled';
    await trip.save();

    const populatedTrip = await Trip.findById(trip._id).populate('vehicle').populate('driver');
    res.json(populatedTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
