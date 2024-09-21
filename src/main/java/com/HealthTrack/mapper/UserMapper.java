package com.HealthTrack.mapper;

import com.HealthTrack.dtos.UserDto;
import com.HealthTrack.models.Appointment;
import com.HealthTrack.models.HealthMetric;
import com.HealthTrack.models.Symptom;
import com.HealthTrack.models.User;
import com.HealthTrack.repositories.AppointmentRepository;
import com.HealthTrack.repositories.HealthMetricRepository;
import com.HealthTrack.repositories.SymptomRepository;
import com.HealthTrack.services.AppointmentService;

import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;



public class UserMapper {



    // Map User entity to UserDto
    public static UserDto mapToUserTdo(User user) {
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getSymptoms(),  // Directly set List<Symptom>
                user.getHealthMetrics(),  // Directly set List<HealthMetric>
                user.getAppointments()
        );
    }


    public static User mapToUser(UserDto userDto){

        User user = new User();
        user.setId(userDto.getId());
        user.setUsername(userDto.getUsername());
        user.setPassword(userDto.getPassword());
        user.setEmail(userDto.getEmail());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setSymptoms(userDto.getSymptoms());  // Directly set List<Symptom>
        user.setHealthMetrics(userDto.getHealthMetrics());  // Directly set List<HealthMetric>
        user.setAppointments(userDto.getAppointments());  // Directly set List<Appointment>
        return user;

    }
}
