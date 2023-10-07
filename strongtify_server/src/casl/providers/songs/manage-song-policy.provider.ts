import { Provider } from "@nestjs/common";
import { ManageSongHandler } from "src/casl/policies/songs/manage-song-policy.handler";

export const ManageSongPolicyProvider: Provider = ManageSongHandler;
