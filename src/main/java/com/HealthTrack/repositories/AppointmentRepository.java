package com.HealthTrack.repositories;

import com.HealthTrack.models.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


import org.springframework.data.repository.query.Param;


import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    /**
     * Find all appointments for a specific user
     */
    List<Appointment> findByUserId(Long userId);

    /**
     * Find appointments within a specific timeframe
     * Used for reminder notifications and conflict detection
     */
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :start AND :end")
    List<Appointment> findAppointmentsWithinTimeframe(@Param("start") LocalDateTime start,
                                                      @Param("end") LocalDateTime end);

    /**
     * Find upcoming appointments for a user (after current time)
     */
    @Query("SELECT a FROM Appointment a WHERE a.user.id = :userId AND a.appointmentDate > :currentTime " +
            "ORDER BY a.appointmentDate ASC")
    List<Appointment> findUpcomingAppointmentsByUserId(@Param("userId") Long userId,
                                                       @Param("currentTime") LocalDateTime currentTime);

    /**
     * Find past appointments for a user (before current time)
     */
    @Query("SELECT a FROM Appointment a WHERE a.user.id = :userId AND a.appointmentDate < :currentTime " +
            "ORDER BY a.appointmentDate DESC")
    List<Appointment> findPastAppointmentsByUserId(@Param("userId") Long userId,
                                                   @Param("currentTime") LocalDateTime currentTime);

    /**
     * Find appointments for a specific user on a specific date
     */
    @Query("SELECT a FROM Appointment a WHERE a.user.id = :userId " +
            "AND DATE(a.appointmentDate) = DATE(:date)")
    List<Appointment> findAppointmentsByUserIdAndDate(@Param("userId") Long userId,
                                                      @Param("date") LocalDateTime date);

    /**
     * Find appointments for a specific user with a specific doctor
     */
    @Query("SELECT a FROM Appointment a WHERE a.user.id = :userId AND a.doctorName = :doctorName " +
            "ORDER BY a.appointmentDate DESC")
    List<Appointment> findAppointmentsByUserIdAndDoctorName(@Param("userId") Long userId,
                                                            @Param("doctorName") String doctorName);

    /**
     * Find appointments within the next 24 hours for reminders
     */
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :now AND :tomorrow")
    List<Appointment> findAppointmentsNext24Hours(@Param("now") LocalDateTime now,
                                                  @Param("tomorrow") LocalDateTime tomorrow);

    /**
     * Find appointments within the next 2 hours for urgent reminders
     */
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :now AND :twoHoursLater")
    List<Appointment> findAppointmentsNext2Hours(@Param("now") LocalDateTime now,
                                                 @Param("twoHoursLater") LocalDateTime twoHoursLater);

    /**
     * Find appointments for today (for day-of reminders)
     */
    @Query("SELECT a FROM Appointment a WHERE DATE(a.appointmentDate) = DATE(:today)")
    List<Appointment> findAppointmentsForToday(@Param("today") LocalDateTime today);

    /**
     * Check if user has any appointments on a specific date
     */
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Appointment a " +
            "WHERE a.user.id = :userId AND DATE(a.appointmentDate) = DATE(:date)")
    boolean hasAppointmentsOnDate(@Param("userId") Long userId, @Param("date") LocalDateTime date);

    /**
     * Count total appointments for a user
     */
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.user.id = :userId")
    long countAppointmentsByUserId(@Param("userId") Long userId);

    /**
     * Find the next upcoming appointment for a user
     */
    @Query("SELECT a FROM Appointment a WHERE a.user.id = :userId AND a.appointmentDate > :currentTime " +
            "ORDER BY a.appointmentDate ASC LIMIT 1")
    Optional<Appointment> findNextAppointmentByUserId(@Param("userId") Long userId,
                                                      @Param("currentTime") LocalDateTime currentTime);

    /**
     * Find the most recent past appointment for a user
     */
    @Query("SELECT a FROM Appointment a WHERE a.user.id = :userId AND a.appointmentDate < :currentTime " +
            "ORDER BY a.appointmentDate DESC LIMIT 1")
    Optional<Appointment> findLastAppointmentByUserId(@Param("userId") Long userId,
                                                      @Param("currentTime") LocalDateTime currentTime);

    /**
     * Find appointments by reason for visit (useful for analytics)
     */
    @Query("SELECT a FROM Appointment a WHERE a.user.id = :userId AND " +
            "LOWER(a.reasonForVisit) LIKE LOWER(CONCAT('%', :reason, '%'))")
    List<Appointment> findAppointmentsByReason(@Param("userId") Long userId,
                                               @Param("reason") String reason);

    /**
     * Find appointments at a specific location
     */
    @Query("SELECT a FROM Appointment a WHERE a.user.id = :userId AND " +
            "LOWER(a.location) LIKE LOWER(CONCAT('%', :location, '%'))")
    List<Appointment> findAppointmentsByLocation(@Param("userId") Long userId,
                                                 @Param("location") String location);

    /**
     * Find appointments within a date range for a user
     */
    @Query("SELECT a FROM Appointment a WHERE a.user.id = :userId " +
            "AND a.appointmentDate BETWEEN :startDate AND :endDate " +
            "ORDER BY a.appointmentDate ASC")
    List<Appointment> findAppointmentsByUserIdAndDateRange(@Param("userId") Long userId,
                                                           @Param("startDate") LocalDateTime startDate,
                                                           @Param("endDate") LocalDateTime endDate);

    /**
     * Find all appointments that need 24-hour reminders
     * (appointments 23-25 hours from now that haven't been reminded)
     */
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :start AND :end")
    List<Appointment> findAppointmentsNeedingReminders(@Param("start") LocalDateTime start,
                                                       @Param("end") LocalDateTime end);
}
