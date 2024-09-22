package com.HealthTrack.Services;


import com.HealthTrack.dtos.UserDto;
import com.HealthTrack.mapper.UserMapper;
import com.HealthTrack.models.User;
import com.HealthTrack.repositories.UserRepository;
import com.HealthTrack.services.UserService;
import com.HealthTrack.services.imp.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    public void testCreateUser() {

        UserDto userDto = new UserDto(null, "cham","mbk","cham@email.com","123-456-7890",null, null,null);
        User user = UserMapper.mapToUser(userDto);

        when(userRepository.save(any(User.class))).thenReturn(user);

        UserDto createdUser = userService.createUser(userDto);
        assertEquals("cham", createdUser.getUsername());
        verify(userRepository, times(1)).save(any(User.class));

    }

    @Test
    public void testFindUserById() {

        User user = new User(1L, "cham","mbk","cham@email.com","123-456-7890",null, null,null);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserDto userDto = userService.findUserById(1L);

        assertEquals("cham", userDto.getUsername());
        assertEquals("cham@email.com", userDto.getEmail());
        verify(userRepository, times(1)).findById(1L);


    }

    @Test
    public void findAllUser(){
        User user1 = new User(1L, "cham","mbk","cham@email.com","123-456-7890",null, null,null);
        User user2 = new User(2L, "jane_doe", "password456", "jane.doe@example.com", "987-654-3210", null, null, null);
        List<User> users = Arrays.asList(user1,user2);

        when(userRepository.findAll()).thenReturn(users);

        List<UserDto> userDtos = userService.findAllUser();

        assertEquals(2, userDtos.size());
        assertEquals("cham", userDtos.get(0).getUsername());
        assertEquals("jane_doe", userDtos.get(1).getUsername());
        verify(userRepository, times(1)).findAll();


    }

    @Test
    public void testUpdateUser(){

        User user = new User(1L, "cham","mbk","cham@email.com","123-456-7890",null, null,null);
        UserDto userDto = new UserDto(1L, "chama", "mbka", "cham@email.com", "987-654-3210", null, null, null);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserDto updatedUser = userService.updateUser(1L, userDto);

        assertEquals("chama", updatedUser.getUsername());
        assertEquals("cham@email.com", updatedUser.getEmail());
        verify(userRepository, times(1)).save(any(User.class));

    }

    @Test
    public void testDeleteUser(){

        User user = new User(1L, "cham","mbk","cham@email.com","123-456-7890",null, null,null);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

       userService.deleteUser(1L);

       verify(userRepository, times(1)).deleteById(1L);


    }
}
