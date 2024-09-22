package com.HealthTrack.mapper;

import com.HealthTrack.dtos.HealthMetricDto;
import com.HealthTrack.models.HealthMetric;
import com.HealthTrack.models.User;

public class HealthMetricMapper {

    public static HealthMetricDto mapToHealthMetricDto(HealthMetric healthMetric){

        return new HealthMetricDto(
                healthMetric.getId(),
                healthMetric.getMetricType(),
                healthMetric.getValue(),
                healthMetric.getTimestamp(),
                healthMetric.getUser() != null ? healthMetric.getUser().getId() : null  // Check for null user Really important

        );
    }

    public static HealthMetric mapToHealthMetric(HealthMetricDto healthMetricDto, User user){

        return new HealthMetric(
                healthMetricDto.getId(),
                healthMetricDto.getMetricType(),
                healthMetricDto.getValue(),
                healthMetricDto.getTimestamp(),
                user // User entity passed from the service layer
        );

    }
}
