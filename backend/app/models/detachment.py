from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Detachment(Base):
    __tablename__ = "detachments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)


    faction_id = Column(
        Integer,
        ForeignKey("factions.id"),
        nullable=False
    )

    faction = relationship(
        "Faction",
        back_populates="detachments"
    )

    armies = relationship(
        "Army",
        back_populates="detachment"
    )