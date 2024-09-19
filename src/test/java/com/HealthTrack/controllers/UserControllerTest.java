package com.HealthTrack.controllers;

import com.HealthTrack.dtos.UserDto;
import com.HealthTrack.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


public class UserControllerTest {

    @InjectMocks
    private  UserController userController;

    @Mock
    private UserService userService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }
    @Test
    void testCreateUser() throws Exception {
        // Create a user DTO object
        UserDto userDto = new UserDto(null, "Candide", "cham");

        // Mock the behavior of the userService.createUser() method
        when(userService.createUser(any(UserDto.class)))
                .thenReturn(new UserDto(1L, "Candide", "cham"));

        // Convert the UserDto object to JSON
        ObjectMapper objectMapper = new ObjectMapper();
        String userDtoJson = objectMapper.writeValueAsString(userDto);

        // Perform the POST request and check the response
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userDtoJson))
                .andExpect(status().isCreated()) // Check that the status is 201 Created
                .andExpect(jsonPath("$.username").value("Candide")) // Check that the username is correct
                .andExpect(jsonPath("$.id").value(1L)); // Check that the ID is as expected
    }

    @Test
    void testGetAllUsers() throws Exception {
        List<UserDto> users = Arrays.asList(
                new UserDto(1L, "Candide", "cham"),
                new UserDto(2L, "john", "john23")
        );
        when(userService.findAllUser()).thenReturn(users);

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].username").value("Candide"))
                .andExpect(jsonPath("$[1].username").value("john"));
    }

    @Test
    void testUpdateUser() throws Exception {
        UserDto userDto = new UserDto(1L, "Candide", "newcham");
        when(userService.updateUser(eq(1L), any(UserDto.class))).thenReturn(userDto);

        mockMvc.perform(put("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\": \"Candide\", \"password\": \"newcham\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("Candide"))
                .andExpect(jsonPath("$.password").value("newcham"));
    }

    @Test
    void testDeleteUser() throws Exception {
        doNothing().when(userService).deleteUser(1L);

        // Perform the DELETE request to delete user with id 1
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("User deleted Successfully"));
    }
}
