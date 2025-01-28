// Import necessary modules
import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db";
import { connectMongoDB } from "@/lib/mongodb";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/users";

// Utility function to retrieve Google credentials
function getGoogleCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId) {
        throw new Error("Missing GOOGLE_CLIENT_ID");
    }

    if (!clientSecret) {
        throw new Error("Missing GOOGLE_CLIENT_SECRET");
    }

    return { clientId, clientSecret };
}
// NextAuth configuration
export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }

            // If token doesn't have an id and user is defined, retrieve user from database
            if (!token.id && user?.email) {
                await connectMongoDB();
                const dbUser = await User.findOne({ email: user.email }).lean<{ _id: string; name: string; email: string; image?: string }>();
                if (dbUser) {
                    token.id = dbUser._id;
                    token.name = dbUser.name;
                    token.email = dbUser.email;
                    token.picture = dbUser.image;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id as string,
                    name: token.name as string,
                    email: token.email as string,
                    image: token.picture as string,
                };
            }
            return session;
        },
        redirect() {
            return "/application";
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};