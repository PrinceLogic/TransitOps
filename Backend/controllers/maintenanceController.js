import Maintenance from '../models/Maintenance.js';
import Vehicle from '../models/Vehicle.js';
import Expense from '../models/Expense.js';

// @desc    Get all maintenance logs
// @route   GET /api/maintenance
// @access  Private
export const getMaintenanceLogs = async (req, res) => {
  try {
    const logs = await Maintenance.find({}).populate('vehicle').sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an active maintenance record
// @route   POST /api/maintenance
// @access  Private (Fleet Manager)
export const createMaintenanceLog = async (req, res) => {
  const { vehicleId, description, cost, startDate } = req.body;

  try {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (vehicle.status === 'Retired') {
      return res.status(400).json({ message: 'Retired vehicles cannot be put into maintenance' });
    }

    if (vehicle.status === 'On Trip') {
      return res.status(400).json({ message: 'Vehicle is currently on a trip and cannot enter maintenance until it returns' });
    }

    // Create Maintenance Log
    const log = await Maintenance.create({
      vehicle: vehicleId,
      description,
      cost: cost || 0,
      startDate: startDate || new Date(),
      status: 'Open',
    });

    // Automatically set vehicle status to "In Shop"
    vehicle.status = 'In Shop';
    await vehicle.save();

    const populatedLog = await Maintenance.findById(log._id).populate('vehicle');
    res.status(201).json(populatedLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Close maintenance (restore vehicle to Available unless retired)
// @route   PUT /api/maintenance/:id/close
// @access  Private (Fleet Manager)
export const closeMaintenanceLog = async (req, res) => {
  const { cost, endDate } = req.body;

  try {
    const log = await Maintenance.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    if (log.status !== 'Open') {
      return res.status(400).json({ message: `Maintenance record is already '${log.status}'` });
    }

    const vehicle = await Vehicle.findById(log.vehicle);

    // Close log
    log.status = 'Closed';
    log.endDate = endDate || new Date();
    if (cost !== undefined) {
      log.cost = cost;
    }
    await log.save();

    // Automatically restore vehicle status to Available (unless retired)
    if (vehicle) {
      if (vehicle.status !== 'Retired') {
        vehicle.status = 'Available';
        await vehicle.save();
      }
    }

    // Automatically log this as a Maintenance Expense
    if (log.cost > 0) {
      await Expense.create({
        vehicle: log.vehicle,
        type: 'Maintenance',
        cost: log.cost,
        date: log.endDate,
        description: `Maintenance close-out: ${log.description}`,
      });
    }

    const populatedLog = await Maintenance.findById(log._id).populate('vehicle');
    res.json(populatedLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
