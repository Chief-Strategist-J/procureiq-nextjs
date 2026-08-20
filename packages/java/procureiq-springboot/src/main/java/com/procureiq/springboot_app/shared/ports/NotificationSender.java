package com.procureiq.springboot_app.shared.ports;

public interface NotificationSender {
    void send(String channel, String provider, String endpoint, String subject, String body) throws Exception;
}
