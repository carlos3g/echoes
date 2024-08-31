import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export const Uint8ArrayToBuffer = (uint8Array: Uint8Array): Buffer => Buffer.from(uint8Array);

export const createUuidV4 = () => uuidv4();

export const removeFileExtension = (fileName: string) => {
  const pieces = fileName.split('.');

  return pieces.slice(0, pieces.length - 1).join('.');
};

export const convertImageToWebp = async (payload: { fileName: string; buffer: Buffer }) => {
  const { buffer, fileName } = payload;

  return {
    fileName: `${removeFileExtension(fileName)}.webp`,
    buffer: await sharp(buffer).webp().toBuffer(),
  };
};
