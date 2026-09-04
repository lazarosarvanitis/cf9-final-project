from pydantic import BaseModel, ConfigDict, EmailStr, Field

# USER SCHEMAS FOR CREATION AND RESPONSE
class UserCreate(BaseModel):
    username: str = Field(min_length=3)
    email: EmailStr # WITH PYDANTIC, EMAIL IS VALIDATED AUTOMATICALLY
    password: str = Field(min_length=6)


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str