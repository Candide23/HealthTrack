package com.HealthTrack.services.imp;

import com.HealthTrack.dtos.HealthMetricDto;
import com.HealthTrack.mapper.HealthMetricMapper;
import com.HealthTrack.models.HealthMetric;
import com.HealthTrack.models.User;
import com.HealthTrack.repositories.HealthMetricRepository;
import com.HealthTrack.repositories.UserRepository;
import com.HealthTrack.services.HealthMetricService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class HealthMetricServiceImpl implements HealthMetricService {

    private HealthMetricRepository healthMetricRepository;

    private UserRepository userRepository;

    @Override
    public HealthMetricDto createHealthMetric(HealthMetricDto healthMetricDto) {
        User user = userRepository.findById(healthMetricDto.getUserId()).orElseThrow();


        HealthMetric healthMetric = HealthMetricMapper.mapToHealthMetric(healthMetricDto, user);
        HealthMetric saveHealthMetric = healthMetricRepository.save(healthMetric);
        return HealthMetricMapper.mapToHealthMetricDto(saveHealthMetric);
    }

    @Override
    public HealthMetricDto getHealthMetricById(Long healthMetricId) {

        HealthMetric healthMetric = healthMetricRepository.findById(healthMetricId)
                .orElseThrow(() -> new RuntimeException("healthMetricId not found"));
        return HealthMetricMapper.mapToHealthMetricDto(healthMetric);
    }

    @Override
    public List<HealthMetricDto> getAllHealthMetric() {

        List<HealthMetric> healthMetrics = healthMetricRepository.findAll();
        return healthMetrics.stream()
                .map((healthMetric -> HealthMetricMapper.mapToHealthMetricDto(healthMetric)))
                .collect(Collectors.toList());
    }

    @Override
    public HealthMetricDto updateHealthMetric(Long healthMetricId, HealthMetricDto healthMetricDto) {

        HealthMetric healthMetric = healthMetricRepository.findById(healthMetricId).orElseThrow(() -> new RuntimeException("healthMetricId not found"));

        healthMetric.setMetricType(healthMetric.getMetricType());
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
