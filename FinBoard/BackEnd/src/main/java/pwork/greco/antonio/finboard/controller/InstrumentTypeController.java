package pwork.greco.antonio.finboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pwork.greco.antonio.finboard.dto.InstrumentTypeDto;
import pwork.greco.antonio.finboard.entity.InstrumentType;
import pwork.greco.antonio.finboard.repository.IInstrumentTypeRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/instrument-types")
@RequiredArgsConstructor
public class InstrumentTypeController {

    private final IInstrumentTypeRepository instrumentTypeRepository;

    @GetMapping
    public List<InstrumentTypeDto> getAllInstrumentTypes() {
        return instrumentTypeRepository.findAll().stream()
                .map(i -> new InstrumentTypeDto(i.getId(), i.getName()))
                .collect(Collectors.toList());
    }
}
