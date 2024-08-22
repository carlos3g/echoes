// see: https://www.prisma.io/docs/orm/reference/error-reference#error-codes
export enum PrismaClientErrorCode {
  UniqueConstraintFailed = 'P2000',
  RecordNotFound = 'P2025',
}
