import {useEffect, useState} from "react";
import {LogOut, Menu, Settings} from "lucide-react";
import {useNavigate} from "react-router";

import {
    getCurrentUser,
    logout
} from "../services/authService";

import type {
    CurrentUser
} from "../services/authService";


// FINAL HEADER
// FLOW: LOG IN -> HEADER LOADS -> GET CURRENT USER -> IF NOT AUTHENTICATED, LOGOUT AND REDIRECT TO LOGIN PAGE

const Header = () => {

    const navigate = useNavigate();

    const [user, setUser] = useState<CurrentUser | null>(null);


    useEffect(() => {

        const loadUser = async () => {

            try {

                const loggedInUser = await getCurrentUser();

                setUser(loggedInUser);

            } catch {

                logout();

                navigate("/login");
            }
        }


        loadUser();

    }, [navigate]);


    // LOGOUT FUNCTION: CLEAR LOCAL STORAGE AND REDIRECT TO LOGIN PAGE
    const handleLogout = () => {

        logout();

        navigate("/login");
    }


    return (
        <header className="border-b border-border bg-[#111318]">

            <div className="mx-auto flex h-14 max-w-[1500px] items-center justify-between px-6">

                <div>

                    <span className="text-sm font-semibold text-gray-200">
                        Army Builder
                    </span>

                </div>


                <div className="flex items-center gap-5 text-gray-400">

                    {user && (
                        <span className="text-sm text-gray-300">
                            {user.username}
                        </span>
                    )}


                    <button
                        className="cursor-pointer hover:text-white"
                    >
                        <Menu size={20}/>
                    </button>


                    <button
                        className="cursor-pointer hover:text-white"
                    >
                        <Settings size={20}/>
                    </button>


                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className="flex cursor-pointer items-center gap-2 hover:text-red-400"
                    >
                        <LogOut size={20}/>

                        <span className="text-sm">
                            Logout
                        </span>
                    </button>

                </div>

            </div>

        </header>
    )
}


export default Header;

