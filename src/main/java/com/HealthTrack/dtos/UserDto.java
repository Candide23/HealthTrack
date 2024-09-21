package com.HealthTrack.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;
    private String username;
    private String password;
    private String email;
    private String phoneNumber;

    private List<Long> symptomIds;
    private List<Long> healthMetricIds;
    private List<Long> appointmentIds;
}
