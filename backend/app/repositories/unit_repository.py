from sqlalchemy.orm import Session

from app.models.unit import Unit


class UnitRepository:

    def __init__(self, db: Session):
        self.db = db


    def get_all(self):
        return self.db.query(Unit).all()


    def get_one(self, unit_id: int):
        return self.db.query(Unit).filter(
            Unit.id == unit_id
        ).first()


    def get_by_faction(self, faction_id: int):
        return self.db.query(Unit).filter(
            Unit.faction_id == faction_id
        ).all()


    def get_by_name(self, name: str):
        return self.db.query(Unit).filter(
            Unit.name == name
        ).first()


    def get_by_name_and_faction(
        self,
        name: str,
        faction_id: int
    ):
        return self.db.query(Unit).filter(
            Unit.name == name,
            Unit.faction_id == faction_id
        ).first()


    def insert(self, unit: Unit):

        self.db.add(unit)
        self.db.commit()
        self.db.refresh(unit)

        return unit


    def update(self, unit: Unit):

        self.db.commit()
        self.db.refresh(unit)

        return unit


    def delete(self, unit_id: int):

        unit = self.get_one(unit_id)

        if unit is None:
            return False

        self.db.delete(unit)
        self.db.commit()

        return True

    