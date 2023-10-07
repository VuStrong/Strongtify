import { Artist } from "./artist";
import { Genre } from "./genre";
import { PagingQuery } from "./paging";
import { Song } from "./song";

export type Album = {
    id: string;
    name: string;
    alias: string;
    imageUrl?: string;
    likeCount: number;
    songCount: number;
    totalLength: number;
    artist?: Artist;
}

export type AlbumDetail = {
    id: string;
    createdAt: string;
    name: string;
    alias: string;
    imageUrl?: string;
    likeCount: number;
    songCount: number;
    totalLength: number;
    artist?: Artist;
    genres?: Genre[];
    songs?: Song[];
}

export type CudAlbumResponse = {
    id: string;
    name: string;
    alias: string;
    imageUrl?: string;
    likeCount: number;
    songCount: number;
    totalLength: number;
    artistId?: string;
}

export type CreateUpdateAlbumRequest = {
    name: string;
    artistId?: string;
    genreIds?: string[];
    image?: File;
}

export type AlbumQuery = PagingQuery & {
    artistId?: string;
    genreId?: string;
}