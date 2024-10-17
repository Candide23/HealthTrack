package com.HealthTrack.Services;


import com.HealthTrack.dtos.NotificationDto;
import com.HealthTrack.models.HealthMetric;
import com.HealthTrack.models.Notification;
import com.HealthTrack.models.User;
import com.HealthTrack.repositories.NotificationRepository;
import com.HealthTrack.repositories.UserRepository;
import com.HealthTrack.services.imp.NotificationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.*;



@SpringBootTest
public class NotificationServiceImplTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    private User user;
    private HealthMetric healthMetric;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        healthMetric = new HealthMetric();
        healthMetric.setMetricType("Blood Pressure");
        healthMetric.setValue(150.0);
        healthMetric.setUser(user);
        healthMetric.setTimestamp(LocalDateTime.now());
    }

    @Test
    public void testSendAbnormalHealthMetricNotification_CreatesNotification() {
        when(notificationRepository.existsSimilarNotification(anyLong(), anyString(), any())).thenReturn(false);
        when(notificationRepository.save(any(Notification.class))).thenAnswer(i -> i.getArguments()[0]);

        notificationService.sendAbnormalHealthMetricNotification(healthMetric);

        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    public void testSendAbnormalHealthMetricNotification_DoesNotCreateDuplicateNotification() {
        when(notificationRepository.existsSimilarNotification(anyLong(), anyString(), any())).thenReturn(true);

        notificationService.sendAbnormalHealthMetricNotification(healthMetric);

        verify(notificationRepository, never()).save(any(Notification.class));
    }

    @Test
    public void testGetUserNotifications_ReturnsNotifications() {
        List<Notification> notifications = Arrays.asList(
                new Notification(1L, "Test Message", "Blood Pressure", "HealthMetricAlert", false, LocalDateTime.now(), user)
        );
        when(notificationRepository.findByUserId(anyLong())).thenReturn(notifications);

        List<NotificationDto> result = notificationService.getUserNotifications(1L);

        assertEquals(1, result.size());
        assertEquals("Test Message", result.get(0).getMessage());
    }

    @Test
    public void testMarkNotificationAsRead() {
        Notification notification = new Notification(1L, "Test Message", "Blood Pressure", "HealthMetricAlert", false, LocalDateTime.now(), user);
        when(notificationRepository.findById(anyLong())).thenReturn(Optional.of(notification));

        notificationService.markNotificationAsRead(1L);

        assertTrue(notification.isRead());
        verify(notificationRepository, times(1)).save(notification);
    }



    @Test
    public void testUpdateNotification() {
        Notification existingNotification = new Notification(1L, "Old Message", "Blood Pressure", "HealthMetricAlert", false, LocalDateTime.now(), user);
        NotificationDto updateDto = new NotificationDto(1L, "Updated Message", "Blood Pressure", "HealthMetricAlert", true, LocalDateTime.now(), 1L);

        when(notificationRepository.findById(anyLong())).thenReturn(Optional.of(existingNotification));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(i -> i.getArguments()[0]);

        NotificationDto result = notificationService.updateNotification(1L, updateDto);

        assertEquals("Updated Message", result.getMessage());
        assertTrue(result.isRead());
        verify(notificationRepository, times(1)).save(existingNotification);
    }

    @Test
    public void testDeleteNotification() {
        Notification notification = new Notification(1L, "Test Message", "Blood Pressure", "HealthMetricAlert", false, LocalDateTime.now(), user);
        when(notificationRepository.findById(anyLong())).thenReturn(Optional.of(notification));

        notificationService.deleteNotification(1L);

        verify(notificationRepository, times(1)).delete(notification);
    }
}