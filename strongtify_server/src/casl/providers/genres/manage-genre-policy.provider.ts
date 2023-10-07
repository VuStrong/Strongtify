import { Provider } from "@nestjs/common";
import { ManageGenreHandler } from "src/casl/policies/genres/manage-genre-policy.handler";

export const ManageGenrePolicyProvider: Provider = ManageGenreHandler;
