import type { Metadata } from "next";

import CreateGenreForm from "@/components/admin/genres/CreateGenreForm";

export const metadata: Metadata = {
    title: "Create Genre",
};

export default function AdminGenreCreatePage() {
    return (
        <section className="mb-5">
            <h1 className="text-primary text-4xl mb-7">Create new genre</h1>

            <CreateGenreForm />
        </section>
    );
}
