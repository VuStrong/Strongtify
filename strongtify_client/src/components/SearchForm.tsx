"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { MdSearch } from "react-icons/md";

export default function SearchForm({
    value,
    searchItem,
}: {
    value?: string;
    searchItem?: string;
}) {
    const [searchText, setSearchText] = useState<string>(value ?? "");
    const router = useRouter();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!searchText) return;

        const searchQuery = encodeURIComponent(searchText);

        router.push(`/search/${searchQuery}/${searchItem ?? ""}`);
    };

    return (
        <form className="relative mb-6" onSubmit={handleSubmit}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-yellow-50">
                <MdSearch size={24} />
            </div>
            <input
                type="search"
                className="block p-4 pl-10 md:w-[400px] w-full text-sm text-gray-400 border rounded-lg bg-darkgray focus:border-primary"
                placeholder="Tìm kiếm..."
                value={searchText}
                onChange={(e) => {
                    setSearchText(e.target.value);
                }}
            />
        </form>
    );
}
