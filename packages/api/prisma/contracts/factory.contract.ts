import * as _ from 'lodash';

export type FactoryEntityDefinition<TEntity> = { [TKey in keyof TEntity]: () => TEntity[TKey] };

export abstract class FactoryContract<TEntity extends Record<string, unknown>> {
  public abstract definition(): FactoryEntityDefinition<TEntity>;

  public make(overrides?: Partial<TEntity>): TEntity {
    const definition = this.definition();

    const pairs = Object.entries(definition) as [keyof TEntity, () => TEntity[keyof TEntity]][];

    const result: TEntity = pairs
      .map(([key, fn]) => ({
        [key]: fn(),
      }))
      .reduce((acc, curr) => ({ ...acc, ...curr }), {}) as unknown as TEntity;

    return {
      ...result,
      ...overrides,
    };
  }

  public makeMany(quantity: number, overrides?: Partial<TEntity>): TEntity[] {
    return _.range(quantity).map(() => this.make(overrides));
  }
}
