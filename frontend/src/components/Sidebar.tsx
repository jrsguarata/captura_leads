import React from 'react';
import { NavLink } from 'react-router-dom';
import { LucideIcon, Menu, X } from 'lucide-react';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, isOpen, onToggle }) => {
  return (
    <>
      {/* Toggle button for mobile */}
      <button
        onClick={onToggle}
        className="fixed left-4 top-4 z-50 rounded-lg bg-primary-600 p-2 text-white lg:hidden"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-primary-900 text-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center border-b border-primary-800 p-6">
            <h2 className="text-xl font-bold">Captura Leads</h2>
          </div>

          {/* Menu */}
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path.split('/').length <= 3}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    isActive
                      ? 'bg-primary-800 text-white'
                      : 'text-primary-200 hover:bg-primary-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-primary-800 p-4">
            <p className="text-center text-xs text-primary-400">© 2024 Captura Leads</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
