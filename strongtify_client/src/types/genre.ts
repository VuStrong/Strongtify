import { Album } from "./album";
import { Song } from "./song";

export type Genre = {
    id: string;
    name: string;
    alias: string;
    imageUrl?: string;
}

export type GenreDetail = {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    alias: string;
    description?: string;
    imageUrl?: string;
    songs?: Song[];
    albums?: Album[];
}

export type CudGenreResponse = {
    id: string;
    name: string;
    alias: string;
    imageUrl?: string;
    description?: string;
}

export type CreateUpdateGenreRequest = {
    name: string;
    description?: string;
    image?: File;
}

export type GenreDetailQuery = {
    songLimit?: number;
    albumLimit?: number;
}