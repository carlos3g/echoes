import { FileEntity } from '@app/storage/entities/file.entity';
import type { File as PrismaFile } from '@prisma/client';

export const prismaFileToFileAdapter = (input: PrismaFile) =>
  new FileEntity({
    ...input,
    id: Number(input.id),
  });
