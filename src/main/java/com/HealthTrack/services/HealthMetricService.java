package com.HealthTrack.services;

import com.HealthTrack.dtos.HealthMetricDto;

import java.util.List;

public interface HealthMetricService {

    HealthMetricDto createHealthMetric(HealthMetricDto healthMetricDto);
    HealthMetricDto getHealthMetricById(Long healthMetricId);

    List<HealthMetricDto> getAllHealthMetric();


}
