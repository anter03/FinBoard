package pwork.greco.antonio.finboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pwork.greco.antonio.finboard.dto.CheckLimitDto;
import pwork.greco.antonio.finboard.dto.CheckResult;
import pwork.greco.antonio.finboard.dto.*;
import pwork.greco.antonio.finboard.entity.CheckLimit;
import pwork.greco.antonio.finboard.repository.ICheckLimitRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
@Service
@Transactional
public class OrderCheckService {

    // Assumo che tu abbia un repository per recuperare i controlli
    private ICheckLimitRepository checkLimitRepository;
    private CheckLimitService checkLimitService;

    public OrderCheckService(ICheckLimitRepository checkLimitRepository,
                             CheckLimitService checkLimitService) {
        this.checkLimitRepository = checkLimitRepository;
        this.checkLimitService = checkLimitService;
    }

    public static final String FORBIDDEN = "FORBIDDEN";
    public static final String LIMIT = "LIMIT";

    /**
     * Verifica se un ordine può essere eseguito in base alle regole di controllo
     * @param order L'ordine da verificare
     * @return Lista di risultati delle verifiche, uno per ogni controllo
     */
    public List<CheckResult> verifyOrder(OrderDto order) {
        // 1. Recupera tutte le regole applicabili al profilo dell'utente
        Long profileId = order.getUser().getProfile().getId();
        List<CheckLimit> limitToApplicate = checkLimitRepository.findByProfileId(profileId);

        List<CheckLimitDto> applicableRules = new ArrayList<>();
        for (CheckLimit limit : limitToApplicate) {
            applicableRules.add(checkLimitService.toDto(limit));
        }

        // 2. Filtra le regole in base ALLO STRUMENTO
        List<CheckLimitDto> matchingRules = filterRulesByInstrument(applicableRules, order.getInstrument());

        // 3. Verifica ogni regola applicabile e raccogli tutti i risultati
        return matchingRules.stream()
                .map(rule -> applyRule(rule, order))
                .collect(Collectors.toList());
    }

    /**
     * Verifica se l'ordine può essere eseguito (tutti i controlli devono passare)
     * @param order L'ordine da verificare
     * @return true se tutti i controlli passano, false altrimenti
     */
    public boolean canExecuteOrder(OrderDto order) {
        List<CheckResult> results = verifyOrder(order);
        return results.stream().allMatch(CheckResult::isValid);
    }

    /**
     * Restituisce i primi controlli falliti
     * @param order L'ordine da verificare
     * @return Lista dei controlli falliti
     */
    public List<CheckResult> getFailedChecks(OrderDto order) {
        return verifyOrder(order).stream()
                .filter(result -> !result.isValid())
                .collect(Collectors.toList());
    }

    /**
     * Filtra le regole in base alle caratteristiche dello strumento
     */
    private List<CheckLimitDto> filterRulesByInstrument(List<CheckLimitDto> rules, InstrumentDto instrument) {
        return rules.stream()
                .filter(rule -> matchesInstrumentType(rule, instrument))
                .filter(rule -> matchesCountry(rule, instrument))
                //.filter(rule -> matchesActionType(rule)) // Solo BUY per ora
                .collect(Collectors.toList());
    }

    private boolean matchesInstrumentType(CheckLimitDto rule, InstrumentDto instrument) {
        // Se la regola non specifica un tipo strumento, è applicabile a tutti
        return rule.getInstrumentTypeId() == null ||
                rule.getInstrumentTypeId().equals(instrument.getInstrumentTypeId());
    }

    private boolean matchesCountry(CheckLimitDto rule, InstrumentDto instrument) {
        // Se la regola non specifica un paese, è applicabile a tutti
        return rule.getActionType().equals(FORBIDDEN)   && (rule.getCountry() == null || rule.getCountry().equals(instrument.getCountry()));
    }

    private boolean matchesRating(CheckLimitDto rule, InstrumentDto instrument) {
        // Se la regola non specifica un rating, è applicabile a tutti
        if (rule.getRating() == null) {
            return true;
        }

        return rule.getActionType().equals(FORBIDDEN)   && rule.getCountry() != null;

    }

