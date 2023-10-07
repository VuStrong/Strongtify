import { NotFoundException } from "@nestjs/common";

export class GenreNotFoundException extends NotFoundException {
    constructor() {
        super(`Genre was not found.`);
    }
}
