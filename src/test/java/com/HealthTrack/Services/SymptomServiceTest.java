package com.HealthTrack.Services;

import org.junit.jupiter.api.Test;
import com.HealthTrack.dtos.SymptomDto;
import com.HealthTrack.mapper.SymptomMapper;
import com.HealthTrack.models.Symptom;
import com.HealthTrack.models.User;
import com.HealthTrack.repositories.SymptomRepository;
import com.HealthTrack.repositories.UserRepository;
import com.HealthTrack.services.imp.SymptomServiceImpl;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@SpringBootTest
public class SymptomServiceTest {

    @Mock
    private SymptomRepository symptomRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SymptomServiceImpl symptomService;

    @Test
    public void testCreateSymptom() {
        SymptomDto symptomDto = new SymptomDto(null, "Headache", 5, "Mild headache", LocalDateTime.now(), 1L);
        User user = new User(1L, "john_doe", "hashed_password", "john.doe@example.com", "123-456-7890", null, null, null);
        Symptom symptom = SymptomMapper.mapToSymptom(symptomDto, user);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(symptomRepository.save(any(Symptom.class))).thenReturn(symptom);

        SymptomDto createdSymptom = symptomService.createSymptom(symptomDto);

        assertEquals("Headache", createdSymptom.getSymptomType());
        verify(symptomRepository, times(1)).save(any(Symptom.class));
    }

    @Test
    public void testGetSymptomById() {
        Symptom symptom = new Symptom(1L, "Headache", 5, "Mild headache", LocalDateTime.now(), null);
        when(symptomRepository.findById(1L)).thenReturn(Optional.of(symptom));

        SymptomDto symptomDto = symptomService.findSymptomById(1L);

        assertEquals("Headache", symptomDto.getSymptomType());
        verify(symptomRepository, times(1)).findById(1L);
    }

    @Test
    public void testUpdateSymptom() {
        Symptom symptom = new Symptom(1L, "Headache", 5, "Mild headache", LocalDateTime.now(), null);
        SymptomDto symptomDto = new SymptomDto(1L, "Severe Headache", 7, "Throbbing pain", LocalDateTime.now(), 1L);

        when(symptomRepository.findById(1L)).thenReturn(Optional.of(symptom));
        when(symptomRepository.save(any(Symptom.class))).thenReturn(symptom);

        SymptomDto updatedSymptom = symptomService.updateSymptom(1L, symptomDto);

        assertEquals("Severe Headache", updatedSymptom.getSymptomType());
        verify(symptomRepository, times(1)).save(any(Symptom.class));
    }

    @Test
    public void testDeleteSymptom() {
        Symptom symptom = new Symptom(1L, "Headache", 5, "Mild headache", LocalDateTime.now(), null);
        when(symptomRepository.findById(1L)).thenReturn(Optional.of(symptom));

        symptomService.deleteSymptom(1L);

        verify(symptomRepository, times(1)).deleteById(1L);
    }
}