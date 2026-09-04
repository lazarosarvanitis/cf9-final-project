from app.database import Base, SessionLocal, engine

from app.models.army import Army
from app.models.army_unit import ArmyUnit
from app.models.detachment import Detachment
from app.models.faction import Faction
from app.models.unit import Unit
from app.models.user import User


# DATA FOR FACTIONS, DETACHMENTS AND UNITS
# DATA FOR FACTIONS
def seed_factions(db):

    faction_names = [
        "Grey Knights",
        "Adeptus Custodes",
        "Eldar"
    ]

    factions = {}

    for faction_name in faction_names:

        faction = db.query(Faction).filter(
            Faction.name == faction_name
        ).first()

        if faction is None:

            faction = Faction(
                name=faction_name
            )

            db.add(faction)
            db.commit()
            db.refresh(faction)

            print(
                f"Created faction: {faction.name}"
            )

        else:

            print(
                f"Faction already exists: {faction.name}"
            )

        factions[faction_name] = faction

    return factions

# DATA FOR DETACHMENTS
def seed_detachments(db, factions):

    detachment_data = [
        {
            "name": "Banishers",
            "faction": "Grey Knights"
        },
        {
            "name": "Lions of the Emperor",
            "faction": "Adeptus Custodes"
        },
        {
            "name": "Aspect Host",
            "faction": "Eldar"
        }
    ]

 
    for data in detachment_data:

        faction = factions[
            data["faction"]
        ]

        detachment = db.query(
            Detachment
        ).filter(
            Detachment.name == data["name"],
            Detachment.faction_id == faction.id
        ).first()

        if detachment is None:

            detachment = Detachment(
                name=data["name"],
                faction_id=faction.id
            )

            db.add(detachment)
            db.commit()

            print(
                f"Created detachment: {data['name']}"
            )

        else:

            print(
                f"Detachment already exists: {data['name']}"
            )

# DATA FOR UNITS
def seed_units(db, factions):

    unit_data = [

        # GREY KNIGHTS

        {
            "name": "Brotherhood Librarian",
            "type": "Character",
            "points": 120,
            "faction": "Grey Knights"
        },
        {
            "name": "Strike Squad",
            "type": "Battleline",
            "points": 120,
            "faction": "Grey Knights"
        },
        {
            "name": "Terminator Squad",
            "type": "Infantry",
            "points": 200,
            "faction": "Grey Knights"
        },
        {
            "name": "Paladin Squad",
            "type": "Infantry",
            "points": 225,
            "faction": "Grey Knights"
        },
        {
            "name": "Nemesis Dreadknight",
            "type": "Vehicle",
            "points": 210,
            "faction": "Grey Knights"
        },

        # ADEPTUS CUSTODES

        {
            "name": "Blade Champion",
            "type": "Character",
            "points": 120,
            "faction": "Adeptus Custodes"
        },
        {
            "name": "Custodian Guard",
            "type": "Battleline",
            "points": 180,
            "faction": "Adeptus Custodes"
        },
        {
            "name": "Custodian Wardens",
            "type": "Infantry",
            "points": 250,
            "faction": "Adeptus Custodes"
        },
        {
            "name": "Allarus Custodians",
            "type": "Infantry",
            "points": 160,
            "faction": "Adeptus Custodes"
        },
        {
            "name": "Vertus Praetors",
            "type": "Mounted",
            "points": 180,
            "faction": "Adeptus Custodes"
        },

        # Eldar

        {
            "name": "Autarch",
            "type": "Character",
            "points": 100,
            "faction": "Eldar"
        },
        {
            "name": "Avatar of Khaine",
            "type": "Monster",
            "points": 335,
            "faction": "Eldar"
        },
        {
            "name": "Dire Avengers",
            "type": "Aspect Warriors",
            "points": 140,
            "faction": "Eldar"
        },
        {
            "name": "Howling Banshees",
            "type": "Aspect Warriors",
            "points": 120,
            "faction": "Eldar"
        },
        {
            "name": "Fire Dragons",
            "type": "Aspect Warriors",
            "points": 130,
            "faction": "Eldar"
        },
        {
            "name": "Striking Scorpions",
            "type": "Aspect Warriors",
            "points": 120,
            "faction": "Eldar"
        },
        {
            "name": "Dark Reapers",
            "type": "Aspect Warriors",
            "points": 130,
            "faction": "Eldar"
        },
        {
            "name": "Swooping Hawks",
            "type": "Aspect Warriors",
            "points": 140,
            "faction": "Eldar"
        },
        {
            "name": "Warp Spiders",
            "type": "Aspect Warriors",
            "points": 140,
            "faction": "Eldar"
        },
        {
            "name": "Shining Spears",
            "type": "Aspect Warriors",
            "points": 150,
            "faction": "Eldar"
        }
    ]

    for data in unit_data:
        
        faction = factions[
            data["faction"]
        ]

        unit = db.query(Unit).filter(
            Unit.name == data["name"],
            Unit.faction_id == faction.id
        ).first()

        if unit is None:

            unit = Unit(
                name=data["name"],
                type=data["type"],
                points=data["points"],
                faction_id=faction.id
            )

            db.add(unit)
            db.commit()

            print(
                f"Created unit: {data['name']}"
            )

        else:

            print(
                f"Unit already exists: {data['name']}"
            )


# SEED DATABASE FUNCTION, FOR RUNNING THE SEEDING PROCESS/LOADING DATA INTO THE DATABASE
def seed_database():

    #SQLAlchemy will create the database tables based on the models defined in the application. If the tables already exist, it will not recreate them.
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:

        print("Starting database seed...")

        factions = seed_factions(db)

        seed_detachments(
            db,
            factions
        )

        seed_units(
            db,
            factions
        )

        print("Database seed complete.")

    finally:

        db.close()


if __name__ == "__main__":
    seed_database()

