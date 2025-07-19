from sqlalchemy import Column, Integer, String
from .base import Base

class Example(Base):
    __tablename__ = "examples"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), index=True)
    description = Column(String(255), nullable=True)