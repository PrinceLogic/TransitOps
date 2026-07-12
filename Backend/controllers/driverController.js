import Driver from '../models/Driver.js';

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private
export const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({});
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single driver by ID
// @route   GET /api/drivers/:id
// @access  Private
export const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (driver) {
      res.json(driver);
    } else {
      res.status(404).json({ message: 'Driver not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new driver
// @route   POST /api/drivers
// @access  Private (Safety Officer, Fleet Manager)
export const createDriver = async (req, res) => {
  const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, safetyScore, status } = req.body;

  try {
    const driverExists = await Driver.findOne({ licenseNumber });

    if (driverExists) {
      return res.status(400).json({ message: 'Driver license number must be unique' });
    }

    const driver = await Driver.create({
      name,
      licenseNumber,
      licenseCategory,
      licenseExpiryDate,
      contactNumber,
      safetyScore: safetyScore || 100,
      status: status || 'Available',
    });

    res.status(201).json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a driver
// @route   PUT /api/drivers/:id
// @access  Private (Safety Officer, Fleet Manager)
export const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (driver) {
      driver.name = req.body.name || driver.name;
      driver.licenseCategory = req.body.licenseCategory || driver.licenseCategory;
      driver.licenseExpiryDate = req.body.licenseExpiryDate || driver.licenseExpiryDate;
      driver.contactNumber = req.body.contactNumber || driver.contactNumber;
      driver.safetyScore = req.body.safetyScore !== undefined ? req.body.safetyScore : driver.safetyScore;
      driver.status = req.body.status || driver.status;

      if (req.body.licenseNumber && req.body.licenseNumber !== driver.licenseNumber) {
        const licExists = await Driver.findOne({ licenseNumber: req.body.licenseNumber });
        if (licExists) {
          return res.status(400).json({ message: 'Driver license number must be unique' });
        }
        driver.licenseNumber = req.body.licenseNumber;
      }

      const updatedDriver = await driver.save();
      res.json(updatedDriver);
    } else {
      res.status(404).json({ message: 'Driver not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a driver
// @route   DELETE /api/drivers/:id
// @access  Private (Fleet Manager)
export const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (driver) {
      await Driver.deleteOne({ _id: req.params.id });
      res.json({ message: 'Driver removed' });
    } else {
      res.status(404).json({ message: 'Driver not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
