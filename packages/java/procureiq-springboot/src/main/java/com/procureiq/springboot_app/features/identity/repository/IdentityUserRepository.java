package com.procureiq.springboot_app.features.identity.repository;

import com.procureiq.springboot_app.features.identity.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository("identityUserRepository")
public interface IdentityUserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
