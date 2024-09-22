package com.HealthTrack.services;

import com.HealthTrack.dtos.AppointmentDto;

import java.util.List;

public interface AppointmentService {

    AppointmentDto createAppointment(AppointmentDto appointmentDto);

    AppointmentDto findAppointmentById(Long appointmentId);

    List<AppointmentDto> findAllAppointment();

    AppointmentDto updateAppointment(Long appointmentId, AppointmentDto appointmentDto );

    void deleteAppointment(Long appointmentId);


}
