package com.HealthTrack.services.imp;

import com.HealthTrack.dtos.AppointmentDto;
import com.HealthTrack.dtos.NotificationDto;
import com.HealthTrack.mapper.AppointmentMapper;
import com.HealthTrack.models.Appointment;
import com.HealthTrack.models.User;
import com.HealthTrack.repositories.AppointmentRepository;
import com.HealthTrack.repositories.UserRepository;
import com.HealthTrack.services.AppointmentService;
import com.HealthTrack.services.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class AppointmentImpl implements AppointmentService {

    private AppointmentRepository appointmentRepository;
    private UserRepository userRepository;
    private NotificationService notificationService;

    @Override
    public AppointmentDto createAppointment(AppointmentDto appointmentDto) {
        User user = userRepository.findById(appointmentDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User with ID " + appointmentDto.getUserId() + " not found"));

        Appointment appointment = AppointmentMapper.mapToAppointment(appointmentDto, user);
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Send appointment-related notifications
        sendAppointmentNotifications(savedAppointment);

        System.out.println("Appointment created successfully for user: " + user.getUsername() +
                " with Dr. " + savedAppointment.getDoctorName() +
                " on " + savedAppointment.getAppointmentDate());

        return AppointmentMapper.mapToAppointmentDto(savedAppointment);
    }

    @Override
    public AppointmentDto findAppointmentById(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment with ID " + appointmentId + " not found"));
        return AppointmentMapper.mapToAppointmentDto(appointment);
    }

    @Override
    public List<AppointmentDto> findAllAppointmentByUserId(Long userId) {
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found"));

        List<Appointment> appointments = appointmentRepository.findByUserId(userId);

        // Sort appointments by date (upcoming first)
        return appointments.stream()
                .sorted(Comparator.comparing(Appointment::getAppointmentDate))
                .map(AppointmentMapper::mapToAppointmentDto)
                .collect(Collectors.toList());
    }

    @Override
    public AppointmentDto updateAppointment(Long appointmentId, AppointmentDto appointmentDto) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment with ID " + appointmentId + " not found"));

        // Store old values for comparison
        LocalDateTime oldDate = appointment.getAppointmentDate();
        String oldDoctorName = appointment.getDoctorName();
        String oldLocation = appointment.getLocation();

        // Update appointment details
        appointment.setDoctorName(appointmentDto.getDoctorName());
        appointment.setLocation(appointmentDto.getLocation());
        appointment.setAppointmentDate(appointmentDto.getAppointmentDate());
        appointment.setReasonForVisit(appointmentDto.getReasonForVisit());

        Appointment updatedAppointment = appointmentRepository.save(appointment);

        // Send notifications for significant changes
        sendAppointmentUpdateNotifications(updatedAppointment, oldDate, oldDoctorName, oldLocation);

        System.out.println("Appointment updated successfully: " + appointmentId);

        return AppointmentMapper.mapToAppointmentDto(updatedAppointment);
    }

    @Override
    public void deleteAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment with ID " + appointmentId + " not found"));

        // Send cancellation notification
        sendAppointmentCancellationNotification(appointment);

        appointmentRepository.deleteById(appointmentId);

        System.out.println("Appointment deleted successfully: " + appointmentId +
                " (Dr. " + appointment.getDoctorName() +
                " on " + appointment.getAppointmentDate() + ")");
    }

    /**
     * Send various appointment-related notifications
     */
    private void sendAppointmentNotifications(Appointment appointment) {
        try {
            // Appointment confirmation notification
            sendAppointmentConfirmationNotification(appointment);

            // Check for same-day appointments
            checkForSameDayAppointments(appointment);

            // Check for conflicting appointments
            checkForConflictingAppointments(appointment);

        } catch (Exception e) {
            System.out.println("Error sending appointment notifications: " + e.getMessage());
        }
    }

    /**
     * Send appointment confirmation notification
     */
    private void sendAppointmentConfirmationNotification(Appointment appointment) {
        String message = buildAppointmentConfirmationMessage(appointment);
        createAppointmentNotification(appointment.getUser(), message, "AppointmentConfirmation", "Appointment");
        System.out.println("Appointment confirmation notification sent for: " + appointment.getDoctorName());
    }

    /**
     * Check for same-day appointments and warn user
     */
    private void checkForSameDayAppointments(Appointment newAppointment) {
        LocalDateTime startOfDay = newAppointment.getAppointmentDate().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusSeconds(1);

        List<Appointment> sameDayAppointments = appointmentRepository.findAppointmentsWithinTimeframe(
                startOfDay, endOfDay);

        // Filter for same user and exclude the current appointment
        long sameDayCount = sameDayAppointments.stream()
                .filter(app -> app.getUser().getId().equals(newAppointment.getUser().getId()))
                .filter(app -> !app.getId().equals(newAppointment.getId()))
                .count();

        if (sameDayCount > 0) {
            String message = String.format("📅 MULTIPLE APPOINTMENTS: You have %d other appointment(s) scheduled for %s. " +
                            "Please review your schedule to avoid conflicts. Latest appointment: Dr. %s at %s.",
                    sameDayCount,
                    newAppointment.getAppointmentDate().toLocalDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")),
                    newAppointment.getDoctorName(),
                    formatAppointmentTime(newAppointment.getAppointmentDate()));

            createAppointmentNotification(newAppointment.getUser(), message, "MultipleDayAppointments", "Appointment");
            System.out.println("Multiple same-day appointments notification sent for user: " + newAppointment.getUser().getId());
        }
    }

    /**
     * Check for conflicting appointments (within 2 hours)
     */
    private void checkForConflictingAppointments(Appointment newAppointment) {
        LocalDateTime appointmentTime = newAppointment.getAppointmentDate();
        LocalDateTime twoHoursBefore = appointmentTime.minusHours(2);
        LocalDateTime twoHoursAfter = appointmentTime.plusHours(2);

        List<Appointment> nearbyAppointments = appointmentRepository.findAppointmentsWithinTimeframe(
                twoHoursBefore, twoHoursAfter);

        // Filter for same user and exclude current appointment
        List<Appointment> conflicts = nearbyAppointments.stream()
                .filter(app -> app.getUser().getId().equals(newAppointment.getUser().getId()))
                .filter(app -> !app.getId().equals(newAppointment.getId()))
                .collect(Collectors.toList());

        if (!conflicts.isEmpty()) {
            String conflictDetails = conflicts.stream()
                    .map(app -> "Dr. " + app.getDoctorName() + " at " + formatAppointmentTime(app.getAppointmentDate()))
                    .collect(Collectors.joining(", "));

            String message = String.format("⚠️ POTENTIAL CONFLICT: Your new appointment with Dr. %s at %s " +
                            "is scheduled within 2 hours of: %s. Please ensure you have adequate travel time.",
                    newAppointment.getDoctorName(),
                    formatAppointmentTime(newAppointment.getAppointmentDate()),
                    conflictDetails);

            createAppointmentNotification(newAppointment.getUser(), message, "AppointmentConflict", "Appointment");
            System.out.println("Appointment conflict notification sent for user: " + newAppointment.getUser().getId());
        }
    }

    /**
     * Send notifications for appointment updates
     */
    private void sendAppointmentUpdateNotifications(Appointment updatedAppointment, LocalDateTime oldDate,
                                                    String oldDoctorName, String oldLocation) {
        List<String> changes = new ArrayList<>();

        // Check what changed
        if (!updatedAppointment.getAppointmentDate().equals(oldDate)) {
            changes.add("Date/Time changed from " + formatAppointmentTime(oldDate) +
                    " to " + formatAppointmentTime(updatedAppointment.getAppointmentDate()));
        }

        if (!updatedAppointment.getDoctorName().equals(oldDoctorName)) {
            changes.add("Doctor changed from Dr. " + oldDoctorName + " to Dr. " + updatedAppointment.getDoctorName());
        }

        if (!updatedAppointment.getLocation().equals(oldLocation)) {
            changes.add("Location changed from " + oldLocation + " to " + updatedAppointment.getLocation());
        }

        if (!changes.isEmpty()) {
            String message = String.format("📝 APPOINTMENT UPDATED: Your appointment has been modified. Changes: %s. " +
                            "Current details: Dr. %s at %s, %s. Reason: %s",
                    String.join("; ", changes),
                    updatedAppointment.getDoctorName(),
                    formatAppointmentTime(updatedAppointment.getAppointmentDate()),
                    updatedAppointment.getLocation(),
                    updatedAppointment.getReasonForVisit());

            createAppointmentNotification(updatedAppointment.getUser(), message, "AppointmentUpdated", "Appointment");
            System.out.println("Appointment update notification sent for: " + updatedAppointment.getDoctorName());
        }
    }

    /**
     * Send appointment cancellation notification
     */
    private void sendAppointmentCancellationNotification(Appointment appointment) {
        String message = String.format("❌ APPOINTMENT CANCELLED: Your appointment with Dr. %s scheduled for %s at %s has been cancelled. " +
                        "Reason for visit was: %s. Please reschedule if needed.",
                appointment.getDoctorName(),
                formatAppointmentTime(appointment.getAppointmentDate()),
                appointment.getLocation(),
                appointment.getReasonForVisit());

        createAppointmentNotification(appointment.getUser(), message, "AppointmentCancelled", "Appointment");
        System.out.println("Appointment cancellation notification sent for: " + appointment.getDoctorName());
    }

    /**
     * Scheduled method to send appointment reminders
     * Runs every hour to check for upcoming appointments
     */
    @Scheduled(fixedRate = 3600000) // Every hour
    public void sendAppointmentReminders() {
        try {
            LocalDateTime now = LocalDateTime.now();

            // Send 24-hour reminders
            send24HourReminders(now);

            // Send 2-hour reminders
            send2HourReminders(now);

            // Send day-of reminders
            sendDayOfReminders(now);

        } catch (Exception e) {
            System.out.println("Error in scheduled appointment reminders: " + e.getMessage());
        }
    }

    /**
     * Send 24-hour appointment reminders
     */
    private void send24HourReminders(LocalDateTime now) {
        LocalDateTime tomorrow = now.plusDays(1);
        LocalDateTime tomorrowStart = tomorrow.minusHours(1);
        LocalDateTime tomorrowEnd = tomorrow.plusHours(1);

        List<Appointment> tomorrowAppointments = appointmentRepository.findAppointmentsWithinTimeframe(
                tomorrowStart, tomorrowEnd);

        for (Appointment appointment : tomorrowAppointments) {
            String message = String.format("📅 24-HOUR REMINDER: You have an appointment tomorrow with Dr. %s at %s. " +
                            "Location: %s. Reason: %s. Please prepare any necessary documents and arrive 15 minutes early.",
                    appointment.getDoctorName(),
                    formatAppointmentTime(appointment.getAppointmentDate()),
                    appointment.getLocation(),
                    appointment.getReasonForVisit());

            createAppointmentNotification(appointment.getUser(), message, "Appointment24HourReminder", "Appointment");
        }

        if (!tomorrowAppointments.isEmpty()) {
            System.out.println("Sent 24-hour reminders for " + tomorrowAppointments.size() + " appointments");
        }
    }

    /**
     * Send 2-hour appointment reminders
     */
    private void send2HourReminders(LocalDateTime now) {
        LocalDateTime twoHoursFromNow = now.plusHours(2);
        LocalDateTime reminderStart = twoHoursFromNow.minusMinutes(30);
        LocalDateTime reminderEnd = twoHoursFromNow.plusMinutes(30);

        List<Appointment> upcomingAppointments = appointmentRepository.findAppointmentsWithinTimeframe(
                reminderStart, reminderEnd);

        for (Appointment appointment : upcomingAppointments) {
            String message = String.format("⏰ 2-HOUR REMINDER: Your appointment with Dr. %s is coming up at %s. " +
                            "Location: %s. Please start preparing to leave soon to arrive on time.",
                    appointment.getDoctorName(),
                    formatAppointmentTime(appointment.getAppointmentDate()),
                    appointment.getLocation());

            createAppointmentNotification(appointment.getUser(), message, "Appointment2HourReminder", "Appointment");
        }

        if (!upcomingAppointments.isEmpty()) {
            System.out.println("Sent 2-hour reminders for " + upcomingAppointments.size() + " appointments");
        }
    }

    /**
     * Send day-of appointment reminders (morning of the appointment)
     */
    private void sendDayOfReminders(LocalDateTime now) {
        // Send reminders at 8 AM for appointments today
        if (now.getHour() == 8) {
            LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
            LocalDateTime endOfDay = startOfDay.plusDays(1).minusSeconds(1);

            List<Appointment> todayAppointments = appointmentRepository.findAppointmentsWithinTimeframe(
                    startOfDay, endOfDay);

            for (Appointment appointment : todayAppointments) {
                long hoursUntil = ChronoUnit.HOURS.between(now, appointment.getAppointmentDate());

                String message = String.format("🌅 GOOD MORNING REMINDER: You have an appointment today with Dr. %s at %s " +
                                "(%d hours from now). Location: %s. Reason: %s. Have a great day!",
                        appointment.getDoctorName(),
                        formatAppointmentTime(appointment.getAppointmentDate()),
                        hoursUntil,
                        appointment.getLocation(),
                        appointment.getReasonForVisit());

                createAppointmentNotification(appointment.getUser(), message, "AppointmentDayOfReminder", "Appointment");
            }

            if (!todayAppointments.isEmpty()) {
                System.out.println("Sent day-of reminders for " + todayAppointments.size() + " appointments");
            }
        }
    }

    // Helper methods

    private String buildAppointmentConfirmationMessage(Appointment appointment) {
        return String.format("✅ APPOINTMENT CONFIRMED: Your appointment with Dr. %s has been scheduled for %s at %s. " +
                        "Reason for visit: %s. Please arrive 15 minutes early and bring a valid ID.",
                appointment.getDoctorName(),
                formatAppointmentTime(appointment.getAppointmentDate()),
                appointment.getLocation(),
                appointment.getReasonForVisit());
    }

    private String formatAppointmentTime(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' h:mm a"));
    }

    /**
     * Helper method to create appointment notification
     */
    private void createAppointmentNotification(User user, String message, String type, String metricType) {
        try {
            NotificationDto notificationDto = new NotificationDto();
            notificationDto.setMessage(message);
            notificationDto.setType(type);
            notificationDto.setMetricType(metricType);
            notificationDto.setTimestamp(LocalDateTime.now());
            notificationDto.setUserId(user.getId());
            notificationDto.setRead(false);

            notificationService.createNotification(notificationDto);
        } catch (Exception e) {
            System.out.println("Error creating appointment notification: " + e.getMessage());
        }
    }

    /**
     * Get user's upcoming appointments (next 30 days)
     */
    public List<AppointmentDto> getUpcomingAppointments(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thirtyDaysFromNow = now.plusDays(30);

        return appointmentRepository.findByUserId(userId).stream()
                .filter(appointment -> appointment.getAppointmentDate().isAfter(now) &&
                        appointment.getAppointmentDate().isBefore(thirtyDaysFromNow))
                .sorted(Comparator.comparing(Appointment::getAppointmentDate))
                .map(AppointmentMapper::mapToAppointmentDto)
                .collect(Collectors.toList());
    }

    /**
     * Get user's appointment history (past appointments)
     */
    public List<AppointmentDto> getAppointmentHistory(Long userId) {
        LocalDateTime now = LocalDateTime.now();

        return appointmentRepository.findByUserId(userId).stream()
                .filter(appointment -> appointment.getAppointmentDate().isBefore(now))
                .sorted(Comparator.comparing(Appointment::getAppointmentDate).reversed())
                .map(AppointmentMapper::mapToAppointmentDto)
                .collect(Collectors.toList());
    }
}