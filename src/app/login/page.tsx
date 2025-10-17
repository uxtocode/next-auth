"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { jwtDecode } from "jwt-decode";

interface TokenData {
  id: string;
  username: string;
  email: string;
  publicId: string;
  iat?: number; // issued at
  exp?: number; // expiry
}


const LoginPage = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)

  // signup handler
  const onLogin = async () => {
    try {
      setLoading(true);

      const res = await axios.post("/api/auth/login", user); // <-- capture response here

      if (res.data.success) {
        const token = res.data.token;
        const decoded = jwtDecode<TokenData>(token);
        toast.success("Login successful");
        router.push(`/u/${decoded.publicId}`); // navigate using user ID
      } else {
        toast.error(res.data.message || "Login failed");
      }

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "login failed")
      } else if (error instanceof Error) {
        toast.error(error.message || "login failed")
      } else {
        toast.error("Something went wrong!")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="mb-4 font-bold text-2xl">Login</h1>
      <div className="flex flex-col gap-4">
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
            onClick={onLogin}
            disabled={loading}
            className={`w-full px-8 py-2.5 font-semibold tracking-wide transition-all duration-200 
      ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-black/90 active:scale-95"}
    `}
          >
            {loading ? "Loggin In..." : "Log In"}
          </button>
        </div>

        <div className="text-center">
          <Link href={"/signup"} className="text-center">
            Not have an account?
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage