package com.HealthTrack.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "health_metrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class HealthMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "metric_type")
    private String metricType;

    @Column
    private Double value;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // The user who logged the health metric
}
