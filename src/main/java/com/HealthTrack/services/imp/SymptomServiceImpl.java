package com.HealthTrack.services.imp;

import com.HealthTrack.dtos.SymptomDto;
import com.HealthTrack.dtos.NotificationDto;
import com.HealthTrack.mapper.SymptomMapper;
import com.HealthTrack.models.Symptom;
import com.HealthTrack.models.User;
import com.HealthTrack.repositories.SymptomRepository;
import com.HealthTrack.repositories.UserRepository;
import com.HealthTrack.services.SymptomService;
import com.HealthTrack.services.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class SymptomServiceImpl implements SymptomService {
    private SymptomRepository symptomRepository;
    private UserRepository userRepository;
    private NotificationService notificationService;

    @Override
    public SymptomDto createSymptom(SymptomDto symptomDto) {
        User user = userRepository.findById(symptomDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User with ID " + symptomDto.getUserId() + " not found"));

        Symptom symptom = SymptomMapper.mapToSymptom(symptomDto, user);
        Symptom savedSymptom = symptomRepository.save(symptom);

        // Send symptom-related notifications
        sendSymptomNotifications(savedSymptom);

        return SymptomMapper.mapToSymptomDto(savedSymptom);
    }

    @Override
    public SymptomDto findSymptomById(Long idSymptom) {
        Symptom symptom = symptomRepository.findById(idSymptom)
                .orElseThrow(() -> new RuntimeException("Symptom not found"));
        return SymptomMapper.mapToSymptomDto(symptom);
    }

    @Override
    public List<SymptomDto> findAllSymptomByUserId(Long userId) {
        List<Symptom> symptoms = symptomRepository.findByUserId(userId);
        return symptoms.stream().map(SymptomMapper::mapToSymptomDto)
                .collect(Collectors.toList());
    }

    @Override
    public SymptomDto updateSymptom(Long idSymptom, SymptomDto symptomDto) {
        Symptom symptom = symptomRepository.findById(idSymptom)
                .orElseThrow(() -> new RuntimeException("Symptom not found"));

        // Store old values for comparison
        int oldSeverity = symptom.getSeverity();

        symptom.setSymptomType(symptomDto.getSymptomType());
        symptom.setDescription(symptomDto.getDescription());
        symptom.setSeverity(symptomDto.getSeverity());
        symptom.setTimestamp(symptomDto.getTimestamp());

        Symptom updatedSymptom = symptomRepository.save(symptom);

        // Send notifications for significant changes
        if (updatedSymptom.getSeverity() - oldSeverity >= 3) {
            createSymptomNotification(updatedSymptom.getUser(),
                    buildDeteriorationMessage(updatedSymptom, oldSeverity),
                    "SymptomDeterioration",
                    updatedSymptom.getSymptomType());
        }

        return SymptomMapper.mapToSymptomDto(updatedSymptom);
    }

    @Override
    public void deleteSymptom(Long idSymptom) {
        Symptom symptom = symptomRepository.findById(idSymptom)
                .orElseThrow(() -> new RuntimeException("Symptom not found"));
        symptomRepository.deleteById(idSymptom);
    }

    /**
     * Send basic symptom notifications without repository dependencies
     */
    private void sendSymptomNotifications(Symptom symptom) {
        try {
            // High severity notification (7-10)
            if (symptom.getSeverity() >= 7) {
                String message = buildHighSeverityMessage(symptom);
                createSymptomNotification(symptom.getUser(), message, "HighSeveritySymptom", symptom.getSymptomType());
                System.out.println("High severity notification sent for: " + symptom.getSymptomType());
            }

            // Critical symptom type notification
            sendCriticalSymptomNotification(symptom);

            // Basic recurring pattern check using existing methods
            checkForBasicPatterns(symptom);

        } catch (Exception e) {
            System.out.println("Error sending notifications: " + e.getMessage());
        }
    }

    /**
     * Check for critical symptom types
     */
    private void sendCriticalSymptomNotification(Symptom symptom) {
        Set<String> criticalSymptoms = Set.of(
                "Chest Pain", "Severe Headache", "Difficulty Breathing",
                "Sudden Vision Loss", "Severe Abdominal Pain", "Numbness", "Confusion"
        );

        if (criticalSymptoms.contains(symptom.getSymptomType())) {
            String message = String.format("🚨 CRITICAL SYMPTOM ALERT: You've reported %s. " +
                            "This type of symptom can be serious and may require immediate medical evaluation. " +
                            "Severity: %d/10. Description: %s. Please consider contacting a healthcare provider.",
                    symptom.getSymptomType().toLowerCase(),
                    symptom.getSeverity(),
                    symptom.getDescription());

            createSymptomNotification(symptom.getUser(), message, "CriticalSymptom", symptom.getSymptomType());
            System.out.println("Critical symptom notification sent for: " + symptom.getSymptomType());
        }
    }

    /**
     * Basic pattern detection using existing repository methods
     */
    private void checkForBasicPatterns(Symptom symptom) {
        try {
            List<Symptom> allUserSymptoms = symptomRepository.findByUserId(symptom.getUser().getId());

            // Check for recurring symptoms (same type in last week)
            LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
            long sameSymptomCount = allUserSymptoms.stream()
                    .filter(s -> s.getSymptomType().equals(symptom.getSymptomType()))
                    .filter(s -> s.getTimestamp().isAfter(oneWeekAgo))
                    .count();

            if (sameSymptomCount >= 3) {
                String message = String.format("📋 RECURRING PATTERN: You've logged %s %d times in the past week. " +
                                "Consider discussing recurring symptoms with your healthcare provider.",
                        symptom.getSymptomType().toLowerCase(), (int) sameSymptomCount);

                createSymptomNotification(symptom.getUser(), message, "RecurringSymptom", symptom.getSymptomType());
                System.out.println("Recurring pattern notification sent for: " + symptom.getSymptomType());
            }

            // Check for multiple symptoms today
            LocalDateTime today = LocalDateTime.now().minusHours(24);
            Set<String> todaySymptomTypes = allUserSymptoms.stream()
                    .filter(s -> s.getTimestamp().isAfter(today))
                    .map(Symptom::getSymptomType)
                    .collect(Collectors.toSet());

            if (todaySymptomTypes.size() >= 3) {
                String symptomList = String.join(", ", todaySymptomTypes);
                String message = String.format("📊 MULTIPLE SYMPTOMS: You've logged %d different symptoms today: %s. " +
                                "Consider rest and hydration. Contact healthcare provider if symptoms worsen.",
                        todaySymptomTypes.size(), symptomList);

                createSymptomNotification(symptom.getUser(), message, "MultipleSymptoms", "Multiple");
                System.out.println("Multiple symptoms notification sent. Count: " + todaySymptomTypes.size());
            }

        } catch (Exception e) {
            System.out.println("Pattern detection error: " + e.getMessage());
        }
    }

    // Message building methods
    private String buildHighSeverityMessage(Symptom symptom) {
        String severity = getSeverityDescription(symptom.getSeverity());
        return String.format("⚠️ HIGH SEVERITY ALERT: You've logged %s with %s severity (%d/10). " +
                        "Description: %s. Please consider seeking medical attention if symptoms persist or worsen.",
                symptom.getSymptomType().toLowerCase(),
                severity,
                symptom.getSeverity(),
                symptom.getDescription());
    }

    private String buildDeteriorationMessage(Symptom symptom, int oldSeverity) {
        return String.format("📈 SYMPTOM WORSENING: Your %s has worsened from %d/10 to %d/10. " +
                        "Please monitor closely and consider seeking medical care if needed.",
                symptom.getSymptomType().toLowerCase(),
                oldSeverity,
                symptom.getSeverity());
    }

    private String getSeverityDescription(int severity) {
        if (severity >= 9) return "critical";
        if (severity >= 7) return "severe";
        if (severity >= 5) return "moderate";
        if (severity >= 3) return "mild";
        return "minimal";
    }

    /**
     * Create notification using NotificationService
     */
    private void createSymptomNotification(User user, String message, String type, String metricType) {
        try {
            NotificationDto notificationDto = new NotificationDto();
            notificationDto.setMessage(message);
            notificationDto.setType(type);
            notificationDto.setMetricType(metricType);
            notificationDto.setTimestamp(LocalDateTime.now());
            notificationDto.setUserId(user.getId());
            notificationDto.setRead(false);

            notificationService.createNotification(notificationDto);
            System.out.println("Notification created: " + type + " for user: " + user.getId());
        } catch (Exception e) {
            System.out.println("Error creating notification: " + e.getMessage());
        }
    }
}