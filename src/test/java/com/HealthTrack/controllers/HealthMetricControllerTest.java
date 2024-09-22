package com.HealthTrack.controllers;

import com.HealthTrack.dtos.HealthMetricDto;
import com.HealthTrack.services.imp.HealthMetricServiceImpl;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;

@SpringBootTest
public class HealthMetricControllerTest {

    private MockMvc mockMvc;

    @Mock
    private HealthMetricServiceImpl healthMetricService;

    @InjectMocks
    private HealthMetricController healthMetricController;

    @Test
    public void testCreateHealthMetric() throws Exception {
        HealthMetricDto healthMetricDto = new HealthMetricDto(null, "Weight", 75.5, LocalDateTime.now(), 1L);
        HealthMetricDto createdHealthMetricDto = new HealthMetricDto(1L, "Weight", 75.5, LocalDateTime.now(), 1L);

        when(healthMetricService.createHealthMetric(any(HealthMetricDto.class))).thenReturn(createdHealthMetricDto);

        mockMvc = MockMvcBuilders.standaloneSetup(healthMetricController).build();

        mockMvc.perform(post("/api/healthMetric")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"metricType\":\"Weight\",\"value\":75.5,\"timestamp\":\"2023-09-20T10:00:00\",\"userId\":1}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.metricType").value("Weight"));
    }

    @Test
    public void testGetHealthMetricById() throws Exception {
        HealthMetricDto healthMetricDto = new HealthMetricDto(1L, "Weight", 75.5, LocalDateTime.now(), 1L);

        when(healthMetricService.findHealthMetricById(1L)).thenReturn(healthMetricDto);

        mockMvc = MockMvcBuilders.standaloneSetup(healthMetricController).build();

        mockMvc.perform(get("/api/healthMetric/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.metricType").value("Weight"));
    }

    @Test
    public void testUpdateHealthMetric() throws Exception {
        HealthMetricDto healthMetricDto = new HealthMetricDto(1L, "Blood Pressure", 120.80, LocalDateTime.now(), 1L);

        when(healthMetricService.updateHealthMetric(eq(1L), any(HealthMetricDto.class))).thenReturn(healthMetricDto);

        mockMvc = MockMvcBuilders.standaloneSetup(healthMetricController).build();

        mockMvc.perform(put("/api/healthMetric/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"metricType\":\"Blood Pressure\",\"value\":120.80,\"timestamp\":\"2023-09-20T10:00:00\",\"userId\":1}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.metricType").value("Blood Pressure"));
    }

    @Test
    public void testDeleteHealthMetric() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(healthMetricController).build();

        mockMvc.perform(delete("/api/healthMetric/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Deleted Metric Successfully"));


        verify(healthMetricService, times(1)).deleteHealthMetric(1L);
    }
}
