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
public class NotificationDto {

    private Long id;
    private String message;
    private String type;
    private boolean isRead;
    private LocalDateTime timestamp;
    private Long userId;
}
