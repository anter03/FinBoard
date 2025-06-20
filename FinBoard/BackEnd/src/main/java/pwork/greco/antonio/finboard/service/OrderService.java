package pwork.greco.antonio.finboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pwork.greco.antonio.finboard.dto.OrderDto;
import pwork.greco.antonio.finboard.entity.*;
import pwork.greco.antonio.finboard.repository.*;
import pwork.greco.antonio.finboard.service.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final IOrderRepository orderRepository;
    private final IPortfolioRepository portfolioRepository;
    private final IInstrumentRepository instrumentRepository;
    private final IUserRepository userRepository;

    private final PortfolioService portfolioService;
    private final InstrumentService instrumentService;
    private final UserService userService;

    public List<OrderDto> getAll() {
        return orderRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public OrderDto getById(Long id) {
        return toDto(orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id)));
    }

    public OrderDto create(OrderDto dto) {
        Order entity = toEntity(dto);
        entity.setId(null);
        if (entity.getCreatedAt() == null)
            entity.setCreatedAt(LocalDateTime.now());
        if (entity.getDeleted() == null)
            entity.setDeleted(false);
        return toDto(orderRepository.save(entity));
    }

    public OrderDto update(Long id, OrderDto dto) {
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));

        existing.setSide(dto.getSide());
        existing.setQuantity(dto.getQuantity());
        existing.setPrice(dto.getPrice());
        existing.setStatus(dto.getStatus());
        existing.setExecutedAt(dto.getExecutedAt());

        return toDto(orderRepository.save(existing));
    }

    public void softDelete(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
        order.setDeleted(true);
        orderRepository.save(order);
    }

    public void hardDelete(Long id) {
        orderRepository.deleteById(id);
    }

    // Mapping

    public OrderDto toDto(Order entity) {

        //return OrderDto.builder()
        //        .id(entity.getId())
        //        .portfolioId(entity.getPortfolio().getId())
        //        .instrumentId(entity.getInstrument().getId())
        //        .operatorId(entity.getOperator().getId())
        //        .side(entity.getSide())
        //        .quantity(entity.getQuantity())
        //        .price(entity.getPrice())
        //        .status(entity.getStatus())
        //        .createdAt(entity.getCreatedAt())
        //        .executedAt(entity.getExecutedAt())
        //        .deleted(entity.getDeleted())
        //        .build();
        return OrderDto.builder()
                .id(entity.getId())
                .portfolio(portfolioService.getById(entity.getPortfolio().getId()))
                .instrument(instrumentService.getById(entity.getInstrument().getId()))
                .user(userService.getUserById(entity.getOperator().getId()))
                .side(entity.getSide())
                .quantity(entity.getQuantity())
                .price(entity.getPrice())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .executedAt(entity.getExecutedAt())
                .deleted(entity.getDeleted())
                .evaluationDate(entity.getEvaluationDate())
                .operationDate(entity.getOperationDate())
                .build();
    }

    public Order toEntity(OrderDto dto) {
//        Portfolio portfolio = portfolioRepository.findById(dto.getPortfolioId())
//                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
//        Instrument instrument = instrumentRepository.findById(dto.getInstrumentId())
//                .orElseThrow(() -> new RuntimeException("Instrument not found"));
//        User operator = userRepository.findById(dto.getOperatorId())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        return Order.builder()
//                .id(dto.getId())
//                .portfolio(portfolio)
//                .instrument(instrument)
//                .operator(operator)
//                .side(dto.getSide())
//                .quantity(dto.getQuantity())
//                .price(dto.getPrice())
//                .status(dto.getStatus())
//                .createdAt(dto.getCreatedAt())
//                .executedAt(dto.getExecutedAt())
//                .deleted(dto.getDeleted())
//                .build();

        return Order.builder()
                .id(dto.getId())
                .portfolio(portfolioService.toEntity(dto.getPortfolio()))
                .instrument(instrumentService.toEntity(dto.getInstrument()))
                .operator(userService.toEntity(dto.getUser()))
                .side(dto.getSide())
                .quantity(dto.getQuantity())
                .price(dto.getPrice())
                .status(dto.getStatus())
                .createdAt(dto.getCreatedAt())
                .executedAt(dto.getExecutedAt())
                .deleted(dto.getDeleted())
                .operationDate(dto.getOperationDate())
                .evaluationDate(dto.getEvaluationDate())
                .build();
    }
}
