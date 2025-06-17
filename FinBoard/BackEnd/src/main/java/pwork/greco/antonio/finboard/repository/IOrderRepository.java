package pwork.greco.antonio.finboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pwork.greco.antonio.finboard.entity.Order;

public interface IOrderRepository extends JpaRepository<Order, Long> {
}
