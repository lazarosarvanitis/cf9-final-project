from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Army(Base):

    __tablename__ = "armies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    points_limit = Column(Integer, nullable=False)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    faction_id = Column(
        Integer,
        ForeignKey("factions.id"),
        nullable=False
    )

    detachment_id = Column(
        Integer,
        ForeignKey("detachments.id"),
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="armies"
    )

    faction = relationship(
        "Faction",
        back_populates="armies"
    )

    detachment = relationship(
        "Detachment",
        back_populates="armies"
    )

    army_units = relationship(
     "ArmyUnit",
     back_populates="army",
     cascade="all, delete-orphan" # if army deleted, delete all army units
)
    