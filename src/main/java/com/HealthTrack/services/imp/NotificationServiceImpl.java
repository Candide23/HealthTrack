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

        // Thresholds for different health metrics
        Map<String, Double> thresholds = new HashMap<>();
        thresholds.put("Blood Pressure", 140.0);    // Systolic BP > 140 mmHg
        thresholds.put("Heart Rate", 100.0);        // Heart Rate > 100 bpm (tachycardia)
        thresholds.put("Blood Sugar", 180.0);       // Blood Sugar > 180 mg/dL (post-meal hyperglycemia)
        thresholds.put("Cholesterol", 200.0);       // Cholesterol > 200 mg/dL (high cholesterol)
        thresholds.put("Body Temperature", 38.0);   // Body Temperature > 38°C (fever)
        thresholds.put("Respiratory Rate", 20.0);   // Respiratory Rate > 20 breaths per minute (tachypnea)
        thresholds.put("Oxygen Saturation", 90.0);  // Oxygen Saturation < 90% (hypoxemia)
        thresholds.put("BMI", 30.0);                // BMI > 30 (Obesity)
        thresholds.put("Weight", 150.0);            // Weight > 150 kg (high weight)
        thresholds.put("Height", 200.0);            // Height > 200 cm (unusual height)
        thresholds.put("Blood Pressure Diastolic", 90.0); // Diastolic BP > 90 mmHg

        Double thresholdValue = thresholds.get(healthMetric.getMetricType());
        if (thresholdValue != null && healthMetric.getValue() > thresholdValue) {
            boolean notificationExists = notificationRepository.existsSimilarNotification(
                    user.getId(), healthMetric.getMetricType(), now.minusHours(24)
            );

            if (!notificationExists) {
                Notification notification = new Notification();
                notification.setMessage(buildNotificationMessage(healthMetric, thresholdValue));
                notification.setType("HealthMetricAlert");
                notification.setMetricType(healthMetric.getMetricType());  // Set the metricType
                notification.setTimestamp(now);
                notification.setUser(user);

                // Save the notification
                Notification savedNotification = notificationRepository.save(notification);
                logNotification(savedNotification); // Add logging to ensure it's saved
            }
        }
    }

    // Method to generate custom notification message based on the metric type and value
    private String buildNotificationMessage(HealthMetric healthMetric, Double threshold) {
        return String.format(
                "Warning! Your %s is abnormally high: %.2f (Threshold: %.2f). Please consult a healthcare provider.",
                healthMetric.getMetricType(),
                healthMetric.getValue(),
                threshold
        );
    }

    // Log notification (could be used for auditing or further action)
    private void logNotification(Notification notification) {
        // Example: Log the notification for auditing purposes or trigger further actions
        System.out.println("Notification sent: " + notification.getMessage());
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
