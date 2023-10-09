import { useEffect, useMemo, useState } from "react";
import { Song } from "@/types/song";
import { getSongById } from "@/services/api/songs";

const useGetSongById = (id?: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [song, setSong] = useState<Song | undefined>(undefined);

    useEffect(() => {
        if (!id) {
            return;
        }

        setIsLoading(true);

        const fetchSong = async () => {
            const data = await getSongById(id);

            if (data) {
                setSong(data as Song);
            }

            setIsLoading(false);
        };

        fetchSong();
    }, [id]);

    return useMemo(
        () => ({
            isLoading,
            song,
        }),
        [isLoading, song],
    );
};

export default useGetSongById;
