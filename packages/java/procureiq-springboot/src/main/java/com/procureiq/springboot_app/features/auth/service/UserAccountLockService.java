package com.procureiq.springboot_app.features.auth.service;

import com.procureiq.springboot_app.features.auth.constants.AuthConstants;
import com.procureiq.springboot_app.features.auth.entity.User;
import com.procureiq.springboot_app.features.auth.repository.UserRepository;
import com.procureiq.springboot_app.shared.exceptions.UnauthorizedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserAccountLockService {

    private static final int MAX_FAILED_ATTEMPTS = 3;
    private static final long LOCK_TIME_DURATION_MINUTES = 15;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserAccountLockService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void checkAndHandleAccountLockState(User user) {
        Optional.of(user)
            .filter(u -> !u.isAccountNonLocked())
            .ifPresent(u -> {
                boolean isLockExpired = Optional.ofNullable(u.getLockTime())
                    .map(lockTime -> lockTime.plusMinutes(LOCK_TIME_DURATION_MINUTES).isBefore(LocalDateTime.now()))
                    .orElse(false);

                if (isLockExpired) {
                    u.setAccountNonLocked(true);
                    u.setFailedAttemptCount(0);
                    u.setLockTime(null);
                } else {
                    throw new com.procureiq.springboot_app.shared.exceptions.AccountLockedException(AuthConstants.MSG_ACCOUNT_LOCKED);
                }
            });
    }

    public void verifyPasswordAndHandleFailure(User user, String password) {
        Optional.of(password)
            .filter(pwd -> passwordEncoder.matches(pwd, user.getPassword()))
            .orElseGet(() -> {
                int attempts = user.getFailedAttemptCount() + 1;
                user.setFailedAttemptCount(attempts);
                Optional.of(attempts)
                    .filter(a -> a >= MAX_FAILED_ATTEMPTS)
                    .ifPresent(a -> {
                        user.setAccountNonLocked(false);
                        user.setLockTime(LocalDateTime.now());
                    });
                userRepository.save(user);
                throw new UnauthorizedException(AuthConstants.MSG_INVALID_CREDENTIALS);
            });
    }
}
