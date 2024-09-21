package com.HealthTrack.services.imp;

import com.HealthTrack.dtos.UserDto;
import com.HealthTrack.mapper.UserMapper;
import com.HealthTrack.models.User;
import com.HealthTrack.repositories.UserRepository;
import com.HealthTrack.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserDto createUser(UserDto userDto) {
        // Initialize the related entities if they are null
        User newUser = UserMapper.mapToUser(userDto);

        // Ensure lists are not null when creating a new user
        if (newUser.getSymptoms() == null) {
            newUser.setSymptoms(new ArrayList<>());
        }
        if (newUser.getHealthMetrics() == null) {
            newUser.setHealthMetrics(new ArrayList<>());
        }
        if (newUser.getAppointments() == null) {
            newUser.setAppointments(new ArrayList<>());
        }

        // Save the user and map it to UserDto
        User saveUser = userRepository.save(newUser);
        return UserMapper.mapToUserTdo(saveUser);
    }

    @Override
    public UserDto findUserById(Long userId) {
        // Find user and handle the case where the user is not found
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Handle potential null lists for symptoms, healthMetrics, and appointments
        if (user.getSymptoms() == null) {
            user.setSymptoms(new ArrayList<>());
        }
        if (user.getHealthMetrics() == null) {
            user.setHealthMetrics(new ArrayList<>());
        }
        if (user.getAppointments() == null) {
            user.setAppointments(new ArrayList<>());
        }

        return UserMapper.mapToUserTdo(user);
    }

    @Override
    public List<UserDto> findAllUser() {
        // Find all users
        List<User> users = userRepository.findAll();

        // Map users to UserDto and handle null values in each user's related entities
        return users.stream().map(user -> {
            if (user.getSymptoms() == null) {
                user.setSymptoms(new ArrayList<>());
            }
            if (user.getHealthMetrics() == null) {
                user.setHealthMetrics(new ArrayList<>());
            }
            if (user.getAppointments() == null) {
                user.setAppointments(new ArrayList<>());
            }
            return UserMapper.mapToUserTdo(user);
        }).collect(Collectors.toList());
    }

    @Override
    public UserDto updateUser(Long userId, UserDto userDto) {
        // Find the user and handle the case where the user is not found
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Update user information
        user.setUsername(userDto.getUsername());
        user.setPassword(userDto.getPassword());
        user.setEmail(userDto.getEmail());
        user.setPhoneNumber(userDto.getPhoneNumber());

        // Ensure lists are not null
        if (user.getSymptoms() == null) {
            user.setSymptoms(new ArrayList<>());
        }
        if (user.getHealthMetrics() == null) {
            user.setHealthMetrics(new ArrayList<>());
        }
        if (user.getAppointments() == null) {
            user.setAppointments(new ArrayList<>());
        }

        // Save updated user and return updated UserDto
        User updatableUser = userRepository.save(user);
        return UserMapper.mapToUserTdo(updatableUser);
    }

    @Override
    public void deleteUser(Long userId) {
        // Find the user and handle the case where the user is not found
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Delete user
        userRepository.deleteById(userId);
    }
}
