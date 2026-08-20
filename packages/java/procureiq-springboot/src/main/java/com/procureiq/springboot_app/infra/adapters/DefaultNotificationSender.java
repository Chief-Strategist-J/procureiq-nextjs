package com.procureiq.springboot_app.infra.adapters;

import com.procureiq.springboot_app.shared.ports.NotificationSender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class DefaultNotificationSender implements NotificationSender {

    private static final Logger log = LoggerFactory.getLogger(DefaultNotificationSender.class);

    @Override
    public void send(String channel, String provider, String endpoint, String subject, String body) throws Exception {
        log.info("[NOTIFICATION] Channel: {}, Provider: {}, Recipient: {}, Subject: {}", channel, provider, endpoint, subject);
    }
}
