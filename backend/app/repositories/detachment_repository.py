from sqlalchemy.orm import Session

from app.models.detachment import Detachment


class DetachmentRepository:

    def __init__(self, db: Session):
        self.db = db


    def get_all(self):
        return self.db.query(Detachment).all()


    def get_one(self, detachment_id: int):
        return self.db.query(Detachment).filter(
            Detachment.id == detachment_id
        ).first()


    def get_by_faction(self, faction_id: int):
        return self.db.query(Detachment).filter(
            Detachment.faction_id == faction_id
        ).all()


    def get_by_name_and_faction(
        self,
        name: str,
        faction_id: int
    ):
        return self.db.query(Detachment).filter(
            Detachment.name == name,
            Detachment.faction_id == faction_id
        ).first()

    def insert(self, detachment: Detachment):
        self.db.add(detachment)
        self.db.commit()
        self.db.refresh(detachment)

        return detachment



    def delete(self, detachment_id: int):
        detachment = self.get_one(detachment_id)

        if detachment is None:
            return False

        self.db.delete(detachment)
        self.db.commit()

        return True
    