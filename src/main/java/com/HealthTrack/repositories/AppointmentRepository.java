package com.HealthTrack.repositories;

import com.HealthTrack.models.Appointment;
import com.HealthTrack.models.HealthMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByUserId(Long userId);
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :now AND :threshold")
    List<Appointment> findAppointmentsWithinTimeframe(LocalDateTime now, LocalDateTime threshold);

}
