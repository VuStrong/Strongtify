import { Metadata } from "next";
import Link from "next/link";
import AlbumSection from "@/components/albums/AlbumSection";
import ArtistSection from "@/components/artists/ArtistSection";
import PlaylistSection from "@/components/playlists/PlaylistSection";
import SongSection from "@/components/songs/SongSection";
import { getHomeSections } from "@/services/api/common";
import getUserSession from "@/services/getUserSession";
import { Album } from "@/types/album";
import { Artist } from "@/types/artist";
import { Playlist } from "@/types/playlist";
import { Song } from "@/types/song";

export const metadata: Metadata = {
    title: "Strongtify",
};

export default async function Home() {
    const session = await getUserSession();
    const sections = await getHomeSections(session?.accessToken);

    return (
        <main className="flex flex-col gap-10 py-5">
            {sections?.map((section) => (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-yellow-50 text-2xl font-semibold">
                            {section.title}
                        </h3>

                        {section.link && (
                            <Link
                                href={section.link}
                                className="text-gray-500 hover:underline"
                            >
                                Hiện tất cả
                            </Link>
                        )}
                    </div>

                    {section.type === "songs" && (
                        <SongSection songs={(section.items as Song[]) ?? []} />
                    )}

                    {section.type === "albums" && (
                        <AlbumSection
                            albums={(section.items as Album[]) ?? []}
                        />
                    )}

                    {section.type === "artists" && (
                        <ArtistSection
                            artists={(section.items as Artist[]) ?? []}
                        />
                    )}

                    {section.type === "playlists" && (
                        <PlaylistSection
                            playlists={(section.items as Playlist[]) ?? []}
                        />
                    )}
                </div>
            ))}
        </main>
    );
}
