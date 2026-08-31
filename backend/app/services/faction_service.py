from sqlalchemy.orm import Session

from app.models.faction import Faction
from app.repositories.faction_repository import FactionRepository



class FactionService: 

    def __init__(self, db: Session):
        self.faction_repository = FactionRepository(db)


    def get_all(self):
        return self.faction_repository.get_all() 

    def get_one(self, faction_id: int):
        faction = self.faction_repository.get_one(faction_id)

        if faction is None:
            raise ValueError("Faction not found")

        return faction

    def create(self, name: str):
        existing_faction = self.faction_repository.get_by_name(name)

        if existing_faction is not None:        
            raise ValueError("Faction already exists") 

        faction = Faction( 
            name=name
        )

        return self.faction_repository.insert(faction)

    def delete(self, faction_id: int):
        faction = self.faction_repository.get_one(faction_id)

        if faction is None:
            raise ValueError("Faction not found")

        return self.faction_repository.delete(faction_id)

    