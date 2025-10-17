import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Create the response first
        const response = NextResponse.json({
            message: "Logout successfully.",
            success: true,
        });

        // Clear the token from cookies
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
            path: "/", // important to ensure it clears the cookie at root path
        });

        // Return the response
        return response;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                {
                    message: "Something went wrong while logging out.",
                    error: error.message, // send only the error message
                },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: "Something went wrong while logging out." },
            { status: 500 }
        );
    }
}
