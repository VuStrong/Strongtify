import { Artist } from "./artist";
import { PagingQuery } from "./paging";
import { Playlist } from "./playlist";

export type Account = {
    id: string;

    createdAt: string;

    name: string;

    alias: string;

    email: string;

    imageUrl?: string;

    emailConfirmed: boolean;

    locked: boolean;

    role: "MEMBER" | "ADMIN";

    followerCount: number;

    birthDate?: string;

    gender?: "MALE" | "FEMALE" | "OTHER";

    about?: string;
}

export type User = {
    id: string;

    name: string;

    alias: string;

    imageUrl?: string;

    followerCount: number;
}

export type UserDetail = {
    id: string;

    createdAt: Date;

    name: string;

    alias: string;

    imageUrl?: string;

    followerCount: number;

    birthDate?: string;

    gender?: "MALE" | "FEMALE" | "OTHER";

    about?: string;

    playlistCount: number;
    followingUserCount: number;
    followingArtistCount: number;

    followings?: User[];
    followers?: User[];
    followingArtists?: Artist[];
    playlists?: Playlist[];
}

export type UpdateAccountRequest = {
    name?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
    birthDate?: string;
    about?: string;
    image?: File;
}

export type AccountQuery = PagingQuery & {
    emailConfirmed?: boolean;

    locked?: boolean;

    role?: "MEMBER" | "ADMIN";
}

export type UserDetailQuery = {
    followerLimit?: number;
    followingUserLimit?: number;
    followingArtistLimit?: number;
    playlistLimit?: number;
}