import { Language } from "@/libs/enums";
import { Artist } from "./artist";
import { PagingQuery } from "./paging";
import { Genre } from "./genre";

export type Song = {
    id: string;
    name: string;
    alias: string;
    songUrl?: string;
    imageUrl?: string;
    length: number;
    releasedAt?: string;
    likeCount: number;
    listenCount: number;
    language?: Language;
    artists?: Artist[];
}

export type TopSong = Song & {
    listenCountInTimeRange: number;
}

export type SongDetail = {
    id: string;
    name: string;
    alias: string;
    songUrl?: string;
    imageUrl?: string;
    length: number;
    releasedAt?: string;
    likeCount: number;
    listenCount: number;
    language?: Language;
    artists?: Artist[];
    genres?: Genre[];
}

export type CudSongResponse = {
    id: string;
    name: string;
    alias: string;
    songUrl?: string;
    imageUrl?: string;
    length: number;
    releasedAt?: Date;
    likeCount: number;
    listenCount: number;
    language?: Language;
}

export type CreateUpdateSongRequest = {
    name: string;
    length?: number;
    releasedAt?: string;
    songUrl?: string;
    language: Language;
    artistIds?: string[];
    genreIds?: string[];
    image?: File;
}

export type SongQuery = PagingQuery & {
    language?: Language;
    artistId?: string;
    genreId?: string;
}