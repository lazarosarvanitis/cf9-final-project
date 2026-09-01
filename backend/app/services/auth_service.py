import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository


load_dotenv()

# JWT
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"

## Password-> AuthService->Argon(hash)->UserRepos->Postgress(hassed password)

class AuthService:

    def __init__(self, db: Session):
        self.user_repository = UserRepository(db)
        self.password_hash = PasswordHash.recommended()

    def register(
        self,
        username: str,
        email: str,
        password: str
    ):
        if username.strip() == "": 
            raise ValueError("Username cannot be empty")

        if email.strip() == "":
            raise ValueError("Email cannot be empty")

        existing_username = self.user_repository.get_by_username(
            username.strip()
        )

        if existing_username is not None:
            raise ValueError("Username already exists")

        existing_email = self.user_repository.get_by_email(
            email.strip() 
        )

        if existing_email is not None:
            raise ValueError("Email already exists")

        hashed_password = self.password_hash.hash(password)  

        user = User(
            username=username.strip(),
            email=email.strip(),
            hashed_password=hashed_password,
            role="USER",
            is_active=True
        )

        return self.user_repository.insert(user)

    def authenticate_user(
        self,
        username: str,
        password: str
    ):
        user = self.user_repository.get_by_username(username)

        if user is None:
            return None

        if not self.password_hash.verify(
            password,
            user.hashed_password
        ):
            return None

        if not user.is_active:
            return None

        return user

    def create_access_token(self, user: User):
        if JWT_SECRET_KEY is None:
            raise ValueError("JWT secret key is missing")

        token_data = {
            "sub": user.username,
            "user_id": user.id,
            "role": user.role,
            "exp": datetime.now(timezone.utc) + timedelta(minutes=30)
        }

        return jwt.encode(
            token_data,
            JWT_SECRET_KEY,
            algorithm=ALGORITHM
        )
    