package com.HealthTrack.repositories;

import com.HealthTrack.models.HealthMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface HealthMetricRepository extends JpaRepository<HealthMetric, Long> {

    List<HealthMetric> findByUserId(Long userId);

}
