package com.HealthTrack.Services;

import com.HealthTrack.dtos.HealthMetricDto;
import com.HealthTrack.mapper.HealthMetricMapper;
import com.HealthTrack.models.HealthMetric;
import com.HealthTrack.models.User;
import com.HealthTrack.repositories.HealthMetricRepository;
import com.HealthTrack.repositories.UserRepository;
import com.HealthTrack.services.imp.HealthMetricServiceImpl;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class HealthMetricServiceTest {

    @Mock
    private HealthMetricRepository healthMetricRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private HealthMetricServiceImpl healthMetricService;

    @Test
    public void testCreateHealthMetric() {
        HealthMetricDto healthMetricDto = new HealthMetricDto(null, "Weight", 75.5, LocalDateTime.now(), 1L);
        User user = new User(1L, "john_doe", "hashed_password", "john.doe@example.com", "123-456-7890", null, null, null);
        HealthMetric healthMetric = HealthMetricMapper.mapToHealthMetric(healthMetricDto, user);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(healthMetricRepository.save(any(HealthMetric.class))).thenReturn(healthMetric);

        HealthMetricDto createdHealthMetric = healthMetricService.createHealthMetric(healthMetricDto);

        assertEquals("Weight", createdHealthMetric.getMetricType());
        verify(healthMetricRepository, times(1)).save(any(HealthMetric.class));
    }

    @Test
    public void testGetHealthMetricById() {
        HealthMetric healthMetric = new HealthMetric(1L, "Weight", 75.5, LocalDateTime.now(), null);
        when(healthMetricRepository.findById(1L)).thenReturn(Optional.of(healthMetric));

        HealthMetricDto healthMetricDto = healthMetricService.findHealthMetricById(1L);

        assertEquals("Weight", healthMetricDto.getMetricType());
        verify(healthMetricRepository, times(1)).findById(1L);
    }

    @Test
    public void testFindAllHealthMetrics() {
        Long userId = 1L;
        HealthMetric healthMetric1 = new HealthMetric(1L, "Weight", 75.5, LocalDateTime.now(), null);
        HealthMetric healthMetric2 = new HealthMetric(2L, "Blood Pressure", 120.80, LocalDateTime.now(), null);

        when(healthMetricRepository.findByUserId(userId)).thenReturn(Arrays.asList(healthMetric1, healthMetric2));

        List<HealthMetricDto> healthMetricDtos = healthMetricService.findAllHealthMetricsByUserId(userId);

        assertEquals(2, healthMetricDtos.size());
        assertEquals("Weight", healthMetricDtos.get(0).getMetricType());
        assertEquals("Blood Pressure", healthMetricDtos.get(1).getMetricType());

        // Verify the repository interaction
        verify(healthMetricRepository, times(1)).findByUserId(userId);
    }



    @Test
    public void testUpdateHealthMetric() {
        HealthMetric healthMetric = new HealthMetric(1L, "Weight", 75.5, LocalDateTime.now(), null);
        HealthMetricDto healthMetricDto = new HealthMetricDto(1L, "Blood Pressure", 120.80, LocalDateTime.now(), 1L);

        when(healthMetricRepository.findById(1L)).thenReturn(Optional.of(healthMetric));
        when(healthMetricRepository.save(any(HealthMetric.class))).thenReturn(healthMetric);

        HealthMetricDto updatedHealthMetric = healthMetricService.updateHealthMetric(1L, healthMetricDto);

        assertEquals("Blood Pressure", updatedHealthMetric.getMetricType());

        verify(healthMetricRepository, times(1)).save(any(HealthMetric.class));
    }

    @Test
    public void testDeleteHealthMetric() {
        HealthMetric healthMetric = new HealthMetric(1L, "Weight", 75.5, LocalDateTime.now(), null);
        when(healthMetricRepository.findById(1L)).thenReturn(Optional.of(healthMetric));

        healthMetricService.deleteHealthMetric(1L);

        verify(healthMetricRepository, times(1)).deleteById(1L);
    }
}