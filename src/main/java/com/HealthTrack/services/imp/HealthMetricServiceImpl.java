package com.HealthTrack.services.imp;

import com.HealthTrack.dtos.HealthMetricDto;
import com.HealthTrack.mapper.HealthMetricMapper;
import com.HealthTrack.models.HealthMetric;
import com.HealthTrack.models.User;
import com.HealthTrack.repositories.HealthMetricRepository;
import com.HealthTrack.repositories.NotificationRepository;
import com.HealthTrack.repositories.UserRepository;
import com.HealthTrack.services.HealthMetricService;
import com.HealthTrack.services.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class HealthMetricServiceImpl implements HealthMetricService {
    private HealthMetricRepository healthMetricRepository;
    private UserRepository userRepository;
    private NotificationService notificationService;


    private void calculateAndSaveBMI(HealthMetric weightMetric, HealthMetric heightMetric) {
        // Validate input parameters
        if (weightMetric == null || heightMetric == null) {
            return;
        }

        if (weightMetric.getUser() == null || !weightMetric.getUser().equals(heightMetric.getUser())) {
            return;
        }

        // Get values - weight in pounds, height in inches
        double weightPounds = weightMetric.getValue();
        double heightInches = heightMetric.getValue();

        // Validate values
        if (weightPounds <= 0 || heightInches <= 0) {
            return;
        }

        // Reasonable bounds check (50-1000 lbs, 24-96 inches)
        if (weightPounds < 50 || weightPounds > 1000 || heightInches < 24 || heightInches > 96) {
            return;
        }

        // Calculate BMI using imperial formula: (weight in pounds / (height in inches)²) × 703
        double bmi = (weightPounds / (heightInches * heightInches)) * 703;

        // Round to 2 decimal places
        bmi = Math.round(bmi * 100.0) / 100.0;

        // Create and save BMI metric
        HealthMetric bmiMetric = new HealthMetric();
        bmiMetric.setMetricType("BMI");
        bmiMetric.setValue(bmi);
        bmiMetric.setTimestamp(LocalDateTime.now());
        bmiMetric.setUser(weightMetric.getUser());

        healthMetricRepository.save(bmiMetric);
    }



    @Override
    public HealthMetricDto createHealthMetric(HealthMetricDto healthMetricDto) {
        User user = userRepository.findById(healthMetricDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        HealthMetric healthMetric = HealthMetricMapper.mapToHealthMetric(healthMetricDto, user);

        // Convert to Chicago timezone if needed
        if (healthMetric.getTimestamp() != null) {
            ZonedDateTime chicagoTime = healthMetric.getTimestamp()
                    .atZone(ZoneId.of("UTC"))
                    .withZoneSameInstant(ZoneId.of("America/Chicago"));
            healthMetric.setTimestamp(chicagoTime.toLocalDateTime());
        }

        HealthMetric savedMetric = healthMetricRepository.save(healthMetric);

        // BMI calculation if weight (in pounds) or height (in inches) submitted
        if ("Weight".equalsIgnoreCase(healthMetric.getMetricType())) {
            // Weight metric saved - look for most recent height to calculate BMI
            healthMetricRepository.findTopByUserIdAndMetricTypeOrderByTimestampDesc(user.getId(), "Height")
                    .ifPresent(heightMetric -> {
                        // Ensure we're using pounds for weight and inches for height
                        if (isValidWeightInPounds(savedMetric) && isValidHeightInInches(heightMetric)) {
                            calculateAndSaveBMI(savedMetric, heightMetric);
                        }
                    });
        } else if ("Height".equalsIgnoreCase(healthMetric.getMetricType())) {
            // Height metric saved - look for most recent weight to calculate BMI
            healthMetricRepository.findTopByUserIdAndMetricTypeOrderByTimestampDesc(user.getId(), "Weight")
                    .ifPresent(weightMetric -> {
                        // Ensure we're using pounds for weight and inches for height
                        if (isValidWeightInPounds(weightMetric) && isValidHeightInInches(savedMetric)) {
                            calculateAndSaveBMI(weightMetric, savedMetric);
                        }
                    });
        }

        notificationService.sendAbnormalHealthMetricNotification(savedMetric);
        return HealthMetricMapper.mapToHealthMetricDto(savedMetric);
    }

    private boolean isValidWeightInPounds(HealthMetric weightMetric) {
        if (weightMetric == null || weightMetric.getValue() <= 0) {
            return false;
        }

        double weight = weightMetric.getValue();
        // Validate reasonable weight range in pounds (50-1000 lbs)
        return weight >= 50 && weight <= 1000;
    }

    private boolean isValidHeightInInches(HealthMetric heightMetric) {
        if (heightMetric == null || heightMetric.getValue() <= 0) {
            return false;
        }

        double height = heightMetric.getValue();
        // Validate reasonable height range in inches (24-96 inches = 2-8 feet)
        return height >= 24 && height <= 96;
    }

    @Override
    public HealthMetricDto findHealthMetricById(Long healthMetricId) {

        HealthMetric healthMetric = healthMetricRepository.findById(healthMetricId)
                .orElseThrow(() -> new RuntimeException("healthMetricId not found"));
        return HealthMetricMapper.mapToHealthMetricDto(healthMetric);
    }


    @Override
    public List<HealthMetricDto> findAllHealthMetricsByUserId(Long userId) {

        List<HealthMetric> healthMetrics = healthMetricRepository.findByUserId(userId);
        return healthMetrics.stream()
                .map(HealthMetricMapper::mapToHealthMetricDto)
                .collect(Collectors.toList());
    }


    @Override
    public HealthMetricDto updateHealthMetric(Long healthMetricId, HealthMetricDto healthMetricDto) {

        HealthMetric healthMetric = healthMetricRepository.findById(healthMetricId).orElseThrow(() -> new RuntimeException("healthMetricId not found"));
        healthMetric.setMetricType(healthMetricDto.getMetricType());
        healthMetric.setValue(healthMetricDto.getValue());
        healthMetric.setTimestamp(healthMetricDto.getTimestamp());
        HealthMetric updatedHealthMetric = healthMetricRepository.save(healthMetric);
        return HealthMetricMapper.mapToHealthMetricDto(updatedHealthMetric);
    }

    @Override
    public void deleteHealthMetric(Long healthMetricId) {

        HealthMetric healthMetric = healthMetricRepository.findById(healthMetricId)
                .orElseThrow(() -> new RuntimeException("healthMetricId not found"));
        healthMetricRepository.deleteById(healthMetricId);

    }




}
