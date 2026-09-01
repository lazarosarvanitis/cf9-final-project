import {useState} from "react";
import type {FormEvent} from "react";
import {useNavigate} from "react-router";

import {
    getCurrentUser,
    login
} from "../services/authService";

import type {
    CurrentUser
} from "../services/authService";


const LoginPage = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [user, setUser] = useState<CurrentUser | null>(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleLogin = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        setLoading(true);
        setError("");

        try {

            await login(
                username,
                password
            );

            const loggedInUser = await getCurrentUser();

            setUser(loggedInUser);

        } catch (error) {

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Login failed");
            }

        } finally {
            setLoading(false);
        }
    }


    if (user) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-background px-6">

                <div className="w-full max-w-md rounded-lg border border-border bg-card p-8">

                    <h1 className="text-2xl font-semibold">
                        Login successful
                    </h1>

                    <div className="mt-6 space-y-2 text-sm">

                        <p>
                            <span className="text-muted">
                                Username:
                            </span>{" "}
                            {user.username}
                        </p>

                        <p>
                            <span className="text-muted">
                                User ID:
                            </span>{" "}
                            {user.user_id}
                        </p>

                        <p>
                            <span className="text-muted">
                                Role:
                            </span>{" "}
                            {user.role}
                        </p>

                    </div>

                    <button
                        onClick={() => navigate("/")}
                        className="mt-6 w-full cursor-pointer rounded-md border border-border bg-background px-4 py-3 font-medium transition hover:border-gray-500"
                    >
                        Continue to My Armies
                    </button>

                </div>

            </div>
        )
    }


    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-6">

            <div className="w-full max-w-md rounded-lg border border-border bg-card p-8">

                <h1 className="text-3xl font-semibold">
                    Army Builder
                </h1>

                <p className="mt-2 text-sm text-muted">
                    Sign in to manage your armies.
                </p>


                <form
                    onSubmit={handleLogin}
                    className="mt-8 space-y-5"
                >

                    <div>

                        <label
                            htmlFor="username"
                            className="mb-2 block text-sm font-medium"
                        >
                            Username
                        </label>

                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            required
                            className="w-full rounded-md border border-border bg-background px-4 py-3 text-white outline-none transition focus:border-gray-500"
                        />

                    </div>


                    <div>

                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                            className="w-full rounded-md border border-border bg-background px-4 py-3 text-white outline-none transition focus:border-gray-500"
                        />

                    </div>


                    {error && (
                        <div className="rounded-md border border-red-800 bg-red-950/30 p-3 text-sm text-red-300">
                            {error}
                        </div>
                    )}


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full cursor-pointer rounded-md border border-border bg-card px-4 py-3 font-semibold transition hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Signing in..."
                            : "Login"
                        }
                    </button>

                </form>

            </div>

        </div>
    )
}


export default LoginPage;
