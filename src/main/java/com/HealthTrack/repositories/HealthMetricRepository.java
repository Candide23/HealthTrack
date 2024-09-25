package com.HealthTrack.repositories;

import com.HealthTrack.models.HealthMetric;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HealthMetricRepository extends JpaRepository<HealthMetric, Long> {

    List<HealthMetric> findByUserId(Long userId);

}
