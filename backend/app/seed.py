import os

from dotenv import load_dotenv
from pwdlib import PasswordHash

from app.database import Base, SessionLocal, engine

from app.models.army import Army
from app.models.army_unit import ArmyUnit
from app.models.detachment import Detachment
from app.models.faction import Faction
from app.models.unit import Unit
from app.models.user import User


load_dotenv()

password_hash = PasswordHash.recommended()


# DATA FOR ADMIN USER
def seed_admin(db):

    admin_username = os.getenv(
        "SEED_ADMIN_USERNAME"
    )

    admin_password = os.getenv(
        "SEED_ADMIN_PASSWORD"
    )

    admin_email = os.getenv(
        "SEED_ADMIN_EMAIL"
    )


    if (
        not admin_username or
        not admin_password or
        not admin_email
    ):

        print(
            "Admin seed skipped. Admin credentials are missing from .env"
        )

        return


    admin = db.query(User).filter(
        User.username == admin_username
    ).first()


    if admin is None:

        existing_email = db.query(User).filter(
            User.email == admin_email
        ).first()

        if existing_email is not None:

            print(
                "Admin seed skipped. Admin email is already in use."
            )

            return


        admin = User(
            username=admin_username,
            email=admin_email,
            hashed_password=password_hash.hash(
                admin_password
            ),
            role="ADMIN",
            is_active=True
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print(
            f"Created admin user: {admin.username}"
        )

    else:

        print(
            f"Admin user already exists: {admin.username}"
        )


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


# DATA FOR SAMPLE ADMIN ARMIES
def seed_admin_armies(db, factions):

    admin_username = os.getenv(
        "SEED_ADMIN_USERNAME"
    )

    if not admin_username:

        print(
            "Admin armies skipped. SEED_ADMIN_USERNAME is missing from .env"
        )

        return


    admin = db.query(User).filter(
        User.username == admin_username
    ).first()

    if admin is None:

        print(
            "Admin armies skipped. Admin user was not found."
        )

        return


    army_data = [
        {
            "name": "Titan's Wraith",
            "points_limit": 2000,
            "faction": "Grey Knights",
            "detachment": "Banishers",
            "units": [
                {
                    "name": "Brotherhood Librarian",
                    "quantity": 1,
                    "is_warlord": True
                },
                {
                    "name": "Strike Squad",
                    "quantity": 3,
                    "is_warlord": False
                },
                {
                    "name": "Terminator Squad",
                    "quantity": 3,
                    "is_warlord": False
                },
                {
                    "name": "Paladin Squad",
                    "quantity": 2,
                    "is_warlord": False
                },
                {
                    "name": "Nemesis Dreadknight",
                    "quantity": 2,
                    "is_warlord": False
                }
            ]
        },
        {
            "name": "Golden Host",
            "points_limit": 2000,
            "faction": "Adeptus Custodes",
            "detachment": "Lions of the Emperor",
            "units": [
                {
                    "name": "Blade Champion",
                    "quantity": 1,
                    "is_warlord": True
                },
                {
                    "name": "Custodian Guard",
                    "quantity": 3,
                    "is_warlord": False
                },
                {
                    "name": "Custodian Wardens",
                    "quantity": 2,
                    "is_warlord": False
                },
                {
                    "name": "Allarus Custodians",
                    "quantity": 3,
                    "is_warlord": False
                },
                {
                    "name": "Vertus Praetors",
                    "quantity": 2,
                    "is_warlord": False
                }
            ]
        },
        {
            "name": "Exodites",
            "points_limit": 2000,
            "faction": "Eldar",
            "detachment": "Aspect Host",
            "units": [
                {
                    "name": "Autarch",
                    "quantity": 1,
                    "is_warlord": True
                },
                {
                    "name": "Avatar of Khaine",
                    "quantity": 1,
                    "is_warlord": False
                },
                {
                    "name": "Dire Avengers",
                    "quantity": 1,
                    "is_warlord": False
                },
                {
                    "name": "Howling Banshees",
                    "quantity": 3,
                    "is_warlord": False
                },
                {
                    "name": "Fire Dragons",
                    "quantity": 1,
                    "is_warlord": False
                },
                {
                    "name": "Striking Scorpions",
                    "quantity": 3,
                    "is_warlord": False
                },
                {
                    "name": "Dark Reapers",
                    "quantity": 1,
                    "is_warlord": False
                },
                {
                    "name": "Swooping Hawks",
                    "quantity": 1,
                    "is_warlord": False
                },
                {
                    "name": "Warp Spiders",
                    "quantity": 1,
                    "is_warlord": False
                },
                {
                    "name": "Shining Spears",
                    "quantity": 1,
                    "is_warlord": False
                }
            ]
        }
    ]


    for data in army_data:

        faction = factions[
            data["faction"]
        ]

        detachment = db.query(
            Detachment
        ).filter(
            Detachment.name == data["detachment"],
            Detachment.faction_id == faction.id
        ).first()

        if detachment is None:

            print(
                f"Sample army skipped. Detachment not found: {data['detachment']}"
            )

            continue


        existing_army = db.query(Army).filter(
            Army.name == data["name"],
            Army.user_id == admin.id
        ).first()

        if existing_army is not None:

            print(
                f"Army already exists: {data['name']}"
            )

            continue


        army = Army(
            name=data["name"],
            points_limit=data["points_limit"],
            user_id=admin.id,
            faction_id=faction.id,
            detachment_id=detachment.id
        )

        db.add(army)
        db.commit()
        db.refresh(army)


        for army_unit_data in data["units"]:

            unit = db.query(Unit).filter(
                Unit.name == army_unit_data["name"],
                Unit.faction_id == faction.id
            ).first()

            if unit is None:

                print(
                    f"Sample army unit not found: {army_unit_data['name']}"
                )

                continue


            army_unit = ArmyUnit(
                quantity=army_unit_data["quantity"],
                is_warlord=army_unit_data["is_warlord"],
                army_id=army.id,
                unit_id=unit.id
            )

            db.add(army_unit)


        db.commit()

        print(
            f"Created sample army: {army.name}"
        )


# SEED DATABASE FUNCTION, FOR RUNNING THE SEEDING PROCESS/LOADING DATA INTO THE DATABASE
def seed_database():

    #SQLAlchemy will create the database tables based on the models defined in the application. If the tables already exist, it will not recreate them.
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:

        print("Starting database seed...")

        seed_admin(db)

        factions = seed_factions(db)

        seed_detachments(
            db,
            factions
        )

        seed_units(
            db,
            factions
        )

        seed_admin_armies(
            db,
            factions
        )

        print("Database seed complete.")

    finally:

        db.close()


if __name__ == "__main__":
    seed_database()


