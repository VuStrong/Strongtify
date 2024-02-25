import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý Songs",
};

export default function AdminSongLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
