package com.HealthTrack.mapper;


import com.HealthTrack.dtos.AppointmentDto;
import com.HealthTrack.models.Appointment;
import com.HealthTrack.models.User;

public class AppointmentMapper {

    // Map Appointment entity to AppointmentDto
    public static AppointmentDto mapToAppointmentDto(Appointment appointment) {
        return new AppointmentDto(
                appointment.getId(),
                appointment.getDoctorName(),
                appointment.getLocation(),
                appointment.getAppointmentDate(),
                appointment.getReasonForVisit(),
                appointment.getUser() != null ? appointment.getUser().getId() : null  // Check for null user Really important
        );
    }

    // Map AppointmentDto to Appointment entity
    public static Appointment mapToAppointment(AppointmentDto appointmentDto, User user) {
        return new Appointment(
                appointmentDto.getId(),
                appointmentDto.getDoctorName(),
                appointmentDto.getLocation(),
                appointmentDto.getAppointmentDate(),
                appointmentDto.getReasonForVisit(),
                user  // Pass the User entity
        );
    }
}
