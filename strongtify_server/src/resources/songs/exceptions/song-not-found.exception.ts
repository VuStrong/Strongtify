import { NotFoundException } from "@nestjs/common";

export class SongNotFoundException extends NotFoundException {
    constructor() {
        super("Song was not found.");
    }
}
