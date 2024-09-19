package com.HealthTrack.services;

import com.HealthTrack.dtos.UserDto;

public interface UserService {

    UserDto createUser(UserDto userDto);

    UserDto findUserById(Long userId);
}
