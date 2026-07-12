import Vehicle from '../models/Vehicle.js';

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Private
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({});
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Private
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
      res.json(vehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new vehicle
// @route   POST /api/vehicles
// @access  Private (Fleet Manager)
export const createVehicle = async (req, res) => {
  const { registrationNumber, name, type, maxLoadCapacity, odometer, acquisitionCost, status, region } = req.body;

  try {
    const vehicleExists = await Vehicle.findOne({ registrationNumber });

    if (vehicleExists) {
      return res.status(400).json({ message: 'Vehicle registration number must be unique' });
    }

    const vehicle = await Vehicle.create({
      registrationNumber,
      name,
      type,
      maxLoadCapacity,
      odometer: odometer || 0,
      acquisitionCost,
      status: status || 'Available',
      region: region || 'North',
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Fleet Manager)
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      vehicle.name = req.body.name || vehicle.name;
      vehicle.type = req.body.type || vehicle.type;
      vehicle.maxLoadCapacity = req.body.maxLoadCapacity || vehicle.maxLoadCapacity;
      vehicle.odometer = req.body.odometer !== undefined ? req.body.odometer : vehicle.odometer;
      vehicle.acquisitionCost = req.body.acquisitionCost || vehicle.acquisitionCost;
      vehicle.status = req.body.status || vehicle.status;
      vehicle.region = req.body.region || vehicle.region;

      if (req.body.registrationNumber && req.body.registrationNumber !== vehicle.registrationNumber) {
        const regExists = await Vehicle.findOne({ registrationNumber: req.body.registrationNumber });
        if (regExists) {
          return res.status(400).json({ message: 'Vehicle registration number must be unique' });
        }
        vehicle.registrationNumber = req.body.registrationNumber;
      }

      const updatedVehicle = await vehicle.save();
      res.json(updatedVehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (Fleet Manager)
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      await Vehicle.deleteOne({ _id: req.params.id });
      res.json({ message: 'Vehicle removed' });
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
