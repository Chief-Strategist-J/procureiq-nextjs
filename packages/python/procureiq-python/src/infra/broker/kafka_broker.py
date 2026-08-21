import json
import logging
from typing import Dict, Any
from opentelemetry import trace
from opentelemetry.trace import Status, StatusCode
from opentelemetry.trace.propagation.tracecontext import TraceContextTextMapPropagator

try:
    from core.config import settings
except ImportError:
    from src.core.config import settings

logger = logging.getLogger(__name__)
tracer = trace.get_tracer("procureiq.kafka.broker")
propagator = TraceContextTextMapPropagator()

class KafkaBroker:
    def __init__(self, bootstrap_servers: str = None):
        self.bootstrap_servers = bootstrap_servers or settings.kafka_bootstrap_servers
        self.producer = None
        self._init_producer()

    def _init_producer(self):
        try:
            from kafka import KafkaProducer
            self.producer = KafkaProducer(
                bootstrap_servers=self.bootstrap_servers,
                value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                request_timeout_ms=5000,
                retries=3
            )
        except Exception as e:
            logger.warning(f"Kafka producer init fallback: {e}")

    def publish(self, topic: str, payload: Dict[str, Any]) -> bool:
        with tracer.start_as_current_span(f"kafka.produce.{topic}") as span:
            carrier: Dict[str, str] = {}
            propagator.inject(carrier)
            
            # kafka-python requires: List[Tuple[str, bytes]]
            # Key = plain str, Value = bytes — do NOT encode the key
            headers = [
                (k, v.encode("utf-8"))
                for k, v in carrier.items()
            ]

            span.set_attribute("messaging.system", "kafka")
            span.set_attribute("messaging.destination", topic)
            span.set_attribute("messaging.destination_kind", "topic")

            if self.producer and payload:
                try:
                    future = self.producer.send(topic, value=payload, headers=headers)
                    future.get(timeout=5.0)
                    span.set_status(Status(StatusCode.OK))
                    return True
                except Exception as e:
                    logger.error(f"Failed to publish to topic {topic}: {e}")
                    span.record_exception(e)
                    span.set_status(Status(StatusCode.ERROR, str(e)))
                    return False
            
            span.set_status(Status(StatusCode.OK))
            return True

kafka_broker = KafkaBroker()
