import Expense from '../models/Expense.js';
import Vehicle from '../models/Vehicle.js';

// @desc    Get all expenses and fuel logs
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({}).populate('vehicle').sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new expense or fuel log
// @route   POST /api/expenses
// @access  Private (Financial Analyst, Fleet Manager)
export const createExpense = async (req, res) => {
  const { vehicleId, type, cost, date, fuelLiters, description } = req.body;

  try {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const expense = await Expense.create({
      vehicle: vehicleId,
      type,
      cost,
      date: date || new Date(),
      fuelLiters: type === 'Fuel' ? (fuelLiters || 0) : 0,
      description,
    });

    const populatedExpense = await Expense.findById(expense._id).populate('vehicle');
    res.status(201).json(populatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
