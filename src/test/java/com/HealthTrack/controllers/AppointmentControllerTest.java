package com.HealthTrack.controllers;

import com.HealthTrack.dtos.AppointmentDto;
import com.HealthTrack.services.AppointmentService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class AppointmentControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AppointmentService appointmentService;

    @InjectMocks
    private AppointmentController appointmentController;

    @Test
    public void testCreateAppointment() throws Exception {
        AppointmentDto appointmentDto = new AppointmentDto(null, "Dr. Smith", "City Clinic", LocalDateTime.now(), "Routine checkup", 1L);
        AppointmentDto createdAppointmentDto = new AppointmentDto(1L, "Dr. Smith", "City Clinic", LocalDateTime.now(), "Routine checkup", 1L);

        when(appointmentService.createAppointment(any(AppointmentDto.class))).thenReturn(createdAppointmentDto);

        mockMvc = MockMvcBuilders.standaloneSetup(appointmentController).build();

        mockMvc.perform(post("/api/appointments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"doctorName\":\"Dr. Smith\",\"location\":\"City Clinic\",\"appointmentDate\":\"2023-09-22T14:30:00\",\"reasonForVisit\":\"Routine checkup\",\"userId\":1}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.doctorName").value("Dr. Smith"));
    }

    @Test
    public void testGetAppointmentById() throws Exception {
        AppointmentDto appointmentDto = new AppointmentDto(1L, "Dr. Smith", "City Clinic", LocalDateTime.now(), "Routine checkup", 1L);

        when(appointmentService.findAppointmentById(1L)).thenReturn(appointmentDto);

        mockMvc = MockMvcBuilders.standaloneSetup(appointmentController).build();

        mockMvc.perform(get("/api/appointments/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.doctorName").value("Dr. Smith"));
    }

    @Test
    public void testFindAllAppointments() throws Exception {
        List<AppointmentDto> appointments = Arrays.asList(
                new AppointmentDto(301L, "Dr. Smith", "City Clinic", LocalDateTime.now(), "Routine checkup", 1L),
                new AppointmentDto(302L, "Dr. Johnson", "General Hospital", LocalDateTime.now(), "Follow-up", 1L)
        );

        when(appointmentService.findAllAppointment()).thenReturn(appointments);

        mockMvc = MockMvcBuilders.standaloneSetup(appointmentController).build();

        mockMvc.perform(get("/api/appointments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].doctorName").value("Dr. Smith"))
                .andExpect(jsonPath("$[1].doctorName").value("Dr. Johnson"));
    }

    @Test
    public void testUpdateAppointment() throws Exception {
        AppointmentDto appointmentDto = new AppointmentDto(1L, "Dr. Johnson", "General Hospital", LocalDateTime.now(), "Follow-up", 1L);

        when(appointmentService.updateAppointment(eq(1L), any(AppointmentDto.class))).thenReturn(appointmentDto);

        mockMvc = MockMvcBuilders.standaloneSetup(appointmentController).build();

        mockMvc.perform(put("/api/appointments/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"doctorName\":\"Dr. Johnson\",\"location\":\"General Hospital\",\"appointmentDate\":\"2023-09-22T14:30:00\",\"reasonForVisit\":\"Follow-up\",\"userId\":1}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.doctorName").value("Dr. Johnson"));
    }

    @Test
    public void testDeleteAppointment() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(appointmentController).build();

        mockMvc.perform(delete("/api/appointments/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Appointment deleted Successfully"));

        verify(appointmentService, times(1)).deleteAppointment(1L);


    }

}