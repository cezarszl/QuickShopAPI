import { Injectable } from "@nestjs/common";
import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { PrismaService } from "prisma/prisma.service";

@ValidatorConstraint({ name: 'IsUnique', async: true })
@Injectable()
export class IsUniqueValidator implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) { }

    async validate(value: any, args: any): Promise<boolean> {
        const [model, field] = args.constraints;

        const modelInstance = (this.prisma as any)[model];
        if (!modelInstance || typeof modelInstance.findUnique !== 'function') {
            throw new Error(`Model ${model} is not valid.`);
        }

        const record = await modelInstance.findUnique({
            where: { [field]: value },
        });

        return !record;
    }

    defaultMessage(args: any): string {
        const [model, field] = args.constraints;
        return `${field} must be unique in ${model}.`;
    }
}