    private boolean matchesActionType(CheckLimitDto rule) {
        return "BUY".equals(rule.getActionType());
        //return true;
    }

    /**
     * Applica una singola regola all'ordine
     */
    private CheckResult applyRule(CheckLimitDto rule, OrderDto order) {
        if ("FORBIDDEN".equals(rule.getActionType())) {

            if(rule.getRating() != null){
                boolean result = isRatingSufficient(order.getInstrument().getRating(), rule.getRating());
                if(result)
                    return CheckResult.success(rule);
                else
                    return CheckResult.failure("Rating insufficiente",rule);
            }


            return CheckResult.failure(
                    String.format("Acquisto vietato per il profilo %d: %s",
                            rule.getProfileId(), rule.getDescription()),
                    rule
            );
        }

        if ("LIMIT".equals(rule.getActionType())) {
            return checkLimit(rule, order);
        }

        return CheckResult.success(rule);
    }

    /**
     * Verifica i limiti di acquisto
     */
    private CheckResult checkLimit(CheckLimitDto rule, OrderDto order) {
        BigDecimal orderAmount = order.getQuantity().multiply(order.getPrice());

        if ("DAILY".equals(rule.getLimitType())) {
            return checkDailyLimit(rule, order, orderAmount);
        } else if ("TOTAL".equals(rule.getLimitType())) {
            return checkTotalLimit(rule, order, orderAmount);
        }

        return CheckResult.success(rule);
    }

    private CheckResult checkDailyLimit(CheckLimitDto rule, OrderDto order, BigDecimal orderAmount) {
        BigDecimal usedTodayAmount = calculateUsedAmountToday(order.getUser().getId());
        BigDecimal totalWithNewOrder = usedTodayAmount.add(orderAmount);

        if (totalWithNewOrder.compareTo(rule.getLimitValue()) > 0) {
            return CheckResult.failure(
                    String.format("Limite giornaliero superato. Limite: %s, Utilizzato: %s, Ordine: %s",
                            rule.getLimitValue(), usedTodayAmount, orderAmount),
                    rule
            );
        }

        return CheckResult.success(rule);
    }

    private CheckResult checkTotalLimit(CheckLimitDto rule, OrderDto order, BigDecimal orderAmount) {

        BigDecimal usedTotalAmount = calculateUsedAmountTotal(order.getUser().getId());
        BigDecimal totalWithNewOrder = usedTotalAmount.add(orderAmount);

        if (totalWithNewOrder.compareTo(rule.getLimitValue()) > 0) {
            return CheckResult.failure(
                    String.format("Limite totale superato. Limite: %s, Utilizzato: %s, Ordine: %s",
                            rule.getLimitValue(), usedTotalAmount, orderAmount),
                    rule
            );
        }

        return CheckResult.success(rule);
    }

    /**
     * Verifica se il rating dello strumento soddisfa il requisito minimo
     */
    private boolean isRatingSufficient(String instrumentRating, String requiredRating) {
        if (instrumentRating == null) {
            return false;
        }


        String[] ratingScale = {"AAA", "AA", "A", "BBB", "BB", "B", "CCC", "CC", "C", "D"};

        int instrumentRatingIndex = getRatingIndex(instrumentRating, ratingScale);
        int requiredRatingIndex = getRatingIndex(requiredRating, ratingScale);

        // Rating migliore ha indice più basso
        return instrumentRatingIndex < requiredRatingIndex;
    }

    private int getRatingIndex(String rating, String[] ratingScale) {
        for (int i = 0; i < ratingScale.length; i++) {
            if (ratingScale[i].equals(rating)) {
                return i;
            }
        }
        return Integer.MAX_VALUE; // Rating non riconosciuto = peggiore possibile
    }

    // TODO: Implementa la logica per calcolare l'importo già utilizzato oggi
    private BigDecimal calculateUsedAmountToday(Long userId) {

        return BigDecimal.ZERO; // Placeholder
    }

    //TODO: Implementa la logica per calcolare l'importo totale utilizzato
    private BigDecimal calculateUsedAmountTotal(Long userId) {
         return BigDecimal.ZERO; // Placeholder
    }
}
