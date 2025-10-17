"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';


const SignupPage = () => {
    const router = useRouter();
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: ""
    })

    const [loading, setLoading] = useState(false);

    // signup handler
    const onSignUp = async () => {
        try {
            setLoading(true);
            await axios.post("/api/auth/signup", user);
            toast.success("Signup successfull.");
            router.push("/login");

        } catch (error: unknown) {
            // Type-safe error handling for AxiosError
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Signup failed.");
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <h1 className="mb-4 font-bold text-2xl">Signup</h1>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 items-start justify-start">
                    <label htmlFor="username">Username</label>
                    <input
                        onChange={(e) => (
                            setUser(
                                { ...user, username: e.target.value }
                            )
                        )}
                        value={user.username}
                        type="text"
                        id="username"
                        className="border border-black p-2" />
                </div>

                <div className="flex flex-col gap-1 items-start justify-start">
                    <label htmlFor="email">Email</label>
                    <input
                        onChange={(e) => (
                            setUser(
                                { ...user, email: e.target.value }
                            )
                        )}
                        value={user.email}
                        type="text"
                        id="email"
                        className="border border-black p-2" />
                </div>

                <div className="flex flex-col gap-1 items-start justify-start">
                    <label htmlFor="password">Password</label>
                    <input
                        onChange={(e) => (
                            setUser(
                                { ...user, password: e.target.value }
                            )
                        )}
                        value={user.password}
                        type="password"
                        id="password"
                        className="border border-black p-2" />
                </div>

                <div className="text-center my-6">
                    <button
                        onClick={onSignUp}
                        disabled={loading}
                        className={`w-full px-8 py-2.5 font-semibold tracking-wide transition-all duration-200 
      ${loading
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-black text-white hover:bg-black/90 active:scale-95"}
    `}
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </div>


                <div className="text-center">
                    <Link href={"/login"} className="text-center">
                        Already have an account?
                    </Link>
                </div>
            </div>
        </div>
    )
};

export default SignupPage