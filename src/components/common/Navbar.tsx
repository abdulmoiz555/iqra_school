import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Shield,
  UserCheck,
  Menu,
  ChevronDown,
  CheckCircle,
  ExternalLink,
  LogOut,
  GraduationCap,
  Globe
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onNavigateToPublic?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onNavigateToPublic }) => {
  const {
    settings,
    currentUser,
    darkMode,
    setDarkMode,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setActiveTab,
    globalSearch,
    setGlobalSearch,
    logout,
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-neutral-200 bg-white px-4 md:px-6 dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
      {/* Left zone: Brand and Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 lg:hidden dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt="School Logo"
              className="h-10 w-10 rounded-lg object-cover border border-neutral-200 dark:border-neutral-700 shadow-xs"
              onError={(e) => {
                // fallback
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              <GraduationCap className="h-6 w-6" />
            </div>
          )}

          <div className="hidden sm:block">
            <h1 className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 truncate max-w-xs md:max-w-md group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {settings.schoolName}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
              <span>Session: <strong className="text-blue-600 dark:text-blue-400 font-medium">{settings.activeSession}</strong></span>
              <span>·</span>
              <span className="hidden md:inline text-neutral-400">{settings.city}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Global Search Input */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search students, roll numbers, staff, receipts..."
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-9 pr-4 py-2 text-xs md:text-sm text-neutral-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-blue-500 dark:focus:bg-neutral-900 transition-colors"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Zone: Controls, Role Switcher, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Public Website / Index Page Quick Switcher */}
        {onNavigateToPublic && (
          <button
            onClick={onNavigateToPublic}
            className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-800 hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50 transition-colors shadow-2xs cursor-pointer"
            title="View Public Website & #IQRA_TALENT_AWARD_CEREMONY Gallery"
          >
            <Globe className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Website (Index)</span>
          </button>
        )}

        {/* User Role Badge (Static - users cannot switch roles directly from dashboard) */}
        <div className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
          <Shield className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span className="hidden sm:inline text-neutral-500">Role:</span>
          <span className="font-bold text-neutral-900 dark:text-neutral-100">{currentUser.role}</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowRoleMenu(false);
              setShowUserMenu(false);
            }}
            className="relative rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-neutral-200 bg-white p-3 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    System Alerts & Notices
                  </h3>
                  {unreadNotifs.length > 0 && (
                    <span className="text-xs bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 px-1.5 py-0.5 rounded-sm font-medium">
                      {unreadNotifs.length} new
                    </span>
                  )}
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
                {notifications.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-6 text-center">No notifications</p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        markNotificationRead(item.id);
                        if (item.linkTab) {
                          setActiveTab(item.linkTab);
                          setShowNotifMenu(false);
                        }
                      }}
                      className={`p-2.5 rounded-lg transition-colors cursor-pointer ${
                        !item.isRead
                          ? 'bg-blue-50/60 dark:bg-blue-950/30'
                          : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {item.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-amber-400" />
          ) : (
            <Moon className="h-5 w-5 text-neutral-600" />
          )}
        </button>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifMenu(false);
            }}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-8 w-8 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="hidden lg:block text-left text-xs">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 truncate max-w-[120px]">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {currentUser.role}
              </div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 z-50">
              <div className="p-3 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                  {currentUser.email}
                </p>
                <span className="inline-block mt-1 text-[10px] font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded-sm">
                  {currentUser.role}
                </span>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-100 rounded-lg dark:text-neutral-300 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  <UserCheck className="h-4 w-4" />
                  School Settings & Profile
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-950/40 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
