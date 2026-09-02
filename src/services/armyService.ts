import {getToken} from "./authService";


const API_URL = "http://127.0.0.1:8000";


export type ArmyResponse = {
    id: number;
    name: string;
    points_limit: number;
    user_id: number;
    faction_id: number;
    detachment_id: number;
}


export type FactionResponse = {
    id: number;
    name: string;
}


export type DetachmentResponse = {
    id: number;
    name: string;
    faction_id: number;
}


export type UnitResponse = {
    id: number;
    name: string;
    type: string;
    points: number;
    faction_id: number;
}


export type ArmyUnitResponse = {
    id: number;
    quantity: number;
    is_warlord: boolean;
    army_id: number;
    unit_id: number;
    unit: UnitResponse;
}


export type ArmyValidationResponse = {
    valid: boolean;
    total_points: number;
    errors: string[];
}


export type ArmyListItem = {
    id: number;
    name: string;
    faction: string;
    detachment: string;
    points: number;
    pointsLimit: number;
}


const getAuthHeaders = () => {

    const token = getToken();


    if (!token) {
        throw new Error("Not authenticated");
    }


    return {
        "Authorization": `Bearer ${token}`
    }
}


const getErrorMessage = async (
    response: Response,
    fallbackMessage: string
) => {

    try {

        const errorData = await response.json();

        if (typeof errorData.detail === "string") {
            return errorData.detail;
        }

    } catch {
        return fallbackMessage;
    }


    return fallbackMessage;
}


export const getFactions = async (): Promise<FactionResponse[]> => {

    const response = await fetch(
        `${API_URL}/api/factions/`
    );


    if (!response.ok) {
        throw new Error("Could not load factions");
    }


    return response.json();
}


export const getDetachments = async (): Promise<DetachmentResponse[]> => {

    const response = await fetch(
        `${API_URL}/api/detachments/`
    );


    if (!response.ok) {
        throw new Error("Could not load detachments");
    }


    return response.json();
}


export const createArmy = async (
    name: string,
    pointsLimit: number,
    factionId: number,
    detachmentId: number
): Promise<ArmyResponse> => {

    const response = await fetch(
        `${API_URL}/api/armies/`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },

            body: JSON.stringify({
                name: name,
                points_limit: pointsLimit,
                faction_id: factionId,
                detachment_id: detachmentId
            })
        }
    );


    if (!response.ok) {

        throw new Error(
            await getErrorMessage(
                response,
                "Could not create army"
            )
        );
    }


    return response.json();
}


export const getArmy = async (
    armyId: number
): Promise<ArmyResponse> => {

    const response = await fetch(
        `${API_URL}/api/armies/${armyId}`,
        {
            headers: getAuthHeaders()
        }
    );


    if (!response.ok) {

        throw new Error(
            await getErrorMessage(
                response,
                "Could not load army"
            )
        );
    }


    return response.json();
}


export const renameArmy = async (
    armyId: number,
    name: string
): Promise<ArmyResponse> => {

    const response = await fetch(
        `${API_URL}/api/armies/${armyId}/name`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },

            body: JSON.stringify({
                name: name
            })
        }
    );


    if (!response.ok) {

        throw new Error(
            await getErrorMessage(
                response,
                "Could not rename army"
            )
        );
    }


    return response.json();
}


export const deleteArmy = async (
    armyId: number
) => {

    const response = await fetch(
        `${API_URL}/api/armies/${armyId}`,
        {
            method: "DELETE",
            headers: getAuthHeaders()
        }
    );


    if (!response.ok) {

        throw new Error(
            await getErrorMessage(
                response,
                "Could not delete army"
            )
        );
    }
}


export const validateArmy = async (
    armyId: number
): Promise<ArmyValidationResponse> => {

    const response = await fetch(
        `${API_URL}/api/armies/${armyId}/validation`,
        {
            headers: getAuthHeaders()
        }
    );


    if (!response.ok) {

        throw new Error(
            await getErrorMessage(
                response,
                "Could not validate army"
            )
        );
    }


    return response.json();
}


export const getUnitsByFaction = async (
    factionId: number
): Promise<UnitResponse[]> => {

    const response = await fetch(
        `${API_URL}/api/units/faction/${factionId}`
    );


    if (!response.ok) {

        throw new Error(
            await getErrorMessage(
                response,
                "Could not load faction units"
            )
        );
    }


    return response.json();
}


