import {useState} from "react";
import type {SubmitEvent} from "react";
import {useNavigate} from "react-router";

import {
    register
} from "../services/authService";


const RegisterPage = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleRegister = async (
        event: SubmitEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        setError("");


        // FRONTEND REGISTRATION VALIDATION

        if (username.trim().length < 3) {
            setError("Username must contain at least 3 characters");
            return;
        }

        if (email.trim().length < 5) {
            setError("Email must contain at least 5 characters");
            return;
        }

        if (password.length < 6) {
            setError("Password must contain at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }


        setLoading(true);


        try {

            await register(
                username.trim(),
                email.trim(),
                password
            );


            // AFTER SUCCESSFUL REGISTRATION, GO TO LOGIN PAGE

            navigate(
                "/login",
                {
                    replace: true,
                    state: {
                        accountCreated: true
                    }
                }
            );

        } catch (registerError) {

            if (registerError instanceof Error) {
                setError(registerError.message);
            } else {
                setError("Registration failed");
            }

        } finally {

            setLoading(false);
        }
    }


    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-6">

            <div className="w-full max-w-md rounded-lg border border-border bg-card p-8">

                <h1 className="text-3xl font-semibold">
                    Create Account
                </h1>

                <p className="mt-2 text-sm text-muted">
                    Register to start building your armies.
                </p>


                <form
                    onSubmit={handleRegister}
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
                            minLength={3}
                            className="w-full rounded-md border border-border bg-background px-4 py-3 text-white outline-none transition focus:border-gray-500"
                        />

                    </div>


                    <div>

                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
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
                            minLength={6}
                            className="w-full rounded-md border border-border bg-background px-4 py-3 text-white outline-none transition focus:border-gray-500"
                        />

                    </div>


                    <div>

                        <label
                            htmlFor="confirmPassword"
                            className="mb-2 block text-sm font-medium"
                        >
                            Confirm Password
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                            required
                            minLength={6}
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
                            ? "Creating account..."
                            : "Create Account"
                        }
                    </button>

                </form>


                <div className="mt-6 border-t border-border pt-6 text-center">

                    <p className="text-sm text-muted">
                        Already have an account?
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="mt-2 cursor-pointer text-sm font-medium text-gray-200 hover:text-white hover:underline"
                    >
                        Back to Login
                    </button>

                </div>

            </div>

        </div>
    )
}



export default RegisterPage;

