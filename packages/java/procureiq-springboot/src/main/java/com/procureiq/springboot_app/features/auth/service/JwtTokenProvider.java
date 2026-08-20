package com.procureiq.springboot_app.features.auth.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.procureiq.springboot_app.features.auth.entity.User;
import com.procureiq.springboot_app.infra.config.AppProperties;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtTokenProvider {

    private final Algorithm jwtAlgorithm;
    private final long jwtExpirationMs;
    private final String jwtIssuer;

    public JwtTokenProvider(AppProperties appProperties) {
        this.jwtAlgorithm = Algorithm.HMAC256(appProperties.getJwtSecret());
        this.jwtExpirationMs = appProperties.getJwtExpirationMs();
        this.jwtIssuer = appProperties.getJwtIssuer();
    }

    public String generateAccessToken(User user) {
        return JWT.create()
            .withIssuer(jwtIssuer)
            .withSubject(user.getUsername())
            .withClaim("email", user.getEmail())
            .withClaim("role", user.getRole())
            .withExpiresAt(new Date(System.currentTimeMillis() + jwtExpirationMs))
            .sign(jwtAlgorithm);
    }
}
