import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý Users",
};

export default function AdminUserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
