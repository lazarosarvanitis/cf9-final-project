from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from starlette import status

from app.database import get_db
from app.schemas.army_unit_schema import ArmyUnitResponse
from app.services.army_unit_service import ArmyUnitService


router = APIRouter(
    prefix="/api/armies/{army_id}/units",
    tags=["Army Units"]
)


db_dependency = Annotated[Session, Depends(get_db)]



@router.get(
    "/",
    response_model=list[ArmyUnitResponse],
    status_code=status.HTTP_200_OK
)
async def get_army_units(
    db: db_dependency,
    army_id: int = Path(gt=0)
):
    service = ArmyUnitService(db)

    try:
        return service.get_by_army(army_id)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )


@router.post(
    "/{unit_id}",
    response_model=list[ArmyUnitResponse],
    status_code=status.HTTP_200_OK
)
async def add_unit(
    db: db_dependency,
    army_id: int = Path(gt=0),
    unit_id: int = Path(gt=0)
):
    service = ArmyUnitService(db)

    try:
        service.add_unit(
            army_id,
            unit_id
        )

        return service.get_by_army(army_id)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )


@router.delete(
    "/{unit_id}/one",
    response_model=list[ArmyUnitResponse],
    status_code=status.HTTP_200_OK
)
async def remove_one(
    db: db_dependency,
    army_id: int = Path(gt=0),
    unit_id: int = Path(gt=0)
):
    service = ArmyUnitService(db)

    try:
        service.remove_one(
            army_id,
            unit_id
        )

        return service.get_by_army(army_id)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )


@router.delete(
    "/{unit_id}/regular-copies",
    response_model=list[ArmyUnitResponse],
    status_code=status.HTTP_200_OK
)
async def delete_regular_copies(
    db: db_dependency,
    army_id: int = Path(gt=0),
    unit_id: int = Path(gt=0)
):
    service = ArmyUnitService(db)

    try:
        service.delete_regular_copies(
            army_id,
            unit_id
        )

        return service.get_by_army(army_id)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )


@router.patch(
    "/{unit_id}/warlord",
    response_model=list[ArmyUnitResponse],
    status_code=status.HTTP_200_OK
)
async def set_warlord(
    db: db_dependency,
    army_id: int = Path(gt=0),
    unit_id: int = Path(gt=0)
):
    service = ArmyUnitService(db)

    try:
        service.set_warlord(
            army_id,
            unit_id
        )

        return service.get_by_army(army_id)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )


@router.patch(
    "/warlord/remove",
    response_model=list[ArmyUnitResponse],
    status_code=status.HTTP_200_OK
)

async def remove_warlord(
    db: db_dependency,
    army_id: int = Path(gt=0)
):
    service = ArmyUnitService(db)

    try:
        service.remove_warlord(army_id)

        return service.get_by_army(army_id)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )



@router.delete(
    "/warlord",
    response_model=list[ArmyUnitResponse],
    status_code=status.HTTP_200_OK
)
async def delete_warlord(
    db: db_dependency,
    army_id: int = Path(gt=0)
):
    service = ArmyUnitService(db)

    try:
        service.delete_warlord(army_id)

        return service.get_by_army(army_id)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )


    