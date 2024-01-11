import NextAuth from "next-auth"
import { Account } from "./user";

declare module "next-auth" {
    interface Session {
        user: SessionUser;
        accessToken: string;
        refreshToken: string;
        accessTokenExpiry: Date;
        error?: string;
    }
}

declare module "next-auth" {
    interface User {
        access_token: string;
        refresh_token: string;
        user?: Account
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken: string;
        refreshToken: string;
        accessTokenExpiry: Date;
        error?: string;
        id: string;
        role: "ADMIN" | "MEMBER";
    }
}

export type SessionUser = {
    id: string
    role: "ADMIN" | "MEMBER"
}