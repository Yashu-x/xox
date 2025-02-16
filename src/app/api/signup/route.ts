import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import { hashPassword } from '@/lib/hashing';
import User from '@/models/users';

export async function POST(req: Request) {
    try {
        // Parse the request body
        const { email, password, name } = await req.json();

        // Validate required fields
        if (!email || !password || !name) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        await connectMongoDB();

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 409 }
            );
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a new user
        const user = new User({ email, password: hashedPassword, name });
        await user.save();

        // Return success response
        return NextResponse.json(
            { message: 'User created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}