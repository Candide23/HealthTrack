package com.HealthTrack.services.imp;

import com.HealthTrack.dtos.AppointmentDto;
import com.HealthTrack.mapper.AppointmentMapper;
import com.HealthTrack.models.Appointment;
import com.HealthTrack.models.User;
import com.HealthTrack.repositories.AppointmentRepository;
import com.HealthTrack.repositories.UserRepository;
import com.HealthTrack.services.AppointmentService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class AppointmentImpl implements AppointmentService {


    private AppointmentRepository appointmentRepository;

    private UserRepository userRepository;

    @Override
    public AppointmentDto createAppointment(AppointmentDto appointmentDto) {
        User user = userRepository.findById(appointmentDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Appointment appointment = AppointmentMapper.mapToAppointment(appointmentDto, user);
        appointmentRepository.save(appointment);
        return AppointmentMapper.mapToAppointmentDto(appointment);
    }

    @Override
    public AppointmentDto findAppointmentById(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        return AppointmentMapper.mapToAppointmentDto(appointment);
    }

    @Override
    public List<AppointmentDto> findAllAppointment() {
        return appointmentRepository.findAll()
                .stream()
                .map(AppointmentMapper::mapToAppointmentDto)
                .collect(Collectors.toList());
    }

    @Override
    public AppointmentDto updateAppointmentById(Long appointmentId, AppointmentDto appointmentDto) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setDoctorName(appointmentDto.getDoctorName());
        appointment.setLocation(appointmentDto.getLocation());
        appointment.setAppointmentDate(appointmentDto.getAppointmentDate());
        appointment.setReasonForVisit(appointmentDto.getReasonForVisit());
        appointmentRepository.save(appointment);
        return AppointmentMapper.mapToAppointmentDto(appointment);
    }

    @Override
    public void deleteAppointment(Long appointmentId) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointmentRepository.deleteById(appointmentId);

    }
}
