package com.HealthTrack.services.imp;

import com.HealthTrack.dtos.UserDto;
import com.HealthTrack.mapper.UserMapper;
import com.HealthTrack.models.User;
import com.HealthTrack.repositories.UserRepository;
import com.HealthTrack.services.UserService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;
@AllArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;

    @Override
    public UserDto createUser(UserDto userDto) {
        User newUser = UserMapper.mapToUser(userDto);
        User saveUser = userRepository.save(newUser);
        return UserMapper.mapToUserTdo(saveUser);
    }

    @Override
    public UserDto findUserById(Long userId) {

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        return UserMapper.mapToUserTdo(user);
    }
}