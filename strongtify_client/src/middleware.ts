export { default } from "next-auth/middleware"

export const config = { 
    matcher: [
        "/success-register",
        "/collection",
        "/account/:path*",
        "/admin/:path*",
    ] 
}