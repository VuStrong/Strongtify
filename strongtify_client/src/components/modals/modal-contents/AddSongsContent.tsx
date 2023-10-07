"use client";

import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import useDebounce from "@/hooks/useDebounce";
import { searchSongs } from "@/services/api/songs";
import { Song } from "@/types/song";
import SongItem from "@/components/songs/SongItem";
import AddButton from "@/components/buttons/AddButton";

export default function AddSongsContent({
    onAdd,
}: {
    onAdd: (song: Song) => Promise<void>;
}) {
    const [end, setEnd] = useState<boolean>(false);
    const [skip, setSkip] = useState<number>(0);
    const [searchText, setSearchText] = useState<string>("");
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [songs, setSongs] = useState<Song[]>();

    const searchValue = useDebounce(searchText, 1000);

    useEffect(() => {
        const search = async () => {
            setIsSearching(true);

            const data = await searchSongs(searchValue, {
                skip: 0,
                take: 10,
            });

            setSongs(data?.results);
            setSkip(0);
            setEnd(data?.end ?? true);
            setIsSearching(false);
        };

        search();
    }, [searchValue]);

    const fetchMoreSong = async () => {
        const data = await searchSongs(searchValue, {
            skip: skip + 10,
            take: 10,
        });

        setSongs([...(songs ?? []), ...(data?.results ?? [])]);
        setSkip(skip + 10);
        setEnd(data?.end ?? true);
    };

    return (
        <div className="px-4 py-3 sm:px-6">
            <h3
                className="font-semibold leading-6 text-yellow-50 text-xl mb-2"
                id="modal-title"
            >
                Thêm bài hát
            </h3>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MdSearch size={24} />
                </div>
                <input
                    type="search"
                    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:border-primary"
                    placeholder="Tìm kiếm bài hát..."
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                    }}
                />
            </div>

            <div
                className="overflow-y-auto max-h-[300px] my-3"
                id="scrollableAddSong"
            >
                {isSearching && (
                    <Skeleton
                        count={5}
                        highlightColor="#f58c1b"
                        baseColor="#121212"
                    />
                )}

                {!isSearching && (
                    <InfiniteScroll
                        dataLength={skip + 10}
                        next={fetchMoreSong}
                        hasMore={!end}
                        loader={
                            <div className="flex justify-center">
                                <BeatLoader color="#f58c1b" />
                            </div>
                        }
                        scrollableTarget="scrollableAddSong"
                    >
                        {songs?.map((song, index) => (
                            <SongItem
                                key={index}
                                song={song}
                                actionLabel={
                                    <AddButton
                                        size={20}
                                        onClick={async () => {
                                            await onAdd(song);
                                        }}
                                    />
                                }
                            />
                        ))}
                    </InfiniteScroll>
                )}
            </div>
        </div>
    );
}