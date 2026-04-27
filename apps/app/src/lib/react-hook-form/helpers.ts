export const getDirtyFields = <TReturn>(dirtyFields: object, formValues: object): TReturn => {
  if (typeof dirtyFields !== 'object' || dirtyFields === null || !formValues) {
    return {} as TReturn;
  }

  return Object.keys(dirtyFields).reduce((accumulator, key) => {
    const isDirty = dirtyFields[key];
    const value = formValues[key];

    if (Array.isArray(isDirty)) {
      // @ts-expect-error typing is not easy
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const _dirtyFields = isDirty.map((item, index) => getDirtyFields(item, value[index]));
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (_dirtyFields.length > 0) {
        // @ts-expect-error typing is not easy
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        accumulator[key] = _dirtyFields;
      }
    } else if (typeof isDirty === 'object' && isDirty !== null) {
      accumulator[key] = getDirtyFields(isDirty, value);
    } else if (isDirty) {
      accumulator[key] = value;
    }

    return accumulator;
  }, {} as TReturn);
};
