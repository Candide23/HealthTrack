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
public class SymptomDto {

    private Long id;

    private String symptomType;

    private int severity;

    private String description;

    private LocalDateTime timestamp;

    private Long userId;
}
