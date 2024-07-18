import { BACKEND_API_URL } from "@/libs/constants";
import callAPI from "../callApi";
import { AdminDashboard } from "@/types/common";

export async function getDashboardData(accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/dashboard/web`, {
        accessToken
    });

    if (!response.ok) return null;

    const data = await response.json();

    return data as AdminDashboard;
}