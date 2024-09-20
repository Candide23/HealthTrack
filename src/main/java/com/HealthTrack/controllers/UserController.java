package com.HealthTrack.controllers;

import com.HealthTrack.dtos.UserDto;
import com.HealthTrack.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @GetMapping
    public ResponseEntity<List<UserDto>> findAllUsers(){

        List<UserDto> userDto = userService.findAllUser();

        return ResponseEntity.ok(userDto);


    }

    @PutMapping("{id}")
    public ResponseEntity<UserDto> updatedUsers( @PathVariable("id") Long userId, @RequestBody UserDto userDto){

        UserDto updatedUser = userService.updateUser(userId, userDto);

        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deletedUsers(@PathVariable("id") Long userId){

      userService.deleteUser(userId);

        return  ResponseEntity.ok("User deleted Successfully");


    }

}
