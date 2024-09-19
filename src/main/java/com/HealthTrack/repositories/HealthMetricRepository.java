package com.HealthTrack.repositories;

import com.HealthTrack.models.HealthMetric;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HealthMetricRepository extends JpaRepository<HealthMetric, Long> {
}
