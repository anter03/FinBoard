package pwork.greco.antonio.finboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pwork.greco.antonio.finboard.entity.InstrumentType;

public interface IInstrumentTypeRepository extends JpaRepository<InstrumentType, Long> {
    // niente metodi custom: usiamo solo findAll()
}
