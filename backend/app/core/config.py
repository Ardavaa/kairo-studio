from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Kairo Studio API"
    DATABASE_URL: str = "postgresql+asyncpg://kairo_user:kairo_password@localhost:5432/kairo_studio"
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    
    # LLM Settings
    DATABYTE_API_KEY: str
    DATABYTE_BASE_URL: str = "https://ai.databyte.co.id/v1"
    DATABYTE_MODEL: str = "databyte-m1"
    
    # Optional Third-Party Search API Keys
    CORE_API_KEY: str | None = None
    ELSEVIER_API_KEY: str | None = None
    S2_API_KEY: str | None = None
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

settings = Settings()
