from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Faction(Base):
    __tablename__ = "factions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    detachments = relationship(
        "Detachment",
        back_populates="faction"
    )

    units = relationship(
        "Unit",
        back_populates="faction"
    )

    armies = relationship(
        "Army",
        back_populates="faction"
    )
    