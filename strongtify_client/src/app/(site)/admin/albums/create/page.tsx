import type { Metadata } from "next";
import CreateAlbumForm from "@/components/admin/albums/CreateAlbumForm";

export const metadata: Metadata = {
    title: "Create Album",
};

export default function AdminSongCreatePage() {
    return (
        <section className="mb-5">
            <h1 className="text-primary text-4xl mb-7">Create new album</h1>

            <CreateAlbumForm />
        </section>
    );
}
