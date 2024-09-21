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
public class AppointmentDto {

    private Long id;
    private String doctorName;
    private String location;
    private LocalDateTime appointmentDate;
    private String reasonForVisit;
    private Long userId;
}
