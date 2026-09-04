const API_URL = "http://127.0.0.1:8000";


// FRONTEND AUTH SERVICE, handles login, logout, and getting the current user INSTEAD OF TOKENS / BACKEND AUTH SERVICE

export type TokenResponse = {
    access_token: string;
    token_type: string;
}


export type CurrentUser = {
    username: string;
    user_id: number;
    role: string;
}


export type RegisteredUser = {
    id: number;
    username: string;
    email: string;
    role: string;
    is_active: boolean;
}


// REGISTER NEW USER
export const register = async (
    username: string,
    email: string,
    password: string
): Promise<RegisteredUser> => {

    const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        }
    );


    if (!response.ok) {

        try {

            const errorData = await response.json();

            if (typeof errorData.detail === "string") {
                throw new Error(errorData.detail);
            }

        } catch (error) {

            if (error instanceof Error) {
                throw error;
            }
        }

        throw new Error("Registration failed");
    }


    return response.json();
}


export const login = async (
    username: string,
    password: string
): Promise<TokenResponse> => {

    const formData = new URLSearchParams();

    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(
        `${API_URL}/api/auth/token`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData
        }
    );

    if (!response.ok) {
        throw new Error("Invalid username or password");
    }

    const data: TokenResponse = await response.json();

    localStorage.setItem(
        "access_token",
        data.access_token
    );

    return data;
}



export const getCurrentUser = async (): Promise<CurrentUser> => {

    const token = localStorage.getItem("access_token");

    if (!token) {
        throw new Error("Not authenticated");
    }

    const response = await fetch(
        `${API_URL}/api/auth/me`,
        {
            headers: {
                "Authorization": `Bearer ${token}` // REACT SWAGGER AUTHORIZATION
            }
        }
    );

    if (!response.ok) {
        throw new Error("Could not authenticate user");
    }

    return response.json();
}


export const getToken = () => {
    return localStorage.getItem("access_token");
}


export const logout = () => {
    localStorage.removeItem("access_token");
}

