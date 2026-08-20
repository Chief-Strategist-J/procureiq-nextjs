package com.procureiq.springboot_app.features.auth.repository;

import com.procureiq.springboot_app.features.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsernameOrEmail(String username, String email);

    Optional<User> findByEmailAndTenantId(String email, String tenantId);
    Optional<User> findByUsernameAndTenantId(String username, String tenantId);

    @Query("SELECT u FROM User u WHERE (u.username = :identifier OR u.email = :identifier) AND u.tenantId = :tenantId")
    Optional<User> findByIdentifierAndTenantId(@Param("identifier") String identifier, @Param("tenantId") String tenantId);

    Optional<User> findByResetToken(String resetToken);
    Optional<User> findByRefreshToken(String refreshToken);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByEmailAndTenantId(String email, String tenantId);
}
