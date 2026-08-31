from sqlalchemy.orm import Session

from app.models.army import Army
from app.repositories.army_repository import ArmyRepository
from app.repositories.army_unit_repository import ArmyUnitRepository
from app.repositories.detachment_repository import DetachmentRepository
from app.repositories.faction_repository import FactionRepository
from app.repositories.user_repository import UserRepository


# HANDLES ARMY LOGIC // ARMY VALID
class ArmyService:

    def __init__(self, db: Session):
        self.army_repository = ArmyRepository(db)
        self.army_unit_repository = ArmyUnitRepository(db)
        self.faction_repository = FactionRepository(db)
        self.detachment_repository = DetachmentRepository(db)
        self.user_repository = UserRepository(db)

    def get_all(self):
        return self.army_repository.get_all()

    def get_one(self, army_id: int):
        army = self.army_repository.get_one(army_id)

        if army is None:
            raise ValueError("Army not found")

        return army

    def get_by_user(self, user_id: int):
        user = self.user_repository.get_one(user_id)

        if user is None:
            raise ValueError("User not found")

        return self.army_repository.get_by_user(user_id)

    def create(
        self,
        name: str,
        points_limit: int,
        user_id: int,
        faction_id: int,
        detachment_id: int
    ):
        if name.strip() == "":                         # name validation
            raise ValueError("Army name cannot be empty")

        if points_limit <= 0:
            raise ValueError("Points limit must be greater than zero")

        user = self.user_repository.get_one(user_id)

        if user is None:
            raise ValueError("User not found")

        existing_army = self.army_repository.get_by_name_and_user(
            name.strip(),
            user_id
        )

        if existing_army is not None:                  # duplicate name validation
            raise ValueError("Army name already exists")

        faction = self.faction_repository.get_one(faction_id)

        if faction is None:
            raise ValueError("Faction not found")

        detachment = self.detachment_repository.get_one(detachment_id)

        if detachment is None:
            raise ValueError("Detachment not found")

        if detachment.faction_id != faction_id:
            raise ValueError(
                "Detachment does not belong to selected faction"
            )

        army = Army(
            name=name.strip(),
            points_limit=points_limit,
            user_id=user_id,
            faction_id=faction_id,
            detachment_id=detachment_id
        )

        return self.army_repository.insert(army)

    def update_name(self, army_id: int, name: str):
        army = self.army_repository.get_one(army_id)

        if army is None:
            raise ValueError("Army not found")

        if name.strip() == "":                         # name validation
            raise ValueError("Army name cannot be empty")

        existing_army = self.army_repository.get_by_name_and_user(
            name.strip(),
            army.user_id
        )

        if (
            existing_army is not None
            and existing_army.id != army_id
        ):                                             # duplicate name validation
            raise ValueError("Army name already exists")

        army.name = name.strip()

        return self.army_repository.update(army)

    def get_total_points(self, army_id: int):
        army = self.army_repository.get_one(army_id)

        if army is None:
            raise ValueError("Army not found")

        army_units = self.army_unit_repository.get_by_army(army_id)

        total_points = 0

        for army_unit in army_units:
            total_points += (
                army_unit.unit.points * army_unit.quantity
            )                                          # models

        return total_points

    def validate_army(self, army_id: int):
        army = self.army_repository.get_one(army_id)

        if army is None:
            raise ValueError("Army not found")

        army_units = self.army_unit_repository.get_by_army(army_id)

        errors = []
        total_points = 0
        warlord_count = 0


        for army_unit in army_units:

            unit = army_unit.unit

            total_points += unit.points * army_unit.quantity

            if unit.faction_id != army.faction_id:   # not needed, done anyway // react bypass
                errors.append(
                    f"{unit.name} does not belong to the army faction"
                )

            if (
                unit.type == "Character"
                and army_unit.quantity > 3
            ):                            # intentional, for invalid army
                errors.append(
                    f"{unit.name} exceeds the Character limit of 3"
                )

            if army_unit.is_warlord:
                warlord_count += 1

                if unit.type != "Character":   # not needed, done anyway, again.
                    errors.append(
                        "Warlord must be a Character"
                    )

        if total_points > army.points_limit:
            points_over = total_points - army.points_limit

            errors.append(
                f"Army exceeds points limit by {points_over} points"
            )

        if warlord_count == 0:
            errors.append("Army must have a Warlord")

        if warlord_count > 1:                           # not needed, done anyway, again and again.
            errors.append(
                "Army can only have one Warlord"
            )

        return {
            "valid": len(errors) == 0,
            "total_points": total_points,
            "errors": errors
        }

    def delete(self, army_id: int):
        army = self.army_repository.get_one(army_id)

        if army is None:
            raise ValueError("Army not found")

        return self.army_repository.delete(army_id)
    