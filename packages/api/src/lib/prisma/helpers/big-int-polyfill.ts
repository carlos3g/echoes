// see: https://github.com/prisma/studio/issues/614
// see: https://stackoverflow.com/a/76013128/13274020
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, func-names
(BigInt.prototype as any).toJSON = function () {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const int = Number.parseInt(this.toString(), 10);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return int ?? this.toString();
};
