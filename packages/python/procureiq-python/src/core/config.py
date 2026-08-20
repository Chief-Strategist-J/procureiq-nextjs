import os

try:
    from pydantic_settings import BaseSettings

    class Settings(BaseSettings):
        app_name: str = "ProcureIQ Python Service"
        env_mode: str = os.getenv("PROCUREIQ_ENV", "local")
        database_url: str = os.getenv("DATABASE_URL", os.getenv("ALLOYDB_URL", "postgresql://postgres:postgres@localhost:5432/procureiq"))
        kafka_bootstrap_servers: str = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
        kafka_tvm_topic: str = os.getenv("KAFKA_TVM_TOPIC", "tvm.forecasts.v1")
        springboot_api_url: str = os.getenv("SPRINGBOOT_API_URL", "http://localhost:6565")
        timesfm_model_name: str = os.getenv("TIMESFM_MODEL_NAME", "google/timesfm-1.0-200m")
        default_stated_rate: float = float(os.getenv("DEFAULT_STATED_RATE", "0.08"))
        default_frequency: int = int(os.getenv("DEFAULT_FREQUENCY", "12"))

        class Config:
            env_file = ".env"
            extra = "allow"

    settings = Settings()

except Exception:
    class FallbackSettings:
        app_name = "ProcureIQ Python Service"
        env_mode = os.getenv("PROCUREIQ_ENV", "local")
        database_url = os.getenv("DATABASE_URL", os.getenv("ALLOYDB_URL", "postgresql://postgres:postgres@localhost:5432/procureiq"))
        kafka_bootstrap_servers = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
        kafka_tvm_topic = os.getenv("KAFKA_TVM_TOPIC", "tvm.forecasts.v1")
        springboot_api_url = os.getenv("SPRINGBOOT_API_URL", "http://localhost:6565")
        timesfm_model_name = os.getenv("TIMESFM_MODEL_NAME", "google/timesfm-1.0-200m")
        default_stated_rate = float(os.getenv("DEFAULT_STATED_RATE", "0.08"))
        default_frequency = int(os.getenv("DEFAULT_FREQUENCY", "12"))

    settings = FallbackSettings()
