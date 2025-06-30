package pwork.greco.antonio.finboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pwork.greco.antonio.finboard.entity.CheckResultLog;
import pwork.greco.antonio.finboard.repository.CheckResultLogRepository;

import java.util.List;

@RestController
@RequestMapping("/api/check-result-logs")
public class CheckResultLogController {

    @Autowired
    private CheckResultLogRepository repository;

    @GetMapping
    public List<CheckResultLog> getAllLogs() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CheckResultLog> getLogById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

