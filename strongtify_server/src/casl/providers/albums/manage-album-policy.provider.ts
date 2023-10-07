import { Provider } from "@nestjs/common";
import { ManageAlbumHandler } from "src/casl/policies/albums/manage-album-policy.handler";

export const ManageAlbumPolicyProvider: Provider = ManageAlbumHandler;
