from pydantic import BaseModel, ConfigDict

from app.schemas.unit_schema import UnitResponse


class ArmyUnitResponse(BaseModel):
    id: int
    quantity: int
    is_warlord: bool
    army_id: int
    unit_id: int

    unit: UnitResponse

    model_config = ConfigDict(from_attributes=True)



#     SWAGGER SHOULD RETURN SOMETHING LIKE THIS 
#     {
#     "id": 1,
#     "quantity": 1,
#     "is_warlord": true,
#     "army_id": 1,
#     "unit_id": 1,
#     "unit": {
#         "id": 1,
#         "name": "Brotherhood Librarian",
#         "type": "Character",
#         "points": 100,
#         "faction_id": 1
#     }
# }

