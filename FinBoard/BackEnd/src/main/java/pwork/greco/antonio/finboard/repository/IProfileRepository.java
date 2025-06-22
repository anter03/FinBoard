package pwork.greco.antonio.finboard.repository;

import pwork.greco.antonio.finboard.entity.Profile;
import pwork.greco.antonio.finboard.entity.User;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import pwork.greco.antonio.finboard.entity.User;

import java.util.List;
import java.util.Optional;

public interface IProfileRepository extends JpaRepository<Profile, Long> {
}


