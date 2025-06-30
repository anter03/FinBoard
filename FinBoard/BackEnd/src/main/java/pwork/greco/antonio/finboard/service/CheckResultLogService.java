package pwork.greco.antonio.finboard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pwork.greco.antonio.finboard.dto.CheckResult;
import pwork.greco.antonio.finboard.entity.CheckResultLog;
import pwork.greco.antonio.finboard.repository.CheckResultLogRepository;

import java.util.List;

@Service
public class CheckResultLogService {

    @Autowired
    private CheckResultLogRepository repository;

    public void logCheckResults(List<CheckResult> results) {
        List<CheckResultLog> logs = results.stream().map(r -> {
            CheckResultLog log = new CheckResultLog();
            log.setValid(r.isValid());
            log.setErrorMessage(r.getErrorMessage());
            log.setRuleDescription(r.getRuleDescription());
            if (r.getAppliedRule() != null) {
                log.setRuleId(r.getAppliedRule().getId());
                log.setRuleText(r.getAppliedRule().getDescription());
            }
            return log;
        }).toList();

        repository.saveAll(logs);
    }
}
