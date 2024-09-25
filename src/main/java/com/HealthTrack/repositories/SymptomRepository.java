package com.HealthTrack.repositories;

import com.HealthTrack.models.HealthMetric;
import com.HealthTrack.models.Symptom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SymptomRepository extends JpaRepository<Symptom, Long> {

    List<Symptom> findByUserId(Long userId);

}
