import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import Trip from '../models/Trip.js';
import Expense from '../models/Expense.js';

// @desc    Get dashboard KPIs and stats (with filters)
// @route   GET /api/dashboard/kpis
// @access  Private
export const getDashboardKPIs = async (req, res) => {
  const { type, status, region } = req.query;

  try {
    // Build vehicle query based on filters
    const vehicleQuery = {};
    if (type) vehicleQuery.type = type;
    if (status) vehicleQuery.status = status;
    if (region) vehicleQuery.region = region;

    // Fetch vehicles matching filters
    const vehicles = await Vehicle.find(vehicleQuery);

    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
    const maintenanceVehicles = vehicles.filter(v => v.status === 'In Shop').length;
    const onTripVehicles = vehicles.filter(v => v.status === 'On Trip').length;
    const retiredVehicles = vehicles.filter(v => v.status === 'Retired').length;

    // Fleet Utilization = On Trip / (Available + On Trip + In Shop) * 100
    const activeFleetCount = availableVehicles + onTripVehicles + maintenanceVehicles;
    const fleetUtilization = activeFleetCount > 0 ? Math.round((onTripVehicles / activeFleetCount) * 100) : 0;

    // Fetch trips
    const trips = await Trip.find({});
    const activeTrips = trips.filter(t => t.status === 'Dispatched').length;
    const pendingTrips = trips.filter(t => t.status === 'Draft').length;

    // Fetch drivers
    const drivers = await Driver.find({});
    const driversOnDuty = drivers.filter(d => d.status === 'Available' || d.status === 'On Trip').length;

    res.json({
      totalVehicles,
      availableVehicles,
      maintenanceVehicles,
      onTripVehicles,
      retiredVehicles,
      fleetUtilization,
      activeTrips,
      pendingTrips,
      driversOnDuty,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get vehicle-by-vehicle reports & ROI analytics
// @route   GET /api/dashboard/reports
// @access  Private
export const getVehicleReports = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({});
    const reports = [];

    for (const vehicle of vehicles) {
      // 1. Get Completed Trips for this vehicle to sum up revenue & compute fuel efficiency
      const completedTrips = await Trip.find({ vehicle: vehicle._id, status: 'Completed' });
      const totalRevenue = completedTrips.reduce((acc, t) => acc + (t.revenue || 0), 0);
      const totalDistance = completedTrips.reduce((acc, t) => acc + (t.plannedDistance || 0), 0);
      const totalFuelConsumedInTrips = completedTrips.reduce((acc, t) => acc + (t.fuelConsumed || 0), 0);

      // Fuel Efficiency = Distance / Fuel
      const fuelEfficiency = totalFuelConsumedInTrips > 0
        ? parseFloat((totalDistance / totalFuelConsumedInTrips).toFixed(2))
        : 0;

      // 2. Get all Expenses for this vehicle
      const expenses = await Expense.find({ vehicle: vehicle._id });
      const fuelExpenses = expenses.filter(e => e.type === 'Fuel');
      const maintenanceExpenses = expenses.filter(e => e.type === 'Maintenance');
      const otherExpenses = expenses.filter(e => e.type === 'Toll' || e.type === 'Other');

      const totalFuelCost = fuelExpenses.reduce((acc, e) => acc + e.cost, 0);
      const totalMaintenanceCost = maintenanceExpenses.reduce((acc, e) => acc + e.cost, 0);
      const totalOtherCost = otherExpenses.reduce((acc, e) => acc + e.cost, 0);

      // Operational Cost = Fuel + Maintenance
      const totalOperationalCost = totalFuelCost + totalMaintenanceCost;

      // Vehicle ROI = [Revenue - (Maintenance + Fuel)] / Acquisition Cost
      // We will present it as a decimal and percentage
      const acquisitionCost = vehicle.acquisitionCost || 1; // Prevent division by zero
      const vehicleROI = parseFloat(((totalRevenue - totalOperationalCost) / acquisitionCost).toFixed(4));

      reports.push({
        _id: vehicle._id,
        name: vehicle.name,
        registrationNumber: vehicle.registrationNumber,
        type: vehicle.type,
        status: vehicle.status,
        region: vehicle.region,
        acquisitionCost: vehicle.acquisitionCost,
        odometer: vehicle.odometer,
        totalRevenue,
        totalFuelCost,
        totalMaintenanceCost,
        totalOtherCost,
        totalOperationalCost,
        fuelEfficiency,
        roi: vehicleROI, // e.g. 0.125 for 12.5%
      });
    }

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
