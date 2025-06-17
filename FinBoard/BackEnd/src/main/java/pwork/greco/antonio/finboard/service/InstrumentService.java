package pwork.greco.antonio.finboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pwork.greco.antonio.finboard.dto.InstrumentDto;
import pwork.greco.antonio.finboard.entity.Instrument;
import pwork.greco.antonio.finboard.entity.InstrumentType;
import pwork.greco.antonio.finboard.repository.IInstrumentRepository;
import pwork.greco.antonio.finboard.repository.IInstrumentTypeRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InstrumentService {

    private final IInstrumentRepository instrumentRepository;
    private final IInstrumentTypeRepository instrumentTypeRepository;

    public List<InstrumentDto> getAll() {
        return instrumentRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public InstrumentDto getById(Long id) {
        return toDto(instrumentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instrument not found with ID: " + id)));
    }

    public InstrumentDto create(InstrumentDto dto) {
        Instrument entity = toEntity(dto);
        return toDto(instrumentRepository.save(entity));
    }

    public InstrumentDto update(Long id, InstrumentDto dto) {
        Instrument existing = instrumentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instrument not found with ID: " + id));
        existing.setName(dto.getName());
        existing.setCurrency(dto.getCurrency());
        existing.setIsin(dto.getIsin());
        existing.setInstrumentType(
                instrumentTypeRepository.findById(dto.getInstrumentTypeId())
                        .orElseThrow(() -> new RuntimeException("InstrumentType not found with ID: " + dto.getInstrumentTypeId()))
        );
        return toDto(instrumentRepository.save(existing));
    }

    public void delete(Long id) {
        instrumentRepository.deleteById(id);
    }

    // Mapping

    private InstrumentDto toDto(Instrument instrument) {
        return InstrumentDto.builder()
                .id(instrument.getId())
                .name(instrument.getName())
                .instrumentTypeId(instrument.getInstrumentType().getId())
                .currency(instrument.getCurrency())
                .isin(instrument.getIsin())
                .build();
    }

    private Instrument toEntity(InstrumentDto dto) {
        InstrumentType type = instrumentTypeRepository.findById(dto.getInstrumentTypeId())
                .orElseThrow(() -> new RuntimeException("InstrumentType not found with ID: " + dto.getInstrumentTypeId()));
        return Instrument.builder()
                .id(dto.getId())
                .name(dto.getName())
                .instrumentType(type)
                .currency(dto.getCurrency())
                .isin(dto.getIsin())
                .build();
    }
}
