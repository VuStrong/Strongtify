import { Provider } from "@nestjs/common";
import { DeletePlaylistHandler } from "src/casl/policies/playlists/delete-playlist-policy.handler";

export const DeletePlaylistPolicyProvider: Provider = DeletePlaylistHandler;
