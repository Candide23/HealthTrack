package com.HealthTrack.repositories;

import com.HealthTrack.models.HealthMetric;
import com.HealthTrack.models.Symptom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface SymptomRepository extends JpaRepository<Symptom, Long> {

    List<Symptom> findByUserId(Long userId);

}
