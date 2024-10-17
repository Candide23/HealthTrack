package com.HealthTrack.controllers;


import com.HealthTrack.dtos.UserDto;
import com.HealthTrack.services.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
public class UserControllerTest {

   private MockMvc mockMvc;

   @Mock
   private UserService userService;

   @InjectMocks
   private UserController userController;

   @Test
    public void testCreateUser() throws Exception{

       UserDto userDto = new UserDto(null, "cham","mbk","cham@email.com","123-456-7890",null, null,null, null);
       UserDto createdUserDto = new UserDto(null, "cham","mbk","cham@email.com","123-456-7890",null, null,null, null);

       when(userService.createUser(any(UserDto.class))).thenReturn(createdUserDto);

       mockMvc = MockMvcBuilders.standaloneSetup(userController).build();

       mockMvc.perform(post("/api/users")
               .contentType(MediaType.APPLICATION_JSON)
               .content("{\"username\":\"cham\",\"password\":\"mbk\",\"email\":\"cham@email.com\",\"phoneNumber\":\"123-456-7890\"}"))
               .andExpect(status().isCreated())
               .andExpect(jsonPath("$.username").value("cham"))
               .andExpect(jsonPath("$.email").value("cham@email.com"));



   }

   @Test
   public void testFindUserById() throws Exception{

      UserDto userDto = new UserDto(1L, "cham","mbk","cham@email.com","123-456-7890",null, null,null, null);

      when(userService.findUserById(1L)).thenReturn(userDto);

      mockMvc = MockMvcBuilders.standaloneSetup(userController).build();


      mockMvc.perform(get("/api/users/1"))
              .andExpect(status().isOk())
              .andExpect(jsonPath("$.username").value("cham"))
              .andExpect(jsonPath("$.email").value("cham@email.com"));

   }

   @Test
   public void testFindAllUsers() throws Exception{

      List<UserDto> users = Arrays.asList(
              new UserDto(1L, "cham", "mbk", "cham@email.com", "123-456-7890", null, null, null, null),
              new UserDto(2L, "jane", "password", "jane@email.com", "123-555-7890", null, null, null, null)
      );

      when(userService.findAllUser()).thenReturn(users);

      mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
      mockMvc.perform(get("/api/users"))
              .andExpect(status().isOk())
              .andExpect(jsonPath("$[0].username").value("cham"))
              .andExpect(jsonPath("$[1].username").value("jane"));

   }

   @Test
   public void testUpdatedUser() throws Exception{
      UserDto userDto = new UserDto(1L, "chama","mbka","chama@email.com","987-654-3210",null, null,null, null);

      when(userService.updateUser(eq(1L), any(UserDto.class))).thenReturn(userDto);

      mockMvc = MockMvcBuilders.standaloneSetup(userController).build();


      mockMvc.perform(put("/api/users/1")
                      .contentType(MediaType.APPLICATION_JSON)
                      .content("{\"username\":\"chama\",\"password\":\"mbka\",\"email\":\"chama@email.com\",\"phoneNumber\":\"987-654-3210\"}"))
              .andExpect(status().isOk())
              .andExpect(jsonPath("$.username").value("chama"))
              .andExpect(jsonPath("$.email").value("chama@email.com"));




   }

   @Test
   public void testDeletedUser() throws Exception{

     mockMvc = MockMvcBuilders.standaloneSetup(userController).build();

     mockMvc.perform(delete("/api/users/1"))
             .andExpect(status().isOk())
                     .andExpect(MockMvcResultMatchers.content().string("User deleted Successfully"));
             verify(userService, times(1)).deleteUser(1L);

   }




}
