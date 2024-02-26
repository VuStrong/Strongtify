'use client'

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Popup from "reactjs-popup";
import { SlOptionsVertical } from "react-icons/sl";
import { 
    FaCopy,
    FaArrowAltCircleDown,
    FaPlusCircle,
} from "react-icons/fa";
import { MdFavoriteBorder, MdFavorite, MdSearch } from "react-icons/md";
import { useSession } from "next-auth/react";
import useRecentPlaylists from "@/hooks/useRecentPlaylists";
import { addSongsToPlaylist, getPlaylists } from "@/services/api/playlists";
import { Song } from "@/types/song";
import useFavs from "@/hooks/useFavs";
import { likeSong, unLikeSong } from "@/services/api/me";
import useDebounce from "@/hooks/useDebounce";
import { Playlist } from "@/types/playlist";
import { ClipLoader } from "react-spinners";

export default function SongMenuPopup({
    song,
    anotherOptions,
}: {
    song: Song,
    anotherOptions?: (close: () => void) => React.ReactNode[]
}) {
    const [tab, setTab] = useState<'root' | 'playlists'>('root');
    const favs = useFavs();
    const { data: session, status } = useSession();

    const onClickCopyLink = useCallback(() => {
        navigator.clipboard.writeText(
            `https://${window.location.hostname}/songs/${song.alias}/${song.id}`,
        );
        toast.success("Đã copy link bài hát");
    }, []);

    const onAddToPlaylist = useCallback(async (playlistId: string) => {
        const addTask = async () => {
            await addSongsToPlaylist(
                playlistId,
                [song.id],
                session?.accessToken ?? "",
            );
        };

        toast.promise(addTask(), {
            loading: "Đang thêm bài hát",
            success: "Đã thêm bài hát vào danh sách phát",
            error: (e) => {
                return e.message;
            },
        });
    }, [session?.accessToken]);

    const onClickLike = useCallback((liked: boolean) => {
        if (status === "unauthenticated") {
            toast("Thích ư?, hãy đăng nhập trước đã", { icon: "🤨" });
            return;
        }

        if (status === "loading" || favs.isLoading) {
            console.log(status);
            console.log(favs.isLoading);
            
            return;
        }

        if (liked) {
            unLikeSong(song.id, session?.accessToken ?? "");
            
            favs.removeLikedSongId(song.id);
            
            toast.success("Đã xóa khỏi danh sách bài hát đã thích");
        } else {
            likeSong(song.id, session?.accessToken ?? "");

            favs.addLikedSongId(song.id);

            toast.success("Đã thêm vào danh sách bài hát đã thích");
        }
    }, [session?.accessToken, status, favs]);

    const getTabContent = (close: () => void) => {
        if (tab === "playlists") {
            return (
                <AddToPlaylistContent
                    onAddToPlaylist={onAddToPlaylist}
                    close={close}
                />
            )
        }

        const liked = favs.likedSongIds.has(song.id);

        return (
            <div className="bg-gray-800 rounded-md shadow-md shadow-gray-900 flex flex-col w-[300px]">
                {anotherOptions && anotherOptions(close)}

                <button
                    onClick={() => {
                        onClickLike(liked);
                        close();
                    }}
                    className="hover:bg-gray-700 p-3 flex items-center gap-3 text-white"
                >
                    {liked ? <MdFavorite /> : <MdFavoriteBorder />}
                    {liked ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
                </button>

                <button
                    onClick={() => setTab('playlists')}
                    className="hover:bg-gray-700 p-3 flex items-center gap-3 text-white"
                >
                    <FaPlusCircle />
                    Thêm vào danh sách phát
                </button>

                <button 
                    onClick={() => {
                        onClickCopyLink();
                        close();
                    }} 
                    className="hover:bg-gray-700 p-3 flex items-center gap-3 text-white"
                >
                    <FaCopy />
                    Copy link bài hát
                </button>

                <a
                    href={song.songUrl ?? "#"}
                    target="_blank"
                    onClick={close} 
                    className="hover:bg-gray-700 p-3 flex items-center gap-3 text-white"
                >
                    <FaArrowAltCircleDown />
                    Tải về bài hát
                </a>
            </div>
        )
    };

    return (
        <Popup
            trigger={<button><SlOptionsVertical /></button>}
            on="click"
            position="left top"
            closeOnDocumentClick
            onOpen={ () => setTab('root') }
            onClose={ () => setTab('root') }
            arrow={false}
        >
            {((close: any) => 
                getTabContent(close)
            ) as unknown as React.ReactNode}
        </Popup>
    );
}

function AddToPlaylistContent({
    close,
    onAddToPlaylist,
}: {
    close: () => void,
    onAddToPlaylist: (playlistId: string) => void
}) {
    const { playlists: recentPlaylists } = useRecentPlaylists();
    const { data: session } = useSession();

    const [searchedPlaylists, setSearchedPlaylists] = useState<Playlist[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const searchValue = useDebounce(searchText, 1000);

    useEffect(() => {
        const search = async () => {
            setIsSearching(true);

            const data = await getPlaylists({
                skip: 0,
                take: 5,
                q: searchValue,
                userId: session?.user.id ?? '',
                sort: "createdAt_desc",
            }, session?.accessToken);

            setSearchedPlaylists(data?.results ?? []);
            setIsSearching(false);
        };

        if (searchValue) search();
    }, [searchValue]);
    
    return (
        <div className="bg-gray-800 rounded-md shadow-md shadow-gray-900 flex flex-col w-[300px]">
            <div className="relative p-4">
                <div className="absolute inset-y-0 left-5 flex items-center pl-3 pointer-events-none text-black">
                    <MdSearch size={24} />
                </div>
                <input
                    type="search"
                    className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:border-primary"
                    placeholder="Tìm kiếm danh sách phát..."
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                    }}
                />
            </div>
            
            <div className="text-primary text-center py-1">Chọn 1 danh sách phát</div>

            {isSearching && (
                <div className="flex justify-center">
                    <ClipLoader color="#f58c1b" />
                </div>
            )}
                
            {!isSearching && recentPlaylists.length === 0 && (
                <div className="p-5 text-white">Không có danh sách phát</div>
            )}

            {!isSearching && (searchValue ? searchedPlaylists.map(playlist => (
                <button 
                    onClick={() => {
                        onAddToPlaylist(playlist.id);
                        close();
                    }} 
                    className="hover:bg-gray-700 py-3 px-4 text-left truncate text-white"
                >
                    {playlist.name}
                </button>
            )) : recentPlaylists.map(playlist => (
                <button 
                    onClick={() => {
                        onAddToPlaylist(playlist.id);
                        close();
                    }} 
                    className="hover:bg-gray-700 py-3 px-4 text-left truncate text-white"
                >
                    {playlist.name}
                </button>
            )))}
        </div>
    );
}