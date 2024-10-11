package com.HealthTrack.mapper;

import com.HealthTrack.dtos.NotificationDto;
import com.HealthTrack.models.Notification;
import com.HealthTrack.models.User;

public class NotificationMapper {

    public static NotificationDto mapToNotificationDto(Notification notification) {
        return new NotificationDto(
                notification.getId(),
                notification.getMessage(),
                notification.getMetricType(),
                notification.getType(),
                notification.isRead(),
                notification.getTimestamp(),
                notification.getUser().getId()
        );
    }

    public static Notification mapToNotification(NotificationDto notificationDto, User user) {
        return new Notification(
                notificationDto.getId(),
                notificationDto.getMessage(),
                notificationDto.getMetricType(),
                notificationDto.getType(),
                notificationDto.isRead(),
                notificationDto.getTimestamp(),
                user
        );
    }
}

