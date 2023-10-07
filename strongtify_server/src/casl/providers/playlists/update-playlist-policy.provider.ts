import { Provider } from "@nestjs/common";
import { UpdatePlaylistHandler } from "src/casl/policies/playlists/update-playlist-policy.handler";

export const UpdatePlaylistPolicyProvider: Provider = UpdatePlaylistHandler;