export const getArmyUnits = async (
    armyId: number
): Promise<ArmyUnitResponse[]> => {

    const response = await fetch(
        `${API_URL}/api/armies/${armyId}/units/`,
        {
            headers: getAuthHeaders()
        }
    );


    if (!response.ok) {

        throw new Error(
            await getErrorMessage(
                response,
                "Could not load army units"
            )
        );
    }


    return response.json();
}


export const addArmyUnit = async (
    armyId: number,
    unitId: number
): Promise<ArmyUnitResponse[]> => {

    const response = await fetch(
        `${API_URL}/api/armies/${armyId}/units/${unitId}`,
        {
            method: "POST",
            headers: getAuthHeaders()
        }
    );


    if (!response.ok) {

        throw new Error(
            await getErrorMessage(
                response,
                "Could not add unit"
            )
        );
    }


    return response.json();
}


export const removeOneArmyUnit = async (
    armyId: number,
    unitId: number
): Promise<ArmyUnitResponse[]> => {

    const response = await fetch(
        `${API_URL}/api/armies/${armyId}/units/${unitId}/one`,
        {
            method: "DELETE",
            headers: getAuthHeaders()
        }
    );


    if (!response.ok) {

        throw new Error(
            await getErrorMessage(
                response,
                "Could not remove unit"
            )
        );
    }


    return response.json();
}


export const deleteRegularArmyUnitCopies = async (
    armyId: number,
    unitId: number
): Promise<ArmyUnitResponse[]> => {

    const response = await fetch(
        `${API_URL}/api/armies/${armyId}/units/${unitId}/regular-copies`,
        {
            method: "DELETE",
            headers: getAuthHeaders()
        }
    );


    if (!response.ok) {

        throw new Error(
            await getErrorMessage(
                response,
                "Could not delete unit copies"
            )
        );
    }


    return response.json();
}


export const setArmyWarlord = async (
    armyId: number,
    unitId: number
): Promise<ArmyUnitResponse[]> => {

    const response = await fetch(
        `${API_URL}/api/armies/${armyId}/units/${unitId}/warlord`,
        {
            method: "PATCH",
            headers: getAuthHeaders()
        }
    );


    if (!response.ok) {

        throw new Error(
            await getErrorMessage(
                response,
                "Could not set Warlord"
            )
        );
    }


    return response.json();
}


export const removeArmyWarlord = async (
    armyId: number
): Promise<ArmyUnitResponse[]> => {

    const response = await fetch(
        `${API_URL}/api/armies/${armyId}/units/warlord/remove`,
        {
            method: "PATCH",
            headers: getAuthHeaders()
        }
    );


    if (!response.ok) {

        throw new Error(
            await getErrorMessage(
                response,
                "Could not remove Warlord"
            )
        );
    }


    return response.json();
}


export const deleteArmyWarlord = async (
    armyId: number
): Promise<ArmyUnitResponse[]> => {

    const response = await fetch(
        `${API_URL}/api/armies/${armyId}/units/warlord`,
        {
            method: "DELETE",
            headers: getAuthHeaders()
        }
    );


    if (!response.ok) {

        throw new Error(
            await getErrorMessage(
                response,
                "Could not delete Warlord"
            )
        );
    }


    return response.json();
}


export const getMyArmies = async (): Promise<ArmyListItem[]> => {

    const [
        armiesResponse,
        factions,
        detachments
    ] = await Promise.all([

        fetch(
            `${API_URL}/api/armies/`,
            {
                headers: getAuthHeaders()
            }
        ),

        getFactions(),

        getDetachments()

    ]);


    if (!armiesResponse.ok) {

        throw new Error(
            await getErrorMessage(
                armiesResponse,
                "Could not load armies"
            )
        );
    }


    const armies: ArmyResponse[] =
        await armiesResponse.json();


    const armiesWithPoints = await Promise.all(

        armies.map(async (army) => {

            const validation =
                await validateArmy(army.id);


            const faction = factions.find(
                (faction) =>
                    faction.id === army.faction_id
            );


            const detachment = detachments.find(
                (detachment) =>
                    detachment.id === army.detachment_id
            );


            return {
                id: army.id,
                name: army.name,
                faction:
                    faction?.name ??
                    "Unknown Faction",
                detachment:
                    detachment?.name ??
                    "Unknown Detachment",
                points: validation.total_points,
                pointsLimit: army.points_limit
            }
        })

    );


    return armiesWithPoints;
}
