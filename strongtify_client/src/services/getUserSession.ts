import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";

export default async function getUserSession() {
    try {
        const session = await getServerSession(authOptions);

        return session;
    } catch (error) {
        return null;
    }
}