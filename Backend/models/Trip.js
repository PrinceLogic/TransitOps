import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    cargoWeight: {
      type: Number,
      required: true, // in kg
    },
    plannedDistance: {
      type: Number,
      required: true, // in km
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Draft', 'Dispatched', 'Completed', 'Cancelled'],
      default: 'Draft',
    },
    odometerStart: {
      type: Number,
    },
    odometerEnd: {
      type: Number,
    },
    fuelConsumed: {
      type: Number, // in Liters, captured upon completion
      default: 0,
    },
    revenue: {
      type: Number,
      default: 0,
    },
    dispatchDate: {
      type: Date,
    },
    completionDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
