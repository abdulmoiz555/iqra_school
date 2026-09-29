import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InventoryItem } from '../../types';
import { Package, Plus, AlertTriangle, ArrowUp, ArrowDown, Search, X } from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { inventory, addInventoryItem, updateStock, settings, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Stationery' as InventoryItem['category'],
    quantity: 50,
    unit: 'Units',
    purchasePrice: 500,
    supplier: 'Central Educational Suppliers',
    location: 'Main Store Room',
    minStockLevel: 10,
  });

  const categories: InventoryItem['category'][] = [
    'Stationery',
    'Furniture',
    'Electronics',
    'Sports',
    'Laboratory',
    'Cleaning',
  ];

  const filteredInventory = inventory.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.supplier.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
    );
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;
    addInventoryItem({
      ...newItem,
      quantity: Number(newItem.quantity),
      purchasePrice: Number(newItem.purchasePrice),
      minStockLevel: Number(newItem.minStockLevel),
    });
    setIsAddModalOpen(false);
  };

  const lowStockItems = inventory.filter((i) => i.quantity <= i.minStockLevel);
  const canManage = ['Super Admin', 'Admin'].includes(currentUser.role);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Campus Inventory & Asset Store
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Track equipment stocks, laboratory chemicals, sports goods and stationery reorders
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Inventory Item
          </button>
        )}
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockItems.length > 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-3.5 dark:border-amber-900/60 dark:bg-amber-950/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-200">
                Low Inventory Warning: {lowStockItems.length} items below minimum threshold
              </span>
              <p className="text-amber-700 dark:text-amber-300 text-[11px]">
                {lowStockItems.map((i) => `${i.name} (${i.quantity} ${i.unit} left)`).join(' · ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search */}
      <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, supplier, location..."
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-8 pr-3 py-1.5 text-xs text-neutral-900 focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium cursor-pointer ${
              selectedCategory === 'all' ? 'bg-blue-600 text-white font-bold' : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium cursor-pointer ${
                selectedCategory === cat ? 'bg-blue-600 text-white font-bold' : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items Table */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800/60 dark:border-neutral-800 dark:text-neutral-300 font-semibold">
            <tr>
              <th className="py-3 px-4">Item Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">In Stock</th>
              <th className="py-3 px-4">Min Level</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4 font-mono">Unit Price</th>
              <th className="py-3 px-4">Supplier</th>
              {canManage && <th className="py-3 px-4 text-right">Stock In / Out</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filteredInventory.map((item) => {
              const isLow = item.quantity <= item.minStockLevel;

              return (
                <tr key={item.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40">
                  <td className="py-3 px-4 font-bold text-neutral-900 dark:text-neutral-100">
                    {item.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-sm bg-neutral-100 dark:bg-neutral-800 text-[10px] font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold">
                    <span className={isLow ? 'text-rose-600 dark:text-rose-400' : 'text-neutral-900 dark:text-neutral-100'}>
                      {item.quantity} {item.unit}
                    </span>
                    {isLow && (
                      <span className="ml-1.5 text-[9px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-1 py-0.5 rounded-xs">
                        LOW
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-400">
                    {item.minStockLevel} {item.unit}
                  </td>
                  <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                    {item.location}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {settings.currencySymbol}{item.purchasePrice.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-neutral-500">
                    {item.supplier}
                  </td>
                  {canManage && (
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => updateStock(item.id, 10)}
                          title="Stock In (+10)"
                          className="flex items-center gap-0.5 px-2 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                        >
                          <ArrowUp className="h-3 w-3" /> +10
                        </button>
                        <button
                          onClick={() => updateStock(item.id, -5)}
                          disabled={item.quantity <= 0}
                          title="Stock Out (-5)"
                          className="flex items-center gap-0.5 px-2 py-1 rounded-md text-[11px] font-semibold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:opacity-40 cursor-pointer dark:bg-neutral-800 dark:text-neutral-300"
                        >
                          <ArrowDown className="h-3 w-3" /> -5
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-3">Add Inventory Item</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Lab Test Tubes"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Unit Measure</label>
                  <input
                    type="text"
                    placeholder="e.g. Packs / Units / Reams"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium mb-1">Initial Qty</label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Unit Price</label>
                  <input
                    type="number"
                    value={newItem.purchasePrice}
                    onChange={(e) => setNewItem({ ...newItem, purchasePrice: Number(e.target.value) })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Min Threshold</label>
                  <input
                    type="number"
                    value={newItem.minStockLevel}
                    onChange={(e) => setNewItem({ ...newItem, minStockLevel: Number(e.target.value) })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Supplier</label>
                  <input
                    type="text"
                    value={newItem.supplier}
                    onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Storage Location</label>
                  <input
                    type="text"
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
