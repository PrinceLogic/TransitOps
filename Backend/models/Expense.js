import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Fuel', 'Toll', 'Maintenance', 'Other'],
    },
    cost: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    fuelLiters: {
      type: Number, // Only applicable for type 'Fuel'
      default: 0,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
