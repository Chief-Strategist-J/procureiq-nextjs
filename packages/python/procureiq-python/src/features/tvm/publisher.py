from typing import Dict, Any

try:
    from core.config import settings
except ImportError:
    from src.core.config import settings

try:
    from infra.broker.kafka_broker import kafka_broker
except ImportError:
    from src.infra.broker.kafka_broker import kafka_broker

class TvmEventPublisher:
    def __init__(self, topic: str = None):
        self.topic = topic or settings.kafka_tvm_topic

    def publish_forecast_event(self, forecast_data: Dict[str, Any]) -> bool:
        return kafka_broker.publish(self.topic, forecast_data)

tvm_publisher = TvmEventPublisher()
