package com.HealthTrack.controllers;


import com.HealthTrack.dtos.HealthMetricDto;
import com.HealthTrack.services.HealthMetricService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/api/healthMetric")
public class HealthMetricController {

    private HealthMetricService healthMetricService;

    @PostMapping
    ResponseEntity<HealthMetricDto> createHealthMetrics(@RequestBody HealthMetricDto healthMetricDto){

        HealthMetricDto createdHealthMetrics = healthMetricService.createHealthMetric(healthMetricDto);

        return new ResponseEntity<>(createdHealthMetrics, HttpStatus.CREATED);

    }
}
