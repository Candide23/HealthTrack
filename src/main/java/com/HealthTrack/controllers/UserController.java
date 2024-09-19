package com.HealthTrack.controllers;

import com.HealthTrack.dtos.UserDto;
import com.HealthTrack.services.UserService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private UserService userService;

    @PostMapping
    public ResponseEntity<UserDto> createUsers(@RequestBody UserDto userDto){

        UserDto createdUser = userService.createUser(userDto);

        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);


    }
}
