import CreateArtistForm from "@/components/admin/artists/CreateArtistForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Artist",
};

export default function AdminArtistCreatePage() {
    return (
        <section className="mb-5">
            <h1 className="text-primary text-4xl mb-7">Add new artist</h1>

            <CreateArtistForm />
        </section>
    );
}
