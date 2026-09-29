import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bus, User, MapPin, DollarSign, Shield } from 'lucide-react';

export const TransportView: React.FC = () => {
  const { vehicles, drivers, routes, settings } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Transport Fleet & Route Logistics
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Dedicated campus transit buses, licensed drivers, and route fare schedules
        </p>
      </div>

      {/* Routes Grid */}
      <div>
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3">
          Daily Transit Routes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map((rt) => {
            const vehicle = vehicles.find((v) => v.id === rt.vehicleId);
            const driver = vehicle ? drivers.find((d) => d.id === vehicle.driverId) : null;

            return (
              <div
                key={rt.id}
                className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {rt.name}
                    </span>
                    <span className="font-mono font-bold text-xs text-neutral-900 dark:text-neutral-100">
                      {settings.currencySymbol}{rt.fareMonthly.toLocaleString()}/mo
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-neutral-400">Pickup Origin:</span>
                        <p className="font-medium text-neutral-800 dark:text-neutral-200">{rt.pickupLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-neutral-400">Drop Destination:</span>
                        <p className="font-medium text-neutral-800 dark:text-neutral-200">{rt.dropLocation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                  <span>Assigned: {vehicle?.vehicleNumber} ({vehicle?.vehicleType})</span>
                  <span>Driver: {driver?.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vehicles & Drivers Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vehicles */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3">
            Fleet Vehicles
          </h3>
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700">
              <tr>
                <th className="py-2 px-3">Vehicle #</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Capacity</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">{v.vehicleNumber}</td>
                  <td className="py-2.5 px-3 font-medium">{v.vehicleType}</td>
                  <td className="py-2.5 px-3 font-mono">{v.capacity} seats</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[10px]">
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Drivers */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3">
            Registered Drivers
          </h3>
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700">
              <tr>
                <th className="py-2 px-3">Driver Name</th>
                <th className="py-2 px-3">Phone</th>
                <th className="py-2 px-3">License No</th>
                <th className="py-2 px-3">License Expiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {drivers.map((d) => (
                <tr key={d.id}>
                  <td className="py-2.5 px-3 font-bold text-neutral-900 dark:text-neutral-100">{d.name}</td>
                  <td className="py-2.5 px-3 font-mono text-neutral-600 dark:text-neutral-400">{d.phone}</td>
                  <td className="py-2.5 px-3 font-mono text-neutral-500">{d.licenseNumber}</td>
                  <td className="py-2.5 px-3 font-mono text-neutral-500">{d.licenseExpiry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
