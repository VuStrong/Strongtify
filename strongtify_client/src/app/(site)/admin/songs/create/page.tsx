import type { Metadata } from "next";

import CreateSongForm from "@/components/admin/songs/CreateSongForm";

export const metadata: Metadata = {
    title: "Create Song",
};

export default function AdminSongCreatePage() {
    return (
        <section className="mb-5">
            <h1 className="text-primary text-4xl mb-7">Create new song</h1>

            <CreateSongForm />
        </section>
    );
}
