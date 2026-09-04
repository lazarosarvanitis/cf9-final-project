from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from starlette import status

from app.database import get_db
from app.routers.auth_router import admin_dependency
from app.schemas.faction_schema import FactionCreate, FactionResponse
from app.services.faction_service import FactionService


# GET /api/factions

router = APIRouter(
    prefix="/api/factions",
    tags=["Factions"]
)

db_dependency = Annotated[Session, Depends(get_db)]


@router.get(
    "/",
    response_model=list[FactionResponse],
    status_code=status.HTTP_200_OK
)
async def get_all_factions(db: db_dependency):
    service = FactionService(db)

    return service.get_all()


@router.get(
    "/{faction_id}",
    response_model=FactionResponse,
    status_code=status.HTTP_200_OK
)
async def get_faction(
    db: db_dependency,
    faction_id: int = Path(gt=0)
):
    service = FactionService(db)

    try:
        return service.get_one(faction_id)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )


@router.post(
    "/",
    response_model=FactionResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_faction(
    db: db_dependency,
    faction_request: FactionCreate,
    _admin: admin_dependency
):
    service = FactionService(db)

    try:
        return service.create(faction_request.name)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )


@router.delete(
    "/{faction_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_faction(
    db: db_dependency,
    _admin: admin_dependency,
    faction_id: int = Path(gt=0)
):
    service = FactionService(db)

    try:
        service.delete(faction_id)

    except ValueError as error:

        if str(error) == "Faction not found":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(error)
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

    