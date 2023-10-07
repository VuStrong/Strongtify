import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from "@nestjs/common";

@Injectable()
export class StringValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (typeof value !== "string") {
            throw new BadRequestException(`${metadata.data} must be a string`);
        }

        return value;
    }
}
