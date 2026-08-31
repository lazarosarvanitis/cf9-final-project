from sqlalchemy.orm import Session

from app.models.army import Army


class ArmyRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(Army).all()

    def get_one(self, army_id: int):
        return self.db.query(Army).filter(
            Army.id == army_id
        ).first()

    def get_by_user(self, user_id: int):
        return self.db.query(Army).filter(
            Army.user_id == user_id
        ).all()

    def get_by_name_and_user(self, name: str, user_id: int):  #DUPLICATE NAME PER USER VALIDATION!!!!!
        return self.db.query(Army).filter(
            Army.name == name,
            Army.user_id == user_id
        ).first()

    def insert(self, army: Army):
        self.db.add(army)
        self.db.commit()
        self.db.refresh(army)

        return army

    def update(self, army: Army):
        self.db.commit()
        self.db.refresh(army)

        return army

    def delete(self, army_id: int):
        army = self.get_one(army_id)

        if army is None:
            return False

        self.db.delete(army)
        self.db.commit()

        return True