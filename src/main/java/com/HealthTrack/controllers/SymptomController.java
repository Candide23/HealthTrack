package com.HealthTrack.controllers;


import com.HealthTrack.dtos.SymptomDto;
import com.HealthTrack.services.SymptomService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/symptoms")
public class SymptomController {

    private SymptomService symptomService;



    @PostMapping
    public ResponseEntity<SymptomDto> createSymptom(@RequestBody SymptomDto symptomDto) {
        SymptomDto createdSymptom = symptomService.createSymptom(symptomDto);
        return new ResponseEntity<>(createdSymptom, HttpStatus.CREATED);
    }


    @GetMapping("/{id}")
    public ResponseEntity<SymptomDto> getSymptomById(@PathVariable("id") Long idSymptom) {
        SymptomDto symptom = symptomService.findSymptomById(idSymptom);
        return ResponseEntity.ok(symptom);
    }

    @GetMapping
    public ResponseEntity<List<SymptomDto>> getAllSymptoms() {
        List<SymptomDto> symptoms = symptomService.findAllSymptom();
        return new ResponseEntity<>(symptoms, HttpStatus.OK);
    }


    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<SymptomDto> updateSymptom(@PathVariable("id") Long idSymptom, @RequestBody SymptomDto symptomDto) {
        SymptomDto updatedSymptom = symptomService.updateSymptom(idSymptom, symptomDto);
        return ResponseEntity.ok(updatedSymptom);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deletedHealthMetrics(@PathVariable("id") Long idSymptom){

        symptomService.deleteSymptom(idSymptom);

        return  ResponseEntity.ok("Deleted Symptom Successful");
    }
}
