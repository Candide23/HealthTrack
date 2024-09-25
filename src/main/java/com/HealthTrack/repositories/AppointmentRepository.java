package com.HealthTrack.repositories;

import com.HealthTrack.models.Appointment;
import com.HealthTrack.models.HealthMetric;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByUserId(Long userId);

}
