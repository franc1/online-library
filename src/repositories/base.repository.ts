import { BaseModel } from 'src/models/_base.model';
import {
  FindManyOptions,
  FindOneOptions,
  IsNull,
  Not,
  ObjectID,
  Repository,
} from 'typeorm';

export class BaseRepository<T extends BaseModel> extends Repository<T> {
  findOneSafe(
    id?: string | number | Date | ObjectID,
    options?: FindOneOptions<T>,
  ): Promise<T | undefined>;
  findOneSafe(options?: FindOneOptions<T>): Promise<T | undefined>;
  findOneSafe(
    optionsOrId?: string | number | Date | ObjectID | FindOneOptions<T>,
    maybeOptions?: FindOneOptions<T>,
  ): Promise<T | undefined> {
    // todo consider relations
    let isId = false;
    if (typeof optionsOrId === 'number' || typeof optionsOrId === 'string') {
      isId = true;
      maybeOptions = this.getOptionsWithSafeWhereClause(maybeOptions);
    }

    if (typeof optionsOrId === 'object') {
      // TODO: handle date and ObjectID ???
      optionsOrId = this.getOptionsWithSafeWhereClause(
        optionsOrId as FindOneOptions,
      );
    }

    if (isId)
      return this.manager.findOne(
        this.metadata.target as string,
        optionsOrId as string | number | Date | ObjectID,
        maybeOptions,
      );
    return this.manager.findOne(
      this.metadata.target as string,
      optionsOrId as FindOneOptions<T>,
    );
  }

  findSafe(options?: FindManyOptions<T>, onlyArchived = false): Promise<T[]> {
    // todo consider relations

    options = this.getOptionsWithSafeWhereClause(options, onlyArchived);

    return this.manager.find(this.metadata.target as string, options);
  }

  findAndCountSafe(
    options?: FindManyOptions<T>,
    onlyArchived = false,
  ): Promise<[T[], number]> {
    // todo consider relations

    options = this.getOptionsWithSafeWhereClause(options, onlyArchived);

    return this.findAndCount(options);
  }

  findByIdsSafe(ids: any[], options?: FindManyOptions<T>): Promise<T[]> {
    // todo consider relations

    options = this.getOptionsWithSafeWhereClause(options);

    return this.manager.findByIds(this.metadata.target as string, ids, options);
  }

  findOneOrFailSafe(
    id?: string | number | Date | ObjectID,
    options?: FindOneOptions<T>,
  ): Promise<T>;
  findOneOrFailSafe(options?: FindOneOptions<T>): Promise<T>;
  findOneOrFailSafe(
    optionsOrId?: string | number | Date | ObjectID | FindOneOptions<T>,
    maybeOptions?: FindOneOptions<T>,
  ): Promise<T> {
    // todo consider relations

    let isId = false;
    if (typeof optionsOrId === 'number' || typeof optionsOrId === 'string') {
      isId = true;
      maybeOptions = this.getOptionsWithSafeWhereClause(maybeOptions);
    }

    if (typeof optionsOrId === 'object') {
      // TODO: handle date and ObjectID ???
      optionsOrId = this.getOptionsWithSafeWhereClause(
        optionsOrId as FindOneOptions,
      );
    }

    if (isId)
      return this.manager.findOneOrFail(
        this.metadata.target as string,
        optionsOrId as string | number | Date | ObjectID,
        maybeOptions,
      );
    return this.manager.findOneOrFail(
      this.metadata.target as string,
      optionsOrId as FindOneOptions<T>,
    );
  }

  countSafe(options?: FindManyOptions<T>): Promise<number> {
    options = this.getOptionsWithSafeWhereClause(options);

    return this.manager.count(
      this.metadata.target as string,
      options as FindManyOptions<T>,
    );
  }

  removeSafeBatch(ids: number[]): Promise<any> {
    return this.createQueryBuilder()
      .update()
      .set({
        deletedDate: () => `CURRENT_TIMESTAMP`,
      })
      .where(`id IN (:...ids)`, {
        ids,
      })
      .execute();
  }
  removeSafe(id: string, entity: BaseModel): Promise<any> {
    entity.deletedDate = new Date();
    return this.createQueryBuilder()
      .update()
      .set({ deletedDate: () => `CURRENT_TIMESTAMP` })
      .where(`id = :id`, { id })
      .execute();
  }

  private getOptionsWithSafeWhereClause(
    options: FindManyOptions<T> | FindOneOptions<T>,
    onlyArchived = false,
  ): FindManyOptions<T> | FindOneOptions<T> {
    options = options || {};
    let newWhereClause;
    if (options.where instanceof Array) {
      newWhereClause = options.where.map((conditions) =>
        Object.assign({}, conditions, {
          deletedDate: onlyArchived ? Not(IsNull()) : IsNull(),
        }),
      );
    } else {
      newWhereClause = Object.assign({}, (options as any).where || {}, {
        deletedDate: onlyArchived ? Not(IsNull()) : IsNull(),
      });
    }
    const dontIncludeDeleted = { where: newWhereClause };
    return Object.assign({}, options, dontIncludeDeleted);
  }
}
