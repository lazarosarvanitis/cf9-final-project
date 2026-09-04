import {getToken} from "./authService";

import type {
    DetachmentResponse,
    FactionResponse,
    UnitResponse
} from "./armyService";


const API_URL = "http://127.0.0.1:8000";


const getAuthHeaders = () => {

    const token = getToken();

    if (!token) {
        throw new Error("Not authenticated");
    }

    return {
        "Authorization": `Bearer ${token}`
    }
}


const getJsonAuthHeaders = () => {

    return {
        ...getAuthHeaders(),
        "Content-Type": "application/json"
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


// FACTIONS

export const getAllFactions = async (): Promise<FactionResponse[]> => {

    const response = await fetch(
        `${API_URL}/api/factions/`
    );

    if (!response.ok) {
        throw new Error("Could not load factions");
    }

    return response.json();
}


export const createFaction = async (
    name: string
): Promise<FactionResponse> => {

    const response = await fetch(
        `${API_URL}/api/factions/`,
        {
            method: "POST",
            headers: getJsonAuthHeaders(),
            body: JSON.stringify({
                name
            })
        }
    );

    if (!response.ok) {

        throw new Error(
            await getErrorMessage(
                response,
                "Could not create faction"
            )
        );
    }

    return response.json();
}


export const deleteFaction = async (
    factionId: number
): Promise<void> => {

    const response = await fetch(
        `${API_URL}/api/factions/${factionId}`,
        {
            method: "DELETE",
            headers: getAuthHeaders()
        }
    );

    if (!response.ok) {

        throw new Error(
            await getErrorMessage(
                response,
                "Could not delete faction"
            )
        );
    }
}


// DETACHMENTS

export const getAllDetachments = async (): Promise<DetachmentResponse[]> => {

    const response = await fetch(
        `${API_URL}/api/detachments/`
    );

    if (!response.ok) {
        throw new Error("Could not load detachments");
    }

    return response.json();
}


export const createDetachment = async (
    name: string,
    factionId: number
): Promise<DetachmentResponse> => {

    const response = await fetch(
        `${API_URL}/api/detachments/`,
        {
            method: "POST",
            headers: getJsonAuthHeaders(),
            body: JSON.stringify({
                name,
                faction_id: factionId
            })
        }
    );

    if (!response.ok) {

        throw new Error(
            await getErrorMessage(
                response,
                "Could not create detachment"
            )
        );
    }

    return response.json();
}


export const deleteDetachment = async (
    detachmentId: number
): Promise<void> => {

    const response = await fetch(
        `${API_URL}/api/detachments/${detachmentId}`,
        {
            method: "DELETE",
            headers: getAuthHeaders()
        }
    );

    if (!response.ok) {

        throw new Error(
            await getErrorMessage(
                response,
                "Could not delete detachment"
            )
        );
    }
}


// UNITS

export const getAllUnits = async (): Promise<UnitResponse[]> => {

    const response = await fetch(
        `${API_URL}/api/units/`
    );

    if (!response.ok) {
        throw new Error("Could not load units");
    }

    return response.json();
}


export const createUnit = async (
    name: string,
    type: string,
    points: number,
    factionId: number
): Promise<UnitResponse> => {

    const response = await fetch(
        `${API_URL}/api/units/`,
        {
            method: "POST",
            headers: getJsonAuthHeaders(),
            body: JSON.stringify({
                name,
                type,
                points,
                faction_id: factionId
            })
        }
    );

    if (!response.ok) {

        throw new Error(
            await getErrorMessage(
                response,
                "Could not create unit"
            )
        );
    }

    return response.json();
}


export const updateUnit = async (
    unitId: number,
    name: string,
    type: string,
    points: number,
    factionId: number
): Promise<UnitResponse> => {

    const response = await fetch(
        `${API_URL}/api/units/${unitId}`,
        {
            method: "PATCH",
            headers: getJsonAuthHeaders(),
            body: JSON.stringify({
                name,
                type,
                points,
                faction_id: factionId
            })
        }
    );

    if (!response.ok) {

        throw new Error(
            await getErrorMessage(
                response,
                "Could not update unit"
            )
        );
    }

    return response.json();
}


export const deleteUnit = async (
    unitId: number
): Promise<void> => {

    const response = await fetch(
        `${API_URL}/api/units/${unitId}`,
        {
            method: "DELETE",
            headers: getAuthHeaders()
        }
    );

    if (!response.ok) {

        throw new Error(
            await getErrorMessage(
                response,
                "Could not delete unit"
            )
        );
    }
}
