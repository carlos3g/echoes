import { FileValidator, Injectable } from '@nestjs/common';
import type { IFile } from '@nestjs/common/pipes/file/interfaces';
import sizeOf from 'image-size';

interface IFileWithBuffer extends IFile {
  buffer: Buffer;
}

@Injectable()
export class AvatarDimensionsValidationPipe extends FileValidator {
  public constructor() {
    super({});
  }

  public isValid(
    file?: IFileWithBuffer | IFileWithBuffer[] | Record<string, IFileWithBuffer[]> | undefined
  ): boolean | Promise<boolean> {
    if (!file) {
      return true;
    }

    if (Array.isArray(file)) {
      const validations = file.map(this.validateDimensions.bind(this));

      return validations.every((validation) => validation);
    }

    if (file instanceof Object && typeof file.buffer === 'undefined') {
      const validations = Object.values(file).flat().map(this.validateDimensions.bind(this));
      return validations.every((validation) => validation);
    }

    // @ts-expect-error file is IFileWithBuffer
    return this.validateDimensions(file);
  }

  public buildErrorMessage(_: any): string {
    return 'Invalid avatar dimensions. Avatar must be 1080x1080px.';
  }

  private validateDimensions(file: IFileWithBuffer): boolean {
    const dimensions = sizeOf(new Uint8Array(file.buffer));

    return dimensions.width === 1080 && dimensions.height === 1080;
  }
}
