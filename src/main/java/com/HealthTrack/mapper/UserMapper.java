package com.HealthTrack.mapper;

import com.HealthTrack.dtos.UserDto;
import com.HealthTrack.models.User;

public class UserMapper {

    public static UserDto mapToUserTdo(User user){

        return new UserDto (
                user.getId(),
                user.getUsername(),
                user.getPassword()
        );
    }

    public static User mapToUser(UserDto userDto){
        return new User(
                userDto.getId(),
                userDto.getUsername(),
                userDto.getPassword()
        );
    }
}
