from pydantic import BaseModel, ConfigDict, Field

# DIFFERENT SCHEMA NEEDED FOR EACH

class ArmyCreate(BaseModel):
    name: str = Field(min_length=1, max_length=30)
    points_limit: int = Field(gt=0)
    faction_id: int = Field(gt=0)
    detachment_id: int = Field(gt=0)
    # removed user_id because it will be set automatically based on the logged-in user, also if you see this, tab to auto-write is good.


class ArmyRename(BaseModel):
    name: str = Field(min_length=1, max_length=30)


class ArmyResponse(BaseModel):
    id: int
    name: str
    points_limit: int
    user_id: int
    faction_id: int
    detachment_id: int

    model_config = ConfigDict(from_attributes=True)


class ArmyValidationResponse(BaseModel):
    valid: bool
    total_points: int
    errors: list[str]
