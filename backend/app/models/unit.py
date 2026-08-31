from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    points = Column(Integer, nullable=False)

    faction_id = Column(
        Integer,
        ForeignKey("factions.id"),
        nullable=False
    )

    faction = relationship(
        "Faction",
        back_populates="units"
    )

    army_units = relationship(
        "ArmyUnit",
        back_populates="unit"
    )
    