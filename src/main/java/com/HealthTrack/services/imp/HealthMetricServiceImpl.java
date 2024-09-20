package com.HealthTrack.services.imp;

import com.HealthTrack.dtos.HealthMetricDto;
import com.HealthTrack.mapper.HealthMetricMapper;
import com.HealthTrack.models.HealthMetric;
import com.HealthTrack.repositories.HealthMetricRepository;
import com.HealthTrack.services.HealthMetricService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class HealthMetricServiceImpl implements HealthMetricService {

    private HealthMetricRepository healthMetricRepository;

    @Override
    public HealthMetricDto createHealthMetric(HealthMetricDto healthMetricDto) {

        HealthMetric healthMetric = HealthMetricMapper.mapToHealthMetric(healthMetricDto);
        HealthMetric saveHealthMetric = healthMetricRepository.save(healthMetric);
        return HealthMetricMapper.mapToHealthMetricDto(saveHealthMetric);
    }

    @Override
    public HealthMetricDto getHealthMetricById(Long healthMetricId) {

        HealthMetric healthMetric = healthMetricRepository.findById(healthMetricId)
                .orElseThrow(() -> new RuntimeException("healthMetricId not found"));
        return HealthMetricMapper.mapToHealthMetricDto(healthMetric);
    }
}
