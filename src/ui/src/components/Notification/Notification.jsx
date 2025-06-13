import React, { useState, useEffect } from 'react';
import { NotificationAPI } from '../../services/api';

const Notification = ({ fetchNewNotifications }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, health, symptoms
  const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const response = await NotificationAPI.getAll(userId);
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await NotificationAPI.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await NotificationAPI.delete(id);
        fetchNotifications();
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    if (unreadNotifications.length === 0) return;

    try {
      await Promise.all(unreadNotifications.map(n => NotificationAPI.markAsRead(n.id)));
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

useEffect(() => {
  const interval = setInterval(() => {
    fetchNotifications();
  }, 5000);
  return () => clearInterval(interval);
}, []);


  // Get notification icon and styling based on type
  const getNotificationStyle = (notification) => {
    const type = notification.type?.toLowerCase() || '';
    const metricType = notification.metricType?.toLowerCase() || '';

    // Symptom-related notifications
    if (type.includes('symptom') || type.includes('critical') || type.includes('severity')) {
      if (type.includes('critical') || metricType.includes('chest') || metricType.includes('breathing')) {
        return {
          icon: '🚨',
          bgClass: 'critical-alert',
          borderClass: 'border-danger',
          textClass: 'text-danger'
        };
      } else if (type.includes('high') || type.includes('severe')) {
        return {
          icon: '⚠️',
          bgClass: 'high-severity-alert',
          borderClass: 'border-warning',
          textClass: 'text-warning'
        };
      } else if (type.includes('recurring') || type.includes('pattern')) {
        return {
          icon: '📋',
          bgClass: 'pattern-alert',
          borderClass: 'border-info',
          textClass: 'text-info'
        };
      } else if (type.includes('multiple')) {
        return {
          icon: '📊',
          bgClass: 'multiple-alert',
          borderClass: 'border-primary',
          textClass: 'text-primary'
        };
      } else if (type.includes('deterioration') || type.includes('worsening')) {
        return {
          icon: '📈',
          bgClass: 'deterioration-alert',
          borderClass: 'border-danger',
          textClass: 'text-danger'
        };
      } else {
        return {
          icon: '📝',
          bgClass: 'symptom-alert',
          borderClass: 'border-success',
          textClass: 'text-success'
        };
      }
    }

    // Health metric notifications
    if (type.includes('health') || type.includes('metric') || metricType === 'bmi') {
      return {
        icon: '💊',
        bgClass: 'health-alert',
        borderClass: 'border-info',
        textClass: 'text-info'
      };
    }

    // Wellness tips
    if (type.includes('wellness') || type.includes('tip')) {
      return {
        icon: '💡',
        bgClass: 'wellness-tip',
        borderClass: 'border-success',
        textClass: 'text-success'
      };
    }

    // Default
    return {
      icon: '🔔',
      bgClass: 'general-alert',
      borderClass: 'border-secondary',
      textClass: 'text-secondary'
    };
  };

  // Get priority level for sorting
  const getNotificationPriority = (notification) => {
    const type = notification.type?.toLowerCase() || '';

    if (type.includes('critical')) return 1;
    if (type.includes('high') || type.includes('severe')) return 2;
    if (type.includes('deterioration')) return 3;
    if (type.includes('multiple')) return 4;
    if (type.includes('recurring')) return 5;
    return 6;
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const type = notification.type?.toLowerCase() || '';

    if (filter === 'unread') return !notification.isRead;
    if (filter === 'symptoms') {
      return type.includes('symptom') || type.includes('critical') ||
             type.includes('severity') || type.includes('deterioration') ||
             type.includes('recurring') || type.includes('multiple');
    }
    if (filter === 'health') {
      return type.includes('health') || type.includes('metric') ||
             type.includes('bmi') || type.includes('wellness');
    }
    return true; // 'all'
  });

  // Sort notifications by priority and timestamp
  const sortedNotifications = filteredNotifications.sort((a, b) => {
    // First by priority
    const priorityDiff = getNotificationPriority(a) - getNotificationPriority(b);
    if (priorityDiff !== 0) return priorityDiff;

    // Then by timestamp (newest first)
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const symptomCount = notifications.filter(n => {
    const type = n.type?.toLowerCase() || '';
    return type.includes('symptom') || type.includes('critical') || type.includes('severity');
  }).length;

  return (
    <div className="notification-container">
      {/* Header with filters */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-1">
            🔔 Notifications
            {unreadCount > 0 && (
              <span className="badge badge-danger ml-2">{unreadCount}</span>
            )}
          </h4>
          {symptomCount > 0 && (
            <small className="text-muted">
              📊 {symptomCount} symptom-related alerts
            </small>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={handleMarkAllAsRead}
            title="Mark all as read"
          >
            Mark All Read
          </button>
        )}
      </div>

      {/* Filter buttons */}
      <div className="btn-group btn-group-sm mb-3" role="group">
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button
          className={`btn ${filter === 'unread' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button
          className={`btn ${filter === 'symptoms' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('symptoms')}
        >
          Symptoms ({symptomCount})
        </button>
        <button
          className={`btn ${filter === 'health' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('health')}
        >
          Health Metrics
        </button>
      </div>

      {/* Notifications list */}
      {sortedNotifications.length === 0 ? (
        <div className="text-center py-4 text-muted">
          <div className="mb-2">
            {filter === 'all' && '📭 No notifications available'}
            {filter === 'unread' && '✅ No unread notifications'}
            {filter === 'symptoms' && '😊 No symptom alerts'}
            {filter === 'health' && '💚 No health metric alerts'}
          </div>
          <small>
            {filter === 'symptoms' && 'Keep tracking your symptoms for health insights!'}
            {filter === 'health' && 'Your health metrics are looking good!'}
          </small>
        </div>
      ) : (
        <div className="notifications-list">
          {sortedNotifications.map((notification) => {
            const style = getNotificationStyle(notification);
            const timeAgo = getTimeAgo(notification.timestamp);

            return (
              <div
                key={notification.id}
                className={`card mb-2 ${style.borderClass} ${!notification.isRead ? 'notification-unread' : ''}`}
              >
                <div className={`card-body p-3 ${style.bgClass}`}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-start mb-2">
                        <span className="notification-icon mr-2" style={{fontSize: '18px'}}>
                          {style.icon}
                        </span>
                        <div className="flex-grow-1">
                          <div className={`notification-message ${style.textClass}`}>
                            {notification.message}
                          </div>
                          <div className="notification-meta mt-1">
                            <small className="text-muted">
                              <span className="badge badge-light mr-2">
                                {formatNotificationType(notification.type)}
                              </span>
                              {notification.metricType && (
                                <span className="badge badge-outline-secondary mr-2">
                                  {notification.metricType}
                                </span>
                              )}
                              <span title={new Date(notification.timestamp).toLocaleString()}>
                                🕒 {timeAgo}
                              </span>
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="notification-actions ml-2">
                      {!notification.isRead && (
                        <button
                          className="btn btn-success btn-sm mr-1"
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(notification.id)}
                        title="Delete notification"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // Helper functions
  function getTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return `${Math.floor(diffInMinutes / 10080)}w ago`;
  }

  function formatNotificationType(type) {
    if (!type) return 'General';

    // Convert camelCase/PascalCase to readable format
    return type
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
};

export default Notification;


