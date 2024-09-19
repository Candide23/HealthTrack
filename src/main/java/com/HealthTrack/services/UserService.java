package com.HealthTrack.services;

import com.HealthTrack.dtos.UserDto;

import java.util.List;

public interface UserService {

    UserDto createUser(UserDto userDto);
    UserDto findUserById(Long userId);
    List<UserDto> findAllUser();
    UserDto updateUser(Long userId, UserDto userDto);

    void deleteUser(Long userId);


}
