package com.HealthTrack.services.imp;

import com.HealthTrack.dtos.NotificationDto;
import com.HealthTrack.mapper.NotificationMapper;
import com.HealthTrack.models.HealthMetric;
import com.HealthTrack.models.Notification;
import com.HealthTrack.models.User;
import com.HealthTrack.repositories.NotificationRepository;
import com.HealthTrack.repositories.UserRepository;
import com.HealthTrack.services.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class NotificationServiceImpl implements NotificationService {

    private NotificationRepository notificationRepository;
    private UserRepository userRepository;


    @Override
    public void sendAbnormalHealthMetricNotification(HealthMetric healthMetric) {
        User user = healthMetric.getUser();
        LocalDateTime now = LocalDateTime.now();
        Map<String, Double> thresholds = new HashMap<>();
        thresholds.put("Blood Pressure", 140.0);
        thresholds.put("Heart Rate", 100.0);
        thresholds.put("Blood Sugar", 180.0);
        thresholds.put("Cholesterol", 200.0);
        thresholds.put("Body Temperature", 38.0);
        thresholds.put("Respiratory Rate", 20.0);
        thresholds.put("Oxygen Saturation", 90.0);
        thresholds.put("BMI", 30.0);
        thresholds.put("Weight", 150.0);
        thresholds.put("Height", 200.0);
        thresholds.put("Blood Pressure Diastolic", 90.0);

        Double thresholdValue = thresholds.get(healthMetric.getMetricType());
        if (thresholdValue != null && healthMetric.getValue() > thresholdValue) {
            boolean notificationExists = notificationRepository.existsSimilarNotification(
                    user.getId(), healthMetric.getMetricType(), now.minusHours(24)
            );

            if (!notificationExists) {
                Notification notification = new Notification();
                notification.setMessage(buildNotificationMessage(healthMetric, thresholdValue));
                notification.setType("HealthMetricAlert");
                notification.setMetricType(healthMetric.getMetricType());
                notification.setTimestamp(now);
                notification.setUser(user);
                Notification savedNotification = notificationRepository.save(notification);
                logNotification(savedNotification);
            }
        }
    }

    private String buildNotificationMessage(HealthMetric healthMetric, Double threshold) {
        return String.format(
                "Warning! Your %s is abnormally high: %.2f (Threshold: %.2f). Please consult a healthcare provider.",
                healthMetric.getMetricType(),
                healthMetric.getValue(),
                threshold
        );
    }

    private void logNotification(Notification notification) {System.out.println("Notification sent: " + notification.getMessage());
    }

    @Override
    public List<NotificationDto> getUserNotifications(Long userId) {
        return notificationRepository.findByUserId(userId).stream()
                .map(NotificationMapper::mapToNotificationDto)
                .collect(Collectors.toList());
    }

    @Override
    public void markNotificationAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);

    }

    @Override
    public NotificationDto createNotification(NotificationDto notificationDto) {
        User user = userRepository.findById(notificationDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Notification notification = NotificationMapper.mapToNotification(notificationDto, user);
        Notification savedNotification = notificationRepository.save(notification);
        return NotificationMapper.mapToNotificationDto(savedNotification);
    }

    @Override
    public NotificationDto updateNotification(Long notificationId, NotificationDto notificationDto) {
        Notification existingNotification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        existingNotification.setMessage(notificationDto.getMessage());
        existingNotification.setMetricType(notificationDto.getMetricType());
        existingNotification.setType(notificationDto.getType());
        existingNotification.setRead(notificationDto.isRead());
        existingNotification.setTimestamp(notificationDto.getTimestamp());
        Notification updatedNotification = notificationRepository.save(existingNotification);
        return NotificationMapper.mapToNotificationDto(updatedNotification);
    }

    @Override
    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notificationRepository.delete(notification);
    }


}
