import { HeadLinkIcons } from "@/libs/link";
import "./globals.css";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import ToasterProvider from "@/providers/ToasterProvider";
import SessionProviderWrapper from "@/providers/SessionProvider";

const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Strongtify",
    description:
        "Strongtify - Nền tảng nghe nhạc trực tuyến miễn phí với hàng triệu bài hát, album chất lượng",
    icons: HeadLinkIcons,
    manifest: "/manifest.json",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={font.className}>
                <ToasterProvider />

                <SessionProviderWrapper>{children}</SessionProviderWrapper>
            </body>
        </html>
    );
}
