from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from starlette import status

from app.database import get_db
from app.routers.auth_router import user_dependency
from app.schemas.army_schema import (
    ArmyCreate,
    ArmyRename,
    ArmyResponse,
    ArmyValidationResponse
)
from app.services.army_service import ArmyService



router = APIRouter(
    prefix="/api/armies",
    tags=["Armies"]
)

db_dependency = Annotated[Session, Depends(get_db)]


@router.get(
    "/",
    response_model=list[ArmyResponse],
    status_code=status.HTTP_200_OK
)
async def get_my_armies(
    db: db_dependency,
    user: user_dependency
):
    service = ArmyService(db)

    return service.get_by_user(
        user["user_id"]
    )


@router.get(
    "/{army_id}",
    response_model=ArmyResponse,
    status_code=status.HTTP_200_OK
)
async def get_army(
    db: db_dependency,
    user: user_dependency,
    army_id: int = Path(gt=0)
):
    service = ArmyService(db)

    try:
        return service.get_one(
            army_id,
            user["user_id"]
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )


@router.post(
    "/",
    response_model=ArmyResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_army(
    db: db_dependency,
    army_request: ArmyCreate,
    user: user_dependency
):
    service = ArmyService(db)

    try:
        return service.create(
            army_request.name,
            army_request.points_limit,
            user["user_id"],
            army_request.faction_id,
            army_request.detachment_id
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )


@router.patch(
    "/{army_id}/name",
    response_model=ArmyResponse,
    status_code=status.HTTP_200_OK
)
async def update_army_name(
    db: db_dependency,
    army_request: ArmyRename,
    user: user_dependency,
    army_id: int = Path(gt=0)
):
    service = ArmyService(db)

    try:
        return service.update_name(
            army_id,
            user["user_id"],
            army_request.name
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )


@router.get(
    "/{army_id}/validation",
    response_model=ArmyValidationResponse,
    status_code=status.HTTP_200_OK
)
async def validate_army(
    db: db_dependency,
    user: user_dependency,
    army_id: int = Path(gt=0)
):
    service = ArmyService(db)

    try:
        return service.validate_army(
            army_id,
            user["user_id"]
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )


@router.delete(
    "/{army_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_army(
    db: db_dependency,
    user: user_dependency,
    army_id: int = Path(gt=0)
):
    service = ArmyService(db)

    try:
        service.delete(
            army_id,
            user["user_id"]
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )

    