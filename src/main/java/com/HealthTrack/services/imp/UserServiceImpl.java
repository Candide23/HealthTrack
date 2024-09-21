package com.HealthTrack.services.imp;

import com.HealthTrack.dtos.UserDto;
import com.HealthTrack.mapper.UserMapper;
import com.HealthTrack.models.User;
import com.HealthTrack.repositories.UserRepository;
import com.HealthTrack.services.UserService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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

    @Override
    public List<UserDto> findAllUser() {

        List<User> users = userRepository.findAll();

        return users.stream().map(user -> UserMapper.mapToUserTdo(user)).collect(Collectors.toList());

    }

    @Override
    public UserDto updateUser(Long userId, UserDto userDto) {

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

       user.setUsername(userDto.getUsername());
       user.setPassword(userDto.getPassword());
       user.setEmail(userDto.getEmail());
       user.setPhoneNumber(userDto.getPhoneNumber());

       User updatableUser = userRepository.save(user);

       return UserMapper.mapToUserTdo(updatableUser);


    }

    @Override
    public void deleteUser(Long userId) {

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.deleteById(userId);





    }


}
