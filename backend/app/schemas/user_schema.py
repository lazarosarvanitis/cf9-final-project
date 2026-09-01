from pydantic import BaseModel, ConfigDict, Field


## USER SCHEMA 
class UserCreate(BaseModel):
    username: str = Field(min_length=3) 
    email: str = Field(min_length=5) 
    password: str = Field(min_length=6)        


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str