import { authOptions } from "@/libs/auth";
import NextAuth from "next-auth/next";

export default NextAuth(authOptions);