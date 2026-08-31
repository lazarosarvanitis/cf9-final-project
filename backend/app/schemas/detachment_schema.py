from pydantic import BaseModel, ConfigDict, Field


class DetachmentCreate(BaseModel):
    name: str = Field(min_length=2)
    faction_id: int = Field(gt=0)


class DetachmentResponse(BaseModel):
    id: int
    name: str
    faction_id: int

    model_config = ConfigDict(from_attributes=True)


    