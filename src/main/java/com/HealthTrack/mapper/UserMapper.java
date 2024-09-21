package com.HealthTrack.mapper;

import com.HealthTrack.dtos.UserDto;
import com.HealthTrack.models.User;

import java.util.stream.Collectors;

public class UserMapper {

    public static UserDto mapToUserTdo(User user){

        return new UserDto (
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                user.getPhoneNumber(),

                // Map related entity IDs
                user.getSymptoms().stream().map(symptom -> symptom.getId()).collect(Collectors.toList()),
                user.getHealthMetrics().stream().map(healthMetric -> healthMetric.getId()).collect(Collectors.toList()),
                user.getAppointments().stream().map(appointment -> appointment.getId()).collect(Collectors.toList())
        );
    }

    public static User mapToUser(UserDto userDto){
        User user = new User();
        user.setId(userDto.getId());
        user.setUsername(userDto.getUsername());
        user.setPassword(userDto.getPassword());  // Ensure password is hashed in the service layer
        user.setEmail(userDto.getEmail());
        user.setPhoneNumber(userDto.getPhoneNumber());
        // Symptoms, HealthMetrics, and Appointments are not mapped here, as they are handled separately
        return user;
    }
}
