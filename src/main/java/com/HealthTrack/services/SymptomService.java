package com.HealthTrack.services;

import com.HealthTrack.dtos.SymptomDto;

import java.util.List;

public interface SymptomService {

    SymptomDto createSymptom(SymptomDto symptomDto);
    SymptomDto findSymptomById(Long idSymptom);
    List<SymptomDto> findAllSymptom();
    SymptomDto updateSymptom(Long idSymptom, SymptomDto symptomDto);
    void deleteSymptom(Long idSymptom);
}