from sqlalchemy.orm import Session

from app.models.army_unit import ArmyUnit


class ArmyUnitRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(ArmyUnit).all()

    def get_one(self, army_unit_id: int):
        return self.db.query(ArmyUnit).filter(
            ArmyUnit.id == army_unit_id
        ).first()

    def get_by_army(self, army_id: int):
        return self.db.query(ArmyUnit).filter(
            ArmyUnit.army_id == army_id
        ).all()

    def get_army_unit(self, army_id: int, unit_id: int):           # all units in list
        return self.db.query(ArmyUnit).filter(
            ArmyUnit.army_id == army_id,
            ArmyUnit.unit_id == unit_id
        ).first()

    def insert(self, army_unit: ArmyUnit):
        self.db.add(army_unit)
        self.db.commit()
        self.db.refresh(army_unit)

        return army_unit

    def update(self, army_unit: ArmyUnit):
        self.db.commit()
        self.db.refresh(army_unit)

        return army_unit

    def delete(self, army_unit_id: int):
        army_unit = self.get_one(army_unit_id)

        if army_unit is None:
            return False

        self.db.delete(army_unit)
        self.db.commit()

        return True
    