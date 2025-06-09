package com.HealthTrack.services.imp;

import com.HealthTrack.dtos.NotificationDto;
import com.HealthTrack.mapper.NotificationMapper;
import com.HealthTrack.models.HealthMetric;
import com.HealthTrack.models.Notification;
import com.HealthTrack.models.Symptom;
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
import java.util.Set;
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
        thresholds.put("Weight", 330.0); // 330 lbs threshold
        thresholds.put("Height", 78.0); // 78 inches threshold
        thresholds.put("Blood Pressure Diastolic", 90.0);

        Double thresholdValue = thresholds.get(healthMetric.getMetricType());
        if (thresholdValue != null && healthMetric.getValue() > thresholdValue) {
            boolean notificationExists = notificationRepository.existsSimilarNotification(
                    user.getId(), healthMetric.getMetricType(), now.minusHours(24)
            );

            if (!notificationExists) {
                Notification notification = new Notification();
                notification.setMessage(buildHealthMetricNotificationMessage(healthMetric, thresholdValue));
                notification.setType("HealthMetricAlert");
                notification.setMetricType(healthMetric.getMetricType());
                notification.setTimestamp(now);
                notification.setUser(user);
                notification.setRead(false);
                Notification savedNotification = notificationRepository.save(notification);
                logNotification(savedNotification);
            }
        }
    }

    /**
     * Send comprehensive symptom-based notification
     */
    public void sendSymptomBasedNotification(Symptom symptom) {
        User user = symptom.getUser();
        LocalDateTime now = LocalDateTime.now();

        // Determine notification type and message based on symptom characteristics
        String notificationType = determineSymptomNotificationType(symptom);
        String message = buildSymptomNotificationMessage(symptom, notificationType);

        // Check if similar notification was sent recently
        boolean notificationExists = notificationRepository.existsSimilarNotification(
                user.getId(), notificationType, now.minusHours(getNotificationCooldownHours(notificationType))
        );

        if (!notificationExists) {
            Notification notification = new Notification();
            notification.setMessage(message);
            notification.setType(notificationType);
            notification.setMetricType(symptom.getSymptomType());
            notification.setTimestamp(now);
            notification.setUser(user);
            notification.setRead(false);

            Notification savedNotification = notificationRepository.save(notification);
            logNotification(savedNotification);
        }
    }

    /**
     * Send wellness tip notifications based on symptom patterns
     */
    public void sendWellnessTipNotification(User user, String symptomType, int severity) {
        String tipMessage = generateWellnessTip(symptomType, severity);

        // Check if wellness tip was sent recently (once per day)
        boolean notificationExists = notificationRepository.existsSimilarNotification(
                user.getId(), "WellnessTip", LocalDateTime.now().minusHours(24)
        );

        if (!notificationExists && tipMessage != null) {
            Notification notification = new Notification();
            notification.setMessage(tipMessage);
            notification.setType("WellnessTip");
            notification.setMetricType(symptomType);
            notification.setTimestamp(LocalDateTime.now());
            notification.setUser(user);
            notification.setRead(false);

            Notification savedNotification = notificationRepository.save(notification);
            logNotification(savedNotification);
        }
    }

    /**
     * Determine the type of notification based on symptom characteristics
     */
    private String determineSymptomNotificationType(Symptom symptom) {
        // Critical symptoms that need immediate attention
        Set<String> criticalSymptoms = Set.of(
                "Chest Pain", "Severe Headache", "Difficulty Breathing",
                "Sudden Vision Loss", "Severe Abdominal Pain", "Numbness", "Confusion"
        );

        if (criticalSymptoms.contains(symptom.getSymptomType())) {
            return "CriticalSymptomAlert";
        }

        // High severity symptoms (8-10)
        if (symptom.getSeverity() >= 8) {
            return "HighSeveritySymptom";
        }

        // Moderate to high severity (6-7)
        if (symptom.getSeverity() >= 6) {
            return "ModerateSymptomAlert";
        }

        // General symptom tracking
        return "SymptomTracking";
    }

    /**
     * Get notification cooldown hours based on type
     */
    private int getNotificationCooldownHours(String notificationType) {
        switch (notificationType) {
            case "CriticalSymptomAlert":
                return 2; // 2 hours for critical symptoms
            case "HighSeveritySymptom":
                return 6; // 6 hours for high severity
            case "ModerateSymptomAlert":
                return 12; // 12 hours for moderate
            case "SymptomTracking":
                return 24; // 24 hours for general tracking
            case "WellnessTip":
                return 24; // 24 hours for wellness tips
            default:
                return 24;
        }
    }

    /**
     * Build symptom notification message based on type and severity
     */
    private String buildSymptomNotificationMessage(Symptom symptom, String notificationType) {
        String symptomType = symptom.getSymptomType();
        int severity = symptom.getSeverity();
        String description = symptom.getDescription();

        switch (notificationType) {
            case "CriticalSymptomAlert":
                return String.format("🚨 URGENT: You've reported %s. This symptom requires immediate medical attention. " +
                                "Severity: %d/10. Description: %s. Please seek emergency care or contact your doctor immediately.",
                        symptomType.toLowerCase(), severity, description);

            case "HighSeveritySymptom":
                return String.format("⚠️ HIGH SEVERITY: Your %s is rated %d/10. This is concerning and you should " +
                                "consider contacting a healthcare provider today. Description: %s. Monitor closely for any changes.",
                        symptomType.toLowerCase(), severity, description);

            case "ModerateSymptomAlert":
                return String.format("📋 MODERATE SYMPTOM: You've logged %s with severity %d/10. " +
                        "Keep monitoring this symptom. If it persists or worsens, consider consulting a healthcare provider. " +
                        "Description: %s", symptomType.toLowerCase(), severity, description);

            case "SymptomTracking":
                return String.format("📊 SYMPTOM LOGGED: %s recorded with severity %d/10. " +
                        "We're tracking your symptoms to help identify patterns. Description: %s. " +
                        "Remember to rest and stay hydrated.", symptomType.toLowerCase(), severity, description);

            default:
                return String.format("Symptom Update: %s logged with severity %d/10.", symptomType, severity);
        }
    }

    /**
     * Generate wellness tips based on symptom type and severity
     */
    private String generateWellnessTip(String symptomType, int severity) {
        Map<String, String> wellnessTips = new HashMap<>();

        wellnessTips.put("Headache", "💡 TIP: For headaches, try drinking more water, getting adequate sleep, " +
                "and taking breaks from screens. Consider gentle neck stretches and relaxation techniques.");

        wellnessTips.put("Fatigue", "💡 TIP: Combat fatigue by maintaining a regular sleep schedule, eating balanced meals, " +
                "staying hydrated, and incorporating light exercise like walking into your routine.");

        wellnessTips.put("Fever", "💡 TIP: When experiencing fever, rest, drink plenty of fluids, and monitor your temperature. " +
                "If fever exceeds 101°F (38.3°C) or persists, contact a healthcare provider.");

        wellnessTips.put("Cough", "💡 TIP: For coughs, stay hydrated, use a humidifier, avoid irritants like smoke, " +
                "and consider honey (for adults) or throat lozenges for relief.");

        wellnessTips.put("Nausea", "💡 TIP: To manage nausea, try eating small, bland meals, sipping ginger tea, " +
                "getting fresh air, and avoiding strong odors. Rest in a comfortable position.");

        wellnessTips.put("Muscle Pain", "💡 TIP: For muscle pain, apply heat or ice as needed, gentle stretching, " +
                "adequate rest, and stay hydrated. Light movement can help prevent stiffness.");

        // Default tip for unlisted symptoms
        String tip = wellnessTips.get(symptomType);
        if (tip == null) {
            tip = "💡 TIP: Remember to rest, stay hydrated, and listen to your body. " +
                    "Track your symptoms and consult a healthcare provider if they persist or worsen.";
        }

        // Add severity-specific advice
        if (severity >= 7) {
            tip += " Given the severity of your symptoms, please consider seeking medical advice.";
        } else if (severity >= 5) {
            tip += " Monitor your symptoms closely and don't hesitate to seek care if needed.";
        }

        return tip;
    }

    private String buildHealthMetricNotificationMessage(HealthMetric healthMetric, Double threshold) {
        String metric = healthMetric.getMetricType();
        double value = healthMetric.getValue();
        String message;

        switch (metric) {
            case "BMI":
                if (value > 30) {
                    message = String.format("Your BMI is %.2f, which is considered obese. Please consult with a nutritionist or healthcare provider.", value);
                } else if (value > 25) {
                    message = String.format("Your BMI is %.2f, indicating overweight. Consider a balanced diet and regular exercise.", value);
                } else {
                    message = String.format("Your BMI is %.2f, slightly above normal. Stay active and monitor regularly.", value);
                }
                break;

            case "Weight":
                if (value > 330 && value < 660) {
                    message = String.format("Your recorded weight is %.2f lbs. Please ensure this is accurate and consult a doctor if unexpected.", value);
                } else if (value >= 660) {
                    message = String.format("Weight registered: %.2f lbs. This is extremely high - please seek immediate medical attention.", value);
                } else {
                    message = String.format("Weight registered: %.2f lbs. No critical alert, just for your awareness.", value);
                }
                break;

            case "Height":
                if (value > 78) {
                    message = String.format("Your recorded height is %.2f inches (%.1f feet). Please verify this measurement is correct.",
                            value, value / 12.0);
                } else {
                    message = String.format("Height registered: %.2f inches. No concerns noted.", value);
                }
                break;

            default:
                message = String.format(
                        "Warning! Your %s is abnormally high: %.2f (Threshold: %.2f). Please consult a healthcare provider.",
                        metric, value, threshold
                );
                break;
        }

        return message;
    }

    private void logNotification(Notification notification) {
        System.out.println("Notification sent: " + notification.getMessage());
        System.out.println("Type: " + notification.getType() + ", User: " + notification.getUser().getId());
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
