from sqlalchemy import Boolean, Column, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.database import Base


class ArmyUnit(Base):
    __tablename__ = "army_units"

    id = Column(Integer, primary_key=True, index=True) 
    quantity = Column(Integer, nullable=False, default=1)
    is_warlord = Column(Boolean, nullable=False, default=False)  


    army_id = Column(
        Integer,
        ForeignKey("armies.id"),
        nullable=False
    )

    unit_id = Column(
        Integer,
        ForeignKey("units.id"),
        nullable=False
    )

    army = relationship(
        "Army",
        back_populates="army_units"
    )

    unit = relationship(
        "Unit",
        back_populates="army_units"
    )