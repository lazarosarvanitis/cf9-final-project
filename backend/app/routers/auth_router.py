import os
from typing import Annotated

import jwt
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from sqlalchemy.orm import Session
from starlette import status

from app.database import get_db
from app.schemas.user_schema import (
    TokenResponse,
    UserCreate,
    UserResponse
)
from app.services.auth_service import AuthService


load_dotenv()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


db_dependency = Annotated[Session, Depends(get_db)]

form_dependency = Annotated[
    OAuth2PasswordRequestForm,
    Depends()
]

oauth2_bearer = OAuth2PasswordBearer(
    tokenUrl="/api/auth/token"
)

token_dependency = Annotated[
    str,
    Depends(oauth2_bearer)
]


async def get_current_user(token: token_dependency):

    if JWT_SECRET_KEY is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="JWT secret key is missing"
        )

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        username = payload.get("sub")
        user_id = payload.get("user_id")
        role = payload.get("role")

        if username is None or user_id is None or role is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate user"
            )

        return {
            "username": username,
            "user_id": user_id,
            "role": role
        }

    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate user"
        )


user_dependency = Annotated[
    dict,
    Depends(get_current_user)
]

# ADMIN ACCESS REQUIRED
# _admin: admin_dependency
async def require_admin(user: user_dependency):

    if user["role"] != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    return user 


admin_dependency = Annotated[
    dict,
    Depends(require_admin)
]


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)

async def register_user(
    db: db_dependency,
    user_request: UserCreate
):
    service = AuthService(db)

    try:
        return service.register(
            user_request.username,
            user_request.email,
            user_request.password
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )


@router.post(
    "/token",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK
)
async def login_for_access_token(
    db: db_dependency,
    form_data: form_dependency
):
    service = AuthService(db)

    user = service.authenticate_user(
        form_data.username,
        form_data.password
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    access_token = service.create_access_token(user)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get(
    "/me",
    status_code=status.HTTP_200_OK
)
async def get_logged_in_user(
    user: user_dependency
):
    return user


