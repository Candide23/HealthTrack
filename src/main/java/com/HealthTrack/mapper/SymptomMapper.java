package com.HealthTrack.mapper;

import com.HealthTrack.dtos.SymptomDto;
import com.HealthTrack.models.Symptom;
import com.HealthTrack.models.User;

public class SymptomMapper {

    public static SymptomDto mapToSymptomDto(Symptom symptom){
        return new SymptomDto(
                symptom.getId(),
                symptom.getSymptomType(),
                symptom.getSeverity(),
                symptom.getDescription(),
                symptom.getTimestamp(),
                symptom.getUser() != null ? symptom.getUser().getId() : null  // Check for null user Really important

        );
    }

    public static Symptom mapToSymptom(SymptomDto symptomDto, User user){

        return new Symptom(
                symptomDto.getId(),
                symptomDto.getSymptomType(),
                symptomDto.getSeverity(),
                symptomDto.getDescription(),
                symptomDto.getTimestamp(),
                user   // User entity passed from the service layer


        );

    }
}
