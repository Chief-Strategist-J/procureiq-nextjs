package com.procureiq.springboot_app.features.tvm.messaging;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.procureiq.springboot_app.features.identity.service.AuditLogService;
import com.procureiq.springboot_app.infra.config.TracingHelper;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.header.Header;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Component
public class TvmKafkaConsumer {

    private static final Logger logger = LoggerFactory.getLogger(TvmKafkaConsumer.class);
    private final ConcurrentMap<String, String> latestForecastMap = new ConcurrentHashMap<>();
    private final AuditLogService auditLogService;
    private final ObjectMapper objectMapper;

    public TvmKafkaConsumer(AuditLogService auditLogService, ObjectMapper objectMapper) {
        this.auditLogService = auditLogService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "tvm.forecasts.v1", groupId = "procureiq-springboot-tvm-group", autoStartup = "${spring.kafka.enabled:false}")
    public void consumeForecastEvent(ConsumerRecord<String, String> record) {
        Header traceparentHeader = record.headers().lastHeader("traceparent");
        String traceparent = traceparentHeader != null ? new String(traceparentHeader.value(), StandardCharsets.UTF_8) : "";

        TracingHelper.executeWithTracing(() -> {
            logger.info("Consumed TimesFM AI forecast event [traceparent: {}] from Kafka topic tvm.forecasts.v1: {}", traceparent, record.value());
            latestForecastMap.put("latest", record.value());

            try {
                JsonNode root = objectMapper.readTree(record.value());
                JsonNode auditNode = root.get("auditContext");

                Long actorId = 1L;
                String clientIp = "127.0.0.1";
                String userAgent = "procureiq-python";

                if (auditNode != null) {
                    if (auditNode.has("actorId")) {
                        try {
                            actorId = Long.parseLong(auditNode.get("actorId").asText());
                        } catch (Exception ignored) {}
                    }
                    if (auditNode.has("clientIp")) clientIp = auditNode.get("clientIp").asText();
                    if (auditNode.has("userAgent")) userAgent = auditNode.get("userAgent").asText();
                }

                String eventId = root.has("eventId") ? root.get("eventId").asText() : "unknown";

                auditLogService.log(
                    1L,
                    "USER",
                    actorId,
                    "TIMESFM_FORECAST_EVALUATED",
                    "TVM_STUDIO",
                    1L,
                    "HIGH",
                    null,
                    "{\"eventId\":\"" + eventId + "\"}",
                    traceparent,
                    null,
                    clientIp,
                    userAgent
                );
            } catch (Exception e) {
                logger.error("Failed to parse and record audit log for TVM forecast event: {}", e.getMessage());
            }

            return null;
        });
    }

    public String getLatestForecast() {
        return latestForecastMap.getOrDefault("latest", "{}");
    }
}
