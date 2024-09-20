package com.HealthTrack.services;

import com.HealthTrack.dtos.HealthMetricDto;

public interface HealthMetricService {

    HealthMetricDto createHealthMetric(HealthMetricDto healthMetricDto);

    HealthMetricDto getHealthMetricById(Long healthMetricId);


}
