package com.HealthTrack.controllers;


import com.HealthTrack.dtos.HealthMetricDto;
import com.HealthTrack.services.HealthMetricService;
import com.HealthTrack.services.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@AllArgsConstructor
@RestController
@RequestMapping("/api/healthMetrics")
public class HealthMetricController {

    private HealthMetricService healthMetricService;


    @PostMapping
    ResponseEntity<HealthMetricDto> createHealthMetrics(@RequestBody HealthMetricDto healthMetricDto){
        HealthMetricDto createdHealthMetrics = healthMetricService.createHealthMetric(healthMetricDto);
        return new ResponseEntity<>(createdHealthMetrics, HttpStatus.CREATED);

    }

    @GetMapping("/{id}")
    public ResponseEntity<HealthMetricDto> getHealthMetricsById(@PathVariable("id") Long healthMetricId) {
        HealthMetricDto metric = healthMetricService.findHealthMetricById(healthMetricId);
        return ResponseEntity.ok(metric);
    }

    @GetMapping
    public ResponseEntity<List<HealthMetricDto>> getAllHealthMetricsByUserId(@RequestParam("userId") Long userId ) {
        List<HealthMetricDto> metrics = healthMetricService.findAllHealthMetricsByUserId(userId);
        return ResponseEntity.ok(metrics);
    }


    @PutMapping("/{id}")
    public ResponseEntity<HealthMetricDto> updateHealthMetrics(@PathVariable("id") Long healthMetricId, @RequestBody HealthMetricDto healthMetricDto) {
        HealthMetricDto updatedHealthMetric = healthMetricService.updateHealthMetric(healthMetricId, healthMetricDto);
        return ResponseEntity.ok(updatedHealthMetric);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deletedHealthMetrics(@PathVariable("id") Long healthMetricId){
         healthMetricService.deleteHealthMetric(healthMetricId);
        return  ResponseEntity.ok("Deleted Metric Successfully");
    }
}
