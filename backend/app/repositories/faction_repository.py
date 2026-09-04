from sqlalchemy.orm import Session

from app.models.faction import Faction


class FactionRepository:


    def __init__(self, db: Session):
        self.db = db


    def get_all(self):
        return self.db.query(Faction).all()


    def get_one(self, faction_id: int):
        return self.db.query(Faction).filter(
            Faction.id == faction_id
        ).first()


    def get_by_name(self, name: str):
        return self.db.query(Faction).filter(
            Faction.name == name
        ).first()


    def insert(self, faction: Faction):
        self.db.add(faction)
        self.db.commit()
        self.db.refresh(faction)

        return faction


    def delete(self, faction_id: int):
        faction = self.get_one(faction_id)

        if faction is None:
            return False

        self.db.delete(faction)
        self.db.commit()

        return True
    