import { BACKEND_API_URL } from "@/libs/constants";
import { RegisterRequest, ResetPasswordRequest, SignInResponse } from "../../types/auth";
import callAPI from "../callApi";

export async function login(email: string, password: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/auth/login`, {
        method: "POST",
        contentType: "application/json",
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi.");
    }

    return data as SignInResponse;
}

export async function registerUser(request: RegisterRequest) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/auth/register`, {
        method: "POST",
        contentType: "application/json",
        body: JSON.stringify(request)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi.");
    }

    return data as SignInResponse;
}

export async function logout(refreshToken: string, accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/auth/logout`, {
        method: "POST",
        contentType: "application/json",
        accessToken,
        body: JSON.stringify({ refreshToken })
    });

    return response.ok;
}

export async function refreshAccessToken(userId: string, refreshToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/auth/refresh-token`, {
        method: "POST",
        contentType: "application/json",
        body: JSON.stringify({ userId, refreshToken })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi.");
    }

    return data as SignInResponse;
}

export async function confirmEmail(userId: string, token: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/auth/confirm-email`, {
        method: "POST",
        contentType: "application/json",
        body: JSON.stringify({ userId, token })
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "Đã xảy ra lỗi.");
    }

    return true;
}

export async function reSendEmailConfirmationToken(accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/auth/confirm-email-link`, {
        method: "POST",
        accessToken
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "Đã xảy ra lỗi.");
    }

    return true;
}

export async function resetPassword(request: ResetPasswordRequest) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/auth/reset-password`, {
        method: "POST",
        contentType: "application/json",
        body: JSON.stringify({ ...request })
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "Đã xảy ra lỗi.");
    }

    return true;
}

export async function sendPasswordResetToken(email: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/auth/reset-password-link`, {
        method: "POST",
        contentType: "application/json",
        body: JSON.stringify({ email })
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "Đã xảy ra lỗi.");
    }

    return true;
}

