package com.HealthTrack.services;

import com.HealthTrack.dtos.NotificationDto;
import com.HealthTrack.models.HealthMetric;

import java.util.List;

public interface NotificationService {

    void sendAbnormalHealthMetricNotification(HealthMetric healthMetric);  // Business Logic
    List<NotificationDto> getUserNotifications(Long userId);  // Get all notifications for a user
    void markNotificationAsRead(Long notificationId);  // Mark a notification as read
    NotificationDto createNotification(NotificationDto notificationDto);  // Create a new notification
    NotificationDto updateNotification(Long notificationId, NotificationDto notificationDto);  // Update a notification
    void deleteNotification(Long notificationId);  // Delete a notification
}
