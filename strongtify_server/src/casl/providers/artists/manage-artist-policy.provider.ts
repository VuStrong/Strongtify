import { Provider } from "@nestjs/common";
import { ManageArtistHandler } from "src/casl/policies/artists/manage-artist-policy.handler";

export const ManageArtistPolicyProvider: Provider = ManageArtistHandler;
