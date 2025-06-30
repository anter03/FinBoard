package pwork.greco.antonio.finboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import pwork.greco.antonio.finboard.dto.CheckResult;
import pwork.greco.antonio.finboard.dto.OrderDto;
import pwork.greco.antonio.finboard.dto.OrderFilters;
import pwork.greco.antonio.finboard.dto.OrderValidationResponse;
import pwork.greco.antonio.finboard.service.CheckResultLogService;
import pwork.greco.antonio.finboard.service.OrderCheckService;
import pwork.greco.antonio.finboard.service.OrderService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderCheckService orderCheckService;
    private final CheckResultLogService checkResultLogService;

    @GetMapping
    public List<OrderDto> getAll() {
        return orderService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getById(id));
    }






    @PutMapping("/{id}")
    public ResponseEntity<OrderDto> update(@PathVariable Long id, @RequestBody OrderDto dto) {
        return ResponseEntity.ok(orderService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {
        orderService.softDelete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/hard")
    public ResponseEntity<Void> hardDelete(@PathVariable Long id) {
        orderService.hardDelete(id);
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/filter")
    public ResponseEntity<List<OrderDto>> getFilteredOrders(@RequestBody OrderFilters filters) {
        return ResponseEntity.ok(orderService.getFilteredOrders(filters));
    }

    //@PostMapping
    //public ResponseEntity<OrderDto> create(@RequestBody OrderDto dto) {
    //    return new ResponseEntity<>(orderService.create(dto), HttpStatus.CREATED);
    //}
    @PostMapping("/validate")
    public ResponseEntity<OrderValidationResponse> validateOrder(@RequestBody OrderDto order) {
        List<CheckResult> checkResults = orderCheckService.verifyOrder(order);
        List<CheckResult> failedChecks = checkResults.stream()
                .filter(r -> !r.isValid())
                .toList();

        // ✅ Log dei risultati (validi e non validi)
        checkResultLogService.logCheckResults(checkResults);

        if (!failedChecks.isEmpty()) {
            List<String> messages = failedChecks.stream()
                    .map(r -> String.format("[%s] %s", r.getRuleDescription(), r.getErrorMessage()))
                    .toList();
            return ResponseEntity.ok(new OrderValidationResponse(false, messages, checkResults));
        }

        return ResponseEntity.ok(new OrderValidationResponse(true, null, checkResults));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderDto order) {
        ResponseEntity<OrderValidationResponse> validationResponse = validateOrder(order);
        if (!validationResponse.getBody().isValid()) {
            return validationResponse;
        }

        // Qui va la logica di inserimento dell'ordine nel DB o sistema di backend
        orderService.create(order);

        OrderValidationResponse successResponse = new OrderValidationResponse();
        successResponse.setValid(true);
        successResponse.setErrorMessages(List.of("Ordine creato con successo"));
        return ResponseEntity.ok(successResponse);

    }

}



