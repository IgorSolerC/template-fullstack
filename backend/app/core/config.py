from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    MYSQL_DATABASE: str
    MYSQL_ROOT_PASSWORD: str

    class Config:
        env_file = "../.env"

settings = Settings()