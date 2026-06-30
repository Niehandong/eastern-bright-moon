from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Eastern Bright Moon API"
    DEBUG: bool = True
    API_V1_STR: str = "/api"
    
    # 允许跨域的前端来源，默认仅包含 localhost。可以通过 .env 文件中的 BACKEND_CORS_ORIGINS 进行覆盖
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:2323",
        "http://127.0.0.1:2323",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]
    
    # 数据库
    DATABASE_URL: str
    
    # Redis
    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_DB: int
    REDIS_PASSWORD: str = ""
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    model_config = SettingsConfigDict(env_file=(".env", "backend/.env"), env_file_encoding="utf-8", extra="ignore")

settings = Settings()
