package com.HealthTrack.Services;

import com.HealthTrack.dtos.AppointmentDto;
import com.HealthTrack.mapper.AppointmentMapper;
import com.HealthTrack.models.Appointment;
import com.HealthTrack.models.User;
import com.HealthTrack.repositories.AppointmentRepository;
import com.HealthTrack.repositories.UserRepository;
import com.HealthTrack.services.imp.AppointmentImpl;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
public class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AppointmentImpl appointmentService;


    @Test
    public void testCreateAppointment() {

        User user = new User(1L, "john_doe", "hashed_password", "john.doe@example.com", "123-456-7890", null, null, null);
        AppointmentDto appointmentDto = new AppointmentDto(null, "Dr. Smith", "City Clinic", LocalDateTime.now(), "Routine checkup", 1L);
        Appointment appointment = AppointmentMapper.mapToAppointment(appointmentDto, user);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);

        AppointmentDto createdAppointment = appointmentService.createAppointment(appointmentDto);

        assertEquals("Dr. Smith", createdAppointment.getDoctorName());
        verify(appointmentRepository, times(1)).save(any(Appointment.class));

    }

    @Test
    public void testGetAppointmentById(){

        Appointment appointment = new Appointment(1L, "Dr. Smith", "City Clinic", LocalDateTime.now(), "Routine checkup", null);

        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));

        AppointmentDto appointmentDto = appointmentService.findAppointmentById(1L);

        assertEquals("Dr. Smith", appointmentDto.getDoctorName());
        verify(appointmentRepository,times(1)).findById(1L);


    }

    @Test
    public void testFindAllAppointments() {


        Appointment appointment1 = new Appointment(1L, "Dr. Smith", "City Clinic", LocalDateTime.now(), "Routine checkup", null);
        Appointment appointment2 = new Appointment(2L, "Dr. Johnson", "General Hospital", LocalDateTime.now(), "Follow-up", null);

        List<Appointment> appointments = Arrays.asList(appointment1,appointment2);

        when(appointmentRepository.findAll()).thenReturn(appointments);


        List<AppointmentDto> appointmentDtos = appointmentService.findAllAppointment();

        assertEquals(2, appointmentDtos.size());
        assertEquals("Dr. Smith", appointmentDtos.get(0).getDoctorName());
        assertEquals("Dr. Johnson", appointmentDtos.get(1).getDoctorName());

        verify(appointmentRepository, times(1)).findAll();
    }

    @Test
    public void testUpdateAppointment() {
        Appointment appointment = new Appointment(1L, "Dr. Smith", "City Clinic", LocalDateTime.now(), "Routine checkup", null);
        AppointmentDto appointmentDto = new AppointmentDto(1L, "Dr. Johnson", "General Hospital", LocalDateTime.now(), "Follow-up", 1L);

        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);

        AppointmentDto updatedAppointment = appointmentService.updateAppointment(1L, appointmentDto);

        assertEquals("Dr. Johnson", updatedAppointment.getDoctorName());
        verify(appointmentRepository, times(1)).save(any(Appointment.class));
    }

    @Test
    public void testDeleteAppointment(){

        Appointment appointment = new Appointment(1L, "Dr. Smith", "City Clinic", LocalDateTime.now(), "Routine checkup", null);

        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));

        appointmentService.deleteAppointment(1L);

        verify(userRepository, times(1)).deleteById(1L);


    }


}
