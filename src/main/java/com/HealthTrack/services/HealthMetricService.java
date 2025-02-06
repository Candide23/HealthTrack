package com.HealthTrack.services;

import com.HealthTrack.dtos.HealthMetricDto;
import com.HealthTrack.models.HealthMetric;

import java.util.List;

public interface HealthMetricService {
    HealthMetricDto createHealthMetric(HealthMetricDto healthMetricDto);
    HealthMetricDto findHealthMetricById(Long healthMetricId);
    List<HealthMetricDto> findAllHealthMetricsByUserId(Long userId);
    HealthMetricDto updateHealthMetric(Long healthMetricId, HealthMetricDto healthMetricDto);
    void deleteHealthMetric(Long healthMetricId);

}
