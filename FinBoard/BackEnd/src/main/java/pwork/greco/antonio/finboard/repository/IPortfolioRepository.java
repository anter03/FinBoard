package pwork.greco.antonio.finboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pwork.greco.antonio.finboard.entity.Portfolio;

public interface IPortfolioRepository extends JpaRepository<Portfolio, Long> {
}
