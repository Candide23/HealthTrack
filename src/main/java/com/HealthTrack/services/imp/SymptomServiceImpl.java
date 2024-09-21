package com.HealthTrack.services.imp;

import com.HealthTrack.dtos.SymptomDto;
import com.HealthTrack.mapper.SymptomMapper;
import com.HealthTrack.models.Symptom;
import com.HealthTrack.models.User;
import com.HealthTrack.repositories.SymptomRepository;
import com.HealthTrack.repositories.UserRepository;
import com.HealthTrack.services.SymptomService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class SymptomServiceImpl implements SymptomService {

    private SymptomRepository symptomRepository;

    private UserRepository userRepository;


    @Override
    public SymptomDto createSymptom(SymptomDto symptomDto) {
        User user = userRepository.findById(symptomDto.getUserId()).orElseThrow();
        Symptom symptom = SymptomMapper.mapToSymptom(symptomDto, user);
        Symptom saveSymptom = symptomRepository.save(symptom);

        return SymptomMapper.mapToSymptomDto(saveSymptom);
    }

    @Override
    public SymptomDto findSymptomById(Long idSymptom) {
        Symptom symptom = symptomRepository.findById(idSymptom)
                .orElseThrow(() -> new RuntimeException("Symptom not found"));
        return SymptomMapper.mapToSymptomDto(symptom);
    }

    @Override
    public List<SymptomDto> findAllSymptom() {
        List<Symptom> symptoms = symptomRepository.findAll();

        return symptoms.stream().map((symptom -> SymptomMapper.mapToSymptomDto(symptom)))
                .collect(Collectors.toList());
    }

    @Override
    public SymptomDto updateSymptom(Long idSymptom, SymptomDto symptomDto) {

        Symptom symptom = symptomRepository.findById(idSymptom)
                .orElseThrow(() -> new RuntimeException("Symptom not found"));
        symptom.setSymptomType(symptomDto.getSymptomType());
        symptom.setDescription(symptomDto.getDescription());
        symptom.setSeverity(symptomDto.getSeverity());

        Symptom updatedSymptom = symptomRepository.save(symptom);

        return SymptomMapper.mapToSymptomDto(updatedSymptom);
    }

    @Override
    public void deleteSymptom(Long idSymptom) {

        Symptom symptom = symptomRepository.findById(idSymptom)
                .orElseThrow(() -> new RuntimeException("Symptom not found"));
        symptomRepository.deleteById(idSymptom);


    }
}
