import {
    ExecutionContext,
    NestInterceptor,
    CallHandler,
    Injectable,
} from "@nestjs/common";
import { map } from "rxjs";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { PagedResponseDto } from "../dtos/paged-response.dto";

@Injectable()
export class TransformDataInterceptor implements NestInterceptor {
    constructor(private readonly classToUse: ClassConstructor<unknown>) {}

    intercept(context: ExecutionContext, next: CallHandler) {
        return next.handle().pipe(
            map((data) => {
                if (data instanceof PagedResponseDto) {
                    data.results = plainToInstance(
                        this.classToUse,
                        data.results,
                        { excludeExtraneousValues: true },
                    );
                    return data;
                }

                return plainToInstance(this.classToUse, data, {
                    excludeExtraneousValues: true,
                });
            }),
        );
    }
}
