package com.HealthTrack.services.imp;

import com.HealthTrack.dtos.UserDto;
import com.HealthTrack.mapper.UserMapper;
import com.HealthTrack.models.User;
import com.HealthTrack.repositories.UserRepository;
import com.HealthTrack.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.PasswordAuthentication;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDto createUser(UserDto userDto) {
        User newUser = UserMapper.mapToUser(userDto);
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword())); // Encrypt password

        if (newUser.getSymptoms() == null) {
            newUser.setSymptoms(new ArrayList<>());
        }
        if (newUser.getHealthMetrics() == null) {
            newUser.setHealthMetrics(new ArrayList<>());
        }
        if (newUser.getAppointments() == null) {
            newUser.setAppointments(new ArrayList<>());
        }
        User savedUser = userRepository.save(newUser);
        return UserMapper.mapToUserTdo(savedUser);
    }

    @Override
    public UserDto findUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserMapper.mapToUserTdo(user);
    }

    @Override
    public List<UserDto> findAllUser() {
        return userRepository.findAll().stream()
                .map(UserMapper::mapToUserTdo)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto updateUser(Long userId, UserDto userDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setEmail(userDto.getEmail());
        user.setPhoneNumber(userDto.getPhoneNumber());
        User updatedUser = userRepository.save(user);
        return UserMapper.mapToUserTdo(updatedUser);
    }

    @Override
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(userId);
    }
}

