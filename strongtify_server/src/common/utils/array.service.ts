import { Injectable } from "@nestjs/common";

@Injectable()
export class ArrayService {
    shuffle(array: any[]) {
        if (!array || array.length <= 1) return array;

        return array?.sort(() => Math.random() - 0.5);
    }
}
