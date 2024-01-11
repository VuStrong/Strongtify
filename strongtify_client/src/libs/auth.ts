import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { login, refreshAccessToken } from "@/services/api/auth";
import { getAccount } from "@/services/api/me";
import { SignInResponse } from "@/types/auth";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error("Email hoặc mật khẩu không phù hợp");
                }

                const response = await login(credentials?.email, credentials?.password);

                return response as any;
            },
        }),
        CredentialsProvider({
            id: 'access-token',
            name: 'Token Auth',
            credentials: {
                accessToken: { type: 'text' },
                refreshToken: { type: 'text' },
            },
            async authorize(credentials) {
                if (!credentials?.accessToken) {
                    throw new Error("Access Token không phù hợp");
                }

                const user = await getAccount(credentials.accessToken);

                return {
                    user,
                    access_token: credentials.accessToken,
                    refresh_token: credentials.refreshToken,
                } as any;
            },
        })
    ],
    callbacks: {
        jwt: async ({ 
            token, user,
        }: { 
            token: JWT, 
            user: SignInResponse, 
        }) => {
            if (user) {
                token.accessToken = user.access_token;
                token.refreshToken = user.refresh_token;

                // set expire time to 25 minutes later
                const now = new Date();
                now.setMinutes(now.getMinutes() + 25);
                token.accessTokenExpiry = now;
                
                token.id = user.user?.id ?? "";
                token.role = user.user?.role ?? "MEMBER";
            }
            
            const shouldRefresh = new Date(token.accessTokenExpiry) < new Date();
            
            if (!shouldRefresh) {
                return Promise.resolve(token);
            }

            try {
                token.accessToken = (await refreshAccessToken(token.id, token.refreshToken)).access_token;

                // set expire time to 25 minutes later
                const now = new Date();
                now.setMinutes(now.getMinutes() + 25);
                token.accessTokenExpiry = now;
            } catch (error) {
                token.error = "RefreshAccessTokenError";
            }

            return Promise.resolve(token);
        },
        session: async ({ session, token }) => {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;

                session.accessToken = token.accessToken;
                session.refreshToken = token.refreshToken;
                session.accessTokenExpiry = token.accessTokenExpiry;
                session.error = token.error;
            }

            return Promise.resolve(session);
        },
    },
    pages: {
        signIn: '/login'
    },
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET
}