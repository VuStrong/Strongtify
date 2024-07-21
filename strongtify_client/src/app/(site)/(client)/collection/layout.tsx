import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Strongtify - Bộ sưu tập",
};

export default function CollectionPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
