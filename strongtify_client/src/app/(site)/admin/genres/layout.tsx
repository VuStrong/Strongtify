import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý Genres",
};

export default function AdminGenreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}