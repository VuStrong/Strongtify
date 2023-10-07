import { Account } from "./user";

export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
}

export type ResetPasswordRequest = {
    userId: string;
    newPassword: string;
    token: string
}

export type SignInResponse = {
    access_token: string;

    refresh_token: string;

    user?: Account;
}