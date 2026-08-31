from pydantic import BaseModel, ConfigDict, Field


class FactionCreate(BaseModel):  # DATA IN      
    name: str = Field(min_length=2)


class FactionResponse(BaseModel): # DATA OUT
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True) # pyndanitc -> json

