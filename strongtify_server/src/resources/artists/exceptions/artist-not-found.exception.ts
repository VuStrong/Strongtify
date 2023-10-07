import { NotFoundException } from "@nestjs/common";

export class ArtistNotFoundException extends NotFoundException {
    constructor() {
        super(`Artist was not found.`);
    }
}
