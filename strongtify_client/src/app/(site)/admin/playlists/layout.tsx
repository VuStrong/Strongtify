import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý Playlists",
};

export default function AdminPlaylistLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
