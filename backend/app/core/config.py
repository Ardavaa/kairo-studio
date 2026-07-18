from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Kairo Studio API"
    DATABASE_URL: str = "postgresql+asyncpg://kairo_user:kairo_password@localhost:5432/kairo_studio"
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
