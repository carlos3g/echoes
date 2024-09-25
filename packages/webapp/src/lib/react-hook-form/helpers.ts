export const getDirtyFields = <TReturn>(dirtyFields: object, formValues: object): TReturn => {
  if (typeof dirtyFields !== 'object' || dirtyFields === null || !formValues) {
    return {} as TReturn;
  }

  return Object.keys(dirtyFields).reduce((accumulator, key) => {
    const isDirty = dirtyFields[key];
    const value = formValues[key];

    if (Array.isArray(isDirty)) {
      // @ts-expect-error typing is not easy
      const _dirtyFields = isDirty.map((item, index) => getDirtyFields(item, value[index]));
      if (_dirtyFields.length > 0) {
        // @ts-expect-error typing is not easy
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
