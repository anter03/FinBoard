package pwork.greco.antonio.finboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pwork.greco.antonio.finboard.entity.Instrument;

public interface IInstrumentRepository extends JpaRepository<Instrument, Long> {
}
