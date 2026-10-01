import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Vehicle, TransportRoute, Driver } from '../../types';
import {
  Bus,
  User,
  MapPin,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Phone,
  Calendar,
  AlertCircle,
  X,
  Search,
  Check,
  Layers,
  Users,
  ShieldCheck,
  Navigation
} from 'lucide-react';

export const TransportView: React.FC = () => {
  const {
    vehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    drivers,
    addDriver,
    updateDriver,
    routes,
    addRoute,
    updateRoute,
    deleteRoute,
    settings,
    classes,
    students,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'routes' | 'fleet' | 'drivers'>('routes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [toastMsg, setToastMsg] = useState('');

  // Vehicle Modal state
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehNumber, setVehNumber] = useState('');
  const [vehReg, setVehReg] = useState('');
  const [vehType, setVehType] = useState<Vehicle['vehicleType']>('Bus');
  const [vehCapacity, setVehCapacity] = useState(30);
  const [vehDriverId, setVehDriverId] = useState('');
  const [vehStatus, setVehStatus] = useState<Vehicle['status']>('Active');

  // Route Modal state
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<TransportRoute | null>(null);
  const [routeName, setRouteName] = useState('');
  const [routePickup, setRoutePickup] = useState('');
  const [routeDrop, setRouteDrop] = useState('');
  const [routeFare, setRouteFare] = useState(3500);
  const [routeVehicleId, setRouteVehicleId] = useState('');
  const [routeStops, setRouteStops] = useState('');
  const [routeAssignedClasses, setRouteAssignedClasses] = useState<string[]>([]);
  const [routeNotes, setRouteNotes] = useState('');

  // Driver Modal state
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [drvName, setDrvName] = useState('');
  const [drvPhone, setDrvPhone] = useState('');
  const [drvCnic, setDrvCnic] = useState('');
  const [drvLicense, setDrvLicense] = useState('');
  const [drvExpiry, setDrvExpiry] = useState('');

  const canManage = ['Super Admin', 'Admin', 'Receptionist'].includes(currentUser.role);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Vehicle handlers
  const handleOpenAddVehicle = () => {
    setEditingVehicle(null);
    setVehNumber('');
    setVehReg('');
    setVehType('Bus');
    setVehCapacity(32);
    setVehDriverId(drivers[0]?.id || '');
    setVehStatus('Active');
    setIsVehicleModalOpen(true);
  };

  const handleOpenEditVehicle = (v: Vehicle) => {
    setEditingVehicle(v);
    setVehNumber(v.vehicleNumber);
    setVehReg(v.registrationNumber);
    setVehType(v.vehicleType);
    setVehCapacity(v.capacity);
    setVehDriverId(v.driverId);
    setVehStatus(v.status);
    setIsVehicleModalOpen(true);
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehNumber.trim()) return;

    if (editingVehicle) {
      updateVehicle(editingVehicle.id, {
        vehicleNumber: vehNumber.trim(),
        registrationNumber: vehReg.trim() || vehNumber.trim(),
        vehicleType: vehType,
        capacity: Number(vehCapacity),
        driverId: vehDriverId,
        status: vehStatus,
      });
      showToast(`Updated vehicle ${vehNumber}`);
    } else {
      addVehicle({
        vehicleNumber: vehNumber.trim(),
        registrationNumber: vehReg.trim() || vehNumber.trim(),
        vehicleType: vehType,
        capacity: Number(vehCapacity),
        driverId: vehDriverId,
        status: vehStatus,
      });
      showToast(`Successfully added vehicle ${vehNumber} to transport fleet`);
    }
    setIsVehicleModalOpen(false);
  };

  // Route handlers
  const handleOpenAddRoute = () => {
    setEditingRoute(null);
    setRouteName('');
    setRoutePickup('Gulshan-e-Iqbal Block 13-D');
    setRouteDrop('Campus Main Gate (IQRA)');
    setRouteFare(3500);
    setRouteVehicleId(vehicles[0]?.id || '');
    setRouteStops('Disco Bakery, Moti Mahal, University Road');
    setRouteAssignedClasses(classes.slice(0, 3).map((c) => c.id));
    setRouteNotes('');
    setIsRouteModalOpen(true);
  };

  const handleOpenEditRoute = (r: TransportRoute) => {
    setEditingRoute(r);
    setRouteName(r.name);
    setRoutePickup(r.pickupLocation);
    setRouteDrop(r.dropLocation);
    setRouteFare(r.fareMonthly);
    setRouteVehicleId(r.vehicleId);
    setRouteStops(r.stops ? r.stops.join(', ') : '');
    setRouteAssignedClasses(r.assignedClassIds || []);
    setRouteNotes(r.notes || '');
    setIsRouteModalOpen(true);
  };

  const handleSaveRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeName.trim()) return;

    const parsedStops = routeStops
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingRoute) {
      updateRoute(editingRoute.id, {
        name: routeName.trim(),
        pickupLocation: routePickup.trim(),
        dropLocation: routeDrop.trim(),
        fareMonthly: Number(routeFare),
        vehicleId: routeVehicleId,
        stops: parsedStops,
        assignedClassIds: routeAssignedClasses,
        notes: routeNotes.trim() || undefined,
      });
      showToast(`Updated route ${routeName}`);
    } else {
      addRoute({
        name: routeName.trim(),
        pickupLocation: routePickup.trim(),
        dropLocation: routeDrop.trim(),
        fareMonthly: Number(routeFare),
        vehicleId: routeVehicleId,
        stops: parsedStops,
        assignedClassIds: routeAssignedClasses,
        notes: routeNotes.trim() || undefined,
      });
      showToast(`Created route ${routeName} servicing ${routeAssignedClasses.length} classes`);
    }
    setIsRouteModalOpen(false);
  };

  // Driver handlers
  const handleOpenAddDriver = () => {
    setEditingDriver(null);
    setDrvName('');
    setDrvPhone('0300-1234567');
    setDrvCnic('42101-1234567-1');
    setDrvLicense('LTV-KAR-9812');
    setDrvExpiry('2028-12-31');
    setIsDriverModalOpen(true);
  };

  const handleOpenEditDriver = (d: Driver) => {
    setEditingDriver(d);
    setDrvName(d.name);
    setDrvPhone(d.phone);
    setDrvCnic(d.cnic);
    setDrvLicense(d.licenseNumber);
    setDrvExpiry(d.licenseExpiry);
    setIsDriverModalOpen(true);
  };

  const handleSaveDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drvName.trim()) return;

    if (editingDriver) {
      updateDriver(editingDriver.id, {
        name: drvName.trim(),
        phone: drvPhone.trim(),
        cnic: drvCnic.trim(),
        licenseNumber: drvLicense.trim(),
        licenseExpiry: drvExpiry.trim(),
      });
      showToast(`Updated driver profile for ${drvName}`);
    } else {
      addDriver({
        name: drvName.trim(),
        phone: drvPhone.trim(),
        cnic: drvCnic.trim(),
        licenseNumber: drvLicense.trim(),
        licenseExpiry: drvExpiry.trim(),
      });
      showToast(`Registered driver ${drvName}`);
    }
    setIsDriverModalOpen(false);
  };

  // Filter routes
  const filteredRoutes = routes.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.pickupLocation.toLowerCase().includes(q) ||
      r.dropLocation.toLowerCase().includes(q);

    const matchesClass =
      selectedClassFilter === 'all' ||
      (r.assignedClassIds && r.assignedClassIds.includes(selectedClassFilter));

    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xl animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Bus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Transport Fleet & Route Logistics
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
              {routes.length} Active Routes
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage transit fleets (Buses, Vans, Coasters), licensed drivers, service routes, and assigned academic classes
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('routes')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'routes'
                ? 'bg-white text-blue-600 font-bold shadow-xs dark:bg-neutral-900 dark:text-blue-400'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
            }`}
          >
            Routes & Classes ({routes.length})
          </button>
          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'fleet'
                ? 'bg-white text-blue-600 font-bold shadow-xs dark:bg-neutral-900 dark:text-blue-400'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
            }`}
          >
            Fleet Vehicles ({vehicles.length})
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'drivers'
                ? 'bg-white text-blue-600 font-bold shadow-xs dark:bg-neutral-900 dark:text-blue-400'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
            }`}
          >
            Drivers ({drivers.length})
          </button>
        </div>
      </div>

      {/* TAB 1: ROUTES & CLASS LINKAGE */}
      {activeTab === 'routes' && (
        <div className="space-y-4">
          {/* Action Toolbar & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search routes, pickup stops, destinations..."
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-8 pr-3 py-1.5 text-xs text-neutral-900 focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>

              {/* Class Filter */}
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 font-medium dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              >
                <option value="all">All Served Classes</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.category || 'Co-Ed'})
                  </option>
                ))}
              </select>
            </div>

            {canManage && (
              <button
                onClick={handleOpenAddRoute}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Plus className="h-4 w-4" />
                + Add Transport Route
              </button>
            )}
          </div>

          {/* Routes Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRoutes.map((rt) => {
              const vehicle = vehicles.find((v) => v.id === rt.vehicleId);
              const driver = vehicle ? drivers.find((d) => d.id === vehicle.driverId) : null;
              const assignedClassObjs = classes.filter(
                (c) => rt.assignedClassIds && rt.assignedClassIds.includes(c.id)
              );

              return (
                <div
                  key={rt.id}
                  className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                            {rt.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Active
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                          Assigned: {vehicle?.vehicleNumber || 'Unassigned'} ({vehicle?.vehicleType || 'Bus'}) · Cap: {vehicle?.capacity || 30} seats
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">
                          {settings.currencySymbol}{rt.fareMonthly.toLocaleString()}<span className="text-[10px] text-neutral-400 font-normal">/mo</span>
                        </div>
                        {canManage && (
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <button
                              onClick={() => handleOpenEditRoute(rt)}
                              title="Edit Route & Assigned Classes"
                              className="p-1 text-neutral-500 hover:text-blue-600 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete route "${rt.name}"?`)) {
                                  deleteRoute(rt.id);
                                  showToast(`Deleted route ${rt.name}`);
                                }
                              }}
                              title="Delete Route"
                              className="p-1 text-neutral-400 hover:text-rose-600 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Transit Details */}
                    <div className="mt-3.5 space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-neutral-400 font-medium">Pickup Origin:</span>
                          <p className="font-semibold text-neutral-800 dark:text-neutral-200">{rt.pickupLocation}</p>
                        </div>
                      </div>

                      {rt.stops && rt.stops.length > 0 && (
                        <div className="flex items-start gap-2 pl-6 text-[11px] text-neutral-500 dark:text-neutral-400">
                          <span>Intermediate Stops:</span>
                          <span className="font-medium text-neutral-700 dark:text-neutral-300">
                            {rt.stops.join(' → ')}
                          </span>
                        </div>
                      )}

                      <div className="flex items-start gap-2">
                        <Navigation className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-neutral-400 font-medium">Drop Destination:</span>
                          <p className="font-semibold text-neutral-800 dark:text-neutral-200">{rt.dropLocation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Existing Classes Serviced by this Route */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Layers className="h-3.5 w-3.5 text-blue-600" />
                          Serviced Existing Classes ({assignedClassObjs.length}):
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {assignedClassObjs.length > 0 ? (
                          assignedClassObjs.map((cls) => (
                            <span
                              key={cls.id}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                            >
                              {cls.name} ({cls.category || 'Co-Ed'})
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-neutral-400 italic">
                            All classes open / General route
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Driver & Contact Footer */}
                  <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-neutral-400" />
                      Driver: <strong className="text-neutral-700 dark:text-neutral-300 font-sans">{driver?.name || 'Assigned Driver'}</strong>
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <Phone className="h-3 w-3" />
                      {driver?.phone || '0300-1234567'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: FLEET VEHICLES */}
      {activeTab === 'fleet' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                School Transport Fleet
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Manage transit buses, vans, coaster units, seat capacities, and maintenance schedules
              </p>
            </div>
            {canManage && (
              <button
                onClick={handleOpenAddVehicle}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                + Add Fleet Vehicle
              </button>
            )}
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Vehicle #</th>
                  <th className="py-2.5 px-3 font-mono">Reg Number</th>
                  <th className="py-2.5 px-3">Vehicle Type</th>
                  <th className="py-2.5 px-3 font-mono">Seat Capacity</th>
                  <th className="py-2.5 px-3">Assigned Driver</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {vehicles.map((v) => {
                  const driver = drivers.find((d) => d.id === v.driverId);
                  return (
                    <tr key={v.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {v.vehicleNumber}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-neutral-600 dark:text-neutral-300">
                        {v.registrationNumber}
                      </td>
                      <td className="py-2.5 px-3 font-medium">
                        <span className="px-2 py-0.5 rounded-sm bg-neutral-100 dark:bg-neutral-800 text-[11px]">
                          {v.vehicleType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        {v.capacity} Seats
                      </td>
                      <td className="py-2.5 px-3 font-medium text-neutral-800 dark:text-neutral-200">
                        {driver?.name || 'Unassigned'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          v.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : v.status === 'Maintenance'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {canManage && (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEditVehicle(v)}
                              className="p-1 text-neutral-500 hover:text-blue-600 rounded cursor-pointer"
                              title="Edit Vehicle"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Remove vehicle "${v.vehicleNumber}"?`)) {
                                  deleteVehicle(v.id);
                                  showToast(`Removed vehicle ${v.vehicleNumber}`);
                                }
                              }}
                              className="p-1 text-neutral-400 hover:text-rose-600 rounded cursor-pointer"
                              title="Delete Vehicle"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REGISTERED DRIVERS */}
      {activeTab === 'drivers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Licensed Campus Drivers
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Driver verification, commercial licenses, contact details, and route assignments
              </p>
            </div>
            {canManage && (
              <button
                onClick={handleOpenAddDriver}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                + Register Driver
              </button>
            )}
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Driver Name</th>
                  <th className="py-2.5 px-3 font-mono">Mobile Contact</th>
                  <th className="py-2.5 px-3 font-mono">CNIC</th>
                  <th className="py-2.5 px-3 font-mono">License #</th>
                  <th className="py-2.5 px-3 font-mono">License Expiry</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {drivers.map((d) => (
                  <tr key={d.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40">
                    <td className="py-2.5 px-3 font-bold text-neutral-900 dark:text-neutral-100">
                      {d.name}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {d.phone}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-neutral-500">{d.cnic}</td>
                    <td className="py-2.5 px-3 font-mono text-neutral-600 dark:text-neutral-300">
                      {d.licenseNumber}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-neutral-500">{d.licenseExpiry}</td>
                    <td className="py-2.5 px-3 text-right">
                      {canManage && (
                        <button
                          onClick={() => handleOpenEditDriver(d)}
                          className="p-1 text-neutral-500 hover:text-blue-600 rounded cursor-pointer"
                          title="Edit Driver"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS: Vehicle Add / Edit Modal
         ========================================================================= */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-3">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Bus className="h-5 w-5 text-blue-600" />
                {editingVehicle ? 'Edit Fleet Vehicle' : 'Add New Fleet Vehicle'}
              </h3>
              <button
                type="button"
                onClick={() => setIsVehicleModalOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bus-01, Van-03"
                    value={vehNumber}
                    onChange={(e) => setVehNumber(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                    Reg Plate Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. LEA-1994, KC-4820"
                    value={vehReg}
                    onChange={(e) => setVehReg(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                    Vehicle Type
                  </label>
                  <select
                    value={vehType}
                    onChange={(e) => setVehType(e.target.value as any)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-medium dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  >
                    <option value="Bus">Transit Bus</option>
                    <option value="Coaster">Toyota Coaster</option>
                    <option value="Van">HiAce Van</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                    Seat Capacity
                  </label>
                  <input
                    type="number"
                    min={4}
                    max={80}
                    value={vehCapacity}
                    onChange={(e) => setVehCapacity(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Assigned Driver
                </label>
                <select
                  value={vehDriverId}
                  onChange={(e) => setVehDriverId(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  <option value="">Select licensed driver</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Operational Status
                </label>
                <select
                  value={vehStatus}
                  onChange={(e) => setVehStatus(e.target.value as any)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-semibold dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  <option value="Active">Active / On Duty</option>
                  <option value="Maintenance">In Maintenance / Workshop</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsVehicleModalOpen(false)}
                  className="px-3.5 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  {editingVehicle ? 'Update Vehicle' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS: Route Add / Edit Modal (With Existing Classes linkage)
         ========================================================================= */}
      {isRouteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-3">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Navigation className="h-5 w-5 text-blue-600" />
                {editingRoute ? 'Edit Transit Route & Classes' : 'Add New Transit Route'}
              </h3>
              <button
                type="button"
                onClick={() => setIsRouteModalOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoute} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Route Name / Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Route 01 - Gulshan / Johar Express"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-medium dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                    Pickup Origin *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gulshan Block 13-D"
                    value={routePickup}
                    onChange={(e) => setRoutePickup(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                    Drop Destination *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Campus Main Gate"
                    value={routeDrop}
                    onChange={(e) => setRouteDrop(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Intermediate Stops (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Disco Bakery, Moti Mahal, NIPA Chowrangi"
                  value={routeStops}
                  onChange={(e) => setRouteStops(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                    Monthly Fare ({settings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={routeFare}
                    onChange={(e) => setRouteFare(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                    Assign Fleet Vehicle
                  </label>
                  <select
                    value={routeVehicleId}
                    onChange={(e) => setRouteVehicleId(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.vehicleNumber} ({v.vehicleType} - {v.capacity} seats)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assign to Existing Classes */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 dark:border-blue-900/60 dark:bg-blue-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-blue-950 dark:text-blue-200">
                    Assign to Existing Classes:
                  </label>
                  <span className="text-[10px] text-blue-700 dark:text-blue-300 font-mono">
                    {routeAssignedClasses.length} Selected
                  </span>
                </div>
                <p className="text-[10px] text-blue-800 dark:text-blue-300">
                  Select which existing classes are serviced by this bus route. Students of these classes will be routed through this vehicle.
                </p>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pt-1">
                  {classes.map((cls) => {
                    const isChecked = routeAssignedClasses.includes(cls.id);
                    return (
                      <label
                        key={cls.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-white dark:bg-neutral-800 border-blue-500 font-bold text-blue-900 dark:text-blue-200'
                            : 'bg-white/60 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRouteAssignedClasses([...routeAssignedClasses, cls.id]);
                            } else {
                              setRouteAssignedClasses(routeAssignedClasses.filter((id) => id !== cls.id));
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="truncate">{cls.name} ({cls.category || 'Co-Ed'})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsRouteModalOpen(false)}
                  className="px-3.5 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  {editingRoute ? 'Update Route' : 'Create Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS: Driver Add / Edit Modal
         ========================================================================= */}
      {isDriverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-3">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                {editingDriver ? 'Edit Driver Record' : 'Register New Driver'}
              </h3>
              <button
                type="button"
                onClick={() => setIsDriverModalOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDriver} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Driver Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Asif"
                  value={drvName}
                  onChange={(e) => setDrvName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                    Phone / Mobile *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0300-1234567"
                    value={drvPhone}
                    onChange={(e) => setDrvPhone(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                    CNIC Number
                  </label>
                  <input
                    type="text"
                    placeholder="42101-XXXXXXX-X"
                    value={drvCnic}
                    onChange={(e) => setDrvCnic(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                    Commercial License #
                  </label>
                  <input
                    type="text"
                    placeholder="LTV-KAR-9812"
                    value={drvLicense}
                    onChange={(e) => setDrvLicense(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                    License Expiry Date
                  </label>
                  <input
                    type="date"
                    value={drvExpiry}
                    onChange={(e) => setDrvExpiry(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsDriverModalOpen(false)}
                  className="px-3.5 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  {editingDriver ? 'Update Driver' : 'Register Driver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
