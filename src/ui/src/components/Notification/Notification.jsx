import React, { useState, useEffect } from 'react';
import { NotificationAPI } from '../../services/api';
import './Notification.css';  // Optional: Add styling for notifications

const Notification = ({ fetchNewNotifications }) => {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const response = await NotificationAPI.getAll(userId);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await NotificationAPI.markAsRead(notificationId);
      fetchNotifications();  // Refresh after marking as read
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await NotificationAPI.delete(notificationId);
      fetchNotifications();  // Refresh after deletion
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  useEffect(() => {
    if (fetchNewNotifications) {
      fetchNewNotifications(fetchNotifications);  // Allows parent to trigger notification refresh
    }
  }, [fetchNewNotifications]);

  return (
    <div>
      <h4>Notifications</h4>
      {notifications.length === 0 ? (
        <p>No notifications available</p>
      ) : (
        <ul className="list-group">
          {notifications.map((notification) => (
            <li key={notification.id} className={`list-group-item ${notification.isRead ? '' : 'unread'}`}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{notification.message}</strong>
                  <br />
                  <small>Type: {notification.type}</small>
                  <br />
                  <small>Date: {new Date(notification.timestamp).toLocaleString()}</small>
                </div>
                <div>
                  {!notification.isRead && (
                    <button className="btn btn-success btn-sm mr-2" onClick={() => handleMarkAsRead(notification.id)}>
                      Mark as Read
                    </button>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(notification.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;


