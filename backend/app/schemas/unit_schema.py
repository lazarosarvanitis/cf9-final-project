from pydantic import BaseModel, ConfigDict, Field


class UnitCreate(BaseModel):  
    name: str = Field(min_length=2)
    type: str = Field(min_length=2)
    points: int = Field(ge=0)     # not needed, unit points not 0
    faction_id: int = Field(gt=0) 


class UnitResponse(BaseModel): 
    id: int
    name: str
    type: str
    points: int
    faction_id: int

    model_config = ConfigDict(from_attributes=True)
