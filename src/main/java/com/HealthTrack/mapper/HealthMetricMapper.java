package com.HealthTrack.mapper;

import com.HealthTrack.dtos.HealthMetricDto;
import com.HealthTrack.models.HealthMetric;

public class HealthMetricMapper {

    public static HealthMetricDto mapToHealthMetricDto(HealthMetric healthMetric){

        return new HealthMetricDto(
                healthMetric.getId(),
                healthMetric.getMetricType(),
                healthMetric.getValue(),
                healthMetric.getTimestamp()

        );
    }

    public static HealthMetric mapToHealthMetric(HealthMetricDto healthMetricDto){

        return new HealthMetric(
                healthMetricDto.getId(),
                healthMetricDto.getMetricType(),
                healthMetricDto.getValue(),
                healthMetricDto.getTimestamp()
        );

    }
}
