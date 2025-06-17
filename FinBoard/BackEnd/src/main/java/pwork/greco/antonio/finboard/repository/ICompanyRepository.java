package pwork.greco.antonio.finboard.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import pwork.greco.antonio.finboard.entity.Company;
import pwork.greco.antonio.finboard.entity.User;
import java.util.List;
import java.util.Optional;

public interface ICompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByName(String name);
}