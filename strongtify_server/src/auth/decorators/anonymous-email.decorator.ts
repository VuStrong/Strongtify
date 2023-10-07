import { SetMetadata } from "@nestjs/common";

export const ANONYMOUS_EMAIL_KEY = "AnonymousEmail";
export const AnonymousEmail = () => SetMetadata(ANONYMOUS_EMAIL_KEY, true);
