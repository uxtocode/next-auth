import { connect } from "@/dbConfig/dbConfig"
import User from "@/models/userModal";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";


// connect to the database
connect();

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();
        const { email, password } = requestBody;

        // check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                {
                    message: "User not found."
                },
                {
                    status: 400
                }
            )
        }

        if (user) {
            // compare saved and provided password
            const validatePassword = await bcryptjs.compare(password, user.password);
            if (!validatePassword) {
                return NextResponse.json(
                    {
                        message: "Password does not match"
                    },
                    {
                        status: 400
                    }
                )
            } else {
                
                const tokenData = {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    publicId: user.publicId,
                }

                // create jwt
                const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });

                const response = NextResponse.json(
                    {
                        message: "Login Successful",
                        success: true,
                        token,
                    }
                )

                // save in cookie
                response.cookies.set("token", token, {
                    httpOnly: true
                })

                return response;
            }
        }


    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                {
                    message: "Error while login"
                },
                {
                    status: 500
                },
            )
        }

        return NextResponse.json(
            {
                message: "Error while login"
            },
            {
                status: 500
            },
        )
    }
}