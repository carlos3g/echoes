import { v4 as uuidv4 } from 'uuid';

export const Uint8ArrayToBuffer = (uint8Array: Uint8Array): Buffer => Buffer.from(uint8Array);

export const createUuidV4 = () => uuidv4();
