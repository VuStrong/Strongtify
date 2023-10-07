/** @type {import('next').NextConfig} */
const nextConfig = {
    images: { 
        domains: [
            'localhost:3000',
            'res.cloudinary.com', 
            'avatars.githubusercontent.com',
            'lh3.googleusercontent.com',
            'platform-lookaside.fbsbx.com'
        ],
    },
}

module.exports = nextConfig
