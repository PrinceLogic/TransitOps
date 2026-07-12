import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true, // e.g. Van, Truck, Semi, Pickup
    },
    maxLoadCapacity: {
      type: Number,
      required: true, // in kg
    },
    odometer: {
      type: Number,
      required: true, // in km
      default: 0,
    },
    acquisitionCost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Available', 'On Trip', 'In Shop', 'Retired'],
      default: 'Available',
    },
    region: {
      type: String,
      required: true,
      default: 'North', // North, South, East, West, etc.
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
