import {useEffect, useState} from "react";
import {Navigate, Outlet} from "react-router";

import {
    getCurrentUser,
    logout
} from "../services/authService";


// GET /api/auth/me
// if the user is authenticated, return the current user
// if the user is not authenticated, return a 401 error
// if token is expired, return a 401 error
// PERSISTANCE LOG IN: if the user is authenticated, store the token in localStorage


const ProtectedRoute = () => {

    const [authenticated, setAuthenticated] = useState<boolean | null>(null);


    useEffect(() => {

        const checkAuthentication = async () => {

            try {

                await getCurrentUser();

                setAuthenticated(true);

            } catch {

                logout();

                setAuthenticated(false);
            }
        }


        checkAuthentication();

    }, []);


    if (authenticated === null) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <p className="text-muted">
                    Loading...
                </p>
            </div>
        )
    }

    
    if (!authenticated) {
        return <Navigate to="/login" replace/>
    }


    return <Outlet/>
}


export default ProtectedRoute;

// please work.