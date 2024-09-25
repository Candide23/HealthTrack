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
        User newUser = UserMapper.mapToUser(userDto);

        if (newUser.getSymptoms() == null) {
            newUser.setSymptoms(new ArrayList<>());
        }
        if (newUser.getHealthMetrics() == null) {
            newUser.setHealthMetrics(new ArrayList<>());
        }
        if (newUser.getAppointments() == null) {
            newUser.setAppointments(new ArrayList<>());
        }

        User saveUser = userRepository.save(newUser);
        return UserMapper.mapToUserTdo(saveUser);
    }

    @Override
    public UserDto findUserById(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

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
        List<User> users = userRepository.findAll();

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
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(userDto.getUsername());
        user.setPassword(userDto.getPassword());
        user.setEmail(userDto.getEmail());
        user.setPhoneNumber(userDto.getPhoneNumber());

        if (user.getSymptoms() == null) {
            user.setSymptoms(new ArrayList<>());
        }
        if (user.getHealthMetrics() == null) {
            user.setHealthMetrics(new ArrayList<>());
        }
        if (user.getAppointments() == null) {
            user.setAppointments(new ArrayList<>());
        }

        User updatableUser = userRepository.save(user);
        return UserMapper.mapToUserTdo(updatableUser);
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.deleteById(userId);
    }
}
