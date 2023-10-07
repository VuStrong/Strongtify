import { PagingQuery } from "./paging";
import { Song } from "./song";
import { User } from "./user";

export type Playlist = {
    id: string;
    name: string;
    alias: string;
    imageUrl?: string;
    likeCount: number;
    songCount: number;
    totalLength: number;
    user: User;
    status: "PUBLIC" | "PRIVATE";
}

export type PlaylistDetail = {
    id: string;
    createdAt: string;
    name: string;
    alias: string;
    description?: string;
    imageUrl?: string;
    likeCount: number;
    songCount: number;
    totalLength: number;
    user: User;
    status: "PUBLIC" | "PRIVATE";
    songs?: Song[];
}

export type CreateUpdatePlaylistRequest = {
    name: string;
    description?: string;
    status: "PUBLIC" | "PRIVATE";
    image?: File;
}

export type CudPlaylistResponse = {
    id: string;
    name: string;
    alias: string;
    description?: string;
    imageUrl?: string;
    likeCount: number;
    songCount: number;
    totalLength: number;
    userId: string;
    status: "PUBLIC" | "PRIVATE";
}

export type PlaylistQuery = PagingQuery & {
    userId?: string;
    status?: "PUBLIC" | "PRIVATE";
}