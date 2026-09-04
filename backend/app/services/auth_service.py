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

    # ADMIN USER MANAGEMENT

    def get_all_users(self):
        return self.user_repository.get_all()

    def promote_user(self, user_id: int):
        user = self.user_repository.get_one(user_id)

        if user is None:
            raise ValueError("User not found")

        if user.role == "ADMIN":
            raise ValueError(
                "User is already an administrator"
            )

        user.role = "ADMIN"

        return self.user_repository.update(user)

    def demote_user(
        self,
        user_id: int,
        current_admin_id: int
    ):
        user = self.user_repository.get_one(user_id)

        if user is None:
            raise ValueError("User not found")

        if user.role != "ADMIN":
            raise ValueError(
                "User is not an administrator"
            )

        if user.id == current_admin_id:
            raise ValueError(
                "You cannot demote your own administrator account"
            )

        if self.user_repository.count_admins() <= 1:
            raise ValueError(
                "The last administrator cannot be demoted"
            )

        user.role = "USER"

        return self.user_repository.update(user)
