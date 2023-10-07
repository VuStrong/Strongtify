import { NotFoundException } from "@nestjs/common";

export class PlaylistNotFoundException extends NotFoundException {
    constructor() {
        super("Playlist was not found.");
    }
}
