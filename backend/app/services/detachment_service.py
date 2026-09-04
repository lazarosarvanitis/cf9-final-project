from sqlalchemy.orm import Session

from app.models.detachment import Detachment
from app.repositories.detachment_repository import DetachmentRepository
from app.repositories.faction_repository import FactionRepository


class DetachmentService:

    def __init__(self, db: Session):
        self.detachment_repository = DetachmentRepository(db)
        self.faction_repository = FactionRepository(db)


    def get_all(self):
        return self.detachment_repository.get_all()


    def get_one(self, detachment_id: int):
        detachment = self.detachment_repository.get_one(detachment_id)

        if detachment is None:
            raise ValueError("Detachment not found")

        return detachment


    def get_by_faction(self, faction_id: int):
        faction = self.faction_repository.get_one(faction_id)

        if faction is None:
            raise ValueError("Faction not found")

        return self.detachment_repository.get_by_faction(faction_id)


    def create(self, name: str, faction_id: int):
        if name.strip() == "":
            raise ValueError("Detachment name cannot be empty")

        faction = self.faction_repository.get_one(faction_id)

        if faction is None:
            raise ValueError("Faction not found")

        existing_detachment = (
            self.detachment_repository.get_by_name_and_faction(
                name.strip(),
                faction_id
            )
        )

        if existing_detachment is not None:
            raise ValueError("Detachment already exists")

        detachment = Detachment(
            name=name.strip(),
            faction_id=faction_id
        )

        return self.detachment_repository.insert(detachment)


    def delete(self, detachment_id: int):
        detachment = self.detachment_repository.get_one(detachment_id)

        if detachment is None:
            raise ValueError("Detachment not found")


        # DETACHMENT CANNOT BE DELETED WHILE AN ARMY USES IT

        if detachment.armies:
            raise ValueError(
                "Detachment cannot be deleted because it is used by armies"
            )


        return self.detachment_repository.delete(detachment_id)

    