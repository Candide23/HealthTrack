package com.HealthTrack.controllers;


import com.HealthTrack.dtos.SymptomDto;
import com.HealthTrack.models.Symptom;
import com.HealthTrack.services.SymptomService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class SymptomControllerTest {

    private MockMvc mockMvc;

    @Mock
    SymptomService symptomService;

    @InjectMocks
    SymptomController symptomController;

    @Test
    public void testCreateSymptom() throws Exception{

        SymptomDto symptomDto = new SymptomDto(null, "Headache", 5, "Mild headache", LocalDateTime.now(), 1L);
        SymptomDto createdSymptom =  new SymptomDto(1L, "Headache", 5, "Mild headache", LocalDateTime.now(), 1L);

        when(symptomService.createSymptom(any(SymptomDto.class))).thenReturn(symptomDto);

        mockMvc = MockMvcBuilders.standaloneSetup(symptomController).build();

        mockMvc.perform(post("/api/symptoms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"symptomType\":\"Headache\",\"severity\":5,\"description\":\"Mild headache\",\"timestamp\":\"2023-09-20T10:30:00\",\"userId\":1}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.symptomType").value("Headache"));

    }

    @Test
    public void testFindSymptomById() throws Exception {

        SymptomDto symptomDto = new SymptomDto(1L, "Headache", 5, "Mild headache", LocalDateTime.now(), 1L);

        when(symptomService.findSymptomById(1L)).thenReturn(symptomDto);

        mockMvc = MockMvcBuilders.standaloneSetup(symptomController).build();


        mockMvc.perform(get("/api/symptoms/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.symptomType").value("Headache"));

    }

    @Test
    public void testFindAllSymptom() throws Exception {

        List<SymptomDto> symptomDtoList = Arrays.asList(new SymptomDto(1L, "Headache", 5, "Mild headache", LocalDateTime.now(), 1L),
                new SymptomDto(2L, "Stomach", 5, "Mild stomach", LocalDateTime.now(), 1L)
                );


        when(symptomService.findAllSymptom()).thenReturn(symptomDtoList);

        mockMvc = MockMvcBuilders.standaloneSetup(symptomController).build();

        mockMvc.perform(get("/api/symptoms"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].symptomType").value("Headache"))
                .andExpect(jsonPath("$[1].symptomType").value("Stomach"));


    }

    @Test
    public void updateSymptom() throws Exception {

        SymptomDto symptomDto = new SymptomDto(1L, "Severe Headache", 7, "Throbbing pain", LocalDateTime.now(), 1L);

        when(symptomService.updateSymptom(eq(1L), any(SymptomDto.class))).thenReturn(symptomDto);

        mockMvc = MockMvcBuilders.standaloneSetup(symptomController).build();


        mockMvc.perform(put("/api/symptoms/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"symptomType\":\"Severe Headache\",\"severity\":7,\"description\":\"Throbbing pain\",\"timestamp\":\"2024-09-20T10:30:00\",\"userId\":1}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.symptomType").value("Severe Headache"));



    }

    @Test
    public void deleteSymptoms()throws Exception{

        SymptomDto symptomDto = new SymptomDto(1L, "Severe Headache", 7, "Throbbing pain", LocalDateTime.now(), 1L);

        mockMvc = MockMvcBuilders.standaloneSetup(symptomController).build();

        mockMvc.perform(delete("/api/symptoms/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Deleted Symptom Successfully"));

        verify(symptomService, times(1)).deleteSymptom(1L);



    }

}
