"use client";

import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface UserProfileProps {
    params: {
        id: string;
    };
}

const UserProfile = ({ params }: UserProfileProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleLogout = async () => {
        try {
            await axios.get("/api/auth/logout");
            toast.success("Logout successful");

            // Only mark the router navigation as transitional
            startTransition(() => {
                router.replace("/login");
            });
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Something went wrong. Try again!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <h2 className="text-xl font-semibold mb-6">
                User Profile: <span className="font-normal">{params.id}</span>
            </h2>

            <button
                onClick={handleLogout}
                disabled={isPending}
                className={`px-4 py-2 rounded-md text-white transition 
                  ${isPending ? "bg-gray-700 cursor-not-allowed" : "bg-black hover:bg-gray-800"}
                `}
            >
                {isPending ? "Logging out..." : "Logout"}
            </button>
        </div>
    );
};

export default UserProfile;
