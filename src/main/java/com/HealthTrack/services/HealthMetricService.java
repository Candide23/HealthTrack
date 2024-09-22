package com.HealthTrack.services;

import com.HealthTrack.dtos.HealthMetricDto;

import java.util.List;

public interface HealthMetricService {

    HealthMetricDto createHealthMetric(HealthMetricDto healthMetricDto);
    HealthMetricDto findHealthMetricById(Long healthMetricId);
    List<HealthMetricDto> findAllHealthMetric();
    HealthMetricDto updateHealthMetric(Long healthMetricId, HealthMetricDto healthMetricDto);

    void deleteHealthMetric(Long healthMetricId);


}
