import { Module } from "@nestjs/common";
import { CaslAbilityFactory } from "./casl-ability.factory";
import { ManageSongPolicyProvider } from "./providers/songs/manage-song-policy.provider";
import { ManageAlbumPolicyProvider } from "./providers/albums/manage-album-policy.provider";
import { ManageGenrePolicyProvider } from "./providers/genres/manage-genre-policy.provider";
import { ManageArtistPolicyProvider } from "./providers/artists/manage-artist-policy.provider";
import { UpdatePlaylistPolicyProvider } from "./providers/playlists/update-playlist-policy.provider";
import { DeletePlaylistPolicyProvider } from "./providers/playlists/delete-playlist-policy.provider";
import { ReadAccountPolicyProvider } from "./providers/users/read-account-policy.provider";
import { UpdateAccountPolicyProvider } from "./providers/users/update-account-policy.provider";
import { DeleteAccountPolicyProvider } from "./providers/users/delete-account-policy.provider";
import { ReadAdminDashboardPolicyProvider } from "./providers/read-admin-dashboard-policy.provider";

@Module({
    providers: [
        CaslAbilityFactory,
        ManageSongPolicyProvider,
        ManageAlbumPolicyProvider,
        ManageGenrePolicyProvider,
        ManageArtistPolicyProvider,
        UpdatePlaylistPolicyProvider,
        DeletePlaylistPolicyProvider,
        ReadAccountPolicyProvider,
        UpdateAccountPolicyProvider,
        DeleteAccountPolicyProvider,
        ReadAdminDashboardPolicyProvider,
    ],
    exports: [CaslAbilityFactory],
})
export class CaslModule {}
