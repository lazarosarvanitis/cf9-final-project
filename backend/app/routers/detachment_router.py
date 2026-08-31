from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from starlette import status

from app.database import get_db
from app.schemas.detachment_schema import (
    DetachmentCreate,
    DetachmentResponse
)
from app.services.detachment_service import DetachmentService


## GET /api/detachments/faction/{faction_id}
router = APIRouter(
    prefix="/api/detachments",
    tags=["Detachments"]
)


db_dependency = Annotated[Session, Depends(get_db)]


@router.get(
    "/",
    response_model=list[DetachmentResponse],
    status_code=status.HTTP_200_OK
)
async def get_all_detachments(db: db_dependency):
    service = DetachmentService(db)

    return service.get_all()


@router.get(
    "/{detachment_id}",
    response_model=DetachmentResponse,
    status_code=status.HTTP_200_OK
)
async def get_detachment(
    db: db_dependency,
    detachment_id: int = Path(gt=0)
):
    service = DetachmentService(db)

    try:
        return service.get_one(detachment_id)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )
    


@router.get(
    "/faction/{faction_id}",
    response_model=list[DetachmentResponse],
    status_code=status.HTTP_200_OK
)
async def get_detachments_by_faction(
    db: db_dependency,
    faction_id: int = Path(gt=0) 
):
    service = DetachmentService(db)         

    try:
        return service.get_by_faction(faction_id) 
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )


@router.post(
    "/",
    response_model=DetachmentResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_detachment(
    db: db_dependency,
    detachment_request: DetachmentCreate
):
    
    service = DetachmentService(db)

    try:
        return service.create(
            detachment_request.name,
            detachment_request.faction_id
        ) 
    
    except ValueError as error:  
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )



@router.delete(
    "/{detachment_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_detachment(
    db: db_dependency,
    detachment_id: int = Path(gt=0)
):
    service = DetachmentService(db)

    try:
        service.delete(detachment_id)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )


