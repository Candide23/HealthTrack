package com.HealthTrack.controllers;

import com.HealthTrack.dtos.UserDto;
import com.HealthTrack.services.UserService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("{id}")
    public ResponseEntity<UserDto> findUsersById(@PathVariable("id") Long userId){

        UserDto foundUserById = userService.findUserById(userId);

        return ResponseEntity.ok(foundUserById);

    }
}
