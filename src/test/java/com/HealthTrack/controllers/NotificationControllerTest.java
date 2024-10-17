package com.HealthTrack.controllers;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.HealthTrack.dtos.NotificationDto;
import com.HealthTrack.services.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@SpringBootTest
public class NotificationControllerTest {

    private MockMvc mockMvc;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private NotificationController notificationController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(notificationController).build();
    }

    @Test
    public void testGetUserNotifications() throws Exception {
        List<NotificationDto> notifications = Arrays.asList(
                new NotificationDto(1L, "Abnormal Blood Pressure", "Blood Pressure", "HealthMetricAlert", false, LocalDateTime.now(), 1L),
                new NotificationDto(2L, "High Heart Rate", "Heart Rate", "HealthMetricAlert", true, LocalDateTime.now(), 1L)
        );

        when(notificationService.getUserNotifications(anyLong())).thenReturn(notifications);

        mockMvc.perform(get("/api/notifications/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].message").value("Abnormal Blood Pressure"))
                .andExpect(jsonPath("$[1].message").value("High Heart Rate"));

        verify(notificationService, times(1)).getUserNotifications(1L);
    }

    @Test
    public void testMarkNotificationAsRead() throws Exception {
        mockMvc.perform(put("/api/notifications/1/read"))
                .andExpect(status().isOk());

        verify(notificationService, times(1)).markNotificationAsRead(1L);
    }

    @Test
    public void testDeleteNotification() throws Exception {
        mockMvc.perform(delete("/api/notifications/1"))
                .andExpect(status().isNoContent());

        verify(notificationService, times(1)).deleteNotification(1L);
    }
}

