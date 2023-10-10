import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý Artists",
};

export default function AdminArtistLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}