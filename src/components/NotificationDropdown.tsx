import React, { useState, useRef, useEffect } from 'react';
import { Bell, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, markNotificationRead, clearAllNotifications } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-kwado-green" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-xl hover:bg-kwado-border flex items-center justify-center transition-colors"
      >
        <Bell className="w-5 h-5 text-kwado-text-muted" />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 kwado-card shadow-xl z-50 animate-scale-in">
          <div className="flex items-center justify-between p-4 border-b border-kwado-border">
            <h3 className="font-semibold text-kwado-text">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-xs text-kwado-text-muted hover:text-kwado-green transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-10 h-10 text-kwado-text-secondary mx-auto mb-3" />
                <p className="text-kwado-text-muted">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => markNotificationRead(notification.id)}
                  className={`w-full flex items-start gap-3 p-4 hover:bg-kwado-border/50 transition-colors text-left border-b border-kwado-border last:border-b-0 ${
                    !notification.read ? 'bg-kwado-green/5' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-kwado-bg flex items-center justify-center flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${!notification.read ? 'text-kwado-text' : 'text-kwado-text-muted'}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-kwado-text-secondary mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-kwado-text-secondary mt-2">
                      {new Date(notification.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-kwado-green flex-shrink-0 mt-1" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
