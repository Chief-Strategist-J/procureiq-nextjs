package com.procureiq.springboot_app.infra.broker;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
@ConditionalOnClass(name = "org.apache.kafka.clients.admin.NewTopic")
@ConditionalOnProperty(name = "spring.kafka.enabled", havingValue = "true", matchIfMissing = true)
public class KafkaBrokerConfig {

    @Bean
    public NewTopic tvmForecastsTopic() {
        return TopicBuilder.name("tvm.forecasts.v1")
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic procureiqEventsTopic() {
        return TopicBuilder.name("procureiq.events.v1")
                .partitions(1)
                .replicas(1)
                .build();
    }
}
