from sqlalchemy.orm import Session

from app.models.army_unit import ArmyUnit
from app.repositories.army_repository import ArmyRepository
from app.repositories.army_unit_repository import ArmyUnitRepository
from app.repositories.unit_repository import UnitRepository

#CHECKS / HANDLES UNIT LOGIC
class ArmyUnitService:

    def __init__(self, db: Session):
        self.army_repository = ArmyRepository(db)
        self.army_unit_repository = ArmyUnitRepository(db)
        self.unit_repository = UnitRepository(db)

    def get_by_army(self, army_id: int):
        army = self.army_repository.get_one(army_id)

        if army is None:
            raise ValueError("Army not found")

        return self.army_unit_repository.get_by_army(army_id)

    def add_unit(self, army_id: int, unit_id: int):
        army = self.army_repository.get_one(army_id)

        if army is None:
            raise ValueError("Army not found")

        unit = self.unit_repository.get_one(unit_id)

        if unit is None:
            raise ValueError("Unit not found")

        if unit.faction_id != army.faction_id:          # react bypass protection
            raise ValueError(
                "Unit does not belong to the army faction"
            )

        existing_army_unit = self.army_unit_repository.get_army_unit(
            army_id,
            unit_id
        )

        if existing_army_unit is not None:
            existing_army_unit.quantity += 1

            return self.army_unit_repository.update(
                existing_army_unit
            )

        army_unit = ArmyUnit(
            army_id=army_id,
            unit_id=unit_id,
            quantity=1,
            is_warlord=False
        )

        return self.army_unit_repository.insert(army_unit)

    def remove_one(self, army_id: int, unit_id: int):
        army = self.army_repository.get_one(army_id)

        if army is None:
            raise ValueError("Army not found")

        army_unit = self.army_unit_repository.get_army_unit(
            army_id,
            unit_id
        )

        if army_unit is None:
            raise ValueError("Unit is not in this army")

        # If the only remaining copy is the Warlord,
        # it cannot be removed as a regular copy.
        if army_unit.quantity == 1 and army_unit.is_warlord:
            raise ValueError(
                "Cannot remove the Warlord as a regular unit"
            )

        if army_unit.quantity > 1:
            army_unit.quantity -= 1

            return self.army_unit_repository.update(
                army_unit
            )

        return self.army_unit_repository.delete(
            army_unit.id
        )

    def delete_regular_copies(self, army_id: int, unit_id: int):
        army = self.army_repository.get_one(army_id)

        if army is None:
            raise ValueError("Army not found")

        army_unit = self.army_unit_repository.get_army_unit(
            army_id,
            unit_id
        )

        if army_unit is None:
            raise ValueError("Unit is not in this army")

        if army_unit.is_warlord:
            army_unit.quantity = 1                     # leave the Warlord copy

            return self.army_unit_repository.update(
                army_unit
            )

        return self.army_unit_repository.delete(
            army_unit.id
        )

    def set_warlord(self, army_id: int, unit_id: int):
        army = self.army_repository.get_one(army_id)

        if army is None:
            raise ValueError("Army not found")

        army_unit = self.army_unit_repository.get_army_unit(
            army_id,
            unit_id
        )

        if army_unit is None:
            raise ValueError("Unit is not in this army")

        unit = self.unit_repository.get_one(unit_id)

        if unit is None:
            raise ValueError("Unit not found")

        if unit.type != "Character":                    # react bypass 
            raise ValueError(
                "Only a Character can be the Warlord"
            )

        army_units = self.army_unit_repository.get_by_army(
            army_id
        )

        for current_army_unit in army_units:

            if current_army_unit.is_warlord:
                current_army_unit.is_warlord = False

                self.army_unit_repository.update(
                    current_army_unit
                )

        army_unit.is_warlord = True

        return self.army_unit_repository.update(
            army_unit
        )


    def remove_warlord(self, army_id: int):
        army = self.army_repository.get_one(army_id)

        if army is None:
            raise ValueError("Army not found")

        army_units = self.army_unit_repository.get_by_army(
            army_id
        )

        for army_unit in army_units:

            if army_unit.is_warlord:
                army_unit.is_warlord = False

                return self.army_unit_repository.update(
                    army_unit
                )

        return None

    def delete_warlord(self, army_id: int):
        army = self.army_repository.get_one(army_id)

        if army is None:
            raise ValueError("Army not found")

        army_units = self.army_unit_repository.get_by_army(
            army_id
        )


        for army_unit in army_units:

            if army_unit.is_warlord:

                if army_unit.quantity == 1:
                    return self.army_unit_repository.delete(
                        army_unit.id
                    )

                army_unit.quantity -= 1
                army_unit.is_warlord = False

                return self.army_unit_repository.update(
                    army_unit
                )

        raise ValueError("Army does not have a Warlord")
    