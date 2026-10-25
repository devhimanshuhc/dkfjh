import logging

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """App-wide configs"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    DEBUG: bool = Field(default=False)
    LOG_LEVEL: str = Field(default="INFO")
    CORS_ORIGINS: list[str] = Field(default=["http://localhost:3000"])
    ELEXON_BASE_URL: str = Field(default="https://data.elexon.co.uk/bmrs/api/v1")

    def get_logger(self):
        logger = logging.getLogger(__name__)
        logger.setLevel(self.LOG_LEVEL)
        return logger


config = Settings()
logger = config.get_logger()
