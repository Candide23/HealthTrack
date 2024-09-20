package com.HealthTrack.repositories;

import com.HealthTrack.models.Symptom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SymptomRepository extends JpaRepository<Symptom, Long> {
}
