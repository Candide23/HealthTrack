package com.HealthTrack.controllers;

import com.HealthTrack.dtos.NotificationDto;
import com.HealthTrack.services.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class NotificationController {

    private  NotificationService notificationService;

    // Get all notifications for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDto>> getUserNotifications(@PathVariable Long userId) {
        List<NotificationDto> notifications = notificationService.getUserNotifications(userId);
        System.out.println(notifications);
        return ResponseEntity.ok(notifications);
    }

    // Mark a notification as read
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long notificationId) {
        notificationService.markNotificationAsRead(notificationId);
        return ResponseEntity.ok().build();
    }

    // Delete a notification
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.noContent().build();
    }
}