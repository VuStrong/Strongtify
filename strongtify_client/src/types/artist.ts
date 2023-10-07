import { Album } from "./album";
import { Song } from "./song";

export type Artist = {
    id: string;
    name: string;
    alias: string;
    imageUrl?: string;
    followerCount: number;
}

export type ArtistDetail = {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    alias: string;
    birthDate?: string;
    about?: string;
    imageUrl?: string;
    followerCount: number;
    songCount: number;
    albumCount: number;
    songs?: Song[];
    albums?: Album[];
}

export type CudArtistResponse = {
    id: string;
    name: string;
    alias: string;
    imageUrl?: string;
    followerCount: number;
    birthDate?: Date;
    about?: string;
}

export type CreateUpdateArtistRequest = {
    name: string;
    birthDate?: string;
    about?: string;
    image?: File;
}

export type ArtistDetailQuery = {
    songLimit?: number;
    albumLimit?: number;
}