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
        thresholds.put("Blood Pressure", 140.0);
        thresholds.put("Heart Rate", 100.0);
        thresholds.put("Blood Sugar", 180.0);

        // Check if the metric exceeds the threshold
        Double thresholdValue = thresholds.get(healthMetric.getMetricType());
        if (thresholdValue != null && healthMetric.getValue() > thresholdValue) {

            // Check if a similar notification was sent recently (within 24 hours)
            boolean notificationExists = notificationRepository.existsSimilarNotification(
                    user.getId(), healthMetric.getMetricType(), now.minusHours(24));

            if (!notificationExists) {
                Notification notification = new Notification();
                notification.setMessage(buildNotificationMessage(healthMetric, thresholdValue));
                notification.setType("HealthMetricAlert");
                notification.setTimestamp(now);
                notification.setUser(user);

                // Save notification and log it
                notificationRepository.save(notification);
                logNotification(notification);
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
}
