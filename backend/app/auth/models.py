from sqlalchemy import Boolean, Column, Integer, String
from app.models.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True) # Nullable for Google-only users
    google_id = Column(String(255), unique=True, nullable=True) # For Google OAuth users
    is_active = Column(Boolean(), default=True)