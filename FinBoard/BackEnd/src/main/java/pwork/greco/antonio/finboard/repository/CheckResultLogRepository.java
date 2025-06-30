package pwork.greco.antonio.finboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pwork.greco.antonio.finboard.entity.CheckResultLog;

@Repository
public interface CheckResultLogRepository extends JpaRepository<CheckResultLog, Long> {
}
