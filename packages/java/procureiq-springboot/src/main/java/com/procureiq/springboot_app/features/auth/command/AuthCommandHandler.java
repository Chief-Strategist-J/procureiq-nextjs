package com.procureiq.springboot_app.features.auth.command;

public interface AuthCommandHandler<C, R> {
    AuthAction getAction();
    R execute(C commandPayload);
}
