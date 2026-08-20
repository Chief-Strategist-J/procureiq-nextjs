package com.procureiq.springboot_app.infra.config;

import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Predicate;

public final class ExceptionRuleEvaluator {

    public record ExceptionRuleResult(HttpStatus status, String userMessage) {}

    public record ExceptionRule(
            String name,
            Predicate<Throwable> condition,
            Function<Throwable, ExceptionRuleResult> resolver
    ) {}

    private static final List<ExceptionRule> RULES = List.of(
        new ExceptionRule(
            "ValidationFailed",
            e -> e instanceof org.springframework.web.bind.MethodArgumentNotValidException,
            e -> {
                var ex = (org.springframework.web.bind.MethodArgumentNotValidException) e;
                String msg = ex.getBindingResult().getFieldErrors().stream()
                        .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                        .collect(java.util.stream.Collectors.joining(", "));
                return new ExceptionRuleResult(HttpStatus.BAD_REQUEST, "Validation failed: " + msg);
            }
        ),
        new ExceptionRule(
            "UserAlreadyExists",
            e -> e instanceof com.procureiq.springboot_app.shared.exceptions.UserAlreadyExistsException,
            e -> new ExceptionRuleResult(
                HttpStatus.CONFLICT,
                e.getMessage() != null && !e.getMessage().isBlank() ? e.getMessage() : "User already exists with this email address or username"
            )
        ),
        new ExceptionRule(
            "DataIntegrityViolation",
            e -> e instanceof org.springframework.dao.DataIntegrityViolationException,
            e -> {
                String rawMsg = Optional.ofNullable(e.getMessage()).orElse("");
                boolean isEmail = rawMsg.contains("uq_users_email") || rawMsg.contains("users_email_key") || rawMsg.contains("email");
                HttpStatus status = isEmail ? HttpStatus.CONFLICT : HttpStatus.BAD_REQUEST;
                String msg = isEmail ? "An account with this email address already exists. Please sign in instead." : "Database constraint violation occurred";
                return new ExceptionRuleResult(status, msg);
            }
        ),
        new ExceptionRule(
            "BadCredentials",
            e -> e instanceof org.springframework.security.authentication.BadCredentialsException,
            e -> new ExceptionRuleResult(HttpStatus.UNAUTHORIZED, "Invalid username or password. Please check your credentials.")
        ),
        new ExceptionRule(
            "ResourceNotFound",
            e -> e instanceof com.procureiq.springboot_app.shared.exceptions.ResourceNotFoundException,
            e -> new ExceptionRuleResult(HttpStatus.NOT_FOUND, e.getMessage())
        ),
        new ExceptionRule(
            "Unauthorized",
            e -> e instanceof com.procureiq.springboot_app.shared.exceptions.UnauthorizedException,
            e -> new ExceptionRuleResult(HttpStatus.UNAUTHORIZED, e.getMessage())
        ),
        new ExceptionRule(
            "Forbidden",
            e -> e instanceof com.procureiq.springboot_app.shared.exceptions.ForbiddenException,
            e -> new ExceptionRuleResult(HttpStatus.FORBIDDEN, e.getMessage())
        ),
        new ExceptionRule(
            "IllegalArgumentOrState",
            e -> e instanceof IllegalArgumentException || e instanceof IllegalStateException,
            e -> {
                String msg = Optional.ofNullable(e.getMessage()).orElse("");
                HttpStatus status = msg.toLowerCase().contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
                return new ExceptionRuleResult(status, msg);
            }
        ),
        new ExceptionRule(
            "DatabaseConnectionFailure",
            e -> {
                String msg = Optional.ofNullable(e.getMessage()).orElse("");
                return msg.contains("JDBC Connection")
                        || msg.contains("database \"procureiq\" does not exist")
                        || e instanceof org.springframework.transaction.CannotCreateTransactionException;
            },
            e -> new ExceptionRuleResult(HttpStatus.SERVICE_UNAVAILABLE, "Database connection failed. Please verify that the database container is running and healthy.")
        )
    );

    private ExceptionRuleEvaluator() {}

    public static ExceptionRuleResult evaluate(Throwable throwable) {
        return RULES.stream()
                .filter(rule -> rule.condition().test(throwable))
                .findFirst()
                .map(rule -> rule.resolver().apply(throwable))
                .orElseGet(() -> new ExceptionRuleResult(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        Optional.ofNullable(throwable.getMessage()).filter(m -> !m.isBlank()).orElse("An unexpected server error occurred")
                ));
    }
}
