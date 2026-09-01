from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import Base, engine
from app.models.army import Army
from app.models.army_unit import ArmyUnit
from app.models.detachment import Detachment
from app.models.faction import Faction
from app.models.unit import Unit
from app.models.user import User
from app.routers import (
    army_router,
    army_unit_router,
    auth_router,
    detachment_router,
    faction_router,
    unit_router
)


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Army Builder API"
)


app.add_middleware(
    CORSMiddleware,               #Connects frontend to backend
    allow_origins=[               #please work
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(faction_router.router)
app.include_router(detachment_router.router)
app.include_router(unit_router.router)
app.include_router(army_router.router)
app.include_router(army_unit_router.router)
app.include_router(auth_router.router)


@app.get("/")
def home():
    return {
        "message": "Army Builder API is running"
    }


@app.get("/database-test")
def database_test():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "message": "Database connection successful"
    }

