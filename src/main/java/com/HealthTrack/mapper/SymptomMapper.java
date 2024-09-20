package com.HealthTrack.mapper;

import com.HealthTrack.dtos.SymptomDto;
import com.HealthTrack.models.Symptom;

public class SymptomMapper {

    public static SymptomDto mapToSymptomDto(Symptom symptom){
        return new SymptomDto(
                symptom.getId(),
                symptom.getSymptomType(),
                symptom.getSeverity(),
                symptom.getDescription(),
                symptom.getTimestamp());
    }

    public static Symptom mapToSymptom(SymptomDto symptomDto){

        return new Symptom(
                symptomDto.getId(),
                symptomDto.getSymptomType(),
                symptomDto.getSeverity(),
                symptomDto.getDescription(),
                symptomDto.getTimestamp()

        );

    }
}
