package pwork.greco.antonio.finboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import pwork.greco.antonio.finboard.dto.CheckResult;
import pwork.greco.antonio.finboard.dto.OrderDto;
import pwork.greco.antonio.finboard.dto.OrderFilters;
import pwork.greco.antonio.finboard.dto.OrderValidationResponse;
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

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderDto order) {
        // Verifica pre-acquisto - ottieni tutti i risultati
        List<CheckResult> checkResults = orderCheckService.verifyOrder(order);

        // Controlla se ci sono controlli falliti
        List<CheckResult> failedChecks = checkResults.stream()
                .filter(result -> !result.isValid())
                .collect(Collectors.toList());

        if (!failedChecks.isEmpty()) {
            // Costruisci risposta con tutti gli errori
            List<String> errorMessages = failedChecks.stream()
                    .map(result -> String.format("[%s] %s",
                            result.getRuleDescription(), result.getErrorMessage()))
                    .collect(Collectors.toList());



            return ResponseEntity.ok(
                    new OrderValidationResponse(false, errorMessages, failedChecks));
        }

        // Tutti i controlli sono passati - procedi con l'esecuzione
        // Log dei controlli applicati con successo (opzionale)
        List<String> appliedRules = checkResults.stream()
                .map(CheckResult::getRuleDescription)
                .collect(Collectors.toList());

        System.out.println("Controlli applicati con successo: " + appliedRules);

        // ... logica di esecuzione dell'ordine

        return ResponseEntity.ok(new OrderValidationResponse(true, null, checkResults));
    }
}



