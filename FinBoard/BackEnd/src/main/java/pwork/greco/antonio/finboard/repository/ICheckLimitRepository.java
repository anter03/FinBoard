package pwork.greco.antonio.finboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pwork.greco.antonio.finboard.entity.CheckLimit;

import java.util.List;
import java.util.Optional;

public interface ICheckLimitRepository extends JpaRepository<CheckLimit, Long> {

    List<CheckLimit> findByProfileId(Long profileId);

    List<CheckLimit> findByProfileIdAndInstrumentTypeId(Long profileId, Long instrumentTypeId);

    Optional<CheckLimit> findByIdAndProfileId(Long id, Long profileId);
}
