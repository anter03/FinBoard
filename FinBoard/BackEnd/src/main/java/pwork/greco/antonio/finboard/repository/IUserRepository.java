package pwork.greco.antonio.finboard.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import pwork.greco.antonio.finboard.entity.User;

import java.util.List;
import java.util.Optional;

public interface IUserRepository extends JpaRepository<User, Long> {
    Optional<User> findByCompanyId(Long companyId);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}
