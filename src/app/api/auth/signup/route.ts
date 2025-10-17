import { connect } from "@/dbConfig/dbConfig"
import User from "@/models/userModal";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";



connect();


export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();
        const { username, email, password } = requestBody;

        // check if use already exists
        const user = await User.findOne({ email })

        if (user) {
            return NextResponse.json(
                {
                    message: "User already exists."
                },
                {
                    status: 400
                }
            )
        }


        // hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        console.log(savedUser);

        return NextResponse.json(
            {
                message: "User Created Successfully."
            },
            {
                status: 200
            }
        )
        
        

        

    } catch (error: unknown) {
        // Narrow type to Error if possible
        if (error instanceof Error) {
            return NextResponse.json(
                { message: error.message },
                { status: 500 }
            );
        }

        // Fallback for unknown error shapes
        return NextResponse.json(
            { message: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
