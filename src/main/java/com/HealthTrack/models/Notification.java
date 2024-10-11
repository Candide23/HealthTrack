package com.HealthTrack.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String message;

    private String metricType;  // Ensure this field is present


    @Column(nullable = false)
    private String type;  // For example: "HealthMetricAlert", "AppointmentReminder", etc.

    @Column(nullable = false)
    private boolean isRead = false;  // Track whether the notification has been read

    @Column(nullable = false)
    private LocalDateTime timestamp;  // When the notification was generated

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // The user receiving the notification
}
