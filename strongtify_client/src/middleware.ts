export { default } from "next-auth/middleware"

export const config = { 
    matcher: [
        "/success-register",
        "/collection/:path*",
        "/account/:path*",
        "/admin/:path*",
    ] 
}