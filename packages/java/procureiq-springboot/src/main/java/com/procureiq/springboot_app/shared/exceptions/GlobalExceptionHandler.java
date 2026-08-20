package com.procureiq.springboot_app.shared.exceptions;

import com.procureiq.springboot_app.shared.types.single.ApiSingleResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            fieldErrors.put(fieldName, errorMessage);
        });

        Map<String, Object> errorPayload = buildErrorPayload(
            HttpStatus.BAD_REQUEST,
            "Validation failed",
            request.getRequestURI(),
            fieldErrors
        );

        return new ResponseEntity<>(ApiSingleResponse.success(400, errorPayload), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<?> handleUnauthorized(UnauthorizedException ex, HttpServletRequest request) {
        Map<String, Object> errorPayload = buildErrorPayload(
            HttpStatus.UNAUTHORIZED,
            ex.getMessage(),
            request.getRequestURI(),
            null
        );
        return new ResponseEntity<>(ApiSingleResponse.error(401, ex.getMessage()), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccountLockedException.class)
    public ResponseEntity<?> handleAccountLocked(AccountLockedException ex, HttpServletRequest request) {
        Map<String, Object> errorPayload = buildErrorPayload(
            HttpStatus.LOCKED,
            ex.getMessage(),
            request.getRequestURI(),
            null
        );
        return new ResponseEntity<>(ApiSingleResponse.error(423, ex.getMessage()), HttpStatus.LOCKED);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<?> handleUserAlreadyExists(UserAlreadyExistsException ex, HttpServletRequest request) {
        return new ResponseEntity<>(ApiSingleResponse.error(409, ex.getMessage()), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest request) {
        return new ResponseEntity<>(ApiSingleResponse.error(400, ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDataIntegrityViolation(org.springframework.dao.DataIntegrityViolationException ex, HttpServletRequest request) {
        String msg = ex.getMessage() != null ? ex.getMessage() : "";
        boolean isEmail = msg.contains("uq_users_email") || msg.contains("users_email_key") || msg.contains("uk_users_email_tenant") || msg.contains("email");
        HttpStatus status = isEmail ? HttpStatus.CONFLICT : HttpStatus.BAD_REQUEST;
        String responseMsg = isEmail
            ? "An account with this email address already exists for this tenant. Please sign in instead."
            : "Database constraint violation occurred";
        return new ResponseEntity<>(ApiSingleResponse.error(status.value(), responseMsg), status);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        return new ResponseEntity<>(ApiSingleResponse.error(404, ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception ex, HttpServletRequest request) {
        String msg = ex.getMessage() != null ? ex.getMessage() : "An unexpected server error occurred";
        return new ResponseEntity<>(ApiSingleResponse.error(500, msg), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private Map<String, Object> buildErrorPayload(HttpStatus status, String message, String path, Map<String, String> errors) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("timestamp", Instant.now().toString());
        payload.put("status", status.value());
        payload.put("error", status.getReasonPhrase());
        payload.put("message", message);
        payload.put("path", path);
        if (errors != null && !errors.isEmpty()) {
            payload.put("errors", errors);
        }
        return payload;
    }
}
