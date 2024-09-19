package com.HealthTrack.mapper;

import com.HealthTrack.dtos.UserDto;
import com.HealthTrack.models.User;

public class UserMapper {

    public static UserDto mapToUserDto(UserDto userDto){

        return new UserDto (
                userDto.getId(),
                userDto.getUsername(),
                userDto.getPassword()
        );
    }

    public static User mapToUser(User user){
        return new User(
                user.getId(),
                user.getUsername(),
                user.getPassword()
        );
    }
}
