package com.procureiq.springboot_app.features.auth.mapper;

import com.procureiq.springboot_app.features.auth.dto.response.UserResponse;
import com.procureiq.springboot_app.features.auth.entity.User;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserMapper {

    public UserResponse toUserResponse(User user) {
        return Optional.ofNullable(user)
            .map(u -> new UserResponse(u.getId(), u.getUsername(), u.getEmail(), u.getRole(), u.getTenantId()))
            .orElseGet(UserResponse::new);
    }
}
