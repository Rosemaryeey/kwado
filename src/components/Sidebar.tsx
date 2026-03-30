import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Brain, 
  Calendar, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Map, 
  Lightbulb, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import NotificationDropdown from './NotificationDropdown';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, streak } = useApp();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/ai-tutor', label: 'AI Tutor', icon: Brain },
    { path: '/study-plan', label: 'Study Plan', icon: Calendar },
    { path: '/practice', label: 'Practice', icon: BookOpen },
    { path: '/cbt-simulator', label: 'CBT Simulator', icon: Target },
    { path: '/progress', label: 'Progress', icon: TrendingUp },
    { path: '/weakness-map', label: 'Weakness Map', icon: Map },
    { path: '/recommendations', label: 'Recommendations', icon: Lightbulb },
  ];

  const bottomItems = [
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-kwado-card border-r border-kwado-border z-40 transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-kwado-border">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-kwado-green flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-display font-bold text-kwado-text">Kwado</span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={onToggle}
            className="w-8 h-8 rounded-lg hover:bg-kwado-border flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-kwado-text-muted" />
          </button>
        )}
        {collapsed && (
          <button
            onClick={onToggle}
            className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-kwado-green text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Streak Badge */}
      {!collapsed && (
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <Zap className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-kwado-text">{streak} day streak</p>
              <p className="text-xs text-kwado-text-muted">Keep it up!</p>
            </div>
          </div>
        </div>
      )}
      {collapsed && (
        <div className="px-2 py-4">
          <div className="w-12 h-12 mx-auto rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-kwado-green/10 text-kwado-green'
                : 'text-kwado-text-muted hover:bg-kwado-border hover:text-kwado-text'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive(item.path) ? 'text-kwado-green' : ''}`} />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-2 py-4 border-t border-kwado-border space-y-1">
        {bottomItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-kwado-green/10 text-kwado-green'
                : 'text-kwado-text-muted hover:bg-kwado-border hover:text-kwado-text'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive(item.path) ? 'text-kwado-green' : ''}`} />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-kwado-text-muted hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* User Profile */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-kwado-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-kwado-green/20 flex items-center justify-center">
              <span className="text-kwado-green font-semibold">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-kwado-text truncate">{user?.name}</p>
              <p className="text-xs text-kwado-text-muted truncate">{user?.examType}</p>
            </div>
            <NotificationDropdown />
          </div>
        </div>
      )}
      {collapsed && (
        <div className="px-2 py-4 border-t border-kwado-border">
          <div className="w-10 h-10 mx-auto rounded-full bg-kwado-green/20 flex items-center justify-center">
            <span className="text-kwado-green font-semibold text-sm">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
