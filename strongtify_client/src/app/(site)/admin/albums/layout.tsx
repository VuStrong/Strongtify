import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý Albums",
};

export default function AdminAlbumLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}