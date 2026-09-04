from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


# TYPES ALLOWED FOR UNIT CREATION AND UPDATE
UnitType = Literal[
    "Character",
    "Battleline",
    "Infantry",
    "Mounted",
    "Vehicle",
    "Monster",
    "Aspect Warriors"
]


class UnitCreate(BaseModel):
    name: str = Field(min_length=1)
    type: UnitType # DIFFERENT FROM UNITRESPONSE, SO CREATING IS RESTRICTED TO THE ABOVE TYPES
    points: int = Field(gt=0)
    faction_id: int = Field(gt=0)


class UnitUpdate(BaseModel):
    name: str = Field(min_length=1)
    type: UnitType # DIFFERENT FROM UNITRESPONSE, SO UPDATING IS RESTRICTED TO THE ABOVE TYPES
    points: int = Field(gt=0)
    faction_id: int = Field(gt=0)


class UnitResponse(BaseModel):
    id: int
    name: str
    type: str       # DONT restrict the type here, because we want to return all types, not just the ones allowed for creation and update
    points: int
    faction_id: int

    model_config = ConfigDict(from_attributes=True)
