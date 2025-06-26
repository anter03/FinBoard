package pwork.greco.antonio.finboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pwork.greco.antonio.finboard.dto.OrderDto;
import pwork.greco.antonio.finboard.dto.OrderFilters;
import pwork.greco.antonio.finboard.entity.*;
import pwork.greco.antonio.finboard.repository.*;
import pwork.greco.antonio.finboard.service.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Objects;
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
        entity.setStatus("DRAFT");
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
                .currency((entity.getCurrency()))
                .build();
    }

    public Order toEntity(OrderDto dto) {

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
                .currency((dto.getCurrency()))
                .build();
    }


    public List<OrderDto> getFilteredOrders(OrderFilters filters) {
        boolean noFilters = filters.getId() == null &&
                filters.getIsin() == null &&
                filters.getQuantity() == null &&
                filters.getPortfolio() == null &&
                filters.getOperationDateFrom() == null &&
                filters.getOperationDateTo() == null &&
                filters.getValueDateFrom() == null &&
                filters.getValueDateTo() == null &&
                filters.getStatus() == null &&
                filters.getCurrency() == null &&
                filters.getSide() == null;

        if (noFilters) {
            return getAll(); // ritorna tutti gli ordini
        }

        return orderRepository.findAll().stream()
                .filter(order -> filters.getId() == null || order.getId().toString().equals(filters.getId()))
                .filter(order -> filters.getIsin() == null ||
                        (order.getInstrument() != null && filters.getIsin().equalsIgnoreCase(order.getInstrument().getIsin())))
                .filter(order -> filters.getQuantity() == null || order.getQuantity().equals((BigDecimal)filters.getQuantity()))

                .filter(order ->
                        filters.getPortfolio() == null ||
                                (order.getPortfolio() != null &&
                                        Objects.equals(order.getPortfolio().getId(), filters.getPortfolio()))
                )

                .filter(order -> filterByOperationDateFrom(order, filters.getOperationDateFrom()))
                .filter(order -> filterByOperationDateTo(order, filters.getOperationDateTo()))
                .filter(order -> filterByValueDateFrom(order, filters.getValueDateFrom()))
                .filter(order -> filterByValueDateTo(order, filters.getValueDateTo()))
                .filter(order -> filters.getStatus() == null || order.getStatus().equalsIgnoreCase(filters.getStatus()))
                .filter(order -> filters.getCurrency() == null || order.getCurrency().equalsIgnoreCase(filters.getCurrency()))
                .filter(order -> filters.getSide() == null || order.getSide().equalsIgnoreCase(filters.getSide()))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private boolean filterByOperationDateFrom(Order order, String dateFromStr) {
        if (dateFromStr == null) {
            return true;
        }
        try {
            LocalDateTime filterDate = LocalDate.parse(dateFromStr).atStartOfDay();
            return !order.getOperationDate().isBefore(filterDate);
        } catch (DateTimeParseException e) {
            //log.warn("Invalid date format for operationDateFrom: {}", dateFromStr);
            return true; // Include l'ordine se la data non è valida
        }
    }

    private boolean filterByOperationDateTo(Order order, String dateToStr) {
        if (dateToStr == null) {
            return true;
        }
        try {
            LocalDateTime filterDate = LocalDate.parse(dateToStr).atTime(23, 59, 59);
            return !order.getOperationDate().isAfter(filterDate);
        } catch (DateTimeParseException e) {
            //log.warn("Invalid date format for operationDateTo: {}", dateToStr);
            return true; // Include l'ordine se la data non è valida
        }
    }

    private boolean filterByValueDateFrom(Order order, String dateFromStr) {
        if (dateFromStr == null) {
            return true;
        }
        try {
            LocalDateTime filterDate = LocalDate.parse(dateFromStr).atStartOfDay();
            return !order.getEvaluationDate().isBefore(filterDate);
        } catch (DateTimeParseException e) {
            //log.warn("Invalid date format for valueDateFrom: {}", dateFromStr);
            return true; // Include l'ordine se la data non è valida
        }
    }

    private boolean filterByValueDateTo(Order order, String dateToStr) {
        if (dateToStr == null) {
            return true;
        }
        try {
            LocalDateTime filterDate = LocalDate.parse(dateToStr).atTime(23, 59, 59);
            return !order.getEvaluationDate().isAfter(filterDate);
        } catch (DateTimeParseException e) {
            //log.warn("Invalid date format for valueDateTo: {}", dateToStr);
            return true; // Include l'ordine se la data non è valida
        }
    }
}
