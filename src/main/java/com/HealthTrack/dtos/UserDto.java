package com.HealthTrack.dtos;

import com.HealthTrack.models.Appointment;
import com.HealthTrack.models.HealthMetric;
import com.HealthTrack.models.Notification;
import com.HealthTrack.models.Symptom;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
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
    @NotNull(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    private String phoneNumber;

    private List<Symptom> symptoms;
    private List<HealthMetric> healthMetrics;
    private List<Appointment> appointments;
    private List<Notification> notifications;
}
