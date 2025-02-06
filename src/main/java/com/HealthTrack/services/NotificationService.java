package com.HealthTrack.services;

import com.HealthTrack.dtos.NotificationDto;
import com.HealthTrack.models.HealthMetric;

import java.util.List;

public interface NotificationService {

    void sendAbnormalHealthMetricNotification(HealthMetric healthMetric);
    List<NotificationDto> getUserNotifications(Long userId);
    void markNotificationAsRead(Long notificationId);
    NotificationDto createNotification(NotificationDto notificationDto);
    NotificationDto updateNotification(Long notificationId, NotificationDto notificationDto);
    void deleteNotification(Long notificationId);
}
