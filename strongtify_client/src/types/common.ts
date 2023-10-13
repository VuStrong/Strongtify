import { Album } from "./album";
import { Artist } from "./artist";
import { Genre } from "./genre";
import { PagedResponse } from "./paging";
import { Playlist } from "./playlist";
import { Song } from "./song";
import { User } from "./user";

export type Section = {
    title: string;
    type: "artists" | "albums" | "playlists" | "songs";
    link?: string;
    items?: Album[] | Artist[] | Song[] | Playlist[];
}

export type SearchResponse = {
    songs?: PagedResponse<Song>;
    albums?: PagedResponse<Album>;
    playlists?: PagedResponse<Playlist>;
    genres?: PagedResponse<Genre>;
    artists?: PagedResponse<Artist>;
    users?: PagedResponse<User>;
}