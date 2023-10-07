import { Role } from "@prisma/client";

export type JwtPayload = {
    sub: string;
    email: string;
    role: Role;
    emailConfirmed: boolean;
    locked: boolean;
};
