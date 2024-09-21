package com.HealthTrack.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HealthMetricDto {


    private Long id;
    private String metricType;
    private Double value;
    private LocalDateTime timestamp;
    private Long userId;        // User ID of the logged user
}
