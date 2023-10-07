import { NotFoundException } from "@nestjs/common";

export class AlbumNotFoundException extends NotFoundException {
    constructor() {
        super(`Album was not found.`);
    }
}
