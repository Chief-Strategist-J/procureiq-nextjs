package com.procureiq.springboot_app.shared.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.Optional;

public final class JsonUtils {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final String DEFAULT_JSON = "{}";

    private JsonUtils() {}

    public static String toJson(Object data) {
        return Optional.ofNullable(data)
            .map(d -> {
                try {
                    return OBJECT_MAPPER.writeValueAsString(d);
                } catch (Exception e) {
                    return DEFAULT_JSON;
                }
            })
            .orElse(DEFAULT_JSON);
    }

    public static String serializeMetadata(Map<String, Object> metadata) {
        return Optional.ofNullable(metadata)
            .filter(m -> !m.isEmpty())
            .map(JsonUtils::toJson)
            .orElse(DEFAULT_JSON);
    }
}
