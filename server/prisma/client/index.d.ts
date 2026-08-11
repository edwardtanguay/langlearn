
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Version
 * 
 */
export type Version = $Result.DefaultSelection<Prisma.$VersionPayload>
/**
 * Model VersionCategory
 * 
 */
export type VersionCategory = $Result.DefaultSelection<Prisma.$VersionCategoryPayload>
/**
 * Model VersionCategoryAbbreviation
 * 
 */
export type VersionCategoryAbbreviation = $Result.DefaultSelection<Prisma.$VersionCategoryAbbreviationPayload>
/**
 * Model VersionItem
 * 
 */
export type VersionItem = $Result.DefaultSelection<Prisma.$VersionItemPayload>
/**
 * Model Flashcard
 * 
 */
export type Flashcard = $Result.DefaultSelection<Prisma.$FlashcardPayload>
/**
 * Model UserFlashcardActivity
 * 
 */
export type UserFlashcardActivity = $Result.DefaultSelection<Prisma.$UserFlashcardActivityPayload>
/**
 * Model Tag
 * 
 */
export type Tag = $Result.DefaultSelection<Prisma.$TagPayload>
/**
 * Model FlashcardTag
 * 
 */
export type FlashcardTag = $Result.DefaultSelection<Prisma.$FlashcardTagPayload>
/**
 * Model MobileImport
 * 
 */
export type MobileImport = $Result.DefaultSelection<Prisma.$MobileImportPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.version`: Exposes CRUD operations for the **Version** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Versions
    * const versions = await prisma.version.findMany()
    * ```
    */
  get version(): Prisma.VersionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.versionCategory`: Exposes CRUD operations for the **VersionCategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VersionCategories
    * const versionCategories = await prisma.versionCategory.findMany()
    * ```
    */
  get versionCategory(): Prisma.VersionCategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.versionCategoryAbbreviation`: Exposes CRUD operations for the **VersionCategoryAbbreviation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VersionCategoryAbbreviations
    * const versionCategoryAbbreviations = await prisma.versionCategoryAbbreviation.findMany()
    * ```
    */
  get versionCategoryAbbreviation(): Prisma.VersionCategoryAbbreviationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.versionItem`: Exposes CRUD operations for the **VersionItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VersionItems
    * const versionItems = await prisma.versionItem.findMany()
    * ```
    */
  get versionItem(): Prisma.VersionItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.flashcard`: Exposes CRUD operations for the **Flashcard** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Flashcards
    * const flashcards = await prisma.flashcard.findMany()
    * ```
    */
  get flashcard(): Prisma.FlashcardDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userFlashcardActivity`: Exposes CRUD operations for the **UserFlashcardActivity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserFlashcardActivities
    * const userFlashcardActivities = await prisma.userFlashcardActivity.findMany()
    * ```
    */
  get userFlashcardActivity(): Prisma.UserFlashcardActivityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tag`: Exposes CRUD operations for the **Tag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tags
    * const tags = await prisma.tag.findMany()
    * ```
    */
  get tag(): Prisma.TagDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.flashcardTag`: Exposes CRUD operations for the **FlashcardTag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FlashcardTags
    * const flashcardTags = await prisma.flashcardTag.findMany()
    * ```
    */
  get flashcardTag(): Prisma.FlashcardTagDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mobileImport`: Exposes CRUD operations for the **MobileImport** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MobileImports
    * const mobileImports = await prisma.mobileImport.findMany()
    * ```
    */
  get mobileImport(): Prisma.MobileImportDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Version: 'Version',
    VersionCategory: 'VersionCategory',
    VersionCategoryAbbreviation: 'VersionCategoryAbbreviation',
    VersionItem: 'VersionItem',
    Flashcard: 'Flashcard',
    UserFlashcardActivity: 'UserFlashcardActivity',
    Tag: 'Tag',
    FlashcardTag: 'FlashcardTag',
    MobileImport: 'MobileImport'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "version" | "versionCategory" | "versionCategoryAbbreviation" | "versionItem" | "flashcard" | "userFlashcardActivity" | "tag" | "flashcardTag" | "mobileImport"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Version: {
        payload: Prisma.$VersionPayload<ExtArgs>
        fields: Prisma.VersionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VersionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VersionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionPayload>
          }
          findFirst: {
            args: Prisma.VersionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VersionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionPayload>
          }
          findMany: {
            args: Prisma.VersionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionPayload>[]
          }
          create: {
            args: Prisma.VersionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionPayload>
          }
          createMany: {
            args: Prisma.VersionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VersionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionPayload>[]
          }
          delete: {
            args: Prisma.VersionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionPayload>
          }
          update: {
            args: Prisma.VersionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionPayload>
          }
          deleteMany: {
            args: Prisma.VersionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VersionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VersionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionPayload>[]
          }
          upsert: {
            args: Prisma.VersionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionPayload>
          }
          aggregate: {
            args: Prisma.VersionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVersion>
          }
          groupBy: {
            args: Prisma.VersionGroupByArgs<ExtArgs>
            result: $Utils.Optional<VersionGroupByOutputType>[]
          }
          count: {
            args: Prisma.VersionCountArgs<ExtArgs>
            result: $Utils.Optional<VersionCountAggregateOutputType> | number
          }
        }
      }
      VersionCategory: {
        payload: Prisma.$VersionCategoryPayload<ExtArgs>
        fields: Prisma.VersionCategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VersionCategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VersionCategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryPayload>
          }
          findFirst: {
            args: Prisma.VersionCategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VersionCategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryPayload>
          }
          findMany: {
            args: Prisma.VersionCategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryPayload>[]
          }
          create: {
            args: Prisma.VersionCategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryPayload>
          }
          createMany: {
            args: Prisma.VersionCategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VersionCategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryPayload>[]
          }
          delete: {
            args: Prisma.VersionCategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryPayload>
          }
          update: {
            args: Prisma.VersionCategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryPayload>
          }
          deleteMany: {
            args: Prisma.VersionCategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VersionCategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VersionCategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryPayload>[]
          }
          upsert: {
            args: Prisma.VersionCategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryPayload>
          }
          aggregate: {
            args: Prisma.VersionCategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVersionCategory>
          }
          groupBy: {
            args: Prisma.VersionCategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<VersionCategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.VersionCategoryCountArgs<ExtArgs>
            result: $Utils.Optional<VersionCategoryCountAggregateOutputType> | number
          }
        }
      }
      VersionCategoryAbbreviation: {
        payload: Prisma.$VersionCategoryAbbreviationPayload<ExtArgs>
        fields: Prisma.VersionCategoryAbbreviationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VersionCategoryAbbreviationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryAbbreviationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VersionCategoryAbbreviationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryAbbreviationPayload>
          }
          findFirst: {
            args: Prisma.VersionCategoryAbbreviationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryAbbreviationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VersionCategoryAbbreviationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryAbbreviationPayload>
          }
          findMany: {
            args: Prisma.VersionCategoryAbbreviationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryAbbreviationPayload>[]
          }
          create: {
            args: Prisma.VersionCategoryAbbreviationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryAbbreviationPayload>
          }
          createMany: {
            args: Prisma.VersionCategoryAbbreviationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VersionCategoryAbbreviationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryAbbreviationPayload>[]
          }
          delete: {
            args: Prisma.VersionCategoryAbbreviationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryAbbreviationPayload>
          }
          update: {
            args: Prisma.VersionCategoryAbbreviationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryAbbreviationPayload>
          }
          deleteMany: {
            args: Prisma.VersionCategoryAbbreviationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VersionCategoryAbbreviationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VersionCategoryAbbreviationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryAbbreviationPayload>[]
          }
          upsert: {
            args: Prisma.VersionCategoryAbbreviationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionCategoryAbbreviationPayload>
          }
          aggregate: {
            args: Prisma.VersionCategoryAbbreviationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVersionCategoryAbbreviation>
          }
          groupBy: {
            args: Prisma.VersionCategoryAbbreviationGroupByArgs<ExtArgs>
            result: $Utils.Optional<VersionCategoryAbbreviationGroupByOutputType>[]
          }
          count: {
            args: Prisma.VersionCategoryAbbreviationCountArgs<ExtArgs>
            result: $Utils.Optional<VersionCategoryAbbreviationCountAggregateOutputType> | number
          }
        }
      }
      VersionItem: {
        payload: Prisma.$VersionItemPayload<ExtArgs>
        fields: Prisma.VersionItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VersionItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VersionItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionItemPayload>
          }
          findFirst: {
            args: Prisma.VersionItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VersionItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionItemPayload>
          }
          findMany: {
            args: Prisma.VersionItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionItemPayload>[]
          }
          create: {
            args: Prisma.VersionItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionItemPayload>
          }
          createMany: {
            args: Prisma.VersionItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VersionItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionItemPayload>[]
          }
          delete: {
            args: Prisma.VersionItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionItemPayload>
          }
          update: {
            args: Prisma.VersionItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionItemPayload>
          }
          deleteMany: {
            args: Prisma.VersionItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VersionItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VersionItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionItemPayload>[]
          }
          upsert: {
            args: Prisma.VersionItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VersionItemPayload>
          }
          aggregate: {
            args: Prisma.VersionItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVersionItem>
          }
          groupBy: {
            args: Prisma.VersionItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<VersionItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.VersionItemCountArgs<ExtArgs>
            result: $Utils.Optional<VersionItemCountAggregateOutputType> | number
          }
        }
      }
      Flashcard: {
        payload: Prisma.$FlashcardPayload<ExtArgs>
        fields: Prisma.FlashcardFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FlashcardFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FlashcardFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          findFirst: {
            args: Prisma.FlashcardFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FlashcardFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          findMany: {
            args: Prisma.FlashcardFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>[]
          }
          create: {
            args: Prisma.FlashcardCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          createMany: {
            args: Prisma.FlashcardCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FlashcardCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>[]
          }
          delete: {
            args: Prisma.FlashcardDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          update: {
            args: Prisma.FlashcardUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          deleteMany: {
            args: Prisma.FlashcardDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FlashcardUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FlashcardUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>[]
          }
          upsert: {
            args: Prisma.FlashcardUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          aggregate: {
            args: Prisma.FlashcardAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFlashcard>
          }
          groupBy: {
            args: Prisma.FlashcardGroupByArgs<ExtArgs>
            result: $Utils.Optional<FlashcardGroupByOutputType>[]
          }
          count: {
            args: Prisma.FlashcardCountArgs<ExtArgs>
            result: $Utils.Optional<FlashcardCountAggregateOutputType> | number
          }
        }
      }
      UserFlashcardActivity: {
        payload: Prisma.$UserFlashcardActivityPayload<ExtArgs>
        fields: Prisma.UserFlashcardActivityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFlashcardActivityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardActivityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFlashcardActivityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardActivityPayload>
          }
          findFirst: {
            args: Prisma.UserFlashcardActivityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardActivityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFlashcardActivityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardActivityPayload>
          }
          findMany: {
            args: Prisma.UserFlashcardActivityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardActivityPayload>[]
          }
          create: {
            args: Prisma.UserFlashcardActivityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardActivityPayload>
          }
          createMany: {
            args: Prisma.UserFlashcardActivityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserFlashcardActivityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardActivityPayload>[]
          }
          delete: {
            args: Prisma.UserFlashcardActivityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardActivityPayload>
          }
          update: {
            args: Prisma.UserFlashcardActivityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardActivityPayload>
          }
          deleteMany: {
            args: Prisma.UserFlashcardActivityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserFlashcardActivityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserFlashcardActivityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardActivityPayload>[]
          }
          upsert: {
            args: Prisma.UserFlashcardActivityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardActivityPayload>
          }
          aggregate: {
            args: Prisma.UserFlashcardActivityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserFlashcardActivity>
          }
          groupBy: {
            args: Prisma.UserFlashcardActivityGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserFlashcardActivityGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserFlashcardActivityCountArgs<ExtArgs>
            result: $Utils.Optional<UserFlashcardActivityCountAggregateOutputType> | number
          }
        }
      }
      Tag: {
        payload: Prisma.$TagPayload<ExtArgs>
        fields: Prisma.TagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          findFirst: {
            args: Prisma.TagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          findMany: {
            args: Prisma.TagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          create: {
            args: Prisma.TagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          createMany: {
            args: Prisma.TagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TagCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          delete: {
            args: Prisma.TagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          update: {
            args: Prisma.TagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          deleteMany: {
            args: Prisma.TagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TagUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          upsert: {
            args: Prisma.TagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          aggregate: {
            args: Prisma.TagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTag>
          }
          groupBy: {
            args: Prisma.TagGroupByArgs<ExtArgs>
            result: $Utils.Optional<TagGroupByOutputType>[]
          }
          count: {
            args: Prisma.TagCountArgs<ExtArgs>
            result: $Utils.Optional<TagCountAggregateOutputType> | number
          }
        }
      }
      FlashcardTag: {
        payload: Prisma.$FlashcardTagPayload<ExtArgs>
        fields: Prisma.FlashcardTagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FlashcardTagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardTagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FlashcardTagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardTagPayload>
          }
          findFirst: {
            args: Prisma.FlashcardTagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardTagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FlashcardTagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardTagPayload>
          }
          findMany: {
            args: Prisma.FlashcardTagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardTagPayload>[]
          }
          create: {
            args: Prisma.FlashcardTagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardTagPayload>
          }
          createMany: {
            args: Prisma.FlashcardTagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FlashcardTagCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardTagPayload>[]
          }
          delete: {
            args: Prisma.FlashcardTagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardTagPayload>
          }
          update: {
            args: Prisma.FlashcardTagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardTagPayload>
          }
          deleteMany: {
            args: Prisma.FlashcardTagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FlashcardTagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FlashcardTagUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardTagPayload>[]
          }
          upsert: {
            args: Prisma.FlashcardTagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardTagPayload>
          }
          aggregate: {
            args: Prisma.FlashcardTagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFlashcardTag>
          }
          groupBy: {
            args: Prisma.FlashcardTagGroupByArgs<ExtArgs>
            result: $Utils.Optional<FlashcardTagGroupByOutputType>[]
          }
          count: {
            args: Prisma.FlashcardTagCountArgs<ExtArgs>
            result: $Utils.Optional<FlashcardTagCountAggregateOutputType> | number
          }
        }
      }
      MobileImport: {
        payload: Prisma.$MobileImportPayload<ExtArgs>
        fields: Prisma.MobileImportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MobileImportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MobileImportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MobileImportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MobileImportPayload>
          }
          findFirst: {
            args: Prisma.MobileImportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MobileImportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MobileImportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MobileImportPayload>
          }
          findMany: {
            args: Prisma.MobileImportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MobileImportPayload>[]
          }
          create: {
            args: Prisma.MobileImportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MobileImportPayload>
          }
          createMany: {
            args: Prisma.MobileImportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MobileImportCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MobileImportPayload>[]
          }
          delete: {
            args: Prisma.MobileImportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MobileImportPayload>
          }
          update: {
            args: Prisma.MobileImportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MobileImportPayload>
          }
          deleteMany: {
            args: Prisma.MobileImportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MobileImportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MobileImportUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MobileImportPayload>[]
          }
          upsert: {
            args: Prisma.MobileImportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MobileImportPayload>
          }
          aggregate: {
            args: Prisma.MobileImportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMobileImport>
          }
          groupBy: {
            args: Prisma.MobileImportGroupByArgs<ExtArgs>
            result: $Utils.Optional<MobileImportGroupByOutputType>[]
          }
          count: {
            args: Prisma.MobileImportCountArgs<ExtArgs>
            result: $Utils.Optional<MobileImportCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    version?: VersionOmit
    versionCategory?: VersionCategoryOmit
    versionCategoryAbbreviation?: VersionCategoryAbbreviationOmit
    versionItem?: VersionItemOmit
    flashcard?: FlashcardOmit
    userFlashcardActivity?: UserFlashcardActivityOmit
    tag?: TagOmit
    flashcardTag?: FlashcardTagOmit
    mobileImport?: MobileImportOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    flashcards: number
    activities: number
    versionItems: number
    mobileImports: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    flashcards?: boolean | UserCountOutputTypeCountFlashcardsArgs
    activities?: boolean | UserCountOutputTypeCountActivitiesArgs
    versionItems?: boolean | UserCountOutputTypeCountVersionItemsArgs
    mobileImports?: boolean | UserCountOutputTypeCountMobileImportsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFlashcardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlashcardWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserFlashcardActivityWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountVersionItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VersionItemWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMobileImportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MobileImportWhereInput
  }


  /**
   * Count Type VersionCountOutputType
   */

  export type VersionCountOutputType = {
    versionItems: number
  }

  export type VersionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versionItems?: boolean | VersionCountOutputTypeCountVersionItemsArgs
  }

  // Custom InputTypes
  /**
   * VersionCountOutputType without action
   */
  export type VersionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCountOutputType
     */
    select?: VersionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VersionCountOutputType without action
   */
  export type VersionCountOutputTypeCountVersionItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VersionItemWhereInput
  }


  /**
   * Count Type VersionCategoryCountOutputType
   */

  export type VersionCategoryCountOutputType = {
    abbreviations: number
    versionItems: number
  }

  export type VersionCategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    abbreviations?: boolean | VersionCategoryCountOutputTypeCountAbbreviationsArgs
    versionItems?: boolean | VersionCategoryCountOutputTypeCountVersionItemsArgs
  }

  // Custom InputTypes
  /**
   * VersionCategoryCountOutputType without action
   */
  export type VersionCategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategoryCountOutputType
     */
    select?: VersionCategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VersionCategoryCountOutputType without action
   */
  export type VersionCategoryCountOutputTypeCountAbbreviationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VersionCategoryAbbreviationWhereInput
  }

  /**
   * VersionCategoryCountOutputType without action
   */
  export type VersionCategoryCountOutputTypeCountVersionItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VersionItemWhereInput
  }


  /**
   * Count Type FlashcardCountOutputType
   */

  export type FlashcardCountOutputType = {
    copies: number
    activities: number
    tags: number
  }

  export type FlashcardCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    copies?: boolean | FlashcardCountOutputTypeCountCopiesArgs
    activities?: boolean | FlashcardCountOutputTypeCountActivitiesArgs
    tags?: boolean | FlashcardCountOutputTypeCountTagsArgs
  }

  // Custom InputTypes
  /**
   * FlashcardCountOutputType without action
   */
  export type FlashcardCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardCountOutputType
     */
    select?: FlashcardCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FlashcardCountOutputType without action
   */
  export type FlashcardCountOutputTypeCountCopiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlashcardWhereInput
  }

  /**
   * FlashcardCountOutputType without action
   */
  export type FlashcardCountOutputTypeCountActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserFlashcardActivityWhereInput
  }

  /**
   * FlashcardCountOutputType without action
   */
  export type FlashcardCountOutputTypeCountTagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlashcardTagWhereInput
  }


  /**
   * Count Type TagCountOutputType
   */

  export type TagCountOutputType = {
    flashcards: number
  }

  export type TagCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    flashcards?: boolean | TagCountOutputTypeCountFlashcardsArgs
  }

  // Custom InputTypes
  /**
   * TagCountOutputType without action
   */
  export type TagCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TagCountOutputType
     */
    select?: TagCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TagCountOutputType without action
   */
  export type TagCountOutputTypeCountFlashcardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlashcardTagWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    minutesToTestAgain: number | null
    dailyTakeGoal: number | null
  }

  export type UserSumAggregateOutputType = {
    minutesToTestAgain: number | null
    dailyTakeGoal: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    firstName: string | null
    lastName: string | null
    email: string | null
    role: string | null
    minutesToTestAgain: number | null
    dailyTakeGoal: number | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    firstName: string | null
    lastName: string | null
    email: string | null
    role: string | null
    minutesToTestAgain: number | null
    dailyTakeGoal: number | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    firstName: number
    lastName: number
    email: number
    role: number
    minutesToTestAgain: number
    dailyTakeGoal: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    minutesToTestAgain?: true
    dailyTakeGoal?: true
  }

  export type UserSumAggregateInputType = {
    minutesToTestAgain?: true
    dailyTakeGoal?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    email?: true
    role?: true
    minutesToTestAgain?: true
    dailyTakeGoal?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    email?: true
    role?: true
    minutesToTestAgain?: true
    dailyTakeGoal?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    email?: true
    role?: true
    minutesToTestAgain?: true
    dailyTakeGoal?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    minutesToTestAgain: number
    dailyTakeGoal: number
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    role?: boolean
    minutesToTestAgain?: boolean
    dailyTakeGoal?: boolean
    flashcards?: boolean | User$flashcardsArgs<ExtArgs>
    activities?: boolean | User$activitiesArgs<ExtArgs>
    versionItems?: boolean | User$versionItemsArgs<ExtArgs>
    mobileImports?: boolean | User$mobileImportsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    role?: boolean
    minutesToTestAgain?: boolean
    dailyTakeGoal?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    role?: boolean
    minutesToTestAgain?: boolean
    dailyTakeGoal?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    role?: boolean
    minutesToTestAgain?: boolean
    dailyTakeGoal?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "firstName" | "lastName" | "email" | "role" | "minutesToTestAgain" | "dailyTakeGoal", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    flashcards?: boolean | User$flashcardsArgs<ExtArgs>
    activities?: boolean | User$activitiesArgs<ExtArgs>
    versionItems?: boolean | User$versionItemsArgs<ExtArgs>
    mobileImports?: boolean | User$mobileImportsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      flashcards: Prisma.$FlashcardPayload<ExtArgs>[]
      activities: Prisma.$UserFlashcardActivityPayload<ExtArgs>[]
      versionItems: Prisma.$VersionItemPayload<ExtArgs>[]
      mobileImports: Prisma.$MobileImportPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      firstName: string
      lastName: string
      email: string
      role: string
      minutesToTestAgain: number
      dailyTakeGoal: number
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    flashcards<T extends User$flashcardsArgs<ExtArgs> = {}>(args?: Subset<T, User$flashcardsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    activities<T extends User$activitiesArgs<ExtArgs> = {}>(args?: Subset<T, User$activitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserFlashcardActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    versionItems<T extends User$versionItemsArgs<ExtArgs> = {}>(args?: Subset<T, User$versionItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VersionItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    mobileImports<T extends User$mobileImportsArgs<ExtArgs> = {}>(args?: Subset<T, User$mobileImportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MobileImportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly minutesToTestAgain: FieldRef<"User", 'Int'>
    readonly dailyTakeGoal: FieldRef<"User", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.flashcards
   */
  export type User$flashcardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    where?: FlashcardWhereInput
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    cursor?: FlashcardWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FlashcardScalarFieldEnum | FlashcardScalarFieldEnum[]
  }

  /**
   * User.activities
   */
  export type User$activitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardActivity
     */
    select?: UserFlashcardActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardActivity
     */
    omit?: UserFlashcardActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardActivityInclude<ExtArgs> | null
    where?: UserFlashcardActivityWhereInput
    orderBy?: UserFlashcardActivityOrderByWithRelationInput | UserFlashcardActivityOrderByWithRelationInput[]
    cursor?: UserFlashcardActivityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserFlashcardActivityScalarFieldEnum | UserFlashcardActivityScalarFieldEnum[]
  }

  /**
   * User.versionItems
   */
  export type User$versionItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionItem
     */
    select?: VersionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionItem
     */
    omit?: VersionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionItemInclude<ExtArgs> | null
    where?: VersionItemWhereInput
    orderBy?: VersionItemOrderByWithRelationInput | VersionItemOrderByWithRelationInput[]
    cursor?: VersionItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VersionItemScalarFieldEnum | VersionItemScalarFieldEnum[]
  }

  /**
   * User.mobileImports
   */
  export type User$mobileImportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MobileImport
     */
    select?: MobileImportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MobileImport
     */
    omit?: MobileImportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MobileImportInclude<ExtArgs> | null
    where?: MobileImportWhereInput
    orderBy?: MobileImportOrderByWithRelationInput | MobileImportOrderByWithRelationInput[]
    cursor?: MobileImportWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MobileImportScalarFieldEnum | MobileImportScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Version
   */

  export type AggregateVersion = {
    _count: VersionCountAggregateOutputType | null
    _min: VersionMinAggregateOutputType | null
    _max: VersionMaxAggregateOutputType | null
  }

  export type VersionMinAggregateOutputType = {
    id: string | null
    versionNumber: string | null
    title: string | null
    status: string | null
    publishDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VersionMaxAggregateOutputType = {
    id: string | null
    versionNumber: string | null
    title: string | null
    status: string | null
    publishDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VersionCountAggregateOutputType = {
    id: number
    versionNumber: number
    title: number
    status: number
    publishDate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VersionMinAggregateInputType = {
    id?: true
    versionNumber?: true
    title?: true
    status?: true
    publishDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VersionMaxAggregateInputType = {
    id?: true
    versionNumber?: true
    title?: true
    status?: true
    publishDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VersionCountAggregateInputType = {
    id?: true
    versionNumber?: true
    title?: true
    status?: true
    publishDate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VersionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Version to aggregate.
     */
    where?: VersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Versions to fetch.
     */
    orderBy?: VersionOrderByWithRelationInput | VersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Versions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Versions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Versions
    **/
    _count?: true | VersionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VersionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VersionMaxAggregateInputType
  }

  export type GetVersionAggregateType<T extends VersionAggregateArgs> = {
        [P in keyof T & keyof AggregateVersion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVersion[P]>
      : GetScalarType<T[P], AggregateVersion[P]>
  }




  export type VersionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VersionWhereInput
    orderBy?: VersionOrderByWithAggregationInput | VersionOrderByWithAggregationInput[]
    by: VersionScalarFieldEnum[] | VersionScalarFieldEnum
    having?: VersionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VersionCountAggregateInputType | true
    _min?: VersionMinAggregateInputType
    _max?: VersionMaxAggregateInputType
  }

  export type VersionGroupByOutputType = {
    id: string
    versionNumber: string
    title: string | null
    status: string
    publishDate: Date | null
    createdAt: Date
    updatedAt: Date
    _count: VersionCountAggregateOutputType | null
    _min: VersionMinAggregateOutputType | null
    _max: VersionMaxAggregateOutputType | null
  }

  type GetVersionGroupByPayload<T extends VersionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VersionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VersionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VersionGroupByOutputType[P]>
            : GetScalarType<T[P], VersionGroupByOutputType[P]>
        }
      >
    >


  export type VersionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    versionNumber?: boolean
    title?: boolean
    status?: boolean
    publishDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    versionItems?: boolean | Version$versionItemsArgs<ExtArgs>
    _count?: boolean | VersionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["version"]>

  export type VersionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    versionNumber?: boolean
    title?: boolean
    status?: boolean
    publishDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["version"]>

  export type VersionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    versionNumber?: boolean
    title?: boolean
    status?: boolean
    publishDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["version"]>

  export type VersionSelectScalar = {
    id?: boolean
    versionNumber?: boolean
    title?: boolean
    status?: boolean
    publishDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VersionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "versionNumber" | "title" | "status" | "publishDate" | "createdAt" | "updatedAt", ExtArgs["result"]["version"]>
  export type VersionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versionItems?: boolean | Version$versionItemsArgs<ExtArgs>
    _count?: boolean | VersionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VersionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type VersionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $VersionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Version"
    objects: {
      versionItems: Prisma.$VersionItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      versionNumber: string
      title: string | null
      status: string
      publishDate: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["version"]>
    composites: {}
  }

  type VersionGetPayload<S extends boolean | null | undefined | VersionDefaultArgs> = $Result.GetResult<Prisma.$VersionPayload, S>

  type VersionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VersionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VersionCountAggregateInputType | true
    }

  export interface VersionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Version'], meta: { name: 'Version' } }
    /**
     * Find zero or one Version that matches the filter.
     * @param {VersionFindUniqueArgs} args - Arguments to find a Version
     * @example
     * // Get one Version
     * const version = await prisma.version.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VersionFindUniqueArgs>(args: SelectSubset<T, VersionFindUniqueArgs<ExtArgs>>): Prisma__VersionClient<$Result.GetResult<Prisma.$VersionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Version that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VersionFindUniqueOrThrowArgs} args - Arguments to find a Version
     * @example
     * // Get one Version
     * const version = await prisma.version.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VersionFindUniqueOrThrowArgs>(args: SelectSubset<T, VersionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VersionClient<$Result.GetResult<Prisma.$VersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Version that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionFindFirstArgs} args - Arguments to find a Version
     * @example
     * // Get one Version
     * const version = await prisma.version.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VersionFindFirstArgs>(args?: SelectSubset<T, VersionFindFirstArgs<ExtArgs>>): Prisma__VersionClient<$Result.GetResult<Prisma.$VersionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Version that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionFindFirstOrThrowArgs} args - Arguments to find a Version
     * @example
     * // Get one Version
     * const version = await prisma.version.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VersionFindFirstOrThrowArgs>(args?: SelectSubset<T, VersionFindFirstOrThrowArgs<ExtArgs>>): Prisma__VersionClient<$Result.GetResult<Prisma.$VersionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Versions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Versions
     * const versions = await prisma.version.findMany()
     * 
     * // Get first 10 Versions
     * const versions = await prisma.version.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const versionWithIdOnly = await prisma.version.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VersionFindManyArgs>(args?: SelectSubset<T, VersionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Version.
     * @param {VersionCreateArgs} args - Arguments to create a Version.
     * @example
     * // Create one Version
     * const Version = await prisma.version.create({
     *   data: {
     *     // ... data to create a Version
     *   }
     * })
     * 
     */
    create<T extends VersionCreateArgs>(args: SelectSubset<T, VersionCreateArgs<ExtArgs>>): Prisma__VersionClient<$Result.GetResult<Prisma.$VersionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Versions.
     * @param {VersionCreateManyArgs} args - Arguments to create many Versions.
     * @example
     * // Create many Versions
     * const version = await prisma.version.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VersionCreateManyArgs>(args?: SelectSubset<T, VersionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Versions and returns the data saved in the database.
     * @param {VersionCreateManyAndReturnArgs} args - Arguments to create many Versions.
     * @example
     * // Create many Versions
     * const version = await prisma.version.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Versions and only return the `id`
     * const versionWithIdOnly = await prisma.version.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VersionCreateManyAndReturnArgs>(args?: SelectSubset<T, VersionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VersionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Version.
     * @param {VersionDeleteArgs} args - Arguments to delete one Version.
     * @example
     * // Delete one Version
     * const Version = await prisma.version.delete({
     *   where: {
     *     // ... filter to delete one Version
     *   }
     * })
     * 
     */
    delete<T extends VersionDeleteArgs>(args: SelectSubset<T, VersionDeleteArgs<ExtArgs>>): Prisma__VersionClient<$Result.GetResult<Prisma.$VersionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Version.
     * @param {VersionUpdateArgs} args - Arguments to update one Version.
     * @example
     * // Update one Version
     * const version = await prisma.version.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VersionUpdateArgs>(args: SelectSubset<T, VersionUpdateArgs<ExtArgs>>): Prisma__VersionClient<$Result.GetResult<Prisma.$VersionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Versions.
     * @param {VersionDeleteManyArgs} args - Arguments to filter Versions to delete.
     * @example
     * // Delete a few Versions
     * const { count } = await prisma.version.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VersionDeleteManyArgs>(args?: SelectSubset<T, VersionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Versions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Versions
     * const version = await prisma.version.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VersionUpdateManyArgs>(args: SelectSubset<T, VersionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Versions and returns the data updated in the database.
     * @param {VersionUpdateManyAndReturnArgs} args - Arguments to update many Versions.
     * @example
     * // Update many Versions
     * const version = await prisma.version.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Versions and only return the `id`
     * const versionWithIdOnly = await prisma.version.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VersionUpdateManyAndReturnArgs>(args: SelectSubset<T, VersionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VersionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Version.
     * @param {VersionUpsertArgs} args - Arguments to update or create a Version.
     * @example
     * // Update or create a Version
     * const version = await prisma.version.upsert({
     *   create: {
     *     // ... data to create a Version
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Version we want to update
     *   }
     * })
     */
    upsert<T extends VersionUpsertArgs>(args: SelectSubset<T, VersionUpsertArgs<ExtArgs>>): Prisma__VersionClient<$Result.GetResult<Prisma.$VersionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Versions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionCountArgs} args - Arguments to filter Versions to count.
     * @example
     * // Count the number of Versions
     * const count = await prisma.version.count({
     *   where: {
     *     // ... the filter for the Versions we want to count
     *   }
     * })
    **/
    count<T extends VersionCountArgs>(
      args?: Subset<T, VersionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VersionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Version.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VersionAggregateArgs>(args: Subset<T, VersionAggregateArgs>): Prisma.PrismaPromise<GetVersionAggregateType<T>>

    /**
     * Group by Version.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VersionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VersionGroupByArgs['orderBy'] }
        : { orderBy?: VersionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Version model
   */
  readonly fields: VersionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Version.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VersionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    versionItems<T extends Version$versionItemsArgs<ExtArgs> = {}>(args?: Subset<T, Version$versionItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VersionItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Version model
   */
  interface VersionFieldRefs {
    readonly id: FieldRef<"Version", 'String'>
    readonly versionNumber: FieldRef<"Version", 'String'>
    readonly title: FieldRef<"Version", 'String'>
    readonly status: FieldRef<"Version", 'String'>
    readonly publishDate: FieldRef<"Version", 'DateTime'>
    readonly createdAt: FieldRef<"Version", 'DateTime'>
    readonly updatedAt: FieldRef<"Version", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Version findUnique
   */
  export type VersionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Version
     */
    select?: VersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Version
     */
    omit?: VersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionInclude<ExtArgs> | null
    /**
     * Filter, which Version to fetch.
     */
    where: VersionWhereUniqueInput
  }

  /**
   * Version findUniqueOrThrow
   */
  export type VersionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Version
     */
    select?: VersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Version
     */
    omit?: VersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionInclude<ExtArgs> | null
    /**
     * Filter, which Version to fetch.
     */
    where: VersionWhereUniqueInput
  }

  /**
   * Version findFirst
   */
  export type VersionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Version
     */
    select?: VersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Version
     */
    omit?: VersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionInclude<ExtArgs> | null
    /**
     * Filter, which Version to fetch.
     */
    where?: VersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Versions to fetch.
     */
    orderBy?: VersionOrderByWithRelationInput | VersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Versions.
     */
    cursor?: VersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Versions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Versions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Versions.
     */
    distinct?: VersionScalarFieldEnum | VersionScalarFieldEnum[]
  }

  /**
   * Version findFirstOrThrow
   */
  export type VersionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Version
     */
    select?: VersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Version
     */
    omit?: VersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionInclude<ExtArgs> | null
    /**
     * Filter, which Version to fetch.
     */
    where?: VersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Versions to fetch.
     */
    orderBy?: VersionOrderByWithRelationInput | VersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Versions.
     */
    cursor?: VersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Versions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Versions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Versions.
     */
    distinct?: VersionScalarFieldEnum | VersionScalarFieldEnum[]
  }

  /**
   * Version findMany
   */
  export type VersionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Version
     */
    select?: VersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Version
     */
    omit?: VersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionInclude<ExtArgs> | null
    /**
     * Filter, which Versions to fetch.
     */
    where?: VersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Versions to fetch.
     */
    orderBy?: VersionOrderByWithRelationInput | VersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Versions.
     */
    cursor?: VersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Versions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Versions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Versions.
     */
    distinct?: VersionScalarFieldEnum | VersionScalarFieldEnum[]
  }

  /**
   * Version create
   */
  export type VersionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Version
     */
    select?: VersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Version
     */
    omit?: VersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionInclude<ExtArgs> | null
    /**
     * The data needed to create a Version.
     */
    data: XOR<VersionCreateInput, VersionUncheckedCreateInput>
  }

  /**
   * Version createMany
   */
  export type VersionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Versions.
     */
    data: VersionCreateManyInput | VersionCreateManyInput[]
  }

  /**
   * Version createManyAndReturn
   */
  export type VersionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Version
     */
    select?: VersionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Version
     */
    omit?: VersionOmit<ExtArgs> | null
    /**
     * The data used to create many Versions.
     */
    data: VersionCreateManyInput | VersionCreateManyInput[]
  }

  /**
   * Version update
   */
  export type VersionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Version
     */
    select?: VersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Version
     */
    omit?: VersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionInclude<ExtArgs> | null
    /**
     * The data needed to update a Version.
     */
    data: XOR<VersionUpdateInput, VersionUncheckedUpdateInput>
    /**
     * Choose, which Version to update.
     */
    where: VersionWhereUniqueInput
  }

  /**
   * Version updateMany
   */
  export type VersionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Versions.
     */
    data: XOR<VersionUpdateManyMutationInput, VersionUncheckedUpdateManyInput>
    /**
     * Filter which Versions to update
     */
    where?: VersionWhereInput
    /**
     * Limit how many Versions to update.
     */
    limit?: number
  }

  /**
   * Version updateManyAndReturn
   */
  export type VersionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Version
     */
    select?: VersionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Version
     */
    omit?: VersionOmit<ExtArgs> | null
    /**
     * The data used to update Versions.
     */
    data: XOR<VersionUpdateManyMutationInput, VersionUncheckedUpdateManyInput>
    /**
     * Filter which Versions to update
     */
    where?: VersionWhereInput
    /**
     * Limit how many Versions to update.
     */
    limit?: number
  }

  /**
   * Version upsert
   */
  export type VersionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Version
     */
    select?: VersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Version
     */
    omit?: VersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionInclude<ExtArgs> | null
    /**
     * The filter to search for the Version to update in case it exists.
     */
    where: VersionWhereUniqueInput
    /**
     * In case the Version found by the `where` argument doesn't exist, create a new Version with this data.
     */
    create: XOR<VersionCreateInput, VersionUncheckedCreateInput>
    /**
     * In case the Version was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VersionUpdateInput, VersionUncheckedUpdateInput>
  }

  /**
   * Version delete
   */
  export type VersionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Version
     */
    select?: VersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Version
     */
    omit?: VersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionInclude<ExtArgs> | null
    /**
     * Filter which Version to delete.
     */
    where: VersionWhereUniqueInput
  }

  /**
   * Version deleteMany
   */
  export type VersionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Versions to delete
     */
    where?: VersionWhereInput
    /**
     * Limit how many Versions to delete.
     */
    limit?: number
  }

  /**
   * Version.versionItems
   */
  export type Version$versionItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionItem
     */
    select?: VersionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionItem
     */
    omit?: VersionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionItemInclude<ExtArgs> | null
    where?: VersionItemWhereInput
    orderBy?: VersionItemOrderByWithRelationInput | VersionItemOrderByWithRelationInput[]
    cursor?: VersionItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VersionItemScalarFieldEnum | VersionItemScalarFieldEnum[]
  }

  /**
   * Version without action
   */
  export type VersionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Version
     */
    select?: VersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Version
     */
    omit?: VersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionInclude<ExtArgs> | null
  }


  /**
   * Model VersionCategory
   */

  export type AggregateVersionCategory = {
    _count: VersionCategoryCountAggregateOutputType | null
    _avg: VersionCategoryAvgAggregateOutputType | null
    _sum: VersionCategorySumAggregateOutputType | null
    _min: VersionCategoryMinAggregateOutputType | null
    _max: VersionCategoryMaxAggregateOutputType | null
  }

  export type VersionCategoryAvgAggregateOutputType = {
    rank: number | null
  }

  export type VersionCategorySumAggregateOutputType = {
    rank: number | null
  }

  export type VersionCategoryMinAggregateOutputType = {
    id: string | null
    title: string | null
    rank: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VersionCategoryMaxAggregateOutputType = {
    id: string | null
    title: string | null
    rank: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VersionCategoryCountAggregateOutputType = {
    id: number
    title: number
    rank: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VersionCategoryAvgAggregateInputType = {
    rank?: true
  }

  export type VersionCategorySumAggregateInputType = {
    rank?: true
  }

  export type VersionCategoryMinAggregateInputType = {
    id?: true
    title?: true
    rank?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VersionCategoryMaxAggregateInputType = {
    id?: true
    title?: true
    rank?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VersionCategoryCountAggregateInputType = {
    id?: true
    title?: true
    rank?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VersionCategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VersionCategory to aggregate.
     */
    where?: VersionCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VersionCategories to fetch.
     */
    orderBy?: VersionCategoryOrderByWithRelationInput | VersionCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VersionCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VersionCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VersionCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VersionCategories
    **/
    _count?: true | VersionCategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VersionCategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VersionCategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VersionCategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VersionCategoryMaxAggregateInputType
  }

  export type GetVersionCategoryAggregateType<T extends VersionCategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateVersionCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVersionCategory[P]>
      : GetScalarType<T[P], AggregateVersionCategory[P]>
  }




  export type VersionCategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VersionCategoryWhereInput
    orderBy?: VersionCategoryOrderByWithAggregationInput | VersionCategoryOrderByWithAggregationInput[]
    by: VersionCategoryScalarFieldEnum[] | VersionCategoryScalarFieldEnum
    having?: VersionCategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VersionCategoryCountAggregateInputType | true
    _avg?: VersionCategoryAvgAggregateInputType
    _sum?: VersionCategorySumAggregateInputType
    _min?: VersionCategoryMinAggregateInputType
    _max?: VersionCategoryMaxAggregateInputType
  }

  export type VersionCategoryGroupByOutputType = {
    id: string
    title: string
    rank: number
    createdAt: Date
    updatedAt: Date
    _count: VersionCategoryCountAggregateOutputType | null
    _avg: VersionCategoryAvgAggregateOutputType | null
    _sum: VersionCategorySumAggregateOutputType | null
    _min: VersionCategoryMinAggregateOutputType | null
    _max: VersionCategoryMaxAggregateOutputType | null
  }

  type GetVersionCategoryGroupByPayload<T extends VersionCategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VersionCategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VersionCategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VersionCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], VersionCategoryGroupByOutputType[P]>
        }
      >
    >


  export type VersionCategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    rank?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    abbreviations?: boolean | VersionCategory$abbreviationsArgs<ExtArgs>
    versionItems?: boolean | VersionCategory$versionItemsArgs<ExtArgs>
    _count?: boolean | VersionCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["versionCategory"]>

  export type VersionCategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    rank?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["versionCategory"]>

  export type VersionCategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    rank?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["versionCategory"]>

  export type VersionCategorySelectScalar = {
    id?: boolean
    title?: boolean
    rank?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VersionCategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "rank" | "createdAt" | "updatedAt", ExtArgs["result"]["versionCategory"]>
  export type VersionCategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    abbreviations?: boolean | VersionCategory$abbreviationsArgs<ExtArgs>
    versionItems?: boolean | VersionCategory$versionItemsArgs<ExtArgs>
    _count?: boolean | VersionCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VersionCategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type VersionCategoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $VersionCategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VersionCategory"
    objects: {
      abbreviations: Prisma.$VersionCategoryAbbreviationPayload<ExtArgs>[]
      versionItems: Prisma.$VersionItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      rank: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["versionCategory"]>
    composites: {}
  }

  type VersionCategoryGetPayload<S extends boolean | null | undefined | VersionCategoryDefaultArgs> = $Result.GetResult<Prisma.$VersionCategoryPayload, S>

  type VersionCategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VersionCategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VersionCategoryCountAggregateInputType | true
    }

  export interface VersionCategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VersionCategory'], meta: { name: 'VersionCategory' } }
    /**
     * Find zero or one VersionCategory that matches the filter.
     * @param {VersionCategoryFindUniqueArgs} args - Arguments to find a VersionCategory
     * @example
     * // Get one VersionCategory
     * const versionCategory = await prisma.versionCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VersionCategoryFindUniqueArgs>(args: SelectSubset<T, VersionCategoryFindUniqueArgs<ExtArgs>>): Prisma__VersionCategoryClient<$Result.GetResult<Prisma.$VersionCategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VersionCategory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VersionCategoryFindUniqueOrThrowArgs} args - Arguments to find a VersionCategory
     * @example
     * // Get one VersionCategory
     * const versionCategory = await prisma.versionCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VersionCategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, VersionCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VersionCategoryClient<$Result.GetResult<Prisma.$VersionCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VersionCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionCategoryFindFirstArgs} args - Arguments to find a VersionCategory
     * @example
     * // Get one VersionCategory
     * const versionCategory = await prisma.versionCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VersionCategoryFindFirstArgs>(args?: SelectSubset<T, VersionCategoryFindFirstArgs<ExtArgs>>): Prisma__VersionCategoryClient<$Result.GetResult<Prisma.$VersionCategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VersionCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionCategoryFindFirstOrThrowArgs} args - Arguments to find a VersionCategory
     * @example
     * // Get one VersionCategory
     * const versionCategory = await prisma.versionCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VersionCategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, VersionCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__VersionCategoryClient<$Result.GetResult<Prisma.$VersionCategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VersionCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VersionCategories
     * const versionCategories = await prisma.versionCategory.findMany()
     * 
     * // Get first 10 VersionCategories
     * const versionCategories = await prisma.versionCategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const versionCategoryWithIdOnly = await prisma.versionCategory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VersionCategoryFindManyArgs>(args?: SelectSubset<T, VersionCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VersionCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VersionCategory.
     * @param {VersionCategoryCreateArgs} args - Arguments to create a VersionCategory.
     * @example
     * // Create one VersionCategory
     * const VersionCategory = await prisma.versionCategory.create({
     *   data: {
     *     // ... data to create a VersionCategory
     *   }
     * })
     * 
     */
    create<T extends VersionCategoryCreateArgs>(args: SelectSubset<T, VersionCategoryCreateArgs<ExtArgs>>): Prisma__VersionCategoryClient<$Result.GetResult<Prisma.$VersionCategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VersionCategories.
     * @param {VersionCategoryCreateManyArgs} args - Arguments to create many VersionCategories.
     * @example
     * // Create many VersionCategories
     * const versionCategory = await prisma.versionCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VersionCategoryCreateManyArgs>(args?: SelectSubset<T, VersionCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VersionCategories and returns the data saved in the database.
     * @param {VersionCategoryCreateManyAndReturnArgs} args - Arguments to create many VersionCategories.
     * @example
     * // Create many VersionCategories
     * const versionCategory = await prisma.versionCategory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VersionCategories and only return the `id`
     * const versionCategoryWithIdOnly = await prisma.versionCategory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VersionCategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, VersionCategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VersionCategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VersionCategory.
     * @param {VersionCategoryDeleteArgs} args - Arguments to delete one VersionCategory.
     * @example
     * // Delete one VersionCategory
     * const VersionCategory = await prisma.versionCategory.delete({
     *   where: {
     *     // ... filter to delete one VersionCategory
     *   }
     * })
     * 
     */
    delete<T extends VersionCategoryDeleteArgs>(args: SelectSubset<T, VersionCategoryDeleteArgs<ExtArgs>>): Prisma__VersionCategoryClient<$Result.GetResult<Prisma.$VersionCategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VersionCategory.
     * @param {VersionCategoryUpdateArgs} args - Arguments to update one VersionCategory.
     * @example
     * // Update one VersionCategory
     * const versionCategory = await prisma.versionCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VersionCategoryUpdateArgs>(args: SelectSubset<T, VersionCategoryUpdateArgs<ExtArgs>>): Prisma__VersionCategoryClient<$Result.GetResult<Prisma.$VersionCategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VersionCategories.
     * @param {VersionCategoryDeleteManyArgs} args - Arguments to filter VersionCategories to delete.
     * @example
     * // Delete a few VersionCategories
     * const { count } = await prisma.versionCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VersionCategoryDeleteManyArgs>(args?: SelectSubset<T, VersionCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VersionCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VersionCategories
     * const versionCategory = await prisma.versionCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VersionCategoryUpdateManyArgs>(args: SelectSubset<T, VersionCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VersionCategories and returns the data updated in the database.
     * @param {VersionCategoryUpdateManyAndReturnArgs} args - Arguments to update many VersionCategories.
     * @example
     * // Update many VersionCategories
     * const versionCategory = await prisma.versionCategory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VersionCategories and only return the `id`
     * const versionCategoryWithIdOnly = await prisma.versionCategory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VersionCategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, VersionCategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VersionCategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VersionCategory.
     * @param {VersionCategoryUpsertArgs} args - Arguments to update or create a VersionCategory.
     * @example
     * // Update or create a VersionCategory
     * const versionCategory = await prisma.versionCategory.upsert({
     *   create: {
     *     // ... data to create a VersionCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VersionCategory we want to update
     *   }
     * })
     */
    upsert<T extends VersionCategoryUpsertArgs>(args: SelectSubset<T, VersionCategoryUpsertArgs<ExtArgs>>): Prisma__VersionCategoryClient<$Result.GetResult<Prisma.$VersionCategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VersionCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionCategoryCountArgs} args - Arguments to filter VersionCategories to count.
     * @example
     * // Count the number of VersionCategories
     * const count = await prisma.versionCategory.count({
     *   where: {
     *     // ... the filter for the VersionCategories we want to count
     *   }
     * })
    **/
    count<T extends VersionCategoryCountArgs>(
      args?: Subset<T, VersionCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VersionCategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VersionCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VersionCategoryAggregateArgs>(args: Subset<T, VersionCategoryAggregateArgs>): Prisma.PrismaPromise<GetVersionCategoryAggregateType<T>>

    /**
     * Group by VersionCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionCategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VersionCategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VersionCategoryGroupByArgs['orderBy'] }
        : { orderBy?: VersionCategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VersionCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVersionCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VersionCategory model
   */
  readonly fields: VersionCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VersionCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VersionCategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    abbreviations<T extends VersionCategory$abbreviationsArgs<ExtArgs> = {}>(args?: Subset<T, VersionCategory$abbreviationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VersionCategoryAbbreviationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    versionItems<T extends VersionCategory$versionItemsArgs<ExtArgs> = {}>(args?: Subset<T, VersionCategory$versionItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VersionItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VersionCategory model
   */
  interface VersionCategoryFieldRefs {
    readonly id: FieldRef<"VersionCategory", 'String'>
    readonly title: FieldRef<"VersionCategory", 'String'>
    readonly rank: FieldRef<"VersionCategory", 'Float'>
    readonly createdAt: FieldRef<"VersionCategory", 'DateTime'>
    readonly updatedAt: FieldRef<"VersionCategory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VersionCategory findUnique
   */
  export type VersionCategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategory
     */
    select?: VersionCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategory
     */
    omit?: VersionCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryInclude<ExtArgs> | null
    /**
     * Filter, which VersionCategory to fetch.
     */
    where: VersionCategoryWhereUniqueInput
  }

  /**
   * VersionCategory findUniqueOrThrow
   */
  export type VersionCategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategory
     */
    select?: VersionCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategory
     */
    omit?: VersionCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryInclude<ExtArgs> | null
    /**
     * Filter, which VersionCategory to fetch.
     */
    where: VersionCategoryWhereUniqueInput
  }

  /**
   * VersionCategory findFirst
   */
  export type VersionCategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategory
     */
    select?: VersionCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategory
     */
    omit?: VersionCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryInclude<ExtArgs> | null
    /**
     * Filter, which VersionCategory to fetch.
     */
    where?: VersionCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VersionCategories to fetch.
     */
    orderBy?: VersionCategoryOrderByWithRelationInput | VersionCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VersionCategories.
     */
    cursor?: VersionCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VersionCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VersionCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VersionCategories.
     */
    distinct?: VersionCategoryScalarFieldEnum | VersionCategoryScalarFieldEnum[]
  }

  /**
   * VersionCategory findFirstOrThrow
   */
  export type VersionCategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategory
     */
    select?: VersionCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategory
     */
    omit?: VersionCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryInclude<ExtArgs> | null
    /**
     * Filter, which VersionCategory to fetch.
     */
    where?: VersionCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VersionCategories to fetch.
     */
    orderBy?: VersionCategoryOrderByWithRelationInput | VersionCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VersionCategories.
     */
    cursor?: VersionCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VersionCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VersionCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VersionCategories.
     */
    distinct?: VersionCategoryScalarFieldEnum | VersionCategoryScalarFieldEnum[]
  }

  /**
   * VersionCategory findMany
   */
  export type VersionCategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategory
     */
    select?: VersionCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategory
     */
    omit?: VersionCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryInclude<ExtArgs> | null
    /**
     * Filter, which VersionCategories to fetch.
     */
    where?: VersionCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VersionCategories to fetch.
     */
    orderBy?: VersionCategoryOrderByWithRelationInput | VersionCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VersionCategories.
     */
    cursor?: VersionCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VersionCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VersionCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VersionCategories.
     */
    distinct?: VersionCategoryScalarFieldEnum | VersionCategoryScalarFieldEnum[]
  }

  /**
   * VersionCategory create
   */
  export type VersionCategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategory
     */
    select?: VersionCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategory
     */
    omit?: VersionCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a VersionCategory.
     */
    data: XOR<VersionCategoryCreateInput, VersionCategoryUncheckedCreateInput>
  }

  /**
   * VersionCategory createMany
   */
  export type VersionCategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VersionCategories.
     */
    data: VersionCategoryCreateManyInput | VersionCategoryCreateManyInput[]
  }

  /**
   * VersionCategory createManyAndReturn
   */
  export type VersionCategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategory
     */
    select?: VersionCategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategory
     */
    omit?: VersionCategoryOmit<ExtArgs> | null
    /**
     * The data used to create many VersionCategories.
     */
    data: VersionCategoryCreateManyInput | VersionCategoryCreateManyInput[]
  }

  /**
   * VersionCategory update
   */
  export type VersionCategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategory
     */
    select?: VersionCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategory
     */
    omit?: VersionCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a VersionCategory.
     */
    data: XOR<VersionCategoryUpdateInput, VersionCategoryUncheckedUpdateInput>
    /**
     * Choose, which VersionCategory to update.
     */
    where: VersionCategoryWhereUniqueInput
  }

  /**
   * VersionCategory updateMany
   */
  export type VersionCategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VersionCategories.
     */
    data: XOR<VersionCategoryUpdateManyMutationInput, VersionCategoryUncheckedUpdateManyInput>
    /**
     * Filter which VersionCategories to update
     */
    where?: VersionCategoryWhereInput
    /**
     * Limit how many VersionCategories to update.
     */
    limit?: number
  }

  /**
   * VersionCategory updateManyAndReturn
   */
  export type VersionCategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategory
     */
    select?: VersionCategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategory
     */
    omit?: VersionCategoryOmit<ExtArgs> | null
    /**
     * The data used to update VersionCategories.
     */
    data: XOR<VersionCategoryUpdateManyMutationInput, VersionCategoryUncheckedUpdateManyInput>
    /**
     * Filter which VersionCategories to update
     */
    where?: VersionCategoryWhereInput
    /**
     * Limit how many VersionCategories to update.
     */
    limit?: number
  }

  /**
   * VersionCategory upsert
   */
  export type VersionCategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategory
     */
    select?: VersionCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategory
     */
    omit?: VersionCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the VersionCategory to update in case it exists.
     */
    where: VersionCategoryWhereUniqueInput
    /**
     * In case the VersionCategory found by the `where` argument doesn't exist, create a new VersionCategory with this data.
     */
    create: XOR<VersionCategoryCreateInput, VersionCategoryUncheckedCreateInput>
    /**
     * In case the VersionCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VersionCategoryUpdateInput, VersionCategoryUncheckedUpdateInput>
  }

  /**
   * VersionCategory delete
   */
  export type VersionCategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategory
     */
    select?: VersionCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategory
     */
    omit?: VersionCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryInclude<ExtArgs> | null
    /**
     * Filter which VersionCategory to delete.
     */
    where: VersionCategoryWhereUniqueInput
  }

  /**
   * VersionCategory deleteMany
   */
  export type VersionCategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VersionCategories to delete
     */
    where?: VersionCategoryWhereInput
    /**
     * Limit how many VersionCategories to delete.
     */
    limit?: number
  }

  /**
   * VersionCategory.abbreviations
   */
  export type VersionCategory$abbreviationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategoryAbbreviation
     */
    select?: VersionCategoryAbbreviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategoryAbbreviation
     */
    omit?: VersionCategoryAbbreviationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryAbbreviationInclude<ExtArgs> | null
    where?: VersionCategoryAbbreviationWhereInput
    orderBy?: VersionCategoryAbbreviationOrderByWithRelationInput | VersionCategoryAbbreviationOrderByWithRelationInput[]
    cursor?: VersionCategoryAbbreviationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VersionCategoryAbbreviationScalarFieldEnum | VersionCategoryAbbreviationScalarFieldEnum[]
  }

  /**
   * VersionCategory.versionItems
   */
  export type VersionCategory$versionItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionItem
     */
    select?: VersionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionItem
     */
    omit?: VersionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionItemInclude<ExtArgs> | null
    where?: VersionItemWhereInput
    orderBy?: VersionItemOrderByWithRelationInput | VersionItemOrderByWithRelationInput[]
    cursor?: VersionItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VersionItemScalarFieldEnum | VersionItemScalarFieldEnum[]
  }

  /**
   * VersionCategory without action
   */
  export type VersionCategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategory
     */
    select?: VersionCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategory
     */
    omit?: VersionCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryInclude<ExtArgs> | null
  }


  /**
   * Model VersionCategoryAbbreviation
   */

  export type AggregateVersionCategoryAbbreviation = {
    _count: VersionCategoryAbbreviationCountAggregateOutputType | null
    _min: VersionCategoryAbbreviationMinAggregateOutputType | null
    _max: VersionCategoryAbbreviationMaxAggregateOutputType | null
  }

  export type VersionCategoryAbbreviationMinAggregateOutputType = {
    id: string | null
    versionCategoryId: string | null
    abbreviationText: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VersionCategoryAbbreviationMaxAggregateOutputType = {
    id: string | null
    versionCategoryId: string | null
    abbreviationText: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VersionCategoryAbbreviationCountAggregateOutputType = {
    id: number
    versionCategoryId: number
    abbreviationText: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VersionCategoryAbbreviationMinAggregateInputType = {
    id?: true
    versionCategoryId?: true
    abbreviationText?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VersionCategoryAbbreviationMaxAggregateInputType = {
    id?: true
    versionCategoryId?: true
    abbreviationText?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VersionCategoryAbbreviationCountAggregateInputType = {
    id?: true
    versionCategoryId?: true
    abbreviationText?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VersionCategoryAbbreviationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VersionCategoryAbbreviation to aggregate.
     */
    where?: VersionCategoryAbbreviationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VersionCategoryAbbreviations to fetch.
     */
    orderBy?: VersionCategoryAbbreviationOrderByWithRelationInput | VersionCategoryAbbreviationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VersionCategoryAbbreviationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VersionCategoryAbbreviations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VersionCategoryAbbreviations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VersionCategoryAbbreviations
    **/
    _count?: true | VersionCategoryAbbreviationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VersionCategoryAbbreviationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VersionCategoryAbbreviationMaxAggregateInputType
  }

  export type GetVersionCategoryAbbreviationAggregateType<T extends VersionCategoryAbbreviationAggregateArgs> = {
        [P in keyof T & keyof AggregateVersionCategoryAbbreviation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVersionCategoryAbbreviation[P]>
      : GetScalarType<T[P], AggregateVersionCategoryAbbreviation[P]>
  }




  export type VersionCategoryAbbreviationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VersionCategoryAbbreviationWhereInput
    orderBy?: VersionCategoryAbbreviationOrderByWithAggregationInput | VersionCategoryAbbreviationOrderByWithAggregationInput[]
    by: VersionCategoryAbbreviationScalarFieldEnum[] | VersionCategoryAbbreviationScalarFieldEnum
    having?: VersionCategoryAbbreviationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VersionCategoryAbbreviationCountAggregateInputType | true
    _min?: VersionCategoryAbbreviationMinAggregateInputType
    _max?: VersionCategoryAbbreviationMaxAggregateInputType
  }

  export type VersionCategoryAbbreviationGroupByOutputType = {
    id: string
    versionCategoryId: string
    abbreviationText: string
    createdAt: Date
    updatedAt: Date
    _count: VersionCategoryAbbreviationCountAggregateOutputType | null
    _min: VersionCategoryAbbreviationMinAggregateOutputType | null
    _max: VersionCategoryAbbreviationMaxAggregateOutputType | null
  }

  type GetVersionCategoryAbbreviationGroupByPayload<T extends VersionCategoryAbbreviationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VersionCategoryAbbreviationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VersionCategoryAbbreviationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VersionCategoryAbbreviationGroupByOutputType[P]>
            : GetScalarType<T[P], VersionCategoryAbbreviationGroupByOutputType[P]>
        }
      >
    >


  export type VersionCategoryAbbreviationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    versionCategoryId?: boolean
    abbreviationText?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    versionCategory?: boolean | VersionCategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["versionCategoryAbbreviation"]>

  export type VersionCategoryAbbreviationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    versionCategoryId?: boolean
    abbreviationText?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    versionCategory?: boolean | VersionCategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["versionCategoryAbbreviation"]>

  export type VersionCategoryAbbreviationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    versionCategoryId?: boolean
    abbreviationText?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    versionCategory?: boolean | VersionCategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["versionCategoryAbbreviation"]>

  export type VersionCategoryAbbreviationSelectScalar = {
    id?: boolean
    versionCategoryId?: boolean
    abbreviationText?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VersionCategoryAbbreviationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "versionCategoryId" | "abbreviationText" | "createdAt" | "updatedAt", ExtArgs["result"]["versionCategoryAbbreviation"]>
  export type VersionCategoryAbbreviationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versionCategory?: boolean | VersionCategoryDefaultArgs<ExtArgs>
  }
  export type VersionCategoryAbbreviationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versionCategory?: boolean | VersionCategoryDefaultArgs<ExtArgs>
  }
  export type VersionCategoryAbbreviationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versionCategory?: boolean | VersionCategoryDefaultArgs<ExtArgs>
  }

  export type $VersionCategoryAbbreviationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VersionCategoryAbbreviation"
    objects: {
      versionCategory: Prisma.$VersionCategoryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      versionCategoryId: string
      abbreviationText: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["versionCategoryAbbreviation"]>
    composites: {}
  }

  type VersionCategoryAbbreviationGetPayload<S extends boolean | null | undefined | VersionCategoryAbbreviationDefaultArgs> = $Result.GetResult<Prisma.$VersionCategoryAbbreviationPayload, S>

  type VersionCategoryAbbreviationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VersionCategoryAbbreviationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VersionCategoryAbbreviationCountAggregateInputType | true
    }

  export interface VersionCategoryAbbreviationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VersionCategoryAbbreviation'], meta: { name: 'VersionCategoryAbbreviation' } }
    /**
     * Find zero or one VersionCategoryAbbreviation that matches the filter.
     * @param {VersionCategoryAbbreviationFindUniqueArgs} args - Arguments to find a VersionCategoryAbbreviation
     * @example
     * // Get one VersionCategoryAbbreviation
     * const versionCategoryAbbreviation = await prisma.versionCategoryAbbreviation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VersionCategoryAbbreviationFindUniqueArgs>(args: SelectSubset<T, VersionCategoryAbbreviationFindUniqueArgs<ExtArgs>>): Prisma__VersionCategoryAbbreviationClient<$Result.GetResult<Prisma.$VersionCategoryAbbreviationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VersionCategoryAbbreviation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VersionCategoryAbbreviationFindUniqueOrThrowArgs} args - Arguments to find a VersionCategoryAbbreviation
     * @example
     * // Get one VersionCategoryAbbreviation
     * const versionCategoryAbbreviation = await prisma.versionCategoryAbbreviation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VersionCategoryAbbreviationFindUniqueOrThrowArgs>(args: SelectSubset<T, VersionCategoryAbbreviationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VersionCategoryAbbreviationClient<$Result.GetResult<Prisma.$VersionCategoryAbbreviationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VersionCategoryAbbreviation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionCategoryAbbreviationFindFirstArgs} args - Arguments to find a VersionCategoryAbbreviation
     * @example
     * // Get one VersionCategoryAbbreviation
     * const versionCategoryAbbreviation = await prisma.versionCategoryAbbreviation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VersionCategoryAbbreviationFindFirstArgs>(args?: SelectSubset<T, VersionCategoryAbbreviationFindFirstArgs<ExtArgs>>): Prisma__VersionCategoryAbbreviationClient<$Result.GetResult<Prisma.$VersionCategoryAbbreviationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VersionCategoryAbbreviation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionCategoryAbbreviationFindFirstOrThrowArgs} args - Arguments to find a VersionCategoryAbbreviation
     * @example
     * // Get one VersionCategoryAbbreviation
     * const versionCategoryAbbreviation = await prisma.versionCategoryAbbreviation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VersionCategoryAbbreviationFindFirstOrThrowArgs>(args?: SelectSubset<T, VersionCategoryAbbreviationFindFirstOrThrowArgs<ExtArgs>>): Prisma__VersionCategoryAbbreviationClient<$Result.GetResult<Prisma.$VersionCategoryAbbreviationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VersionCategoryAbbreviations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionCategoryAbbreviationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VersionCategoryAbbreviations
     * const versionCategoryAbbreviations = await prisma.versionCategoryAbbreviation.findMany()
     * 
     * // Get first 10 VersionCategoryAbbreviations
     * const versionCategoryAbbreviations = await prisma.versionCategoryAbbreviation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const versionCategoryAbbreviationWithIdOnly = await prisma.versionCategoryAbbreviation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VersionCategoryAbbreviationFindManyArgs>(args?: SelectSubset<T, VersionCategoryAbbreviationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VersionCategoryAbbreviationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VersionCategoryAbbreviation.
     * @param {VersionCategoryAbbreviationCreateArgs} args - Arguments to create a VersionCategoryAbbreviation.
     * @example
     * // Create one VersionCategoryAbbreviation
     * const VersionCategoryAbbreviation = await prisma.versionCategoryAbbreviation.create({
     *   data: {
     *     // ... data to create a VersionCategoryAbbreviation
     *   }
     * })
     * 
     */
    create<T extends VersionCategoryAbbreviationCreateArgs>(args: SelectSubset<T, VersionCategoryAbbreviationCreateArgs<ExtArgs>>): Prisma__VersionCategoryAbbreviationClient<$Result.GetResult<Prisma.$VersionCategoryAbbreviationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VersionCategoryAbbreviations.
     * @param {VersionCategoryAbbreviationCreateManyArgs} args - Arguments to create many VersionCategoryAbbreviations.
     * @example
     * // Create many VersionCategoryAbbreviations
     * const versionCategoryAbbreviation = await prisma.versionCategoryAbbreviation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VersionCategoryAbbreviationCreateManyArgs>(args?: SelectSubset<T, VersionCategoryAbbreviationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VersionCategoryAbbreviations and returns the data saved in the database.
     * @param {VersionCategoryAbbreviationCreateManyAndReturnArgs} args - Arguments to create many VersionCategoryAbbreviations.
     * @example
     * // Create many VersionCategoryAbbreviations
     * const versionCategoryAbbreviation = await prisma.versionCategoryAbbreviation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VersionCategoryAbbreviations and only return the `id`
     * const versionCategoryAbbreviationWithIdOnly = await prisma.versionCategoryAbbreviation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VersionCategoryAbbreviationCreateManyAndReturnArgs>(args?: SelectSubset<T, VersionCategoryAbbreviationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VersionCategoryAbbreviationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VersionCategoryAbbreviation.
     * @param {VersionCategoryAbbreviationDeleteArgs} args - Arguments to delete one VersionCategoryAbbreviation.
     * @example
     * // Delete one VersionCategoryAbbreviation
     * const VersionCategoryAbbreviation = await prisma.versionCategoryAbbreviation.delete({
     *   where: {
     *     // ... filter to delete one VersionCategoryAbbreviation
     *   }
     * })
     * 
     */
    delete<T extends VersionCategoryAbbreviationDeleteArgs>(args: SelectSubset<T, VersionCategoryAbbreviationDeleteArgs<ExtArgs>>): Prisma__VersionCategoryAbbreviationClient<$Result.GetResult<Prisma.$VersionCategoryAbbreviationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VersionCategoryAbbreviation.
     * @param {VersionCategoryAbbreviationUpdateArgs} args - Arguments to update one VersionCategoryAbbreviation.
     * @example
     * // Update one VersionCategoryAbbreviation
     * const versionCategoryAbbreviation = await prisma.versionCategoryAbbreviation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VersionCategoryAbbreviationUpdateArgs>(args: SelectSubset<T, VersionCategoryAbbreviationUpdateArgs<ExtArgs>>): Prisma__VersionCategoryAbbreviationClient<$Result.GetResult<Prisma.$VersionCategoryAbbreviationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VersionCategoryAbbreviations.
     * @param {VersionCategoryAbbreviationDeleteManyArgs} args - Arguments to filter VersionCategoryAbbreviations to delete.
     * @example
     * // Delete a few VersionCategoryAbbreviations
     * const { count } = await prisma.versionCategoryAbbreviation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VersionCategoryAbbreviationDeleteManyArgs>(args?: SelectSubset<T, VersionCategoryAbbreviationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VersionCategoryAbbreviations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionCategoryAbbreviationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VersionCategoryAbbreviations
     * const versionCategoryAbbreviation = await prisma.versionCategoryAbbreviation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VersionCategoryAbbreviationUpdateManyArgs>(args: SelectSubset<T, VersionCategoryAbbreviationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VersionCategoryAbbreviations and returns the data updated in the database.
     * @param {VersionCategoryAbbreviationUpdateManyAndReturnArgs} args - Arguments to update many VersionCategoryAbbreviations.
     * @example
     * // Update many VersionCategoryAbbreviations
     * const versionCategoryAbbreviation = await prisma.versionCategoryAbbreviation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VersionCategoryAbbreviations and only return the `id`
     * const versionCategoryAbbreviationWithIdOnly = await prisma.versionCategoryAbbreviation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VersionCategoryAbbreviationUpdateManyAndReturnArgs>(args: SelectSubset<T, VersionCategoryAbbreviationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VersionCategoryAbbreviationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VersionCategoryAbbreviation.
     * @param {VersionCategoryAbbreviationUpsertArgs} args - Arguments to update or create a VersionCategoryAbbreviation.
     * @example
     * // Update or create a VersionCategoryAbbreviation
     * const versionCategoryAbbreviation = await prisma.versionCategoryAbbreviation.upsert({
     *   create: {
     *     // ... data to create a VersionCategoryAbbreviation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VersionCategoryAbbreviation we want to update
     *   }
     * })
     */
    upsert<T extends VersionCategoryAbbreviationUpsertArgs>(args: SelectSubset<T, VersionCategoryAbbreviationUpsertArgs<ExtArgs>>): Prisma__VersionCategoryAbbreviationClient<$Result.GetResult<Prisma.$VersionCategoryAbbreviationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VersionCategoryAbbreviations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionCategoryAbbreviationCountArgs} args - Arguments to filter VersionCategoryAbbreviations to count.
     * @example
     * // Count the number of VersionCategoryAbbreviations
     * const count = await prisma.versionCategoryAbbreviation.count({
     *   where: {
     *     // ... the filter for the VersionCategoryAbbreviations we want to count
     *   }
     * })
    **/
    count<T extends VersionCategoryAbbreviationCountArgs>(
      args?: Subset<T, VersionCategoryAbbreviationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VersionCategoryAbbreviationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VersionCategoryAbbreviation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionCategoryAbbreviationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VersionCategoryAbbreviationAggregateArgs>(args: Subset<T, VersionCategoryAbbreviationAggregateArgs>): Prisma.PrismaPromise<GetVersionCategoryAbbreviationAggregateType<T>>

    /**
     * Group by VersionCategoryAbbreviation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionCategoryAbbreviationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VersionCategoryAbbreviationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VersionCategoryAbbreviationGroupByArgs['orderBy'] }
        : { orderBy?: VersionCategoryAbbreviationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VersionCategoryAbbreviationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVersionCategoryAbbreviationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VersionCategoryAbbreviation model
   */
  readonly fields: VersionCategoryAbbreviationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VersionCategoryAbbreviation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VersionCategoryAbbreviationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    versionCategory<T extends VersionCategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VersionCategoryDefaultArgs<ExtArgs>>): Prisma__VersionCategoryClient<$Result.GetResult<Prisma.$VersionCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VersionCategoryAbbreviation model
   */
  interface VersionCategoryAbbreviationFieldRefs {
    readonly id: FieldRef<"VersionCategoryAbbreviation", 'String'>
    readonly versionCategoryId: FieldRef<"VersionCategoryAbbreviation", 'String'>
    readonly abbreviationText: FieldRef<"VersionCategoryAbbreviation", 'String'>
    readonly createdAt: FieldRef<"VersionCategoryAbbreviation", 'DateTime'>
    readonly updatedAt: FieldRef<"VersionCategoryAbbreviation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VersionCategoryAbbreviation findUnique
   */
  export type VersionCategoryAbbreviationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategoryAbbreviation
     */
    select?: VersionCategoryAbbreviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategoryAbbreviation
     */
    omit?: VersionCategoryAbbreviationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryAbbreviationInclude<ExtArgs> | null
    /**
     * Filter, which VersionCategoryAbbreviation to fetch.
     */
    where: VersionCategoryAbbreviationWhereUniqueInput
  }

  /**
   * VersionCategoryAbbreviation findUniqueOrThrow
   */
  export type VersionCategoryAbbreviationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategoryAbbreviation
     */
    select?: VersionCategoryAbbreviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategoryAbbreviation
     */
    omit?: VersionCategoryAbbreviationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryAbbreviationInclude<ExtArgs> | null
    /**
     * Filter, which VersionCategoryAbbreviation to fetch.
     */
    where: VersionCategoryAbbreviationWhereUniqueInput
  }

  /**
   * VersionCategoryAbbreviation findFirst
   */
  export type VersionCategoryAbbreviationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategoryAbbreviation
     */
    select?: VersionCategoryAbbreviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategoryAbbreviation
     */
    omit?: VersionCategoryAbbreviationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryAbbreviationInclude<ExtArgs> | null
    /**
     * Filter, which VersionCategoryAbbreviation to fetch.
     */
    where?: VersionCategoryAbbreviationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VersionCategoryAbbreviations to fetch.
     */
    orderBy?: VersionCategoryAbbreviationOrderByWithRelationInput | VersionCategoryAbbreviationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VersionCategoryAbbreviations.
     */
    cursor?: VersionCategoryAbbreviationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VersionCategoryAbbreviations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VersionCategoryAbbreviations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VersionCategoryAbbreviations.
     */
    distinct?: VersionCategoryAbbreviationScalarFieldEnum | VersionCategoryAbbreviationScalarFieldEnum[]
  }

  /**
   * VersionCategoryAbbreviation findFirstOrThrow
   */
  export type VersionCategoryAbbreviationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategoryAbbreviation
     */
    select?: VersionCategoryAbbreviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategoryAbbreviation
     */
    omit?: VersionCategoryAbbreviationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryAbbreviationInclude<ExtArgs> | null
    /**
     * Filter, which VersionCategoryAbbreviation to fetch.
     */
    where?: VersionCategoryAbbreviationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VersionCategoryAbbreviations to fetch.
     */
    orderBy?: VersionCategoryAbbreviationOrderByWithRelationInput | VersionCategoryAbbreviationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VersionCategoryAbbreviations.
     */
    cursor?: VersionCategoryAbbreviationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VersionCategoryAbbreviations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VersionCategoryAbbreviations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VersionCategoryAbbreviations.
     */
    distinct?: VersionCategoryAbbreviationScalarFieldEnum | VersionCategoryAbbreviationScalarFieldEnum[]
  }

  /**
   * VersionCategoryAbbreviation findMany
   */
  export type VersionCategoryAbbreviationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategoryAbbreviation
     */
    select?: VersionCategoryAbbreviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategoryAbbreviation
     */
    omit?: VersionCategoryAbbreviationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryAbbreviationInclude<ExtArgs> | null
    /**
     * Filter, which VersionCategoryAbbreviations to fetch.
     */
    where?: VersionCategoryAbbreviationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VersionCategoryAbbreviations to fetch.
     */
    orderBy?: VersionCategoryAbbreviationOrderByWithRelationInput | VersionCategoryAbbreviationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VersionCategoryAbbreviations.
     */
    cursor?: VersionCategoryAbbreviationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VersionCategoryAbbreviations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VersionCategoryAbbreviations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VersionCategoryAbbreviations.
     */
    distinct?: VersionCategoryAbbreviationScalarFieldEnum | VersionCategoryAbbreviationScalarFieldEnum[]
  }

  /**
   * VersionCategoryAbbreviation create
   */
  export type VersionCategoryAbbreviationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategoryAbbreviation
     */
    select?: VersionCategoryAbbreviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategoryAbbreviation
     */
    omit?: VersionCategoryAbbreviationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryAbbreviationInclude<ExtArgs> | null
    /**
     * The data needed to create a VersionCategoryAbbreviation.
     */
    data: XOR<VersionCategoryAbbreviationCreateInput, VersionCategoryAbbreviationUncheckedCreateInput>
  }

  /**
   * VersionCategoryAbbreviation createMany
   */
  export type VersionCategoryAbbreviationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VersionCategoryAbbreviations.
     */
    data: VersionCategoryAbbreviationCreateManyInput | VersionCategoryAbbreviationCreateManyInput[]
  }

  /**
   * VersionCategoryAbbreviation createManyAndReturn
   */
  export type VersionCategoryAbbreviationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategoryAbbreviation
     */
    select?: VersionCategoryAbbreviationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategoryAbbreviation
     */
    omit?: VersionCategoryAbbreviationOmit<ExtArgs> | null
    /**
     * The data used to create many VersionCategoryAbbreviations.
     */
    data: VersionCategoryAbbreviationCreateManyInput | VersionCategoryAbbreviationCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryAbbreviationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VersionCategoryAbbreviation update
   */
  export type VersionCategoryAbbreviationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategoryAbbreviation
     */
    select?: VersionCategoryAbbreviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategoryAbbreviation
     */
    omit?: VersionCategoryAbbreviationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryAbbreviationInclude<ExtArgs> | null
    /**
     * The data needed to update a VersionCategoryAbbreviation.
     */
    data: XOR<VersionCategoryAbbreviationUpdateInput, VersionCategoryAbbreviationUncheckedUpdateInput>
    /**
     * Choose, which VersionCategoryAbbreviation to update.
     */
    where: VersionCategoryAbbreviationWhereUniqueInput
  }

  /**
   * VersionCategoryAbbreviation updateMany
   */
  export type VersionCategoryAbbreviationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VersionCategoryAbbreviations.
     */
    data: XOR<VersionCategoryAbbreviationUpdateManyMutationInput, VersionCategoryAbbreviationUncheckedUpdateManyInput>
    /**
     * Filter which VersionCategoryAbbreviations to update
     */
    where?: VersionCategoryAbbreviationWhereInput
    /**
     * Limit how many VersionCategoryAbbreviations to update.
     */
    limit?: number
  }

  /**
   * VersionCategoryAbbreviation updateManyAndReturn
   */
  export type VersionCategoryAbbreviationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategoryAbbreviation
     */
    select?: VersionCategoryAbbreviationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategoryAbbreviation
     */
    omit?: VersionCategoryAbbreviationOmit<ExtArgs> | null
    /**
     * The data used to update VersionCategoryAbbreviations.
     */
    data: XOR<VersionCategoryAbbreviationUpdateManyMutationInput, VersionCategoryAbbreviationUncheckedUpdateManyInput>
    /**
     * Filter which VersionCategoryAbbreviations to update
     */
    where?: VersionCategoryAbbreviationWhereInput
    /**
     * Limit how many VersionCategoryAbbreviations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryAbbreviationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VersionCategoryAbbreviation upsert
   */
  export type VersionCategoryAbbreviationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategoryAbbreviation
     */
    select?: VersionCategoryAbbreviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategoryAbbreviation
     */
    omit?: VersionCategoryAbbreviationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryAbbreviationInclude<ExtArgs> | null
    /**
     * The filter to search for the VersionCategoryAbbreviation to update in case it exists.
     */
    where: VersionCategoryAbbreviationWhereUniqueInput
    /**
     * In case the VersionCategoryAbbreviation found by the `where` argument doesn't exist, create a new VersionCategoryAbbreviation with this data.
     */
    create: XOR<VersionCategoryAbbreviationCreateInput, VersionCategoryAbbreviationUncheckedCreateInput>
    /**
     * In case the VersionCategoryAbbreviation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VersionCategoryAbbreviationUpdateInput, VersionCategoryAbbreviationUncheckedUpdateInput>
  }

  /**
   * VersionCategoryAbbreviation delete
   */
  export type VersionCategoryAbbreviationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategoryAbbreviation
     */
    select?: VersionCategoryAbbreviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategoryAbbreviation
     */
    omit?: VersionCategoryAbbreviationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryAbbreviationInclude<ExtArgs> | null
    /**
     * Filter which VersionCategoryAbbreviation to delete.
     */
    where: VersionCategoryAbbreviationWhereUniqueInput
  }

  /**
   * VersionCategoryAbbreviation deleteMany
   */
  export type VersionCategoryAbbreviationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VersionCategoryAbbreviations to delete
     */
    where?: VersionCategoryAbbreviationWhereInput
    /**
     * Limit how many VersionCategoryAbbreviations to delete.
     */
    limit?: number
  }

  /**
   * VersionCategoryAbbreviation without action
   */
  export type VersionCategoryAbbreviationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategoryAbbreviation
     */
    select?: VersionCategoryAbbreviationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategoryAbbreviation
     */
    omit?: VersionCategoryAbbreviationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryAbbreviationInclude<ExtArgs> | null
  }


  /**
   * Model VersionItem
   */

  export type AggregateVersionItem = {
    _count: VersionItemCountAggregateOutputType | null
    _avg: VersionItemAvgAggregateOutputType | null
    _sum: VersionItemSumAggregateOutputType | null
    _min: VersionItemMinAggregateOutputType | null
    _max: VersionItemMaxAggregateOutputType | null
  }

  export type VersionItemAvgAggregateOutputType = {
    rank: number | null
    orderWithinVersion: number | null
  }

  export type VersionItemSumAggregateOutputType = {
    rank: number | null
    orderWithinVersion: number | null
  }

  export type VersionItemMinAggregateOutputType = {
    id: string | null
    versionId: string | null
    versionCategoryId: string | null
    type: string | null
    body: string | null
    rank: number | null
    startedByUserId: string | null
    orderWithinVersion: number | null
    isTested: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VersionItemMaxAggregateOutputType = {
    id: string | null
    versionId: string | null
    versionCategoryId: string | null
    type: string | null
    body: string | null
    rank: number | null
    startedByUserId: string | null
    orderWithinVersion: number | null
    isTested: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VersionItemCountAggregateOutputType = {
    id: number
    versionId: number
    versionCategoryId: number
    type: number
    body: number
    rank: number
    startedByUserId: number
    orderWithinVersion: number
    isTested: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VersionItemAvgAggregateInputType = {
    rank?: true
    orderWithinVersion?: true
  }

  export type VersionItemSumAggregateInputType = {
    rank?: true
    orderWithinVersion?: true
  }

  export type VersionItemMinAggregateInputType = {
    id?: true
    versionId?: true
    versionCategoryId?: true
    type?: true
    body?: true
    rank?: true
    startedByUserId?: true
    orderWithinVersion?: true
    isTested?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VersionItemMaxAggregateInputType = {
    id?: true
    versionId?: true
    versionCategoryId?: true
    type?: true
    body?: true
    rank?: true
    startedByUserId?: true
    orderWithinVersion?: true
    isTested?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VersionItemCountAggregateInputType = {
    id?: true
    versionId?: true
    versionCategoryId?: true
    type?: true
    body?: true
    rank?: true
    startedByUserId?: true
    orderWithinVersion?: true
    isTested?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VersionItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VersionItem to aggregate.
     */
    where?: VersionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VersionItems to fetch.
     */
    orderBy?: VersionItemOrderByWithRelationInput | VersionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VersionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VersionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VersionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VersionItems
    **/
    _count?: true | VersionItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VersionItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VersionItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VersionItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VersionItemMaxAggregateInputType
  }

  export type GetVersionItemAggregateType<T extends VersionItemAggregateArgs> = {
        [P in keyof T & keyof AggregateVersionItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVersionItem[P]>
      : GetScalarType<T[P], AggregateVersionItem[P]>
  }




  export type VersionItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VersionItemWhereInput
    orderBy?: VersionItemOrderByWithAggregationInput | VersionItemOrderByWithAggregationInput[]
    by: VersionItemScalarFieldEnum[] | VersionItemScalarFieldEnum
    having?: VersionItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VersionItemCountAggregateInputType | true
    _avg?: VersionItemAvgAggregateInputType
    _sum?: VersionItemSumAggregateInputType
    _min?: VersionItemMinAggregateInputType
    _max?: VersionItemMaxAggregateInputType
  }

  export type VersionItemGroupByOutputType = {
    id: string
    versionId: string | null
    versionCategoryId: string | null
    type: string
    body: string
    rank: number
    startedByUserId: string | null
    orderWithinVersion: number
    isTested: boolean
    createdAt: Date
    updatedAt: Date
    _count: VersionItemCountAggregateOutputType | null
    _avg: VersionItemAvgAggregateOutputType | null
    _sum: VersionItemSumAggregateOutputType | null
    _min: VersionItemMinAggregateOutputType | null
    _max: VersionItemMaxAggregateOutputType | null
  }

  type GetVersionItemGroupByPayload<T extends VersionItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VersionItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VersionItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VersionItemGroupByOutputType[P]>
            : GetScalarType<T[P], VersionItemGroupByOutputType[P]>
        }
      >
    >


  export type VersionItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    versionId?: boolean
    versionCategoryId?: boolean
    type?: boolean
    body?: boolean
    rank?: boolean
    startedByUserId?: boolean
    orderWithinVersion?: boolean
    isTested?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean | VersionItem$versionArgs<ExtArgs>
    versionCategory?: boolean | VersionItem$versionCategoryArgs<ExtArgs>
    startedByUser?: boolean | VersionItem$startedByUserArgs<ExtArgs>
  }, ExtArgs["result"]["versionItem"]>

  export type VersionItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    versionId?: boolean
    versionCategoryId?: boolean
    type?: boolean
    body?: boolean
    rank?: boolean
    startedByUserId?: boolean
    orderWithinVersion?: boolean
    isTested?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean | VersionItem$versionArgs<ExtArgs>
    versionCategory?: boolean | VersionItem$versionCategoryArgs<ExtArgs>
    startedByUser?: boolean | VersionItem$startedByUserArgs<ExtArgs>
  }, ExtArgs["result"]["versionItem"]>

  export type VersionItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    versionId?: boolean
    versionCategoryId?: boolean
    type?: boolean
    body?: boolean
    rank?: boolean
    startedByUserId?: boolean
    orderWithinVersion?: boolean
    isTested?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean | VersionItem$versionArgs<ExtArgs>
    versionCategory?: boolean | VersionItem$versionCategoryArgs<ExtArgs>
    startedByUser?: boolean | VersionItem$startedByUserArgs<ExtArgs>
  }, ExtArgs["result"]["versionItem"]>

  export type VersionItemSelectScalar = {
    id?: boolean
    versionId?: boolean
    versionCategoryId?: boolean
    type?: boolean
    body?: boolean
    rank?: boolean
    startedByUserId?: boolean
    orderWithinVersion?: boolean
    isTested?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VersionItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "versionId" | "versionCategoryId" | "type" | "body" | "rank" | "startedByUserId" | "orderWithinVersion" | "isTested" | "createdAt" | "updatedAt", ExtArgs["result"]["versionItem"]>
  export type VersionItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    version?: boolean | VersionItem$versionArgs<ExtArgs>
    versionCategory?: boolean | VersionItem$versionCategoryArgs<ExtArgs>
    startedByUser?: boolean | VersionItem$startedByUserArgs<ExtArgs>
  }
  export type VersionItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    version?: boolean | VersionItem$versionArgs<ExtArgs>
    versionCategory?: boolean | VersionItem$versionCategoryArgs<ExtArgs>
    startedByUser?: boolean | VersionItem$startedByUserArgs<ExtArgs>
  }
  export type VersionItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    version?: boolean | VersionItem$versionArgs<ExtArgs>
    versionCategory?: boolean | VersionItem$versionCategoryArgs<ExtArgs>
    startedByUser?: boolean | VersionItem$startedByUserArgs<ExtArgs>
  }

  export type $VersionItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VersionItem"
    objects: {
      version: Prisma.$VersionPayload<ExtArgs> | null
      versionCategory: Prisma.$VersionCategoryPayload<ExtArgs> | null
      startedByUser: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      versionId: string | null
      versionCategoryId: string | null
      type: string
      body: string
      rank: number
      startedByUserId: string | null
      orderWithinVersion: number
      isTested: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["versionItem"]>
    composites: {}
  }

  type VersionItemGetPayload<S extends boolean | null | undefined | VersionItemDefaultArgs> = $Result.GetResult<Prisma.$VersionItemPayload, S>

  type VersionItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VersionItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VersionItemCountAggregateInputType | true
    }

  export interface VersionItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VersionItem'], meta: { name: 'VersionItem' } }
    /**
     * Find zero or one VersionItem that matches the filter.
     * @param {VersionItemFindUniqueArgs} args - Arguments to find a VersionItem
     * @example
     * // Get one VersionItem
     * const versionItem = await prisma.versionItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VersionItemFindUniqueArgs>(args: SelectSubset<T, VersionItemFindUniqueArgs<ExtArgs>>): Prisma__VersionItemClient<$Result.GetResult<Prisma.$VersionItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VersionItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VersionItemFindUniqueOrThrowArgs} args - Arguments to find a VersionItem
     * @example
     * // Get one VersionItem
     * const versionItem = await prisma.versionItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VersionItemFindUniqueOrThrowArgs>(args: SelectSubset<T, VersionItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VersionItemClient<$Result.GetResult<Prisma.$VersionItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VersionItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionItemFindFirstArgs} args - Arguments to find a VersionItem
     * @example
     * // Get one VersionItem
     * const versionItem = await prisma.versionItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VersionItemFindFirstArgs>(args?: SelectSubset<T, VersionItemFindFirstArgs<ExtArgs>>): Prisma__VersionItemClient<$Result.GetResult<Prisma.$VersionItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VersionItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionItemFindFirstOrThrowArgs} args - Arguments to find a VersionItem
     * @example
     * // Get one VersionItem
     * const versionItem = await prisma.versionItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VersionItemFindFirstOrThrowArgs>(args?: SelectSubset<T, VersionItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__VersionItemClient<$Result.GetResult<Prisma.$VersionItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VersionItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VersionItems
     * const versionItems = await prisma.versionItem.findMany()
     * 
     * // Get first 10 VersionItems
     * const versionItems = await prisma.versionItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const versionItemWithIdOnly = await prisma.versionItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VersionItemFindManyArgs>(args?: SelectSubset<T, VersionItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VersionItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VersionItem.
     * @param {VersionItemCreateArgs} args - Arguments to create a VersionItem.
     * @example
     * // Create one VersionItem
     * const VersionItem = await prisma.versionItem.create({
     *   data: {
     *     // ... data to create a VersionItem
     *   }
     * })
     * 
     */
    create<T extends VersionItemCreateArgs>(args: SelectSubset<T, VersionItemCreateArgs<ExtArgs>>): Prisma__VersionItemClient<$Result.GetResult<Prisma.$VersionItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VersionItems.
     * @param {VersionItemCreateManyArgs} args - Arguments to create many VersionItems.
     * @example
     * // Create many VersionItems
     * const versionItem = await prisma.versionItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VersionItemCreateManyArgs>(args?: SelectSubset<T, VersionItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VersionItems and returns the data saved in the database.
     * @param {VersionItemCreateManyAndReturnArgs} args - Arguments to create many VersionItems.
     * @example
     * // Create many VersionItems
     * const versionItem = await prisma.versionItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VersionItems and only return the `id`
     * const versionItemWithIdOnly = await prisma.versionItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VersionItemCreateManyAndReturnArgs>(args?: SelectSubset<T, VersionItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VersionItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VersionItem.
     * @param {VersionItemDeleteArgs} args - Arguments to delete one VersionItem.
     * @example
     * // Delete one VersionItem
     * const VersionItem = await prisma.versionItem.delete({
     *   where: {
     *     // ... filter to delete one VersionItem
     *   }
     * })
     * 
     */
    delete<T extends VersionItemDeleteArgs>(args: SelectSubset<T, VersionItemDeleteArgs<ExtArgs>>): Prisma__VersionItemClient<$Result.GetResult<Prisma.$VersionItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VersionItem.
     * @param {VersionItemUpdateArgs} args - Arguments to update one VersionItem.
     * @example
     * // Update one VersionItem
     * const versionItem = await prisma.versionItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VersionItemUpdateArgs>(args: SelectSubset<T, VersionItemUpdateArgs<ExtArgs>>): Prisma__VersionItemClient<$Result.GetResult<Prisma.$VersionItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VersionItems.
     * @param {VersionItemDeleteManyArgs} args - Arguments to filter VersionItems to delete.
     * @example
     * // Delete a few VersionItems
     * const { count } = await prisma.versionItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VersionItemDeleteManyArgs>(args?: SelectSubset<T, VersionItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VersionItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VersionItems
     * const versionItem = await prisma.versionItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VersionItemUpdateManyArgs>(args: SelectSubset<T, VersionItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VersionItems and returns the data updated in the database.
     * @param {VersionItemUpdateManyAndReturnArgs} args - Arguments to update many VersionItems.
     * @example
     * // Update many VersionItems
     * const versionItem = await prisma.versionItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VersionItems and only return the `id`
     * const versionItemWithIdOnly = await prisma.versionItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VersionItemUpdateManyAndReturnArgs>(args: SelectSubset<T, VersionItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VersionItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VersionItem.
     * @param {VersionItemUpsertArgs} args - Arguments to update or create a VersionItem.
     * @example
     * // Update or create a VersionItem
     * const versionItem = await prisma.versionItem.upsert({
     *   create: {
     *     // ... data to create a VersionItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VersionItem we want to update
     *   }
     * })
     */
    upsert<T extends VersionItemUpsertArgs>(args: SelectSubset<T, VersionItemUpsertArgs<ExtArgs>>): Prisma__VersionItemClient<$Result.GetResult<Prisma.$VersionItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VersionItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionItemCountArgs} args - Arguments to filter VersionItems to count.
     * @example
     * // Count the number of VersionItems
     * const count = await prisma.versionItem.count({
     *   where: {
     *     // ... the filter for the VersionItems we want to count
     *   }
     * })
    **/
    count<T extends VersionItemCountArgs>(
      args?: Subset<T, VersionItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VersionItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VersionItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VersionItemAggregateArgs>(args: Subset<T, VersionItemAggregateArgs>): Prisma.PrismaPromise<GetVersionItemAggregateType<T>>

    /**
     * Group by VersionItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VersionItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VersionItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VersionItemGroupByArgs['orderBy'] }
        : { orderBy?: VersionItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VersionItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVersionItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VersionItem model
   */
  readonly fields: VersionItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VersionItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VersionItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    version<T extends VersionItem$versionArgs<ExtArgs> = {}>(args?: Subset<T, VersionItem$versionArgs<ExtArgs>>): Prisma__VersionClient<$Result.GetResult<Prisma.$VersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    versionCategory<T extends VersionItem$versionCategoryArgs<ExtArgs> = {}>(args?: Subset<T, VersionItem$versionCategoryArgs<ExtArgs>>): Prisma__VersionCategoryClient<$Result.GetResult<Prisma.$VersionCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    startedByUser<T extends VersionItem$startedByUserArgs<ExtArgs> = {}>(args?: Subset<T, VersionItem$startedByUserArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VersionItem model
   */
  interface VersionItemFieldRefs {
    readonly id: FieldRef<"VersionItem", 'String'>
    readonly versionId: FieldRef<"VersionItem", 'String'>
    readonly versionCategoryId: FieldRef<"VersionItem", 'String'>
    readonly type: FieldRef<"VersionItem", 'String'>
    readonly body: FieldRef<"VersionItem", 'String'>
    readonly rank: FieldRef<"VersionItem", 'Float'>
    readonly startedByUserId: FieldRef<"VersionItem", 'String'>
    readonly orderWithinVersion: FieldRef<"VersionItem", 'Int'>
    readonly isTested: FieldRef<"VersionItem", 'Boolean'>
    readonly createdAt: FieldRef<"VersionItem", 'DateTime'>
    readonly updatedAt: FieldRef<"VersionItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VersionItem findUnique
   */
  export type VersionItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionItem
     */
    select?: VersionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionItem
     */
    omit?: VersionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionItemInclude<ExtArgs> | null
    /**
     * Filter, which VersionItem to fetch.
     */
    where: VersionItemWhereUniqueInput
  }

  /**
   * VersionItem findUniqueOrThrow
   */
  export type VersionItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionItem
     */
    select?: VersionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionItem
     */
    omit?: VersionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionItemInclude<ExtArgs> | null
    /**
     * Filter, which VersionItem to fetch.
     */
    where: VersionItemWhereUniqueInput
  }

  /**
   * VersionItem findFirst
   */
  export type VersionItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionItem
     */
    select?: VersionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionItem
     */
    omit?: VersionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionItemInclude<ExtArgs> | null
    /**
     * Filter, which VersionItem to fetch.
     */
    where?: VersionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VersionItems to fetch.
     */
    orderBy?: VersionItemOrderByWithRelationInput | VersionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VersionItems.
     */
    cursor?: VersionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VersionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VersionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VersionItems.
     */
    distinct?: VersionItemScalarFieldEnum | VersionItemScalarFieldEnum[]
  }

  /**
   * VersionItem findFirstOrThrow
   */
  export type VersionItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionItem
     */
    select?: VersionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionItem
     */
    omit?: VersionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionItemInclude<ExtArgs> | null
    /**
     * Filter, which VersionItem to fetch.
     */
    where?: VersionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VersionItems to fetch.
     */
    orderBy?: VersionItemOrderByWithRelationInput | VersionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VersionItems.
     */
    cursor?: VersionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VersionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VersionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VersionItems.
     */
    distinct?: VersionItemScalarFieldEnum | VersionItemScalarFieldEnum[]
  }

  /**
   * VersionItem findMany
   */
  export type VersionItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionItem
     */
    select?: VersionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionItem
     */
    omit?: VersionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionItemInclude<ExtArgs> | null
    /**
     * Filter, which VersionItems to fetch.
     */
    where?: VersionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VersionItems to fetch.
     */
    orderBy?: VersionItemOrderByWithRelationInput | VersionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VersionItems.
     */
    cursor?: VersionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VersionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VersionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VersionItems.
     */
    distinct?: VersionItemScalarFieldEnum | VersionItemScalarFieldEnum[]
  }

  /**
   * VersionItem create
   */
  export type VersionItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionItem
     */
    select?: VersionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionItem
     */
    omit?: VersionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionItemInclude<ExtArgs> | null
    /**
     * The data needed to create a VersionItem.
     */
    data: XOR<VersionItemCreateInput, VersionItemUncheckedCreateInput>
  }

  /**
   * VersionItem createMany
   */
  export type VersionItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VersionItems.
     */
    data: VersionItemCreateManyInput | VersionItemCreateManyInput[]
  }

  /**
   * VersionItem createManyAndReturn
   */
  export type VersionItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionItem
     */
    select?: VersionItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VersionItem
     */
    omit?: VersionItemOmit<ExtArgs> | null
    /**
     * The data used to create many VersionItems.
     */
    data: VersionItemCreateManyInput | VersionItemCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VersionItem update
   */
  export type VersionItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionItem
     */
    select?: VersionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionItem
     */
    omit?: VersionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionItemInclude<ExtArgs> | null
    /**
     * The data needed to update a VersionItem.
     */
    data: XOR<VersionItemUpdateInput, VersionItemUncheckedUpdateInput>
    /**
     * Choose, which VersionItem to update.
     */
    where: VersionItemWhereUniqueInput
  }

  /**
   * VersionItem updateMany
   */
  export type VersionItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VersionItems.
     */
    data: XOR<VersionItemUpdateManyMutationInput, VersionItemUncheckedUpdateManyInput>
    /**
     * Filter which VersionItems to update
     */
    where?: VersionItemWhereInput
    /**
     * Limit how many VersionItems to update.
     */
    limit?: number
  }

  /**
   * VersionItem updateManyAndReturn
   */
  export type VersionItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionItem
     */
    select?: VersionItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VersionItem
     */
    omit?: VersionItemOmit<ExtArgs> | null
    /**
     * The data used to update VersionItems.
     */
    data: XOR<VersionItemUpdateManyMutationInput, VersionItemUncheckedUpdateManyInput>
    /**
     * Filter which VersionItems to update
     */
    where?: VersionItemWhereInput
    /**
     * Limit how many VersionItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VersionItem upsert
   */
  export type VersionItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionItem
     */
    select?: VersionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionItem
     */
    omit?: VersionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionItemInclude<ExtArgs> | null
    /**
     * The filter to search for the VersionItem to update in case it exists.
     */
    where: VersionItemWhereUniqueInput
    /**
     * In case the VersionItem found by the `where` argument doesn't exist, create a new VersionItem with this data.
     */
    create: XOR<VersionItemCreateInput, VersionItemUncheckedCreateInput>
    /**
     * In case the VersionItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VersionItemUpdateInput, VersionItemUncheckedUpdateInput>
  }

  /**
   * VersionItem delete
   */
  export type VersionItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionItem
     */
    select?: VersionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionItem
     */
    omit?: VersionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionItemInclude<ExtArgs> | null
    /**
     * Filter which VersionItem to delete.
     */
    where: VersionItemWhereUniqueInput
  }

  /**
   * VersionItem deleteMany
   */
  export type VersionItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VersionItems to delete
     */
    where?: VersionItemWhereInput
    /**
     * Limit how many VersionItems to delete.
     */
    limit?: number
  }

  /**
   * VersionItem.version
   */
  export type VersionItem$versionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Version
     */
    select?: VersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Version
     */
    omit?: VersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionInclude<ExtArgs> | null
    where?: VersionWhereInput
  }

  /**
   * VersionItem.versionCategory
   */
  export type VersionItem$versionCategoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionCategory
     */
    select?: VersionCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionCategory
     */
    omit?: VersionCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionCategoryInclude<ExtArgs> | null
    where?: VersionCategoryWhereInput
  }

  /**
   * VersionItem.startedByUser
   */
  export type VersionItem$startedByUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * VersionItem without action
   */
  export type VersionItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VersionItem
     */
    select?: VersionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VersionItem
     */
    omit?: VersionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VersionItemInclude<ExtArgs> | null
  }


  /**
   * Model Flashcard
   */

  export type AggregateFlashcard = {
    _count: FlashcardCountAggregateOutputType | null
    _avg: FlashcardAvgAggregateOutputType | null
    _sum: FlashcardSumAggregateOutputType | null
    _min: FlashcardMinAggregateOutputType | null
    _max: FlashcardMaxAggregateOutputType | null
  }

  export type FlashcardAvgAggregateOutputType = {
    rank: number | null
  }

  export type FlashcardSumAggregateOutputType = {
    rank: number | null
  }

  export type FlashcardMinAggregateOutputType = {
    id: string | null
    ownerId: string | null
    front: string | null
    back: string | null
    frontLanguage: string | null
    backLanguage: string | null
    pronunciation: string | null
    createdAt: Date | null
    status: string | null
    rank: number | null
    memoryHook: string | null
    nextTestTime: Date | null
    copiedFromId: string | null
  }

  export type FlashcardMaxAggregateOutputType = {
    id: string | null
    ownerId: string | null
    front: string | null
    back: string | null
    frontLanguage: string | null
    backLanguage: string | null
    pronunciation: string | null
    createdAt: Date | null
    status: string | null
    rank: number | null
    memoryHook: string | null
    nextTestTime: Date | null
    copiedFromId: string | null
  }

  export type FlashcardCountAggregateOutputType = {
    id: number
    ownerId: number
    front: number
    back: number
    frontLanguage: number
    backLanguage: number
    pronunciation: number
    createdAt: number
    status: number
    rank: number
    memoryHook: number
    nextTestTime: number
    copiedFromId: number
    _all: number
  }


  export type FlashcardAvgAggregateInputType = {
    rank?: true
  }

  export type FlashcardSumAggregateInputType = {
    rank?: true
  }

  export type FlashcardMinAggregateInputType = {
    id?: true
    ownerId?: true
    front?: true
    back?: true
    frontLanguage?: true
    backLanguage?: true
    pronunciation?: true
    createdAt?: true
    status?: true
    rank?: true
    memoryHook?: true
    nextTestTime?: true
    copiedFromId?: true
  }

  export type FlashcardMaxAggregateInputType = {
    id?: true
    ownerId?: true
    front?: true
    back?: true
    frontLanguage?: true
    backLanguage?: true
    pronunciation?: true
    createdAt?: true
    status?: true
    rank?: true
    memoryHook?: true
    nextTestTime?: true
    copiedFromId?: true
  }

  export type FlashcardCountAggregateInputType = {
    id?: true
    ownerId?: true
    front?: true
    back?: true
    frontLanguage?: true
    backLanguage?: true
    pronunciation?: true
    createdAt?: true
    status?: true
    rank?: true
    memoryHook?: true
    nextTestTime?: true
    copiedFromId?: true
    _all?: true
  }

  export type FlashcardAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Flashcard to aggregate.
     */
    where?: FlashcardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flashcards to fetch.
     */
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FlashcardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flashcards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flashcards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Flashcards
    **/
    _count?: true | FlashcardCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FlashcardAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FlashcardSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FlashcardMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FlashcardMaxAggregateInputType
  }

  export type GetFlashcardAggregateType<T extends FlashcardAggregateArgs> = {
        [P in keyof T & keyof AggregateFlashcard]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFlashcard[P]>
      : GetScalarType<T[P], AggregateFlashcard[P]>
  }




  export type FlashcardGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlashcardWhereInput
    orderBy?: FlashcardOrderByWithAggregationInput | FlashcardOrderByWithAggregationInput[]
    by: FlashcardScalarFieldEnum[] | FlashcardScalarFieldEnum
    having?: FlashcardScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FlashcardCountAggregateInputType | true
    _avg?: FlashcardAvgAggregateInputType
    _sum?: FlashcardSumAggregateInputType
    _min?: FlashcardMinAggregateInputType
    _max?: FlashcardMaxAggregateInputType
  }

  export type FlashcardGroupByOutputType = {
    id: string
    ownerId: string
    front: string
    back: string
    frontLanguage: string
    backLanguage: string
    pronunciation: string | null
    createdAt: Date
    status: string
    rank: number
    memoryHook: string | null
    nextTestTime: Date | null
    copiedFromId: string | null
    _count: FlashcardCountAggregateOutputType | null
    _avg: FlashcardAvgAggregateOutputType | null
    _sum: FlashcardSumAggregateOutputType | null
    _min: FlashcardMinAggregateOutputType | null
    _max: FlashcardMaxAggregateOutputType | null
  }

  type GetFlashcardGroupByPayload<T extends FlashcardGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FlashcardGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FlashcardGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FlashcardGroupByOutputType[P]>
            : GetScalarType<T[P], FlashcardGroupByOutputType[P]>
        }
      >
    >


  export type FlashcardSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    front?: boolean
    back?: boolean
    frontLanguage?: boolean
    backLanguage?: boolean
    pronunciation?: boolean
    createdAt?: boolean
    status?: boolean
    rank?: boolean
    memoryHook?: boolean
    nextTestTime?: boolean
    copiedFromId?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    copiedFrom?: boolean | Flashcard$copiedFromArgs<ExtArgs>
    copies?: boolean | Flashcard$copiesArgs<ExtArgs>
    activities?: boolean | Flashcard$activitiesArgs<ExtArgs>
    tags?: boolean | Flashcard$tagsArgs<ExtArgs>
    _count?: boolean | FlashcardCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["flashcard"]>

  export type FlashcardSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    front?: boolean
    back?: boolean
    frontLanguage?: boolean
    backLanguage?: boolean
    pronunciation?: boolean
    createdAt?: boolean
    status?: boolean
    rank?: boolean
    memoryHook?: boolean
    nextTestTime?: boolean
    copiedFromId?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    copiedFrom?: boolean | Flashcard$copiedFromArgs<ExtArgs>
  }, ExtArgs["result"]["flashcard"]>

  export type FlashcardSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    front?: boolean
    back?: boolean
    frontLanguage?: boolean
    backLanguage?: boolean
    pronunciation?: boolean
    createdAt?: boolean
    status?: boolean
    rank?: boolean
    memoryHook?: boolean
    nextTestTime?: boolean
    copiedFromId?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    copiedFrom?: boolean | Flashcard$copiedFromArgs<ExtArgs>
  }, ExtArgs["result"]["flashcard"]>

  export type FlashcardSelectScalar = {
    id?: boolean
    ownerId?: boolean
    front?: boolean
    back?: boolean
    frontLanguage?: boolean
    backLanguage?: boolean
    pronunciation?: boolean
    createdAt?: boolean
    status?: boolean
    rank?: boolean
    memoryHook?: boolean
    nextTestTime?: boolean
    copiedFromId?: boolean
  }

  export type FlashcardOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ownerId" | "front" | "back" | "frontLanguage" | "backLanguage" | "pronunciation" | "createdAt" | "status" | "rank" | "memoryHook" | "nextTestTime" | "copiedFromId", ExtArgs["result"]["flashcard"]>
  export type FlashcardInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    copiedFrom?: boolean | Flashcard$copiedFromArgs<ExtArgs>
    copies?: boolean | Flashcard$copiesArgs<ExtArgs>
    activities?: boolean | Flashcard$activitiesArgs<ExtArgs>
    tags?: boolean | Flashcard$tagsArgs<ExtArgs>
    _count?: boolean | FlashcardCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FlashcardIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    copiedFrom?: boolean | Flashcard$copiedFromArgs<ExtArgs>
  }
  export type FlashcardIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    copiedFrom?: boolean | Flashcard$copiedFromArgs<ExtArgs>
  }

  export type $FlashcardPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Flashcard"
    objects: {
      owner: Prisma.$UserPayload<ExtArgs>
      copiedFrom: Prisma.$FlashcardPayload<ExtArgs> | null
      copies: Prisma.$FlashcardPayload<ExtArgs>[]
      activities: Prisma.$UserFlashcardActivityPayload<ExtArgs>[]
      tags: Prisma.$FlashcardTagPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ownerId: string
      front: string
      back: string
      frontLanguage: string
      backLanguage: string
      pronunciation: string | null
      createdAt: Date
      status: string
      rank: number
      memoryHook: string | null
      nextTestTime: Date | null
      copiedFromId: string | null
    }, ExtArgs["result"]["flashcard"]>
    composites: {}
  }

  type FlashcardGetPayload<S extends boolean | null | undefined | FlashcardDefaultArgs> = $Result.GetResult<Prisma.$FlashcardPayload, S>

  type FlashcardCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FlashcardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FlashcardCountAggregateInputType | true
    }

  export interface FlashcardDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Flashcard'], meta: { name: 'Flashcard' } }
    /**
     * Find zero or one Flashcard that matches the filter.
     * @param {FlashcardFindUniqueArgs} args - Arguments to find a Flashcard
     * @example
     * // Get one Flashcard
     * const flashcard = await prisma.flashcard.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FlashcardFindUniqueArgs>(args: SelectSubset<T, FlashcardFindUniqueArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Flashcard that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FlashcardFindUniqueOrThrowArgs} args - Arguments to find a Flashcard
     * @example
     * // Get one Flashcard
     * const flashcard = await prisma.flashcard.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FlashcardFindUniqueOrThrowArgs>(args: SelectSubset<T, FlashcardFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Flashcard that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardFindFirstArgs} args - Arguments to find a Flashcard
     * @example
     * // Get one Flashcard
     * const flashcard = await prisma.flashcard.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FlashcardFindFirstArgs>(args?: SelectSubset<T, FlashcardFindFirstArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Flashcard that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardFindFirstOrThrowArgs} args - Arguments to find a Flashcard
     * @example
     * // Get one Flashcard
     * const flashcard = await prisma.flashcard.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FlashcardFindFirstOrThrowArgs>(args?: SelectSubset<T, FlashcardFindFirstOrThrowArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Flashcards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Flashcards
     * const flashcards = await prisma.flashcard.findMany()
     * 
     * // Get first 10 Flashcards
     * const flashcards = await prisma.flashcard.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const flashcardWithIdOnly = await prisma.flashcard.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FlashcardFindManyArgs>(args?: SelectSubset<T, FlashcardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Flashcard.
     * @param {FlashcardCreateArgs} args - Arguments to create a Flashcard.
     * @example
     * // Create one Flashcard
     * const Flashcard = await prisma.flashcard.create({
     *   data: {
     *     // ... data to create a Flashcard
     *   }
     * })
     * 
     */
    create<T extends FlashcardCreateArgs>(args: SelectSubset<T, FlashcardCreateArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Flashcards.
     * @param {FlashcardCreateManyArgs} args - Arguments to create many Flashcards.
     * @example
     * // Create many Flashcards
     * const flashcard = await prisma.flashcard.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FlashcardCreateManyArgs>(args?: SelectSubset<T, FlashcardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Flashcards and returns the data saved in the database.
     * @param {FlashcardCreateManyAndReturnArgs} args - Arguments to create many Flashcards.
     * @example
     * // Create many Flashcards
     * const flashcard = await prisma.flashcard.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Flashcards and only return the `id`
     * const flashcardWithIdOnly = await prisma.flashcard.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FlashcardCreateManyAndReturnArgs>(args?: SelectSubset<T, FlashcardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Flashcard.
     * @param {FlashcardDeleteArgs} args - Arguments to delete one Flashcard.
     * @example
     * // Delete one Flashcard
     * const Flashcard = await prisma.flashcard.delete({
     *   where: {
     *     // ... filter to delete one Flashcard
     *   }
     * })
     * 
     */
    delete<T extends FlashcardDeleteArgs>(args: SelectSubset<T, FlashcardDeleteArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Flashcard.
     * @param {FlashcardUpdateArgs} args - Arguments to update one Flashcard.
     * @example
     * // Update one Flashcard
     * const flashcard = await prisma.flashcard.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FlashcardUpdateArgs>(args: SelectSubset<T, FlashcardUpdateArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Flashcards.
     * @param {FlashcardDeleteManyArgs} args - Arguments to filter Flashcards to delete.
     * @example
     * // Delete a few Flashcards
     * const { count } = await prisma.flashcard.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FlashcardDeleteManyArgs>(args?: SelectSubset<T, FlashcardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Flashcards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Flashcards
     * const flashcard = await prisma.flashcard.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FlashcardUpdateManyArgs>(args: SelectSubset<T, FlashcardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Flashcards and returns the data updated in the database.
     * @param {FlashcardUpdateManyAndReturnArgs} args - Arguments to update many Flashcards.
     * @example
     * // Update many Flashcards
     * const flashcard = await prisma.flashcard.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Flashcards and only return the `id`
     * const flashcardWithIdOnly = await prisma.flashcard.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FlashcardUpdateManyAndReturnArgs>(args: SelectSubset<T, FlashcardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Flashcard.
     * @param {FlashcardUpsertArgs} args - Arguments to update or create a Flashcard.
     * @example
     * // Update or create a Flashcard
     * const flashcard = await prisma.flashcard.upsert({
     *   create: {
     *     // ... data to create a Flashcard
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Flashcard we want to update
     *   }
     * })
     */
    upsert<T extends FlashcardUpsertArgs>(args: SelectSubset<T, FlashcardUpsertArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Flashcards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardCountArgs} args - Arguments to filter Flashcards to count.
     * @example
     * // Count the number of Flashcards
     * const count = await prisma.flashcard.count({
     *   where: {
     *     // ... the filter for the Flashcards we want to count
     *   }
     * })
    **/
    count<T extends FlashcardCountArgs>(
      args?: Subset<T, FlashcardCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FlashcardCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Flashcard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FlashcardAggregateArgs>(args: Subset<T, FlashcardAggregateArgs>): Prisma.PrismaPromise<GetFlashcardAggregateType<T>>

    /**
     * Group by Flashcard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FlashcardGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FlashcardGroupByArgs['orderBy'] }
        : { orderBy?: FlashcardGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FlashcardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFlashcardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Flashcard model
   */
  readonly fields: FlashcardFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Flashcard.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FlashcardClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    copiedFrom<T extends Flashcard$copiedFromArgs<ExtArgs> = {}>(args?: Subset<T, Flashcard$copiedFromArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    copies<T extends Flashcard$copiesArgs<ExtArgs> = {}>(args?: Subset<T, Flashcard$copiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    activities<T extends Flashcard$activitiesArgs<ExtArgs> = {}>(args?: Subset<T, Flashcard$activitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserFlashcardActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tags<T extends Flashcard$tagsArgs<ExtArgs> = {}>(args?: Subset<T, Flashcard$tagsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardTagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Flashcard model
   */
  interface FlashcardFieldRefs {
    readonly id: FieldRef<"Flashcard", 'String'>
    readonly ownerId: FieldRef<"Flashcard", 'String'>
    readonly front: FieldRef<"Flashcard", 'String'>
    readonly back: FieldRef<"Flashcard", 'String'>
    readonly frontLanguage: FieldRef<"Flashcard", 'String'>
    readonly backLanguage: FieldRef<"Flashcard", 'String'>
    readonly pronunciation: FieldRef<"Flashcard", 'String'>
    readonly createdAt: FieldRef<"Flashcard", 'DateTime'>
    readonly status: FieldRef<"Flashcard", 'String'>
    readonly rank: FieldRef<"Flashcard", 'Float'>
    readonly memoryHook: FieldRef<"Flashcard", 'String'>
    readonly nextTestTime: FieldRef<"Flashcard", 'DateTime'>
    readonly copiedFromId: FieldRef<"Flashcard", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Flashcard findUnique
   */
  export type FlashcardFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter, which Flashcard to fetch.
     */
    where: FlashcardWhereUniqueInput
  }

  /**
   * Flashcard findUniqueOrThrow
   */
  export type FlashcardFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter, which Flashcard to fetch.
     */
    where: FlashcardWhereUniqueInput
  }

  /**
   * Flashcard findFirst
   */
  export type FlashcardFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter, which Flashcard to fetch.
     */
    where?: FlashcardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flashcards to fetch.
     */
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Flashcards.
     */
    cursor?: FlashcardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flashcards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flashcards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Flashcards.
     */
    distinct?: FlashcardScalarFieldEnum | FlashcardScalarFieldEnum[]
  }

  /**
   * Flashcard findFirstOrThrow
   */
  export type FlashcardFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter, which Flashcard to fetch.
     */
    where?: FlashcardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flashcards to fetch.
     */
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Flashcards.
     */
    cursor?: FlashcardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flashcards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flashcards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Flashcards.
     */
    distinct?: FlashcardScalarFieldEnum | FlashcardScalarFieldEnum[]
  }

  /**
   * Flashcard findMany
   */
  export type FlashcardFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter, which Flashcards to fetch.
     */
    where?: FlashcardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flashcards to fetch.
     */
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Flashcards.
     */
    cursor?: FlashcardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flashcards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flashcards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Flashcards.
     */
    distinct?: FlashcardScalarFieldEnum | FlashcardScalarFieldEnum[]
  }

  /**
   * Flashcard create
   */
  export type FlashcardCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * The data needed to create a Flashcard.
     */
    data: XOR<FlashcardCreateInput, FlashcardUncheckedCreateInput>
  }

  /**
   * Flashcard createMany
   */
  export type FlashcardCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Flashcards.
     */
    data: FlashcardCreateManyInput | FlashcardCreateManyInput[]
  }

  /**
   * Flashcard createManyAndReturn
   */
  export type FlashcardCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * The data used to create many Flashcards.
     */
    data: FlashcardCreateManyInput | FlashcardCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Flashcard update
   */
  export type FlashcardUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * The data needed to update a Flashcard.
     */
    data: XOR<FlashcardUpdateInput, FlashcardUncheckedUpdateInput>
    /**
     * Choose, which Flashcard to update.
     */
    where: FlashcardWhereUniqueInput
  }

  /**
   * Flashcard updateMany
   */
  export type FlashcardUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Flashcards.
     */
    data: XOR<FlashcardUpdateManyMutationInput, FlashcardUncheckedUpdateManyInput>
    /**
     * Filter which Flashcards to update
     */
    where?: FlashcardWhereInput
    /**
     * Limit how many Flashcards to update.
     */
    limit?: number
  }

  /**
   * Flashcard updateManyAndReturn
   */
  export type FlashcardUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * The data used to update Flashcards.
     */
    data: XOR<FlashcardUpdateManyMutationInput, FlashcardUncheckedUpdateManyInput>
    /**
     * Filter which Flashcards to update
     */
    where?: FlashcardWhereInput
    /**
     * Limit how many Flashcards to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Flashcard upsert
   */
  export type FlashcardUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * The filter to search for the Flashcard to update in case it exists.
     */
    where: FlashcardWhereUniqueInput
    /**
     * In case the Flashcard found by the `where` argument doesn't exist, create a new Flashcard with this data.
     */
    create: XOR<FlashcardCreateInput, FlashcardUncheckedCreateInput>
    /**
     * In case the Flashcard was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FlashcardUpdateInput, FlashcardUncheckedUpdateInput>
  }

  /**
   * Flashcard delete
   */
  export type FlashcardDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter which Flashcard to delete.
     */
    where: FlashcardWhereUniqueInput
  }

  /**
   * Flashcard deleteMany
   */
  export type FlashcardDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Flashcards to delete
     */
    where?: FlashcardWhereInput
    /**
     * Limit how many Flashcards to delete.
     */
    limit?: number
  }

  /**
   * Flashcard.copiedFrom
   */
  export type Flashcard$copiedFromArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    where?: FlashcardWhereInput
  }

  /**
   * Flashcard.copies
   */
  export type Flashcard$copiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    where?: FlashcardWhereInput
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    cursor?: FlashcardWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FlashcardScalarFieldEnum | FlashcardScalarFieldEnum[]
  }

  /**
   * Flashcard.activities
   */
  export type Flashcard$activitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardActivity
     */
    select?: UserFlashcardActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardActivity
     */
    omit?: UserFlashcardActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardActivityInclude<ExtArgs> | null
    where?: UserFlashcardActivityWhereInput
    orderBy?: UserFlashcardActivityOrderByWithRelationInput | UserFlashcardActivityOrderByWithRelationInput[]
    cursor?: UserFlashcardActivityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserFlashcardActivityScalarFieldEnum | UserFlashcardActivityScalarFieldEnum[]
  }

  /**
   * Flashcard.tags
   */
  export type Flashcard$tagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardTag
     */
    select?: FlashcardTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardTag
     */
    omit?: FlashcardTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardTagInclude<ExtArgs> | null
    where?: FlashcardTagWhereInput
    orderBy?: FlashcardTagOrderByWithRelationInput | FlashcardTagOrderByWithRelationInput[]
    cursor?: FlashcardTagWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FlashcardTagScalarFieldEnum | FlashcardTagScalarFieldEnum[]
  }

  /**
   * Flashcard without action
   */
  export type FlashcardDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
  }


  /**
   * Model UserFlashcardActivity
   */

  export type AggregateUserFlashcardActivity = {
    _count: UserFlashcardActivityCountAggregateOutputType | null
    _min: UserFlashcardActivityMinAggregateOutputType | null
    _max: UserFlashcardActivityMaxAggregateOutputType | null
  }

  export type UserFlashcardActivityMinAggregateOutputType = {
    id: string | null
    userId: string | null
    flashcardId: string | null
    whenActedUpon: Date | null
    actionTaken: string | null
    actionDetails: string | null
  }

  export type UserFlashcardActivityMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    flashcardId: string | null
    whenActedUpon: Date | null
    actionTaken: string | null
    actionDetails: string | null
  }

  export type UserFlashcardActivityCountAggregateOutputType = {
    id: number
    userId: number
    flashcardId: number
    whenActedUpon: number
    actionTaken: number
    actionDetails: number
    _all: number
  }


  export type UserFlashcardActivityMinAggregateInputType = {
    id?: true
    userId?: true
    flashcardId?: true
    whenActedUpon?: true
    actionTaken?: true
    actionDetails?: true
  }

  export type UserFlashcardActivityMaxAggregateInputType = {
    id?: true
    userId?: true
    flashcardId?: true
    whenActedUpon?: true
    actionTaken?: true
    actionDetails?: true
  }

  export type UserFlashcardActivityCountAggregateInputType = {
    id?: true
    userId?: true
    flashcardId?: true
    whenActedUpon?: true
    actionTaken?: true
    actionDetails?: true
    _all?: true
  }

  export type UserFlashcardActivityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserFlashcardActivity to aggregate.
     */
    where?: UserFlashcardActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserFlashcardActivities to fetch.
     */
    orderBy?: UserFlashcardActivityOrderByWithRelationInput | UserFlashcardActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserFlashcardActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserFlashcardActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserFlashcardActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserFlashcardActivities
    **/
    _count?: true | UserFlashcardActivityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserFlashcardActivityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserFlashcardActivityMaxAggregateInputType
  }

  export type GetUserFlashcardActivityAggregateType<T extends UserFlashcardActivityAggregateArgs> = {
        [P in keyof T & keyof AggregateUserFlashcardActivity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserFlashcardActivity[P]>
      : GetScalarType<T[P], AggregateUserFlashcardActivity[P]>
  }




  export type UserFlashcardActivityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserFlashcardActivityWhereInput
    orderBy?: UserFlashcardActivityOrderByWithAggregationInput | UserFlashcardActivityOrderByWithAggregationInput[]
    by: UserFlashcardActivityScalarFieldEnum[] | UserFlashcardActivityScalarFieldEnum
    having?: UserFlashcardActivityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserFlashcardActivityCountAggregateInputType | true
    _min?: UserFlashcardActivityMinAggregateInputType
    _max?: UserFlashcardActivityMaxAggregateInputType
  }

  export type UserFlashcardActivityGroupByOutputType = {
    id: string
    userId: string
    flashcardId: string
    whenActedUpon: Date
    actionTaken: string
    actionDetails: string | null
    _count: UserFlashcardActivityCountAggregateOutputType | null
    _min: UserFlashcardActivityMinAggregateOutputType | null
    _max: UserFlashcardActivityMaxAggregateOutputType | null
  }

  type GetUserFlashcardActivityGroupByPayload<T extends UserFlashcardActivityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserFlashcardActivityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserFlashcardActivityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserFlashcardActivityGroupByOutputType[P]>
            : GetScalarType<T[P], UserFlashcardActivityGroupByOutputType[P]>
        }
      >
    >


  export type UserFlashcardActivitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    flashcardId?: boolean
    whenActedUpon?: boolean
    actionTaken?: boolean
    actionDetails?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    flashcard?: boolean | FlashcardDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userFlashcardActivity"]>

  export type UserFlashcardActivitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    flashcardId?: boolean
    whenActedUpon?: boolean
    actionTaken?: boolean
    actionDetails?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    flashcard?: boolean | FlashcardDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userFlashcardActivity"]>

  export type UserFlashcardActivitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    flashcardId?: boolean
    whenActedUpon?: boolean
    actionTaken?: boolean
    actionDetails?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    flashcard?: boolean | FlashcardDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userFlashcardActivity"]>

  export type UserFlashcardActivitySelectScalar = {
    id?: boolean
    userId?: boolean
    flashcardId?: boolean
    whenActedUpon?: boolean
    actionTaken?: boolean
    actionDetails?: boolean
  }

  export type UserFlashcardActivityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "flashcardId" | "whenActedUpon" | "actionTaken" | "actionDetails", ExtArgs["result"]["userFlashcardActivity"]>
  export type UserFlashcardActivityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    flashcard?: boolean | FlashcardDefaultArgs<ExtArgs>
  }
  export type UserFlashcardActivityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    flashcard?: boolean | FlashcardDefaultArgs<ExtArgs>
  }
  export type UserFlashcardActivityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    flashcard?: boolean | FlashcardDefaultArgs<ExtArgs>
  }

  export type $UserFlashcardActivityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserFlashcardActivity"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      flashcard: Prisma.$FlashcardPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      flashcardId: string
      whenActedUpon: Date
      actionTaken: string
      actionDetails: string | null
    }, ExtArgs["result"]["userFlashcardActivity"]>
    composites: {}
  }

  type UserFlashcardActivityGetPayload<S extends boolean | null | undefined | UserFlashcardActivityDefaultArgs> = $Result.GetResult<Prisma.$UserFlashcardActivityPayload, S>

  type UserFlashcardActivityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFlashcardActivityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserFlashcardActivityCountAggregateInputType | true
    }

  export interface UserFlashcardActivityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserFlashcardActivity'], meta: { name: 'UserFlashcardActivity' } }
    /**
     * Find zero or one UserFlashcardActivity that matches the filter.
     * @param {UserFlashcardActivityFindUniqueArgs} args - Arguments to find a UserFlashcardActivity
     * @example
     * // Get one UserFlashcardActivity
     * const userFlashcardActivity = await prisma.userFlashcardActivity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFlashcardActivityFindUniqueArgs>(args: SelectSubset<T, UserFlashcardActivityFindUniqueArgs<ExtArgs>>): Prisma__UserFlashcardActivityClient<$Result.GetResult<Prisma.$UserFlashcardActivityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserFlashcardActivity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFlashcardActivityFindUniqueOrThrowArgs} args - Arguments to find a UserFlashcardActivity
     * @example
     * // Get one UserFlashcardActivity
     * const userFlashcardActivity = await prisma.userFlashcardActivity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFlashcardActivityFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFlashcardActivityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserFlashcardActivityClient<$Result.GetResult<Prisma.$UserFlashcardActivityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserFlashcardActivity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFlashcardActivityFindFirstArgs} args - Arguments to find a UserFlashcardActivity
     * @example
     * // Get one UserFlashcardActivity
     * const userFlashcardActivity = await prisma.userFlashcardActivity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFlashcardActivityFindFirstArgs>(args?: SelectSubset<T, UserFlashcardActivityFindFirstArgs<ExtArgs>>): Prisma__UserFlashcardActivityClient<$Result.GetResult<Prisma.$UserFlashcardActivityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserFlashcardActivity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFlashcardActivityFindFirstOrThrowArgs} args - Arguments to find a UserFlashcardActivity
     * @example
     * // Get one UserFlashcardActivity
     * const userFlashcardActivity = await prisma.userFlashcardActivity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFlashcardActivityFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFlashcardActivityFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserFlashcardActivityClient<$Result.GetResult<Prisma.$UserFlashcardActivityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserFlashcardActivities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFlashcardActivityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserFlashcardActivities
     * const userFlashcardActivities = await prisma.userFlashcardActivity.findMany()
     * 
     * // Get first 10 UserFlashcardActivities
     * const userFlashcardActivities = await prisma.userFlashcardActivity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userFlashcardActivityWithIdOnly = await prisma.userFlashcardActivity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFlashcardActivityFindManyArgs>(args?: SelectSubset<T, UserFlashcardActivityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserFlashcardActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserFlashcardActivity.
     * @param {UserFlashcardActivityCreateArgs} args - Arguments to create a UserFlashcardActivity.
     * @example
     * // Create one UserFlashcardActivity
     * const UserFlashcardActivity = await prisma.userFlashcardActivity.create({
     *   data: {
     *     // ... data to create a UserFlashcardActivity
     *   }
     * })
     * 
     */
    create<T extends UserFlashcardActivityCreateArgs>(args: SelectSubset<T, UserFlashcardActivityCreateArgs<ExtArgs>>): Prisma__UserFlashcardActivityClient<$Result.GetResult<Prisma.$UserFlashcardActivityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserFlashcardActivities.
     * @param {UserFlashcardActivityCreateManyArgs} args - Arguments to create many UserFlashcardActivities.
     * @example
     * // Create many UserFlashcardActivities
     * const userFlashcardActivity = await prisma.userFlashcardActivity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserFlashcardActivityCreateManyArgs>(args?: SelectSubset<T, UserFlashcardActivityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserFlashcardActivities and returns the data saved in the database.
     * @param {UserFlashcardActivityCreateManyAndReturnArgs} args - Arguments to create many UserFlashcardActivities.
     * @example
     * // Create many UserFlashcardActivities
     * const userFlashcardActivity = await prisma.userFlashcardActivity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserFlashcardActivities and only return the `id`
     * const userFlashcardActivityWithIdOnly = await prisma.userFlashcardActivity.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserFlashcardActivityCreateManyAndReturnArgs>(args?: SelectSubset<T, UserFlashcardActivityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserFlashcardActivityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserFlashcardActivity.
     * @param {UserFlashcardActivityDeleteArgs} args - Arguments to delete one UserFlashcardActivity.
     * @example
     * // Delete one UserFlashcardActivity
     * const UserFlashcardActivity = await prisma.userFlashcardActivity.delete({
     *   where: {
     *     // ... filter to delete one UserFlashcardActivity
     *   }
     * })
     * 
     */
    delete<T extends UserFlashcardActivityDeleteArgs>(args: SelectSubset<T, UserFlashcardActivityDeleteArgs<ExtArgs>>): Prisma__UserFlashcardActivityClient<$Result.GetResult<Prisma.$UserFlashcardActivityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserFlashcardActivity.
     * @param {UserFlashcardActivityUpdateArgs} args - Arguments to update one UserFlashcardActivity.
     * @example
     * // Update one UserFlashcardActivity
     * const userFlashcardActivity = await prisma.userFlashcardActivity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserFlashcardActivityUpdateArgs>(args: SelectSubset<T, UserFlashcardActivityUpdateArgs<ExtArgs>>): Prisma__UserFlashcardActivityClient<$Result.GetResult<Prisma.$UserFlashcardActivityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserFlashcardActivities.
     * @param {UserFlashcardActivityDeleteManyArgs} args - Arguments to filter UserFlashcardActivities to delete.
     * @example
     * // Delete a few UserFlashcardActivities
     * const { count } = await prisma.userFlashcardActivity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserFlashcardActivityDeleteManyArgs>(args?: SelectSubset<T, UserFlashcardActivityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserFlashcardActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFlashcardActivityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserFlashcardActivities
     * const userFlashcardActivity = await prisma.userFlashcardActivity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserFlashcardActivityUpdateManyArgs>(args: SelectSubset<T, UserFlashcardActivityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserFlashcardActivities and returns the data updated in the database.
     * @param {UserFlashcardActivityUpdateManyAndReturnArgs} args - Arguments to update many UserFlashcardActivities.
     * @example
     * // Update many UserFlashcardActivities
     * const userFlashcardActivity = await prisma.userFlashcardActivity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserFlashcardActivities and only return the `id`
     * const userFlashcardActivityWithIdOnly = await prisma.userFlashcardActivity.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserFlashcardActivityUpdateManyAndReturnArgs>(args: SelectSubset<T, UserFlashcardActivityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserFlashcardActivityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserFlashcardActivity.
     * @param {UserFlashcardActivityUpsertArgs} args - Arguments to update or create a UserFlashcardActivity.
     * @example
     * // Update or create a UserFlashcardActivity
     * const userFlashcardActivity = await prisma.userFlashcardActivity.upsert({
     *   create: {
     *     // ... data to create a UserFlashcardActivity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserFlashcardActivity we want to update
     *   }
     * })
     */
    upsert<T extends UserFlashcardActivityUpsertArgs>(args: SelectSubset<T, UserFlashcardActivityUpsertArgs<ExtArgs>>): Prisma__UserFlashcardActivityClient<$Result.GetResult<Prisma.$UserFlashcardActivityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserFlashcardActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFlashcardActivityCountArgs} args - Arguments to filter UserFlashcardActivities to count.
     * @example
     * // Count the number of UserFlashcardActivities
     * const count = await prisma.userFlashcardActivity.count({
     *   where: {
     *     // ... the filter for the UserFlashcardActivities we want to count
     *   }
     * })
    **/
    count<T extends UserFlashcardActivityCountArgs>(
      args?: Subset<T, UserFlashcardActivityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserFlashcardActivityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserFlashcardActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFlashcardActivityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserFlashcardActivityAggregateArgs>(args: Subset<T, UserFlashcardActivityAggregateArgs>): Prisma.PrismaPromise<GetUserFlashcardActivityAggregateType<T>>

    /**
     * Group by UserFlashcardActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFlashcardActivityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserFlashcardActivityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserFlashcardActivityGroupByArgs['orderBy'] }
        : { orderBy?: UserFlashcardActivityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserFlashcardActivityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserFlashcardActivityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserFlashcardActivity model
   */
  readonly fields: UserFlashcardActivityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserFlashcardActivity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserFlashcardActivityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    flashcard<T extends FlashcardDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FlashcardDefaultArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserFlashcardActivity model
   */
  interface UserFlashcardActivityFieldRefs {
    readonly id: FieldRef<"UserFlashcardActivity", 'String'>
    readonly userId: FieldRef<"UserFlashcardActivity", 'String'>
    readonly flashcardId: FieldRef<"UserFlashcardActivity", 'String'>
    readonly whenActedUpon: FieldRef<"UserFlashcardActivity", 'DateTime'>
    readonly actionTaken: FieldRef<"UserFlashcardActivity", 'String'>
    readonly actionDetails: FieldRef<"UserFlashcardActivity", 'String'>
  }
    

  // Custom InputTypes
  /**
   * UserFlashcardActivity findUnique
   */
  export type UserFlashcardActivityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardActivity
     */
    select?: UserFlashcardActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardActivity
     */
    omit?: UserFlashcardActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardActivityInclude<ExtArgs> | null
    /**
     * Filter, which UserFlashcardActivity to fetch.
     */
    where: UserFlashcardActivityWhereUniqueInput
  }

  /**
   * UserFlashcardActivity findUniqueOrThrow
   */
  export type UserFlashcardActivityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardActivity
     */
    select?: UserFlashcardActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardActivity
     */
    omit?: UserFlashcardActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardActivityInclude<ExtArgs> | null
    /**
     * Filter, which UserFlashcardActivity to fetch.
     */
    where: UserFlashcardActivityWhereUniqueInput
  }

  /**
   * UserFlashcardActivity findFirst
   */
  export type UserFlashcardActivityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardActivity
     */
    select?: UserFlashcardActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardActivity
     */
    omit?: UserFlashcardActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardActivityInclude<ExtArgs> | null
    /**
     * Filter, which UserFlashcardActivity to fetch.
     */
    where?: UserFlashcardActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserFlashcardActivities to fetch.
     */
    orderBy?: UserFlashcardActivityOrderByWithRelationInput | UserFlashcardActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserFlashcardActivities.
     */
    cursor?: UserFlashcardActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserFlashcardActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserFlashcardActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserFlashcardActivities.
     */
    distinct?: UserFlashcardActivityScalarFieldEnum | UserFlashcardActivityScalarFieldEnum[]
  }

  /**
   * UserFlashcardActivity findFirstOrThrow
   */
  export type UserFlashcardActivityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardActivity
     */
    select?: UserFlashcardActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardActivity
     */
    omit?: UserFlashcardActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardActivityInclude<ExtArgs> | null
    /**
     * Filter, which UserFlashcardActivity to fetch.
     */
    where?: UserFlashcardActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserFlashcardActivities to fetch.
     */
    orderBy?: UserFlashcardActivityOrderByWithRelationInput | UserFlashcardActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserFlashcardActivities.
     */
    cursor?: UserFlashcardActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserFlashcardActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserFlashcardActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserFlashcardActivities.
     */
    distinct?: UserFlashcardActivityScalarFieldEnum | UserFlashcardActivityScalarFieldEnum[]
  }

  /**
   * UserFlashcardActivity findMany
   */
  export type UserFlashcardActivityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardActivity
     */
    select?: UserFlashcardActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardActivity
     */
    omit?: UserFlashcardActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardActivityInclude<ExtArgs> | null
    /**
     * Filter, which UserFlashcardActivities to fetch.
     */
    where?: UserFlashcardActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserFlashcardActivities to fetch.
     */
    orderBy?: UserFlashcardActivityOrderByWithRelationInput | UserFlashcardActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserFlashcardActivities.
     */
    cursor?: UserFlashcardActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserFlashcardActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserFlashcardActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserFlashcardActivities.
     */
    distinct?: UserFlashcardActivityScalarFieldEnum | UserFlashcardActivityScalarFieldEnum[]
  }

  /**
   * UserFlashcardActivity create
   */
  export type UserFlashcardActivityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardActivity
     */
    select?: UserFlashcardActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardActivity
     */
    omit?: UserFlashcardActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardActivityInclude<ExtArgs> | null
    /**
     * The data needed to create a UserFlashcardActivity.
     */
    data: XOR<UserFlashcardActivityCreateInput, UserFlashcardActivityUncheckedCreateInput>
  }

  /**
   * UserFlashcardActivity createMany
   */
  export type UserFlashcardActivityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserFlashcardActivities.
     */
    data: UserFlashcardActivityCreateManyInput | UserFlashcardActivityCreateManyInput[]
  }

  /**
   * UserFlashcardActivity createManyAndReturn
   */
  export type UserFlashcardActivityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardActivity
     */
    select?: UserFlashcardActivitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardActivity
     */
    omit?: UserFlashcardActivityOmit<ExtArgs> | null
    /**
     * The data used to create many UserFlashcardActivities.
     */
    data: UserFlashcardActivityCreateManyInput | UserFlashcardActivityCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardActivityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserFlashcardActivity update
   */
  export type UserFlashcardActivityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardActivity
     */
    select?: UserFlashcardActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardActivity
     */
    omit?: UserFlashcardActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardActivityInclude<ExtArgs> | null
    /**
     * The data needed to update a UserFlashcardActivity.
     */
    data: XOR<UserFlashcardActivityUpdateInput, UserFlashcardActivityUncheckedUpdateInput>
    /**
     * Choose, which UserFlashcardActivity to update.
     */
    where: UserFlashcardActivityWhereUniqueInput
  }

  /**
   * UserFlashcardActivity updateMany
   */
  export type UserFlashcardActivityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserFlashcardActivities.
     */
    data: XOR<UserFlashcardActivityUpdateManyMutationInput, UserFlashcardActivityUncheckedUpdateManyInput>
    /**
     * Filter which UserFlashcardActivities to update
     */
    where?: UserFlashcardActivityWhereInput
    /**
     * Limit how many UserFlashcardActivities to update.
     */
    limit?: number
  }

  /**
   * UserFlashcardActivity updateManyAndReturn
   */
  export type UserFlashcardActivityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardActivity
     */
    select?: UserFlashcardActivitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardActivity
     */
    omit?: UserFlashcardActivityOmit<ExtArgs> | null
    /**
     * The data used to update UserFlashcardActivities.
     */
    data: XOR<UserFlashcardActivityUpdateManyMutationInput, UserFlashcardActivityUncheckedUpdateManyInput>
    /**
     * Filter which UserFlashcardActivities to update
     */
    where?: UserFlashcardActivityWhereInput
    /**
     * Limit how many UserFlashcardActivities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardActivityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserFlashcardActivity upsert
   */
  export type UserFlashcardActivityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardActivity
     */
    select?: UserFlashcardActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardActivity
     */
    omit?: UserFlashcardActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardActivityInclude<ExtArgs> | null
    /**
     * The filter to search for the UserFlashcardActivity to update in case it exists.
     */
    where: UserFlashcardActivityWhereUniqueInput
    /**
     * In case the UserFlashcardActivity found by the `where` argument doesn't exist, create a new UserFlashcardActivity with this data.
     */
    create: XOR<UserFlashcardActivityCreateInput, UserFlashcardActivityUncheckedCreateInput>
    /**
     * In case the UserFlashcardActivity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserFlashcardActivityUpdateInput, UserFlashcardActivityUncheckedUpdateInput>
  }

  /**
   * UserFlashcardActivity delete
   */
  export type UserFlashcardActivityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardActivity
     */
    select?: UserFlashcardActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardActivity
     */
    omit?: UserFlashcardActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardActivityInclude<ExtArgs> | null
    /**
     * Filter which UserFlashcardActivity to delete.
     */
    where: UserFlashcardActivityWhereUniqueInput
  }

  /**
   * UserFlashcardActivity deleteMany
   */
  export type UserFlashcardActivityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserFlashcardActivities to delete
     */
    where?: UserFlashcardActivityWhereInput
    /**
     * Limit how many UserFlashcardActivities to delete.
     */
    limit?: number
  }

  /**
   * UserFlashcardActivity without action
   */
  export type UserFlashcardActivityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardActivity
     */
    select?: UserFlashcardActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardActivity
     */
    omit?: UserFlashcardActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardActivityInclude<ExtArgs> | null
  }


  /**
   * Model Tag
   */

  export type AggregateTag = {
    _count: TagCountAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  export type TagMinAggregateOutputType = {
    id: string | null
    abbreviation: string | null
    description: string | null
  }

  export type TagMaxAggregateOutputType = {
    id: string | null
    abbreviation: string | null
    description: string | null
  }

  export type TagCountAggregateOutputType = {
    id: number
    abbreviation: number
    description: number
    _all: number
  }


  export type TagMinAggregateInputType = {
    id?: true
    abbreviation?: true
    description?: true
  }

  export type TagMaxAggregateInputType = {
    id?: true
    abbreviation?: true
    description?: true
  }

  export type TagCountAggregateInputType = {
    id?: true
    abbreviation?: true
    description?: true
    _all?: true
  }

  export type TagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tag to aggregate.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tags
    **/
    _count?: true | TagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TagMaxAggregateInputType
  }

  export type GetTagAggregateType<T extends TagAggregateArgs> = {
        [P in keyof T & keyof AggregateTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTag[P]>
      : GetScalarType<T[P], AggregateTag[P]>
  }




  export type TagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TagWhereInput
    orderBy?: TagOrderByWithAggregationInput | TagOrderByWithAggregationInput[]
    by: TagScalarFieldEnum[] | TagScalarFieldEnum
    having?: TagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TagCountAggregateInputType | true
    _min?: TagMinAggregateInputType
    _max?: TagMaxAggregateInputType
  }

  export type TagGroupByOutputType = {
    id: string
    abbreviation: string
    description: string | null
    _count: TagCountAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  type GetTagGroupByPayload<T extends TagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TagGroupByOutputType[P]>
            : GetScalarType<T[P], TagGroupByOutputType[P]>
        }
      >
    >


  export type TagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    abbreviation?: boolean
    description?: boolean
    flashcards?: boolean | Tag$flashcardsArgs<ExtArgs>
    _count?: boolean | TagCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tag"]>

  export type TagSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    abbreviation?: boolean
    description?: boolean
  }, ExtArgs["result"]["tag"]>

  export type TagSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    abbreviation?: boolean
    description?: boolean
  }, ExtArgs["result"]["tag"]>

  export type TagSelectScalar = {
    id?: boolean
    abbreviation?: boolean
    description?: boolean
  }

  export type TagOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "abbreviation" | "description", ExtArgs["result"]["tag"]>
  export type TagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    flashcards?: boolean | Tag$flashcardsArgs<ExtArgs>
    _count?: boolean | TagCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TagIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TagIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tag"
    objects: {
      flashcards: Prisma.$FlashcardTagPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      abbreviation: string
      description: string | null
    }, ExtArgs["result"]["tag"]>
    composites: {}
  }

  type TagGetPayload<S extends boolean | null | undefined | TagDefaultArgs> = $Result.GetResult<Prisma.$TagPayload, S>

  type TagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TagCountAggregateInputType | true
    }

  export interface TagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tag'], meta: { name: 'Tag' } }
    /**
     * Find zero or one Tag that matches the filter.
     * @param {TagFindUniqueArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TagFindUniqueArgs>(args: SelectSubset<T, TagFindUniqueArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TagFindUniqueOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TagFindUniqueOrThrowArgs>(args: SelectSubset<T, TagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TagFindFirstArgs>(args?: SelectSubset<T, TagFindFirstArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TagFindFirstOrThrowArgs>(args?: SelectSubset<T, TagFindFirstOrThrowArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tags
     * const tags = await prisma.tag.findMany()
     * 
     * // Get first 10 Tags
     * const tags = await prisma.tag.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tagWithIdOnly = await prisma.tag.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TagFindManyArgs>(args?: SelectSubset<T, TagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tag.
     * @param {TagCreateArgs} args - Arguments to create a Tag.
     * @example
     * // Create one Tag
     * const Tag = await prisma.tag.create({
     *   data: {
     *     // ... data to create a Tag
     *   }
     * })
     * 
     */
    create<T extends TagCreateArgs>(args: SelectSubset<T, TagCreateArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tags.
     * @param {TagCreateManyArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TagCreateManyArgs>(args?: SelectSubset<T, TagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tags and returns the data saved in the database.
     * @param {TagCreateManyAndReturnArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tags and only return the `id`
     * const tagWithIdOnly = await prisma.tag.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TagCreateManyAndReturnArgs>(args?: SelectSubset<T, TagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tag.
     * @param {TagDeleteArgs} args - Arguments to delete one Tag.
     * @example
     * // Delete one Tag
     * const Tag = await prisma.tag.delete({
     *   where: {
     *     // ... filter to delete one Tag
     *   }
     * })
     * 
     */
    delete<T extends TagDeleteArgs>(args: SelectSubset<T, TagDeleteArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tag.
     * @param {TagUpdateArgs} args - Arguments to update one Tag.
     * @example
     * // Update one Tag
     * const tag = await prisma.tag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TagUpdateArgs>(args: SelectSubset<T, TagUpdateArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tags.
     * @param {TagDeleteManyArgs} args - Arguments to filter Tags to delete.
     * @example
     * // Delete a few Tags
     * const { count } = await prisma.tag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TagDeleteManyArgs>(args?: SelectSubset<T, TagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tags
     * const tag = await prisma.tag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TagUpdateManyArgs>(args: SelectSubset<T, TagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tags and returns the data updated in the database.
     * @param {TagUpdateManyAndReturnArgs} args - Arguments to update many Tags.
     * @example
     * // Update many Tags
     * const tag = await prisma.tag.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tags and only return the `id`
     * const tagWithIdOnly = await prisma.tag.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TagUpdateManyAndReturnArgs>(args: SelectSubset<T, TagUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tag.
     * @param {TagUpsertArgs} args - Arguments to update or create a Tag.
     * @example
     * // Update or create a Tag
     * const tag = await prisma.tag.upsert({
     *   create: {
     *     // ... data to create a Tag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tag we want to update
     *   }
     * })
     */
    upsert<T extends TagUpsertArgs>(args: SelectSubset<T, TagUpsertArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagCountArgs} args - Arguments to filter Tags to count.
     * @example
     * // Count the number of Tags
     * const count = await prisma.tag.count({
     *   where: {
     *     // ... the filter for the Tags we want to count
     *   }
     * })
    **/
    count<T extends TagCountArgs>(
      args?: Subset<T, TagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TagAggregateArgs>(args: Subset<T, TagAggregateArgs>): Prisma.PrismaPromise<GetTagAggregateType<T>>

    /**
     * Group by Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TagGroupByArgs['orderBy'] }
        : { orderBy?: TagGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tag model
   */
  readonly fields: TagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    flashcards<T extends Tag$flashcardsArgs<ExtArgs> = {}>(args?: Subset<T, Tag$flashcardsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardTagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tag model
   */
  interface TagFieldRefs {
    readonly id: FieldRef<"Tag", 'String'>
    readonly abbreviation: FieldRef<"Tag", 'String'>
    readonly description: FieldRef<"Tag", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Tag findUnique
   */
  export type TagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag findUniqueOrThrow
   */
  export type TagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag findFirst
   */
  export type TagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag findFirstOrThrow
   */
  export type TagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag findMany
   */
  export type TagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tags to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag create
   */
  export type TagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The data needed to create a Tag.
     */
    data: XOR<TagCreateInput, TagUncheckedCreateInput>
  }

  /**
   * Tag createMany
   */
  export type TagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[]
  }

  /**
   * Tag createManyAndReturn
   */
  export type TagCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[]
  }

  /**
   * Tag update
   */
  export type TagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The data needed to update a Tag.
     */
    data: XOR<TagUpdateInput, TagUncheckedUpdateInput>
    /**
     * Choose, which Tag to update.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag updateMany
   */
  export type TagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tags.
     */
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyInput>
    /**
     * Filter which Tags to update
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to update.
     */
    limit?: number
  }

  /**
   * Tag updateManyAndReturn
   */
  export type TagUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * The data used to update Tags.
     */
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyInput>
    /**
     * Filter which Tags to update
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to update.
     */
    limit?: number
  }

  /**
   * Tag upsert
   */
  export type TagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The filter to search for the Tag to update in case it exists.
     */
    where: TagWhereUniqueInput
    /**
     * In case the Tag found by the `where` argument doesn't exist, create a new Tag with this data.
     */
    create: XOR<TagCreateInput, TagUncheckedCreateInput>
    /**
     * In case the Tag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TagUpdateInput, TagUncheckedUpdateInput>
  }

  /**
   * Tag delete
   */
  export type TagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter which Tag to delete.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag deleteMany
   */
  export type TagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tags to delete
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to delete.
     */
    limit?: number
  }

  /**
   * Tag.flashcards
   */
  export type Tag$flashcardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardTag
     */
    select?: FlashcardTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardTag
     */
    omit?: FlashcardTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardTagInclude<ExtArgs> | null
    where?: FlashcardTagWhereInput
    orderBy?: FlashcardTagOrderByWithRelationInput | FlashcardTagOrderByWithRelationInput[]
    cursor?: FlashcardTagWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FlashcardTagScalarFieldEnum | FlashcardTagScalarFieldEnum[]
  }

  /**
   * Tag without action
   */
  export type TagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
  }


  /**
   * Model FlashcardTag
   */

  export type AggregateFlashcardTag = {
    _count: FlashcardTagCountAggregateOutputType | null
    _min: FlashcardTagMinAggregateOutputType | null
    _max: FlashcardTagMaxAggregateOutputType | null
  }

  export type FlashcardTagMinAggregateOutputType = {
    id: string | null
    flashcardId: string | null
    tagId: string | null
  }

  export type FlashcardTagMaxAggregateOutputType = {
    id: string | null
    flashcardId: string | null
    tagId: string | null
  }

  export type FlashcardTagCountAggregateOutputType = {
    id: number
    flashcardId: number
    tagId: number
    _all: number
  }


  export type FlashcardTagMinAggregateInputType = {
    id?: true
    flashcardId?: true
    tagId?: true
  }

  export type FlashcardTagMaxAggregateInputType = {
    id?: true
    flashcardId?: true
    tagId?: true
  }

  export type FlashcardTagCountAggregateInputType = {
    id?: true
    flashcardId?: true
    tagId?: true
    _all?: true
  }

  export type FlashcardTagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FlashcardTag to aggregate.
     */
    where?: FlashcardTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlashcardTags to fetch.
     */
    orderBy?: FlashcardTagOrderByWithRelationInput | FlashcardTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FlashcardTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlashcardTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlashcardTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FlashcardTags
    **/
    _count?: true | FlashcardTagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FlashcardTagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FlashcardTagMaxAggregateInputType
  }

  export type GetFlashcardTagAggregateType<T extends FlashcardTagAggregateArgs> = {
        [P in keyof T & keyof AggregateFlashcardTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFlashcardTag[P]>
      : GetScalarType<T[P], AggregateFlashcardTag[P]>
  }




  export type FlashcardTagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlashcardTagWhereInput
    orderBy?: FlashcardTagOrderByWithAggregationInput | FlashcardTagOrderByWithAggregationInput[]
    by: FlashcardTagScalarFieldEnum[] | FlashcardTagScalarFieldEnum
    having?: FlashcardTagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FlashcardTagCountAggregateInputType | true
    _min?: FlashcardTagMinAggregateInputType
    _max?: FlashcardTagMaxAggregateInputType
  }

  export type FlashcardTagGroupByOutputType = {
    id: string
    flashcardId: string
    tagId: string
    _count: FlashcardTagCountAggregateOutputType | null
    _min: FlashcardTagMinAggregateOutputType | null
    _max: FlashcardTagMaxAggregateOutputType | null
  }

  type GetFlashcardTagGroupByPayload<T extends FlashcardTagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FlashcardTagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FlashcardTagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FlashcardTagGroupByOutputType[P]>
            : GetScalarType<T[P], FlashcardTagGroupByOutputType[P]>
        }
      >
    >


  export type FlashcardTagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    flashcardId?: boolean
    tagId?: boolean
    flashcard?: boolean | FlashcardDefaultArgs<ExtArgs>
    tag?: boolean | TagDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["flashcardTag"]>

  export type FlashcardTagSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    flashcardId?: boolean
    tagId?: boolean
    flashcard?: boolean | FlashcardDefaultArgs<ExtArgs>
    tag?: boolean | TagDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["flashcardTag"]>

  export type FlashcardTagSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    flashcardId?: boolean
    tagId?: boolean
    flashcard?: boolean | FlashcardDefaultArgs<ExtArgs>
    tag?: boolean | TagDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["flashcardTag"]>

  export type FlashcardTagSelectScalar = {
    id?: boolean
    flashcardId?: boolean
    tagId?: boolean
  }

  export type FlashcardTagOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "flashcardId" | "tagId", ExtArgs["result"]["flashcardTag"]>
  export type FlashcardTagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    flashcard?: boolean | FlashcardDefaultArgs<ExtArgs>
    tag?: boolean | TagDefaultArgs<ExtArgs>
  }
  export type FlashcardTagIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    flashcard?: boolean | FlashcardDefaultArgs<ExtArgs>
    tag?: boolean | TagDefaultArgs<ExtArgs>
  }
  export type FlashcardTagIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    flashcard?: boolean | FlashcardDefaultArgs<ExtArgs>
    tag?: boolean | TagDefaultArgs<ExtArgs>
  }

  export type $FlashcardTagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FlashcardTag"
    objects: {
      flashcard: Prisma.$FlashcardPayload<ExtArgs>
      tag: Prisma.$TagPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      flashcardId: string
      tagId: string
    }, ExtArgs["result"]["flashcardTag"]>
    composites: {}
  }

  type FlashcardTagGetPayload<S extends boolean | null | undefined | FlashcardTagDefaultArgs> = $Result.GetResult<Prisma.$FlashcardTagPayload, S>

  type FlashcardTagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FlashcardTagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FlashcardTagCountAggregateInputType | true
    }

  export interface FlashcardTagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FlashcardTag'], meta: { name: 'FlashcardTag' } }
    /**
     * Find zero or one FlashcardTag that matches the filter.
     * @param {FlashcardTagFindUniqueArgs} args - Arguments to find a FlashcardTag
     * @example
     * // Get one FlashcardTag
     * const flashcardTag = await prisma.flashcardTag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FlashcardTagFindUniqueArgs>(args: SelectSubset<T, FlashcardTagFindUniqueArgs<ExtArgs>>): Prisma__FlashcardTagClient<$Result.GetResult<Prisma.$FlashcardTagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FlashcardTag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FlashcardTagFindUniqueOrThrowArgs} args - Arguments to find a FlashcardTag
     * @example
     * // Get one FlashcardTag
     * const flashcardTag = await prisma.flashcardTag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FlashcardTagFindUniqueOrThrowArgs>(args: SelectSubset<T, FlashcardTagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FlashcardTagClient<$Result.GetResult<Prisma.$FlashcardTagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FlashcardTag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardTagFindFirstArgs} args - Arguments to find a FlashcardTag
     * @example
     * // Get one FlashcardTag
     * const flashcardTag = await prisma.flashcardTag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FlashcardTagFindFirstArgs>(args?: SelectSubset<T, FlashcardTagFindFirstArgs<ExtArgs>>): Prisma__FlashcardTagClient<$Result.GetResult<Prisma.$FlashcardTagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FlashcardTag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardTagFindFirstOrThrowArgs} args - Arguments to find a FlashcardTag
     * @example
     * // Get one FlashcardTag
     * const flashcardTag = await prisma.flashcardTag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FlashcardTagFindFirstOrThrowArgs>(args?: SelectSubset<T, FlashcardTagFindFirstOrThrowArgs<ExtArgs>>): Prisma__FlashcardTagClient<$Result.GetResult<Prisma.$FlashcardTagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FlashcardTags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardTagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FlashcardTags
     * const flashcardTags = await prisma.flashcardTag.findMany()
     * 
     * // Get first 10 FlashcardTags
     * const flashcardTags = await prisma.flashcardTag.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const flashcardTagWithIdOnly = await prisma.flashcardTag.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FlashcardTagFindManyArgs>(args?: SelectSubset<T, FlashcardTagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardTagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FlashcardTag.
     * @param {FlashcardTagCreateArgs} args - Arguments to create a FlashcardTag.
     * @example
     * // Create one FlashcardTag
     * const FlashcardTag = await prisma.flashcardTag.create({
     *   data: {
     *     // ... data to create a FlashcardTag
     *   }
     * })
     * 
     */
    create<T extends FlashcardTagCreateArgs>(args: SelectSubset<T, FlashcardTagCreateArgs<ExtArgs>>): Prisma__FlashcardTagClient<$Result.GetResult<Prisma.$FlashcardTagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FlashcardTags.
     * @param {FlashcardTagCreateManyArgs} args - Arguments to create many FlashcardTags.
     * @example
     * // Create many FlashcardTags
     * const flashcardTag = await prisma.flashcardTag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FlashcardTagCreateManyArgs>(args?: SelectSubset<T, FlashcardTagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FlashcardTags and returns the data saved in the database.
     * @param {FlashcardTagCreateManyAndReturnArgs} args - Arguments to create many FlashcardTags.
     * @example
     * // Create many FlashcardTags
     * const flashcardTag = await prisma.flashcardTag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FlashcardTags and only return the `id`
     * const flashcardTagWithIdOnly = await prisma.flashcardTag.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FlashcardTagCreateManyAndReturnArgs>(args?: SelectSubset<T, FlashcardTagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardTagPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FlashcardTag.
     * @param {FlashcardTagDeleteArgs} args - Arguments to delete one FlashcardTag.
     * @example
     * // Delete one FlashcardTag
     * const FlashcardTag = await prisma.flashcardTag.delete({
     *   where: {
     *     // ... filter to delete one FlashcardTag
     *   }
     * })
     * 
     */
    delete<T extends FlashcardTagDeleteArgs>(args: SelectSubset<T, FlashcardTagDeleteArgs<ExtArgs>>): Prisma__FlashcardTagClient<$Result.GetResult<Prisma.$FlashcardTagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FlashcardTag.
     * @param {FlashcardTagUpdateArgs} args - Arguments to update one FlashcardTag.
     * @example
     * // Update one FlashcardTag
     * const flashcardTag = await prisma.flashcardTag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FlashcardTagUpdateArgs>(args: SelectSubset<T, FlashcardTagUpdateArgs<ExtArgs>>): Prisma__FlashcardTagClient<$Result.GetResult<Prisma.$FlashcardTagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FlashcardTags.
     * @param {FlashcardTagDeleteManyArgs} args - Arguments to filter FlashcardTags to delete.
     * @example
     * // Delete a few FlashcardTags
     * const { count } = await prisma.flashcardTag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FlashcardTagDeleteManyArgs>(args?: SelectSubset<T, FlashcardTagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FlashcardTags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardTagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FlashcardTags
     * const flashcardTag = await prisma.flashcardTag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FlashcardTagUpdateManyArgs>(args: SelectSubset<T, FlashcardTagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FlashcardTags and returns the data updated in the database.
     * @param {FlashcardTagUpdateManyAndReturnArgs} args - Arguments to update many FlashcardTags.
     * @example
     * // Update many FlashcardTags
     * const flashcardTag = await prisma.flashcardTag.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FlashcardTags and only return the `id`
     * const flashcardTagWithIdOnly = await prisma.flashcardTag.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FlashcardTagUpdateManyAndReturnArgs>(args: SelectSubset<T, FlashcardTagUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardTagPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FlashcardTag.
     * @param {FlashcardTagUpsertArgs} args - Arguments to update or create a FlashcardTag.
     * @example
     * // Update or create a FlashcardTag
     * const flashcardTag = await prisma.flashcardTag.upsert({
     *   create: {
     *     // ... data to create a FlashcardTag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FlashcardTag we want to update
     *   }
     * })
     */
    upsert<T extends FlashcardTagUpsertArgs>(args: SelectSubset<T, FlashcardTagUpsertArgs<ExtArgs>>): Prisma__FlashcardTagClient<$Result.GetResult<Prisma.$FlashcardTagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FlashcardTags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardTagCountArgs} args - Arguments to filter FlashcardTags to count.
     * @example
     * // Count the number of FlashcardTags
     * const count = await prisma.flashcardTag.count({
     *   where: {
     *     // ... the filter for the FlashcardTags we want to count
     *   }
     * })
    **/
    count<T extends FlashcardTagCountArgs>(
      args?: Subset<T, FlashcardTagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FlashcardTagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FlashcardTag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardTagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FlashcardTagAggregateArgs>(args: Subset<T, FlashcardTagAggregateArgs>): Prisma.PrismaPromise<GetFlashcardTagAggregateType<T>>

    /**
     * Group by FlashcardTag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardTagGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FlashcardTagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FlashcardTagGroupByArgs['orderBy'] }
        : { orderBy?: FlashcardTagGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FlashcardTagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFlashcardTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FlashcardTag model
   */
  readonly fields: FlashcardTagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FlashcardTag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FlashcardTagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    flashcard<T extends FlashcardDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FlashcardDefaultArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tag<T extends TagDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TagDefaultArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FlashcardTag model
   */
  interface FlashcardTagFieldRefs {
    readonly id: FieldRef<"FlashcardTag", 'String'>
    readonly flashcardId: FieldRef<"FlashcardTag", 'String'>
    readonly tagId: FieldRef<"FlashcardTag", 'String'>
  }
    

  // Custom InputTypes
  /**
   * FlashcardTag findUnique
   */
  export type FlashcardTagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardTag
     */
    select?: FlashcardTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardTag
     */
    omit?: FlashcardTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardTagInclude<ExtArgs> | null
    /**
     * Filter, which FlashcardTag to fetch.
     */
    where: FlashcardTagWhereUniqueInput
  }

  /**
   * FlashcardTag findUniqueOrThrow
   */
  export type FlashcardTagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardTag
     */
    select?: FlashcardTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardTag
     */
    omit?: FlashcardTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardTagInclude<ExtArgs> | null
    /**
     * Filter, which FlashcardTag to fetch.
     */
    where: FlashcardTagWhereUniqueInput
  }

  /**
   * FlashcardTag findFirst
   */
  export type FlashcardTagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardTag
     */
    select?: FlashcardTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardTag
     */
    omit?: FlashcardTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardTagInclude<ExtArgs> | null
    /**
     * Filter, which FlashcardTag to fetch.
     */
    where?: FlashcardTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlashcardTags to fetch.
     */
    orderBy?: FlashcardTagOrderByWithRelationInput | FlashcardTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FlashcardTags.
     */
    cursor?: FlashcardTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlashcardTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlashcardTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FlashcardTags.
     */
    distinct?: FlashcardTagScalarFieldEnum | FlashcardTagScalarFieldEnum[]
  }

  /**
   * FlashcardTag findFirstOrThrow
   */
  export type FlashcardTagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardTag
     */
    select?: FlashcardTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardTag
     */
    omit?: FlashcardTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardTagInclude<ExtArgs> | null
    /**
     * Filter, which FlashcardTag to fetch.
     */
    where?: FlashcardTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlashcardTags to fetch.
     */
    orderBy?: FlashcardTagOrderByWithRelationInput | FlashcardTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FlashcardTags.
     */
    cursor?: FlashcardTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlashcardTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlashcardTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FlashcardTags.
     */
    distinct?: FlashcardTagScalarFieldEnum | FlashcardTagScalarFieldEnum[]
  }

  /**
   * FlashcardTag findMany
   */
  export type FlashcardTagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardTag
     */
    select?: FlashcardTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardTag
     */
    omit?: FlashcardTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardTagInclude<ExtArgs> | null
    /**
     * Filter, which FlashcardTags to fetch.
     */
    where?: FlashcardTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlashcardTags to fetch.
     */
    orderBy?: FlashcardTagOrderByWithRelationInput | FlashcardTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FlashcardTags.
     */
    cursor?: FlashcardTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlashcardTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlashcardTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FlashcardTags.
     */
    distinct?: FlashcardTagScalarFieldEnum | FlashcardTagScalarFieldEnum[]
  }

  /**
   * FlashcardTag create
   */
  export type FlashcardTagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardTag
     */
    select?: FlashcardTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardTag
     */
    omit?: FlashcardTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardTagInclude<ExtArgs> | null
    /**
     * The data needed to create a FlashcardTag.
     */
    data: XOR<FlashcardTagCreateInput, FlashcardTagUncheckedCreateInput>
  }

  /**
   * FlashcardTag createMany
   */
  export type FlashcardTagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FlashcardTags.
     */
    data: FlashcardTagCreateManyInput | FlashcardTagCreateManyInput[]
  }

  /**
   * FlashcardTag createManyAndReturn
   */
  export type FlashcardTagCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardTag
     */
    select?: FlashcardTagSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardTag
     */
    omit?: FlashcardTagOmit<ExtArgs> | null
    /**
     * The data used to create many FlashcardTags.
     */
    data: FlashcardTagCreateManyInput | FlashcardTagCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardTagIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FlashcardTag update
   */
  export type FlashcardTagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardTag
     */
    select?: FlashcardTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardTag
     */
    omit?: FlashcardTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardTagInclude<ExtArgs> | null
    /**
     * The data needed to update a FlashcardTag.
     */
    data: XOR<FlashcardTagUpdateInput, FlashcardTagUncheckedUpdateInput>
    /**
     * Choose, which FlashcardTag to update.
     */
    where: FlashcardTagWhereUniqueInput
  }

  /**
   * FlashcardTag updateMany
   */
  export type FlashcardTagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FlashcardTags.
     */
    data: XOR<FlashcardTagUpdateManyMutationInput, FlashcardTagUncheckedUpdateManyInput>
    /**
     * Filter which FlashcardTags to update
     */
    where?: FlashcardTagWhereInput
    /**
     * Limit how many FlashcardTags to update.
     */
    limit?: number
  }

  /**
   * FlashcardTag updateManyAndReturn
   */
  export type FlashcardTagUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardTag
     */
    select?: FlashcardTagSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardTag
     */
    omit?: FlashcardTagOmit<ExtArgs> | null
    /**
     * The data used to update FlashcardTags.
     */
    data: XOR<FlashcardTagUpdateManyMutationInput, FlashcardTagUncheckedUpdateManyInput>
    /**
     * Filter which FlashcardTags to update
     */
    where?: FlashcardTagWhereInput
    /**
     * Limit how many FlashcardTags to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardTagIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FlashcardTag upsert
   */
  export type FlashcardTagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardTag
     */
    select?: FlashcardTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardTag
     */
    omit?: FlashcardTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardTagInclude<ExtArgs> | null
    /**
     * The filter to search for the FlashcardTag to update in case it exists.
     */
    where: FlashcardTagWhereUniqueInput
    /**
     * In case the FlashcardTag found by the `where` argument doesn't exist, create a new FlashcardTag with this data.
     */
    create: XOR<FlashcardTagCreateInput, FlashcardTagUncheckedCreateInput>
    /**
     * In case the FlashcardTag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FlashcardTagUpdateInput, FlashcardTagUncheckedUpdateInput>
  }

  /**
   * FlashcardTag delete
   */
  export type FlashcardTagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardTag
     */
    select?: FlashcardTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardTag
     */
    omit?: FlashcardTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardTagInclude<ExtArgs> | null
    /**
     * Filter which FlashcardTag to delete.
     */
    where: FlashcardTagWhereUniqueInput
  }

  /**
   * FlashcardTag deleteMany
   */
  export type FlashcardTagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FlashcardTags to delete
     */
    where?: FlashcardTagWhereInput
    /**
     * Limit how many FlashcardTags to delete.
     */
    limit?: number
  }

  /**
   * FlashcardTag without action
   */
  export type FlashcardTagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardTag
     */
    select?: FlashcardTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardTag
     */
    omit?: FlashcardTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardTagInclude<ExtArgs> | null
  }


  /**
   * Model MobileImport
   */

  export type AggregateMobileImport = {
    _count: MobileImportCountAggregateOutputType | null
    _min: MobileImportMinAggregateOutputType | null
    _max: MobileImportMaxAggregateOutputType | null
  }

  export type MobileImportMinAggregateOutputType = {
    id: string | null
    userId: string | null
    mobileImportText: string | null
    whenImported: Date | null
  }

  export type MobileImportMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    mobileImportText: string | null
    whenImported: Date | null
  }

  export type MobileImportCountAggregateOutputType = {
    id: number
    userId: number
    mobileImportText: number
    whenImported: number
    _all: number
  }


  export type MobileImportMinAggregateInputType = {
    id?: true
    userId?: true
    mobileImportText?: true
    whenImported?: true
  }

  export type MobileImportMaxAggregateInputType = {
    id?: true
    userId?: true
    mobileImportText?: true
    whenImported?: true
  }

  export type MobileImportCountAggregateInputType = {
    id?: true
    userId?: true
    mobileImportText?: true
    whenImported?: true
    _all?: true
  }

  export type MobileImportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MobileImport to aggregate.
     */
    where?: MobileImportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MobileImports to fetch.
     */
    orderBy?: MobileImportOrderByWithRelationInput | MobileImportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MobileImportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MobileImports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MobileImports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MobileImports
    **/
    _count?: true | MobileImportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MobileImportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MobileImportMaxAggregateInputType
  }

  export type GetMobileImportAggregateType<T extends MobileImportAggregateArgs> = {
        [P in keyof T & keyof AggregateMobileImport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMobileImport[P]>
      : GetScalarType<T[P], AggregateMobileImport[P]>
  }




  export type MobileImportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MobileImportWhereInput
    orderBy?: MobileImportOrderByWithAggregationInput | MobileImportOrderByWithAggregationInput[]
    by: MobileImportScalarFieldEnum[] | MobileImportScalarFieldEnum
    having?: MobileImportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MobileImportCountAggregateInputType | true
    _min?: MobileImportMinAggregateInputType
    _max?: MobileImportMaxAggregateInputType
  }

  export type MobileImportGroupByOutputType = {
    id: string
    userId: string
    mobileImportText: string
    whenImported: Date
    _count: MobileImportCountAggregateOutputType | null
    _min: MobileImportMinAggregateOutputType | null
    _max: MobileImportMaxAggregateOutputType | null
  }

  type GetMobileImportGroupByPayload<T extends MobileImportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MobileImportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MobileImportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MobileImportGroupByOutputType[P]>
            : GetScalarType<T[P], MobileImportGroupByOutputType[P]>
        }
      >
    >


  export type MobileImportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    mobileImportText?: boolean
    whenImported?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mobileImport"]>

  export type MobileImportSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    mobileImportText?: boolean
    whenImported?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mobileImport"]>

  export type MobileImportSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    mobileImportText?: boolean
    whenImported?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mobileImport"]>

  export type MobileImportSelectScalar = {
    id?: boolean
    userId?: boolean
    mobileImportText?: boolean
    whenImported?: boolean
  }

  export type MobileImportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "mobileImportText" | "whenImported", ExtArgs["result"]["mobileImport"]>
  export type MobileImportInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MobileImportIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MobileImportIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MobileImportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MobileImport"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      mobileImportText: string
      whenImported: Date
    }, ExtArgs["result"]["mobileImport"]>
    composites: {}
  }

  type MobileImportGetPayload<S extends boolean | null | undefined | MobileImportDefaultArgs> = $Result.GetResult<Prisma.$MobileImportPayload, S>

  type MobileImportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MobileImportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MobileImportCountAggregateInputType | true
    }

  export interface MobileImportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MobileImport'], meta: { name: 'MobileImport' } }
    /**
     * Find zero or one MobileImport that matches the filter.
     * @param {MobileImportFindUniqueArgs} args - Arguments to find a MobileImport
     * @example
     * // Get one MobileImport
     * const mobileImport = await prisma.mobileImport.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MobileImportFindUniqueArgs>(args: SelectSubset<T, MobileImportFindUniqueArgs<ExtArgs>>): Prisma__MobileImportClient<$Result.GetResult<Prisma.$MobileImportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MobileImport that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MobileImportFindUniqueOrThrowArgs} args - Arguments to find a MobileImport
     * @example
     * // Get one MobileImport
     * const mobileImport = await prisma.mobileImport.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MobileImportFindUniqueOrThrowArgs>(args: SelectSubset<T, MobileImportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MobileImportClient<$Result.GetResult<Prisma.$MobileImportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MobileImport that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MobileImportFindFirstArgs} args - Arguments to find a MobileImport
     * @example
     * // Get one MobileImport
     * const mobileImport = await prisma.mobileImport.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MobileImportFindFirstArgs>(args?: SelectSubset<T, MobileImportFindFirstArgs<ExtArgs>>): Prisma__MobileImportClient<$Result.GetResult<Prisma.$MobileImportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MobileImport that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MobileImportFindFirstOrThrowArgs} args - Arguments to find a MobileImport
     * @example
     * // Get one MobileImport
     * const mobileImport = await prisma.mobileImport.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MobileImportFindFirstOrThrowArgs>(args?: SelectSubset<T, MobileImportFindFirstOrThrowArgs<ExtArgs>>): Prisma__MobileImportClient<$Result.GetResult<Prisma.$MobileImportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MobileImports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MobileImportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MobileImports
     * const mobileImports = await prisma.mobileImport.findMany()
     * 
     * // Get first 10 MobileImports
     * const mobileImports = await prisma.mobileImport.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mobileImportWithIdOnly = await prisma.mobileImport.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MobileImportFindManyArgs>(args?: SelectSubset<T, MobileImportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MobileImportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MobileImport.
     * @param {MobileImportCreateArgs} args - Arguments to create a MobileImport.
     * @example
     * // Create one MobileImport
     * const MobileImport = await prisma.mobileImport.create({
     *   data: {
     *     // ... data to create a MobileImport
     *   }
     * })
     * 
     */
    create<T extends MobileImportCreateArgs>(args: SelectSubset<T, MobileImportCreateArgs<ExtArgs>>): Prisma__MobileImportClient<$Result.GetResult<Prisma.$MobileImportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MobileImports.
     * @param {MobileImportCreateManyArgs} args - Arguments to create many MobileImports.
     * @example
     * // Create many MobileImports
     * const mobileImport = await prisma.mobileImport.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MobileImportCreateManyArgs>(args?: SelectSubset<T, MobileImportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MobileImports and returns the data saved in the database.
     * @param {MobileImportCreateManyAndReturnArgs} args - Arguments to create many MobileImports.
     * @example
     * // Create many MobileImports
     * const mobileImport = await prisma.mobileImport.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MobileImports and only return the `id`
     * const mobileImportWithIdOnly = await prisma.mobileImport.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MobileImportCreateManyAndReturnArgs>(args?: SelectSubset<T, MobileImportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MobileImportPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MobileImport.
     * @param {MobileImportDeleteArgs} args - Arguments to delete one MobileImport.
     * @example
     * // Delete one MobileImport
     * const MobileImport = await prisma.mobileImport.delete({
     *   where: {
     *     // ... filter to delete one MobileImport
     *   }
     * })
     * 
     */
    delete<T extends MobileImportDeleteArgs>(args: SelectSubset<T, MobileImportDeleteArgs<ExtArgs>>): Prisma__MobileImportClient<$Result.GetResult<Prisma.$MobileImportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MobileImport.
     * @param {MobileImportUpdateArgs} args - Arguments to update one MobileImport.
     * @example
     * // Update one MobileImport
     * const mobileImport = await prisma.mobileImport.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MobileImportUpdateArgs>(args: SelectSubset<T, MobileImportUpdateArgs<ExtArgs>>): Prisma__MobileImportClient<$Result.GetResult<Prisma.$MobileImportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MobileImports.
     * @param {MobileImportDeleteManyArgs} args - Arguments to filter MobileImports to delete.
     * @example
     * // Delete a few MobileImports
     * const { count } = await prisma.mobileImport.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MobileImportDeleteManyArgs>(args?: SelectSubset<T, MobileImportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MobileImports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MobileImportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MobileImports
     * const mobileImport = await prisma.mobileImport.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MobileImportUpdateManyArgs>(args: SelectSubset<T, MobileImportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MobileImports and returns the data updated in the database.
     * @param {MobileImportUpdateManyAndReturnArgs} args - Arguments to update many MobileImports.
     * @example
     * // Update many MobileImports
     * const mobileImport = await prisma.mobileImport.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MobileImports and only return the `id`
     * const mobileImportWithIdOnly = await prisma.mobileImport.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MobileImportUpdateManyAndReturnArgs>(args: SelectSubset<T, MobileImportUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MobileImportPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MobileImport.
     * @param {MobileImportUpsertArgs} args - Arguments to update or create a MobileImport.
     * @example
     * // Update or create a MobileImport
     * const mobileImport = await prisma.mobileImport.upsert({
     *   create: {
     *     // ... data to create a MobileImport
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MobileImport we want to update
     *   }
     * })
     */
    upsert<T extends MobileImportUpsertArgs>(args: SelectSubset<T, MobileImportUpsertArgs<ExtArgs>>): Prisma__MobileImportClient<$Result.GetResult<Prisma.$MobileImportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MobileImports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MobileImportCountArgs} args - Arguments to filter MobileImports to count.
     * @example
     * // Count the number of MobileImports
     * const count = await prisma.mobileImport.count({
     *   where: {
     *     // ... the filter for the MobileImports we want to count
     *   }
     * })
    **/
    count<T extends MobileImportCountArgs>(
      args?: Subset<T, MobileImportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MobileImportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MobileImport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MobileImportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MobileImportAggregateArgs>(args: Subset<T, MobileImportAggregateArgs>): Prisma.PrismaPromise<GetMobileImportAggregateType<T>>

    /**
     * Group by MobileImport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MobileImportGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MobileImportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MobileImportGroupByArgs['orderBy'] }
        : { orderBy?: MobileImportGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MobileImportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMobileImportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MobileImport model
   */
  readonly fields: MobileImportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MobileImport.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MobileImportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MobileImport model
   */
  interface MobileImportFieldRefs {
    readonly id: FieldRef<"MobileImport", 'String'>
    readonly userId: FieldRef<"MobileImport", 'String'>
    readonly mobileImportText: FieldRef<"MobileImport", 'String'>
    readonly whenImported: FieldRef<"MobileImport", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MobileImport findUnique
   */
  export type MobileImportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MobileImport
     */
    select?: MobileImportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MobileImport
     */
    omit?: MobileImportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MobileImportInclude<ExtArgs> | null
    /**
     * Filter, which MobileImport to fetch.
     */
    where: MobileImportWhereUniqueInput
  }

  /**
   * MobileImport findUniqueOrThrow
   */
  export type MobileImportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MobileImport
     */
    select?: MobileImportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MobileImport
     */
    omit?: MobileImportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MobileImportInclude<ExtArgs> | null
    /**
     * Filter, which MobileImport to fetch.
     */
    where: MobileImportWhereUniqueInput
  }

  /**
   * MobileImport findFirst
   */
  export type MobileImportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MobileImport
     */
    select?: MobileImportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MobileImport
     */
    omit?: MobileImportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MobileImportInclude<ExtArgs> | null
    /**
     * Filter, which MobileImport to fetch.
     */
    where?: MobileImportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MobileImports to fetch.
     */
    orderBy?: MobileImportOrderByWithRelationInput | MobileImportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MobileImports.
     */
    cursor?: MobileImportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MobileImports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MobileImports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MobileImports.
     */
    distinct?: MobileImportScalarFieldEnum | MobileImportScalarFieldEnum[]
  }

  /**
   * MobileImport findFirstOrThrow
   */
  export type MobileImportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MobileImport
     */
    select?: MobileImportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MobileImport
     */
    omit?: MobileImportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MobileImportInclude<ExtArgs> | null
    /**
     * Filter, which MobileImport to fetch.
     */
    where?: MobileImportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MobileImports to fetch.
     */
    orderBy?: MobileImportOrderByWithRelationInput | MobileImportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MobileImports.
     */
    cursor?: MobileImportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MobileImports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MobileImports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MobileImports.
     */
    distinct?: MobileImportScalarFieldEnum | MobileImportScalarFieldEnum[]
  }

  /**
   * MobileImport findMany
   */
  export type MobileImportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MobileImport
     */
    select?: MobileImportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MobileImport
     */
    omit?: MobileImportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MobileImportInclude<ExtArgs> | null
    /**
     * Filter, which MobileImports to fetch.
     */
    where?: MobileImportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MobileImports to fetch.
     */
    orderBy?: MobileImportOrderByWithRelationInput | MobileImportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MobileImports.
     */
    cursor?: MobileImportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MobileImports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MobileImports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MobileImports.
     */
    distinct?: MobileImportScalarFieldEnum | MobileImportScalarFieldEnum[]
  }

  /**
   * MobileImport create
   */
  export type MobileImportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MobileImport
     */
    select?: MobileImportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MobileImport
     */
    omit?: MobileImportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MobileImportInclude<ExtArgs> | null
    /**
     * The data needed to create a MobileImport.
     */
    data: XOR<MobileImportCreateInput, MobileImportUncheckedCreateInput>
  }

  /**
   * MobileImport createMany
   */
  export type MobileImportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MobileImports.
     */
    data: MobileImportCreateManyInput | MobileImportCreateManyInput[]
  }

  /**
   * MobileImport createManyAndReturn
   */
  export type MobileImportCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MobileImport
     */
    select?: MobileImportSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MobileImport
     */
    omit?: MobileImportOmit<ExtArgs> | null
    /**
     * The data used to create many MobileImports.
     */
    data: MobileImportCreateManyInput | MobileImportCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MobileImportIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MobileImport update
   */
  export type MobileImportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MobileImport
     */
    select?: MobileImportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MobileImport
     */
    omit?: MobileImportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MobileImportInclude<ExtArgs> | null
    /**
     * The data needed to update a MobileImport.
     */
    data: XOR<MobileImportUpdateInput, MobileImportUncheckedUpdateInput>
    /**
     * Choose, which MobileImport to update.
     */
    where: MobileImportWhereUniqueInput
  }

  /**
   * MobileImport updateMany
   */
  export type MobileImportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MobileImports.
     */
    data: XOR<MobileImportUpdateManyMutationInput, MobileImportUncheckedUpdateManyInput>
    /**
     * Filter which MobileImports to update
     */
    where?: MobileImportWhereInput
    /**
     * Limit how many MobileImports to update.
     */
    limit?: number
  }

  /**
   * MobileImport updateManyAndReturn
   */
  export type MobileImportUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MobileImport
     */
    select?: MobileImportSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MobileImport
     */
    omit?: MobileImportOmit<ExtArgs> | null
    /**
     * The data used to update MobileImports.
     */
    data: XOR<MobileImportUpdateManyMutationInput, MobileImportUncheckedUpdateManyInput>
    /**
     * Filter which MobileImports to update
     */
    where?: MobileImportWhereInput
    /**
     * Limit how many MobileImports to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MobileImportIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MobileImport upsert
   */
  export type MobileImportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MobileImport
     */
    select?: MobileImportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MobileImport
     */
    omit?: MobileImportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MobileImportInclude<ExtArgs> | null
    /**
     * The filter to search for the MobileImport to update in case it exists.
     */
    where: MobileImportWhereUniqueInput
    /**
     * In case the MobileImport found by the `where` argument doesn't exist, create a new MobileImport with this data.
     */
    create: XOR<MobileImportCreateInput, MobileImportUncheckedCreateInput>
    /**
     * In case the MobileImport was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MobileImportUpdateInput, MobileImportUncheckedUpdateInput>
  }

  /**
   * MobileImport delete
   */
  export type MobileImportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MobileImport
     */
    select?: MobileImportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MobileImport
     */
    omit?: MobileImportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MobileImportInclude<ExtArgs> | null
    /**
     * Filter which MobileImport to delete.
     */
    where: MobileImportWhereUniqueInput
  }

  /**
   * MobileImport deleteMany
   */
  export type MobileImportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MobileImports to delete
     */
    where?: MobileImportWhereInput
    /**
     * Limit how many MobileImports to delete.
     */
    limit?: number
  }

  /**
   * MobileImport without action
   */
  export type MobileImportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MobileImport
     */
    select?: MobileImportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MobileImport
     */
    omit?: MobileImportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MobileImportInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    role: 'role',
    minutesToTestAgain: 'minutesToTestAgain',
    dailyTakeGoal: 'dailyTakeGoal'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const VersionScalarFieldEnum: {
    id: 'id',
    versionNumber: 'versionNumber',
    title: 'title',
    status: 'status',
    publishDate: 'publishDate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VersionScalarFieldEnum = (typeof VersionScalarFieldEnum)[keyof typeof VersionScalarFieldEnum]


  export const VersionCategoryScalarFieldEnum: {
    id: 'id',
    title: 'title',
    rank: 'rank',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VersionCategoryScalarFieldEnum = (typeof VersionCategoryScalarFieldEnum)[keyof typeof VersionCategoryScalarFieldEnum]


  export const VersionCategoryAbbreviationScalarFieldEnum: {
    id: 'id',
    versionCategoryId: 'versionCategoryId',
    abbreviationText: 'abbreviationText',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VersionCategoryAbbreviationScalarFieldEnum = (typeof VersionCategoryAbbreviationScalarFieldEnum)[keyof typeof VersionCategoryAbbreviationScalarFieldEnum]


  export const VersionItemScalarFieldEnum: {
    id: 'id',
    versionId: 'versionId',
    versionCategoryId: 'versionCategoryId',
    type: 'type',
    body: 'body',
    rank: 'rank',
    startedByUserId: 'startedByUserId',
    orderWithinVersion: 'orderWithinVersion',
    isTested: 'isTested',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VersionItemScalarFieldEnum = (typeof VersionItemScalarFieldEnum)[keyof typeof VersionItemScalarFieldEnum]


  export const FlashcardScalarFieldEnum: {
    id: 'id',
    ownerId: 'ownerId',
    front: 'front',
    back: 'back',
    frontLanguage: 'frontLanguage',
    backLanguage: 'backLanguage',
    pronunciation: 'pronunciation',
    createdAt: 'createdAt',
    status: 'status',
    rank: 'rank',
    memoryHook: 'memoryHook',
    nextTestTime: 'nextTestTime',
    copiedFromId: 'copiedFromId'
  };

  export type FlashcardScalarFieldEnum = (typeof FlashcardScalarFieldEnum)[keyof typeof FlashcardScalarFieldEnum]


  export const UserFlashcardActivityScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    flashcardId: 'flashcardId',
    whenActedUpon: 'whenActedUpon',
    actionTaken: 'actionTaken',
    actionDetails: 'actionDetails'
  };

  export type UserFlashcardActivityScalarFieldEnum = (typeof UserFlashcardActivityScalarFieldEnum)[keyof typeof UserFlashcardActivityScalarFieldEnum]


  export const TagScalarFieldEnum: {
    id: 'id',
    abbreviation: 'abbreviation',
    description: 'description'
  };

  export type TagScalarFieldEnum = (typeof TagScalarFieldEnum)[keyof typeof TagScalarFieldEnum]


  export const FlashcardTagScalarFieldEnum: {
    id: 'id',
    flashcardId: 'flashcardId',
    tagId: 'tagId'
  };

  export type FlashcardTagScalarFieldEnum = (typeof FlashcardTagScalarFieldEnum)[keyof typeof FlashcardTagScalarFieldEnum]


  export const MobileImportScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    mobileImportText: 'mobileImportText',
    whenImported: 'whenImported'
  };

  export type MobileImportScalarFieldEnum = (typeof MobileImportScalarFieldEnum)[keyof typeof MobileImportScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    minutesToTestAgain?: IntFilter<"User"> | number
    dailyTakeGoal?: IntFilter<"User"> | number
    flashcards?: FlashcardListRelationFilter
    activities?: UserFlashcardActivityListRelationFilter
    versionItems?: VersionItemListRelationFilter
    mobileImports?: MobileImportListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    role?: SortOrder
    minutesToTestAgain?: SortOrder
    dailyTakeGoal?: SortOrder
    flashcards?: FlashcardOrderByRelationAggregateInput
    activities?: UserFlashcardActivityOrderByRelationAggregateInput
    versionItems?: VersionItemOrderByRelationAggregateInput
    mobileImports?: MobileImportOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    minutesToTestAgain?: IntFilter<"User"> | number
    dailyTakeGoal?: IntFilter<"User"> | number
    flashcards?: FlashcardListRelationFilter
    activities?: UserFlashcardActivityListRelationFilter
    versionItems?: VersionItemListRelationFilter
    mobileImports?: MobileImportListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    role?: SortOrder
    minutesToTestAgain?: SortOrder
    dailyTakeGoal?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    firstName?: StringWithAggregatesFilter<"User"> | string
    lastName?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    minutesToTestAgain?: IntWithAggregatesFilter<"User"> | number
    dailyTakeGoal?: IntWithAggregatesFilter<"User"> | number
  }

  export type VersionWhereInput = {
    AND?: VersionWhereInput | VersionWhereInput[]
    OR?: VersionWhereInput[]
    NOT?: VersionWhereInput | VersionWhereInput[]
    id?: StringFilter<"Version"> | string
    versionNumber?: StringFilter<"Version"> | string
    title?: StringNullableFilter<"Version"> | string | null
    status?: StringFilter<"Version"> | string
    publishDate?: DateTimeNullableFilter<"Version"> | Date | string | null
    createdAt?: DateTimeFilter<"Version"> | Date | string
    updatedAt?: DateTimeFilter<"Version"> | Date | string
    versionItems?: VersionItemListRelationFilter
  }

  export type VersionOrderByWithRelationInput = {
    id?: SortOrder
    versionNumber?: SortOrder
    title?: SortOrderInput | SortOrder
    status?: SortOrder
    publishDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    versionItems?: VersionItemOrderByRelationAggregateInput
  }

  export type VersionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    versionNumber?: string
    AND?: VersionWhereInput | VersionWhereInput[]
    OR?: VersionWhereInput[]
    NOT?: VersionWhereInput | VersionWhereInput[]
    title?: StringNullableFilter<"Version"> | string | null
    status?: StringFilter<"Version"> | string
    publishDate?: DateTimeNullableFilter<"Version"> | Date | string | null
    createdAt?: DateTimeFilter<"Version"> | Date | string
    updatedAt?: DateTimeFilter<"Version"> | Date | string
    versionItems?: VersionItemListRelationFilter
  }, "id" | "versionNumber">

  export type VersionOrderByWithAggregationInput = {
    id?: SortOrder
    versionNumber?: SortOrder
    title?: SortOrderInput | SortOrder
    status?: SortOrder
    publishDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VersionCountOrderByAggregateInput
    _max?: VersionMaxOrderByAggregateInput
    _min?: VersionMinOrderByAggregateInput
  }

  export type VersionScalarWhereWithAggregatesInput = {
    AND?: VersionScalarWhereWithAggregatesInput | VersionScalarWhereWithAggregatesInput[]
    OR?: VersionScalarWhereWithAggregatesInput[]
    NOT?: VersionScalarWhereWithAggregatesInput | VersionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Version"> | string
    versionNumber?: StringWithAggregatesFilter<"Version"> | string
    title?: StringNullableWithAggregatesFilter<"Version"> | string | null
    status?: StringWithAggregatesFilter<"Version"> | string
    publishDate?: DateTimeNullableWithAggregatesFilter<"Version"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Version"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Version"> | Date | string
  }

  export type VersionCategoryWhereInput = {
    AND?: VersionCategoryWhereInput | VersionCategoryWhereInput[]
    OR?: VersionCategoryWhereInput[]
    NOT?: VersionCategoryWhereInput | VersionCategoryWhereInput[]
    id?: StringFilter<"VersionCategory"> | string
    title?: StringFilter<"VersionCategory"> | string
    rank?: FloatFilter<"VersionCategory"> | number
    createdAt?: DateTimeFilter<"VersionCategory"> | Date | string
    updatedAt?: DateTimeFilter<"VersionCategory"> | Date | string
    abbreviations?: VersionCategoryAbbreviationListRelationFilter
    versionItems?: VersionItemListRelationFilter
  }

  export type VersionCategoryOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    rank?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    abbreviations?: VersionCategoryAbbreviationOrderByRelationAggregateInput
    versionItems?: VersionItemOrderByRelationAggregateInput
  }

  export type VersionCategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    title?: string
    AND?: VersionCategoryWhereInput | VersionCategoryWhereInput[]
    OR?: VersionCategoryWhereInput[]
    NOT?: VersionCategoryWhereInput | VersionCategoryWhereInput[]
    rank?: FloatFilter<"VersionCategory"> | number
    createdAt?: DateTimeFilter<"VersionCategory"> | Date | string
    updatedAt?: DateTimeFilter<"VersionCategory"> | Date | string
    abbreviations?: VersionCategoryAbbreviationListRelationFilter
    versionItems?: VersionItemListRelationFilter
  }, "id" | "title">

  export type VersionCategoryOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    rank?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VersionCategoryCountOrderByAggregateInput
    _avg?: VersionCategoryAvgOrderByAggregateInput
    _max?: VersionCategoryMaxOrderByAggregateInput
    _min?: VersionCategoryMinOrderByAggregateInput
    _sum?: VersionCategorySumOrderByAggregateInput
  }

  export type VersionCategoryScalarWhereWithAggregatesInput = {
    AND?: VersionCategoryScalarWhereWithAggregatesInput | VersionCategoryScalarWhereWithAggregatesInput[]
    OR?: VersionCategoryScalarWhereWithAggregatesInput[]
    NOT?: VersionCategoryScalarWhereWithAggregatesInput | VersionCategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VersionCategory"> | string
    title?: StringWithAggregatesFilter<"VersionCategory"> | string
    rank?: FloatWithAggregatesFilter<"VersionCategory"> | number
    createdAt?: DateTimeWithAggregatesFilter<"VersionCategory"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"VersionCategory"> | Date | string
  }

  export type VersionCategoryAbbreviationWhereInput = {
    AND?: VersionCategoryAbbreviationWhereInput | VersionCategoryAbbreviationWhereInput[]
    OR?: VersionCategoryAbbreviationWhereInput[]
    NOT?: VersionCategoryAbbreviationWhereInput | VersionCategoryAbbreviationWhereInput[]
    id?: StringFilter<"VersionCategoryAbbreviation"> | string
    versionCategoryId?: StringFilter<"VersionCategoryAbbreviation"> | string
    abbreviationText?: StringFilter<"VersionCategoryAbbreviation"> | string
    createdAt?: DateTimeFilter<"VersionCategoryAbbreviation"> | Date | string
    updatedAt?: DateTimeFilter<"VersionCategoryAbbreviation"> | Date | string
    versionCategory?: XOR<VersionCategoryScalarRelationFilter, VersionCategoryWhereInput>
  }

  export type VersionCategoryAbbreviationOrderByWithRelationInput = {
    id?: SortOrder
    versionCategoryId?: SortOrder
    abbreviationText?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    versionCategory?: VersionCategoryOrderByWithRelationInput
  }

  export type VersionCategoryAbbreviationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VersionCategoryAbbreviationWhereInput | VersionCategoryAbbreviationWhereInput[]
    OR?: VersionCategoryAbbreviationWhereInput[]
    NOT?: VersionCategoryAbbreviationWhereInput | VersionCategoryAbbreviationWhereInput[]
    versionCategoryId?: StringFilter<"VersionCategoryAbbreviation"> | string
    abbreviationText?: StringFilter<"VersionCategoryAbbreviation"> | string
    createdAt?: DateTimeFilter<"VersionCategoryAbbreviation"> | Date | string
    updatedAt?: DateTimeFilter<"VersionCategoryAbbreviation"> | Date | string
    versionCategory?: XOR<VersionCategoryScalarRelationFilter, VersionCategoryWhereInput>
  }, "id">

  export type VersionCategoryAbbreviationOrderByWithAggregationInput = {
    id?: SortOrder
    versionCategoryId?: SortOrder
    abbreviationText?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VersionCategoryAbbreviationCountOrderByAggregateInput
    _max?: VersionCategoryAbbreviationMaxOrderByAggregateInput
    _min?: VersionCategoryAbbreviationMinOrderByAggregateInput
  }

  export type VersionCategoryAbbreviationScalarWhereWithAggregatesInput = {
    AND?: VersionCategoryAbbreviationScalarWhereWithAggregatesInput | VersionCategoryAbbreviationScalarWhereWithAggregatesInput[]
    OR?: VersionCategoryAbbreviationScalarWhereWithAggregatesInput[]
    NOT?: VersionCategoryAbbreviationScalarWhereWithAggregatesInput | VersionCategoryAbbreviationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VersionCategoryAbbreviation"> | string
    versionCategoryId?: StringWithAggregatesFilter<"VersionCategoryAbbreviation"> | string
    abbreviationText?: StringWithAggregatesFilter<"VersionCategoryAbbreviation"> | string
    createdAt?: DateTimeWithAggregatesFilter<"VersionCategoryAbbreviation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"VersionCategoryAbbreviation"> | Date | string
  }

  export type VersionItemWhereInput = {
    AND?: VersionItemWhereInput | VersionItemWhereInput[]
    OR?: VersionItemWhereInput[]
    NOT?: VersionItemWhereInput | VersionItemWhereInput[]
    id?: StringFilter<"VersionItem"> | string
    versionId?: StringNullableFilter<"VersionItem"> | string | null
    versionCategoryId?: StringNullableFilter<"VersionItem"> | string | null
    type?: StringFilter<"VersionItem"> | string
    body?: StringFilter<"VersionItem"> | string
    rank?: FloatFilter<"VersionItem"> | number
    startedByUserId?: StringNullableFilter<"VersionItem"> | string | null
    orderWithinVersion?: IntFilter<"VersionItem"> | number
    isTested?: BoolFilter<"VersionItem"> | boolean
    createdAt?: DateTimeFilter<"VersionItem"> | Date | string
    updatedAt?: DateTimeFilter<"VersionItem"> | Date | string
    version?: XOR<VersionNullableScalarRelationFilter, VersionWhereInput> | null
    versionCategory?: XOR<VersionCategoryNullableScalarRelationFilter, VersionCategoryWhereInput> | null
    startedByUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type VersionItemOrderByWithRelationInput = {
    id?: SortOrder
    versionId?: SortOrderInput | SortOrder
    versionCategoryId?: SortOrderInput | SortOrder
    type?: SortOrder
    body?: SortOrder
    rank?: SortOrder
    startedByUserId?: SortOrderInput | SortOrder
    orderWithinVersion?: SortOrder
    isTested?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: VersionOrderByWithRelationInput
    versionCategory?: VersionCategoryOrderByWithRelationInput
    startedByUser?: UserOrderByWithRelationInput
  }

  export type VersionItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VersionItemWhereInput | VersionItemWhereInput[]
    OR?: VersionItemWhereInput[]
    NOT?: VersionItemWhereInput | VersionItemWhereInput[]
    versionId?: StringNullableFilter<"VersionItem"> | string | null
    versionCategoryId?: StringNullableFilter<"VersionItem"> | string | null
    type?: StringFilter<"VersionItem"> | string
    body?: StringFilter<"VersionItem"> | string
    rank?: FloatFilter<"VersionItem"> | number
    startedByUserId?: StringNullableFilter<"VersionItem"> | string | null
    orderWithinVersion?: IntFilter<"VersionItem"> | number
    isTested?: BoolFilter<"VersionItem"> | boolean
    createdAt?: DateTimeFilter<"VersionItem"> | Date | string
    updatedAt?: DateTimeFilter<"VersionItem"> | Date | string
    version?: XOR<VersionNullableScalarRelationFilter, VersionWhereInput> | null
    versionCategory?: XOR<VersionCategoryNullableScalarRelationFilter, VersionCategoryWhereInput> | null
    startedByUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type VersionItemOrderByWithAggregationInput = {
    id?: SortOrder
    versionId?: SortOrderInput | SortOrder
    versionCategoryId?: SortOrderInput | SortOrder
    type?: SortOrder
    body?: SortOrder
    rank?: SortOrder
    startedByUserId?: SortOrderInput | SortOrder
    orderWithinVersion?: SortOrder
    isTested?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VersionItemCountOrderByAggregateInput
    _avg?: VersionItemAvgOrderByAggregateInput
    _max?: VersionItemMaxOrderByAggregateInput
    _min?: VersionItemMinOrderByAggregateInput
    _sum?: VersionItemSumOrderByAggregateInput
  }

  export type VersionItemScalarWhereWithAggregatesInput = {
    AND?: VersionItemScalarWhereWithAggregatesInput | VersionItemScalarWhereWithAggregatesInput[]
    OR?: VersionItemScalarWhereWithAggregatesInput[]
    NOT?: VersionItemScalarWhereWithAggregatesInput | VersionItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VersionItem"> | string
    versionId?: StringNullableWithAggregatesFilter<"VersionItem"> | string | null
    versionCategoryId?: StringNullableWithAggregatesFilter<"VersionItem"> | string | null
    type?: StringWithAggregatesFilter<"VersionItem"> | string
    body?: StringWithAggregatesFilter<"VersionItem"> | string
    rank?: FloatWithAggregatesFilter<"VersionItem"> | number
    startedByUserId?: StringNullableWithAggregatesFilter<"VersionItem"> | string | null
    orderWithinVersion?: IntWithAggregatesFilter<"VersionItem"> | number
    isTested?: BoolWithAggregatesFilter<"VersionItem"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"VersionItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"VersionItem"> | Date | string
  }

  export type FlashcardWhereInput = {
    AND?: FlashcardWhereInput | FlashcardWhereInput[]
    OR?: FlashcardWhereInput[]
    NOT?: FlashcardWhereInput | FlashcardWhereInput[]
    id?: StringFilter<"Flashcard"> | string
    ownerId?: StringFilter<"Flashcard"> | string
    front?: StringFilter<"Flashcard"> | string
    back?: StringFilter<"Flashcard"> | string
    frontLanguage?: StringFilter<"Flashcard"> | string
    backLanguage?: StringFilter<"Flashcard"> | string
    pronunciation?: StringNullableFilter<"Flashcard"> | string | null
    createdAt?: DateTimeFilter<"Flashcard"> | Date | string
    status?: StringFilter<"Flashcard"> | string
    rank?: FloatFilter<"Flashcard"> | number
    memoryHook?: StringNullableFilter<"Flashcard"> | string | null
    nextTestTime?: DateTimeNullableFilter<"Flashcard"> | Date | string | null
    copiedFromId?: StringNullableFilter<"Flashcard"> | string | null
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    copiedFrom?: XOR<FlashcardNullableScalarRelationFilter, FlashcardWhereInput> | null
    copies?: FlashcardListRelationFilter
    activities?: UserFlashcardActivityListRelationFilter
    tags?: FlashcardTagListRelationFilter
  }

  export type FlashcardOrderByWithRelationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    front?: SortOrder
    back?: SortOrder
    frontLanguage?: SortOrder
    backLanguage?: SortOrder
    pronunciation?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    status?: SortOrder
    rank?: SortOrder
    memoryHook?: SortOrderInput | SortOrder
    nextTestTime?: SortOrderInput | SortOrder
    copiedFromId?: SortOrderInput | SortOrder
    owner?: UserOrderByWithRelationInput
    copiedFrom?: FlashcardOrderByWithRelationInput
    copies?: FlashcardOrderByRelationAggregateInput
    activities?: UserFlashcardActivityOrderByRelationAggregateInput
    tags?: FlashcardTagOrderByRelationAggregateInput
  }

  export type FlashcardWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FlashcardWhereInput | FlashcardWhereInput[]
    OR?: FlashcardWhereInput[]
    NOT?: FlashcardWhereInput | FlashcardWhereInput[]
    ownerId?: StringFilter<"Flashcard"> | string
    front?: StringFilter<"Flashcard"> | string
    back?: StringFilter<"Flashcard"> | string
    frontLanguage?: StringFilter<"Flashcard"> | string
    backLanguage?: StringFilter<"Flashcard"> | string
    pronunciation?: StringNullableFilter<"Flashcard"> | string | null
    createdAt?: DateTimeFilter<"Flashcard"> | Date | string
    status?: StringFilter<"Flashcard"> | string
    rank?: FloatFilter<"Flashcard"> | number
    memoryHook?: StringNullableFilter<"Flashcard"> | string | null
    nextTestTime?: DateTimeNullableFilter<"Flashcard"> | Date | string | null
    copiedFromId?: StringNullableFilter<"Flashcard"> | string | null
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    copiedFrom?: XOR<FlashcardNullableScalarRelationFilter, FlashcardWhereInput> | null
    copies?: FlashcardListRelationFilter
    activities?: UserFlashcardActivityListRelationFilter
    tags?: FlashcardTagListRelationFilter
  }, "id">

  export type FlashcardOrderByWithAggregationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    front?: SortOrder
    back?: SortOrder
    frontLanguage?: SortOrder
    backLanguage?: SortOrder
    pronunciation?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    status?: SortOrder
    rank?: SortOrder
    memoryHook?: SortOrderInput | SortOrder
    nextTestTime?: SortOrderInput | SortOrder
    copiedFromId?: SortOrderInput | SortOrder
    _count?: FlashcardCountOrderByAggregateInput
    _avg?: FlashcardAvgOrderByAggregateInput
    _max?: FlashcardMaxOrderByAggregateInput
    _min?: FlashcardMinOrderByAggregateInput
    _sum?: FlashcardSumOrderByAggregateInput
  }

  export type FlashcardScalarWhereWithAggregatesInput = {
    AND?: FlashcardScalarWhereWithAggregatesInput | FlashcardScalarWhereWithAggregatesInput[]
    OR?: FlashcardScalarWhereWithAggregatesInput[]
    NOT?: FlashcardScalarWhereWithAggregatesInput | FlashcardScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Flashcard"> | string
    ownerId?: StringWithAggregatesFilter<"Flashcard"> | string
    front?: StringWithAggregatesFilter<"Flashcard"> | string
    back?: StringWithAggregatesFilter<"Flashcard"> | string
    frontLanguage?: StringWithAggregatesFilter<"Flashcard"> | string
    backLanguage?: StringWithAggregatesFilter<"Flashcard"> | string
    pronunciation?: StringNullableWithAggregatesFilter<"Flashcard"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Flashcard"> | Date | string
    status?: StringWithAggregatesFilter<"Flashcard"> | string
    rank?: FloatWithAggregatesFilter<"Flashcard"> | number
    memoryHook?: StringNullableWithAggregatesFilter<"Flashcard"> | string | null
    nextTestTime?: DateTimeNullableWithAggregatesFilter<"Flashcard"> | Date | string | null
    copiedFromId?: StringNullableWithAggregatesFilter<"Flashcard"> | string | null
  }

  export type UserFlashcardActivityWhereInput = {
    AND?: UserFlashcardActivityWhereInput | UserFlashcardActivityWhereInput[]
    OR?: UserFlashcardActivityWhereInput[]
    NOT?: UserFlashcardActivityWhereInput | UserFlashcardActivityWhereInput[]
    id?: StringFilter<"UserFlashcardActivity"> | string
    userId?: StringFilter<"UserFlashcardActivity"> | string
    flashcardId?: StringFilter<"UserFlashcardActivity"> | string
    whenActedUpon?: DateTimeFilter<"UserFlashcardActivity"> | Date | string
    actionTaken?: StringFilter<"UserFlashcardActivity"> | string
    actionDetails?: StringNullableFilter<"UserFlashcardActivity"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    flashcard?: XOR<FlashcardScalarRelationFilter, FlashcardWhereInput>
  }

  export type UserFlashcardActivityOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    flashcardId?: SortOrder
    whenActedUpon?: SortOrder
    actionTaken?: SortOrder
    actionDetails?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    flashcard?: FlashcardOrderByWithRelationInput
  }

  export type UserFlashcardActivityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UserFlashcardActivityWhereInput | UserFlashcardActivityWhereInput[]
    OR?: UserFlashcardActivityWhereInput[]
    NOT?: UserFlashcardActivityWhereInput | UserFlashcardActivityWhereInput[]
    userId?: StringFilter<"UserFlashcardActivity"> | string
    flashcardId?: StringFilter<"UserFlashcardActivity"> | string
    whenActedUpon?: DateTimeFilter<"UserFlashcardActivity"> | Date | string
    actionTaken?: StringFilter<"UserFlashcardActivity"> | string
    actionDetails?: StringNullableFilter<"UserFlashcardActivity"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    flashcard?: XOR<FlashcardScalarRelationFilter, FlashcardWhereInput>
  }, "id">

  export type UserFlashcardActivityOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    flashcardId?: SortOrder
    whenActedUpon?: SortOrder
    actionTaken?: SortOrder
    actionDetails?: SortOrderInput | SortOrder
    _count?: UserFlashcardActivityCountOrderByAggregateInput
    _max?: UserFlashcardActivityMaxOrderByAggregateInput
    _min?: UserFlashcardActivityMinOrderByAggregateInput
  }

  export type UserFlashcardActivityScalarWhereWithAggregatesInput = {
    AND?: UserFlashcardActivityScalarWhereWithAggregatesInput | UserFlashcardActivityScalarWhereWithAggregatesInput[]
    OR?: UserFlashcardActivityScalarWhereWithAggregatesInput[]
    NOT?: UserFlashcardActivityScalarWhereWithAggregatesInput | UserFlashcardActivityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserFlashcardActivity"> | string
    userId?: StringWithAggregatesFilter<"UserFlashcardActivity"> | string
    flashcardId?: StringWithAggregatesFilter<"UserFlashcardActivity"> | string
    whenActedUpon?: DateTimeWithAggregatesFilter<"UserFlashcardActivity"> | Date | string
    actionTaken?: StringWithAggregatesFilter<"UserFlashcardActivity"> | string
    actionDetails?: StringNullableWithAggregatesFilter<"UserFlashcardActivity"> | string | null
  }

  export type TagWhereInput = {
    AND?: TagWhereInput | TagWhereInput[]
    OR?: TagWhereInput[]
    NOT?: TagWhereInput | TagWhereInput[]
    id?: StringFilter<"Tag"> | string
    abbreviation?: StringFilter<"Tag"> | string
    description?: StringNullableFilter<"Tag"> | string | null
    flashcards?: FlashcardTagListRelationFilter
  }

  export type TagOrderByWithRelationInput = {
    id?: SortOrder
    abbreviation?: SortOrder
    description?: SortOrderInput | SortOrder
    flashcards?: FlashcardTagOrderByRelationAggregateInput
  }

  export type TagWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    abbreviation?: string
    AND?: TagWhereInput | TagWhereInput[]
    OR?: TagWhereInput[]
    NOT?: TagWhereInput | TagWhereInput[]
    description?: StringNullableFilter<"Tag"> | string | null
    flashcards?: FlashcardTagListRelationFilter
  }, "id" | "abbreviation">

  export type TagOrderByWithAggregationInput = {
    id?: SortOrder
    abbreviation?: SortOrder
    description?: SortOrderInput | SortOrder
    _count?: TagCountOrderByAggregateInput
    _max?: TagMaxOrderByAggregateInput
    _min?: TagMinOrderByAggregateInput
  }

  export type TagScalarWhereWithAggregatesInput = {
    AND?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[]
    OR?: TagScalarWhereWithAggregatesInput[]
    NOT?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tag"> | string
    abbreviation?: StringWithAggregatesFilter<"Tag"> | string
    description?: StringNullableWithAggregatesFilter<"Tag"> | string | null
  }

  export type FlashcardTagWhereInput = {
    AND?: FlashcardTagWhereInput | FlashcardTagWhereInput[]
    OR?: FlashcardTagWhereInput[]
    NOT?: FlashcardTagWhereInput | FlashcardTagWhereInput[]
    id?: StringFilter<"FlashcardTag"> | string
    flashcardId?: StringFilter<"FlashcardTag"> | string
    tagId?: StringFilter<"FlashcardTag"> | string
    flashcard?: XOR<FlashcardScalarRelationFilter, FlashcardWhereInput>
    tag?: XOR<TagScalarRelationFilter, TagWhereInput>
  }

  export type FlashcardTagOrderByWithRelationInput = {
    id?: SortOrder
    flashcardId?: SortOrder
    tagId?: SortOrder
    flashcard?: FlashcardOrderByWithRelationInput
    tag?: TagOrderByWithRelationInput
  }

  export type FlashcardTagWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    flashcardId_tagId?: FlashcardTagFlashcardIdTagIdCompoundUniqueInput
    AND?: FlashcardTagWhereInput | FlashcardTagWhereInput[]
    OR?: FlashcardTagWhereInput[]
    NOT?: FlashcardTagWhereInput | FlashcardTagWhereInput[]
    flashcardId?: StringFilter<"FlashcardTag"> | string
    tagId?: StringFilter<"FlashcardTag"> | string
    flashcard?: XOR<FlashcardScalarRelationFilter, FlashcardWhereInput>
    tag?: XOR<TagScalarRelationFilter, TagWhereInput>
  }, "id" | "flashcardId_tagId">

  export type FlashcardTagOrderByWithAggregationInput = {
    id?: SortOrder
    flashcardId?: SortOrder
    tagId?: SortOrder
    _count?: FlashcardTagCountOrderByAggregateInput
    _max?: FlashcardTagMaxOrderByAggregateInput
    _min?: FlashcardTagMinOrderByAggregateInput
  }

  export type FlashcardTagScalarWhereWithAggregatesInput = {
    AND?: FlashcardTagScalarWhereWithAggregatesInput | FlashcardTagScalarWhereWithAggregatesInput[]
    OR?: FlashcardTagScalarWhereWithAggregatesInput[]
    NOT?: FlashcardTagScalarWhereWithAggregatesInput | FlashcardTagScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FlashcardTag"> | string
    flashcardId?: StringWithAggregatesFilter<"FlashcardTag"> | string
    tagId?: StringWithAggregatesFilter<"FlashcardTag"> | string
  }

  export type MobileImportWhereInput = {
    AND?: MobileImportWhereInput | MobileImportWhereInput[]
    OR?: MobileImportWhereInput[]
    NOT?: MobileImportWhereInput | MobileImportWhereInput[]
    id?: StringFilter<"MobileImport"> | string
    userId?: StringFilter<"MobileImport"> | string
    mobileImportText?: StringFilter<"MobileImport"> | string
    whenImported?: DateTimeFilter<"MobileImport"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type MobileImportOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    mobileImportText?: SortOrder
    whenImported?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type MobileImportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MobileImportWhereInput | MobileImportWhereInput[]
    OR?: MobileImportWhereInput[]
    NOT?: MobileImportWhereInput | MobileImportWhereInput[]
    userId?: StringFilter<"MobileImport"> | string
    mobileImportText?: StringFilter<"MobileImport"> | string
    whenImported?: DateTimeFilter<"MobileImport"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type MobileImportOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    mobileImportText?: SortOrder
    whenImported?: SortOrder
    _count?: MobileImportCountOrderByAggregateInput
    _max?: MobileImportMaxOrderByAggregateInput
    _min?: MobileImportMinOrderByAggregateInput
  }

  export type MobileImportScalarWhereWithAggregatesInput = {
    AND?: MobileImportScalarWhereWithAggregatesInput | MobileImportScalarWhereWithAggregatesInput[]
    OR?: MobileImportScalarWhereWithAggregatesInput[]
    NOT?: MobileImportScalarWhereWithAggregatesInput | MobileImportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MobileImport"> | string
    userId?: StringWithAggregatesFilter<"MobileImport"> | string
    mobileImportText?: StringWithAggregatesFilter<"MobileImport"> | string
    whenImported?: DateTimeWithAggregatesFilter<"MobileImport"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    role?: string
    minutesToTestAgain?: number
    dailyTakeGoal?: number
    flashcards?: FlashcardCreateNestedManyWithoutOwnerInput
    activities?: UserFlashcardActivityCreateNestedManyWithoutUserInput
    versionItems?: VersionItemCreateNestedManyWithoutStartedByUserInput
    mobileImports?: MobileImportCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    role?: string
    minutesToTestAgain?: number
    dailyTakeGoal?: number
    flashcards?: FlashcardUncheckedCreateNestedManyWithoutOwnerInput
    activities?: UserFlashcardActivityUncheckedCreateNestedManyWithoutUserInput
    versionItems?: VersionItemUncheckedCreateNestedManyWithoutStartedByUserInput
    mobileImports?: MobileImportUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    minutesToTestAgain?: IntFieldUpdateOperationsInput | number
    dailyTakeGoal?: IntFieldUpdateOperationsInput | number
    flashcards?: FlashcardUpdateManyWithoutOwnerNestedInput
    activities?: UserFlashcardActivityUpdateManyWithoutUserNestedInput
    versionItems?: VersionItemUpdateManyWithoutStartedByUserNestedInput
    mobileImports?: MobileImportUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    minutesToTestAgain?: IntFieldUpdateOperationsInput | number
    dailyTakeGoal?: IntFieldUpdateOperationsInput | number
    flashcards?: FlashcardUncheckedUpdateManyWithoutOwnerNestedInput
    activities?: UserFlashcardActivityUncheckedUpdateManyWithoutUserNestedInput
    versionItems?: VersionItemUncheckedUpdateManyWithoutStartedByUserNestedInput
    mobileImports?: MobileImportUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    role?: string
    minutesToTestAgain?: number
    dailyTakeGoal?: number
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    minutesToTestAgain?: IntFieldUpdateOperationsInput | number
    dailyTakeGoal?: IntFieldUpdateOperationsInput | number
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    minutesToTestAgain?: IntFieldUpdateOperationsInput | number
    dailyTakeGoal?: IntFieldUpdateOperationsInput | number
  }

  export type VersionCreateInput = {
    id?: string
    versionNumber: string
    title?: string | null
    status?: string
    publishDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    versionItems?: VersionItemCreateNestedManyWithoutVersionInput
  }

  export type VersionUncheckedCreateInput = {
    id?: string
    versionNumber: string
    title?: string | null
    status?: string
    publishDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    versionItems?: VersionItemUncheckedCreateNestedManyWithoutVersionInput
  }

  export type VersionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionNumber?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    publishDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versionItems?: VersionItemUpdateManyWithoutVersionNestedInput
  }

  export type VersionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionNumber?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    publishDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versionItems?: VersionItemUncheckedUpdateManyWithoutVersionNestedInput
  }

  export type VersionCreateManyInput = {
    id?: string
    versionNumber: string
    title?: string | null
    status?: string
    publishDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VersionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionNumber?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    publishDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VersionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionNumber?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    publishDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VersionCategoryCreateInput = {
    id?: string
    title: string
    rank?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    abbreviations?: VersionCategoryAbbreviationCreateNestedManyWithoutVersionCategoryInput
    versionItems?: VersionItemCreateNestedManyWithoutVersionCategoryInput
  }

  export type VersionCategoryUncheckedCreateInput = {
    id?: string
    title: string
    rank?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    abbreviations?: VersionCategoryAbbreviationUncheckedCreateNestedManyWithoutVersionCategoryInput
    versionItems?: VersionItemUncheckedCreateNestedManyWithoutVersionCategoryInput
  }

  export type VersionCategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    abbreviations?: VersionCategoryAbbreviationUpdateManyWithoutVersionCategoryNestedInput
    versionItems?: VersionItemUpdateManyWithoutVersionCategoryNestedInput
  }

  export type VersionCategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    abbreviations?: VersionCategoryAbbreviationUncheckedUpdateManyWithoutVersionCategoryNestedInput
    versionItems?: VersionItemUncheckedUpdateManyWithoutVersionCategoryNestedInput
  }

  export type VersionCategoryCreateManyInput = {
    id?: string
    title: string
    rank?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VersionCategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VersionCategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VersionCategoryAbbreviationCreateInput = {
    id?: string
    abbreviationText: string
    createdAt?: Date | string
    updatedAt?: Date | string
    versionCategory: VersionCategoryCreateNestedOneWithoutAbbreviationsInput
  }

  export type VersionCategoryAbbreviationUncheckedCreateInput = {
    id?: string
    versionCategoryId: string
    abbreviationText: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VersionCategoryAbbreviationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    abbreviationText?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versionCategory?: VersionCategoryUpdateOneRequiredWithoutAbbreviationsNestedInput
  }

  export type VersionCategoryAbbreviationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionCategoryId?: StringFieldUpdateOperationsInput | string
    abbreviationText?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VersionCategoryAbbreviationCreateManyInput = {
    id?: string
    versionCategoryId: string
    abbreviationText: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VersionCategoryAbbreviationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    abbreviationText?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VersionCategoryAbbreviationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionCategoryId?: StringFieldUpdateOperationsInput | string
    abbreviationText?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VersionItemCreateInput = {
    id?: string
    type?: string
    body: string
    rank?: number
    orderWithinVersion?: number
    isTested?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: VersionCreateNestedOneWithoutVersionItemsInput
    versionCategory?: VersionCategoryCreateNestedOneWithoutVersionItemsInput
    startedByUser?: UserCreateNestedOneWithoutVersionItemsInput
  }

  export type VersionItemUncheckedCreateInput = {
    id?: string
    versionId?: string | null
    versionCategoryId?: string | null
    type?: string
    body: string
    rank?: number
    startedByUserId?: string | null
    orderWithinVersion?: number
    isTested?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VersionItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    orderWithinVersion?: IntFieldUpdateOperationsInput | number
    isTested?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: VersionUpdateOneWithoutVersionItemsNestedInput
    versionCategory?: VersionCategoryUpdateOneWithoutVersionItemsNestedInput
    startedByUser?: UserUpdateOneWithoutVersionItemsNestedInput
  }

  export type VersionItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionId?: NullableStringFieldUpdateOperationsInput | string | null
    versionCategoryId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    startedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    orderWithinVersion?: IntFieldUpdateOperationsInput | number
    isTested?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VersionItemCreateManyInput = {
    id?: string
    versionId?: string | null
    versionCategoryId?: string | null
    type?: string
    body: string
    rank?: number
    startedByUserId?: string | null
    orderWithinVersion?: number
    isTested?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VersionItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    orderWithinVersion?: IntFieldUpdateOperationsInput | number
    isTested?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VersionItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionId?: NullableStringFieldUpdateOperationsInput | string | null
    versionCategoryId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    startedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    orderWithinVersion?: IntFieldUpdateOperationsInput | number
    isTested?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlashcardCreateInput = {
    id?: string
    front: string
    back: string
    frontLanguage: string
    backLanguage: string
    pronunciation?: string | null
    createdAt?: Date | string
    status?: string
    rank?: number
    memoryHook?: string | null
    nextTestTime?: Date | string | null
    owner: UserCreateNestedOneWithoutFlashcardsInput
    copiedFrom?: FlashcardCreateNestedOneWithoutCopiesInput
    copies?: FlashcardCreateNestedManyWithoutCopiedFromInput
    activities?: UserFlashcardActivityCreateNestedManyWithoutFlashcardInput
    tags?: FlashcardTagCreateNestedManyWithoutFlashcardInput
  }

  export type FlashcardUncheckedCreateInput = {
    id?: string
    ownerId: string
    front: string
    back: string
    frontLanguage: string
    backLanguage: string
    pronunciation?: string | null
    createdAt?: Date | string
    status?: string
    rank?: number
    memoryHook?: string | null
    nextTestTime?: Date | string | null
    copiedFromId?: string | null
    copies?: FlashcardUncheckedCreateNestedManyWithoutCopiedFromInput
    activities?: UserFlashcardActivityUncheckedCreateNestedManyWithoutFlashcardInput
    tags?: FlashcardTagUncheckedCreateNestedManyWithoutFlashcardInput
  }

  export type FlashcardUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    frontLanguage?: StringFieldUpdateOperationsInput | string
    backLanguage?: StringFieldUpdateOperationsInput | string
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    memoryHook?: NullableStringFieldUpdateOperationsInput | string | null
    nextTestTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    owner?: UserUpdateOneRequiredWithoutFlashcardsNestedInput
    copiedFrom?: FlashcardUpdateOneWithoutCopiesNestedInput
    copies?: FlashcardUpdateManyWithoutCopiedFromNestedInput
    activities?: UserFlashcardActivityUpdateManyWithoutFlashcardNestedInput
    tags?: FlashcardTagUpdateManyWithoutFlashcardNestedInput
  }

  export type FlashcardUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    frontLanguage?: StringFieldUpdateOperationsInput | string
    backLanguage?: StringFieldUpdateOperationsInput | string
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    memoryHook?: NullableStringFieldUpdateOperationsInput | string | null
    nextTestTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    copiedFromId?: NullableStringFieldUpdateOperationsInput | string | null
    copies?: FlashcardUncheckedUpdateManyWithoutCopiedFromNestedInput
    activities?: UserFlashcardActivityUncheckedUpdateManyWithoutFlashcardNestedInput
    tags?: FlashcardTagUncheckedUpdateManyWithoutFlashcardNestedInput
  }

  export type FlashcardCreateManyInput = {
    id?: string
    ownerId: string
    front: string
    back: string
    frontLanguage: string
    backLanguage: string
    pronunciation?: string | null
    createdAt?: Date | string
    status?: string
    rank?: number
    memoryHook?: string | null
    nextTestTime?: Date | string | null
    copiedFromId?: string | null
  }

  export type FlashcardUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    frontLanguage?: StringFieldUpdateOperationsInput | string
    backLanguage?: StringFieldUpdateOperationsInput | string
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    memoryHook?: NullableStringFieldUpdateOperationsInput | string | null
    nextTestTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FlashcardUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    frontLanguage?: StringFieldUpdateOperationsInput | string
    backLanguage?: StringFieldUpdateOperationsInput | string
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    memoryHook?: NullableStringFieldUpdateOperationsInput | string | null
    nextTestTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    copiedFromId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserFlashcardActivityCreateInput = {
    id?: string
    whenActedUpon?: Date | string
    actionTaken: string
    actionDetails?: string | null
    user: UserCreateNestedOneWithoutActivitiesInput
    flashcard: FlashcardCreateNestedOneWithoutActivitiesInput
  }

  export type UserFlashcardActivityUncheckedCreateInput = {
    id?: string
    userId: string
    flashcardId: string
    whenActedUpon?: Date | string
    actionTaken: string
    actionDetails?: string | null
  }

  export type UserFlashcardActivityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    whenActedUpon?: DateTimeFieldUpdateOperationsInput | Date | string
    actionTaken?: StringFieldUpdateOperationsInput | string
    actionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutActivitiesNestedInput
    flashcard?: FlashcardUpdateOneRequiredWithoutActivitiesNestedInput
  }

  export type UserFlashcardActivityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    flashcardId?: StringFieldUpdateOperationsInput | string
    whenActedUpon?: DateTimeFieldUpdateOperationsInput | Date | string
    actionTaken?: StringFieldUpdateOperationsInput | string
    actionDetails?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserFlashcardActivityCreateManyInput = {
    id?: string
    userId: string
    flashcardId: string
    whenActedUpon?: Date | string
    actionTaken: string
    actionDetails?: string | null
  }

  export type UserFlashcardActivityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    whenActedUpon?: DateTimeFieldUpdateOperationsInput | Date | string
    actionTaken?: StringFieldUpdateOperationsInput | string
    actionDetails?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserFlashcardActivityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    flashcardId?: StringFieldUpdateOperationsInput | string
    whenActedUpon?: DateTimeFieldUpdateOperationsInput | Date | string
    actionTaken?: StringFieldUpdateOperationsInput | string
    actionDetails?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TagCreateInput = {
    id?: string
    abbreviation: string
    description?: string | null
    flashcards?: FlashcardTagCreateNestedManyWithoutTagInput
  }

  export type TagUncheckedCreateInput = {
    id?: string
    abbreviation: string
    description?: string | null
    flashcards?: FlashcardTagUncheckedCreateNestedManyWithoutTagInput
  }

  export type TagUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    flashcards?: FlashcardTagUpdateManyWithoutTagNestedInput
  }

  export type TagUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    flashcards?: FlashcardTagUncheckedUpdateManyWithoutTagNestedInput
  }

  export type TagCreateManyInput = {
    id?: string
    abbreviation: string
    description?: string | null
  }

  export type TagUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TagUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FlashcardTagCreateInput = {
    id?: string
    flashcard: FlashcardCreateNestedOneWithoutTagsInput
    tag: TagCreateNestedOneWithoutFlashcardsInput
  }

  export type FlashcardTagUncheckedCreateInput = {
    id?: string
    flashcardId: string
    tagId: string
  }

  export type FlashcardTagUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    flashcard?: FlashcardUpdateOneRequiredWithoutTagsNestedInput
    tag?: TagUpdateOneRequiredWithoutFlashcardsNestedInput
  }

  export type FlashcardTagUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    flashcardId?: StringFieldUpdateOperationsInput | string
    tagId?: StringFieldUpdateOperationsInput | string
  }

  export type FlashcardTagCreateManyInput = {
    id?: string
    flashcardId: string
    tagId: string
  }

  export type FlashcardTagUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type FlashcardTagUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    flashcardId?: StringFieldUpdateOperationsInput | string
    tagId?: StringFieldUpdateOperationsInput | string
  }

  export type MobileImportCreateInput = {
    id?: string
    mobileImportText: string
    whenImported?: Date | string
    user: UserCreateNestedOneWithoutMobileImportsInput
  }

  export type MobileImportUncheckedCreateInput = {
    id?: string
    userId: string
    mobileImportText: string
    whenImported?: Date | string
  }

  export type MobileImportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mobileImportText?: StringFieldUpdateOperationsInput | string
    whenImported?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMobileImportsNestedInput
  }

  export type MobileImportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    mobileImportText?: StringFieldUpdateOperationsInput | string
    whenImported?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MobileImportCreateManyInput = {
    id?: string
    userId: string
    mobileImportText: string
    whenImported?: Date | string
  }

  export type MobileImportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    mobileImportText?: StringFieldUpdateOperationsInput | string
    whenImported?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MobileImportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    mobileImportText?: StringFieldUpdateOperationsInput | string
    whenImported?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type FlashcardListRelationFilter = {
    every?: FlashcardWhereInput
    some?: FlashcardWhereInput
    none?: FlashcardWhereInput
  }

  export type UserFlashcardActivityListRelationFilter = {
    every?: UserFlashcardActivityWhereInput
    some?: UserFlashcardActivityWhereInput
    none?: UserFlashcardActivityWhereInput
  }

  export type VersionItemListRelationFilter = {
    every?: VersionItemWhereInput
    some?: VersionItemWhereInput
    none?: VersionItemWhereInput
  }

  export type MobileImportListRelationFilter = {
    every?: MobileImportWhereInput
    some?: MobileImportWhereInput
    none?: MobileImportWhereInput
  }

  export type FlashcardOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserFlashcardActivityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VersionItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MobileImportOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    role?: SortOrder
    minutesToTestAgain?: SortOrder
    dailyTakeGoal?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    minutesToTestAgain?: SortOrder
    dailyTakeGoal?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    role?: SortOrder
    minutesToTestAgain?: SortOrder
    dailyTakeGoal?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    role?: SortOrder
    minutesToTestAgain?: SortOrder
    dailyTakeGoal?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    minutesToTestAgain?: SortOrder
    dailyTakeGoal?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type VersionCountOrderByAggregateInput = {
    id?: SortOrder
    versionNumber?: SortOrder
    title?: SortOrder
    status?: SortOrder
    publishDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VersionMaxOrderByAggregateInput = {
    id?: SortOrder
    versionNumber?: SortOrder
    title?: SortOrder
    status?: SortOrder
    publishDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VersionMinOrderByAggregateInput = {
    id?: SortOrder
    versionNumber?: SortOrder
    title?: SortOrder
    status?: SortOrder
    publishDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type VersionCategoryAbbreviationListRelationFilter = {
    every?: VersionCategoryAbbreviationWhereInput
    some?: VersionCategoryAbbreviationWhereInput
    none?: VersionCategoryAbbreviationWhereInput
  }

  export type VersionCategoryAbbreviationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VersionCategoryCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    rank?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VersionCategoryAvgOrderByAggregateInput = {
    rank?: SortOrder
  }

  export type VersionCategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    rank?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VersionCategoryMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    rank?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VersionCategorySumOrderByAggregateInput = {
    rank?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type VersionCategoryScalarRelationFilter = {
    is?: VersionCategoryWhereInput
    isNot?: VersionCategoryWhereInput
  }

  export type VersionCategoryAbbreviationCountOrderByAggregateInput = {
    id?: SortOrder
    versionCategoryId?: SortOrder
    abbreviationText?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VersionCategoryAbbreviationMaxOrderByAggregateInput = {
    id?: SortOrder
    versionCategoryId?: SortOrder
    abbreviationText?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VersionCategoryAbbreviationMinOrderByAggregateInput = {
    id?: SortOrder
    versionCategoryId?: SortOrder
    abbreviationText?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type VersionNullableScalarRelationFilter = {
    is?: VersionWhereInput | null
    isNot?: VersionWhereInput | null
  }

  export type VersionCategoryNullableScalarRelationFilter = {
    is?: VersionCategoryWhereInput | null
    isNot?: VersionCategoryWhereInput | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type VersionItemCountOrderByAggregateInput = {
    id?: SortOrder
    versionId?: SortOrder
    versionCategoryId?: SortOrder
    type?: SortOrder
    body?: SortOrder
    rank?: SortOrder
    startedByUserId?: SortOrder
    orderWithinVersion?: SortOrder
    isTested?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VersionItemAvgOrderByAggregateInput = {
    rank?: SortOrder
    orderWithinVersion?: SortOrder
  }

  export type VersionItemMaxOrderByAggregateInput = {
    id?: SortOrder
    versionId?: SortOrder
    versionCategoryId?: SortOrder
    type?: SortOrder
    body?: SortOrder
    rank?: SortOrder
    startedByUserId?: SortOrder
    orderWithinVersion?: SortOrder
    isTested?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VersionItemMinOrderByAggregateInput = {
    id?: SortOrder
    versionId?: SortOrder
    versionCategoryId?: SortOrder
    type?: SortOrder
    body?: SortOrder
    rank?: SortOrder
    startedByUserId?: SortOrder
    orderWithinVersion?: SortOrder
    isTested?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VersionItemSumOrderByAggregateInput = {
    rank?: SortOrder
    orderWithinVersion?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type FlashcardNullableScalarRelationFilter = {
    is?: FlashcardWhereInput | null
    isNot?: FlashcardWhereInput | null
  }

  export type FlashcardTagListRelationFilter = {
    every?: FlashcardTagWhereInput
    some?: FlashcardTagWhereInput
    none?: FlashcardTagWhereInput
  }

  export type FlashcardTagOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FlashcardCountOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    front?: SortOrder
    back?: SortOrder
    frontLanguage?: SortOrder
    backLanguage?: SortOrder
    pronunciation?: SortOrder
    createdAt?: SortOrder
    status?: SortOrder
    rank?: SortOrder
    memoryHook?: SortOrder
    nextTestTime?: SortOrder
    copiedFromId?: SortOrder
  }

  export type FlashcardAvgOrderByAggregateInput = {
    rank?: SortOrder
  }

  export type FlashcardMaxOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    front?: SortOrder
    back?: SortOrder
    frontLanguage?: SortOrder
    backLanguage?: SortOrder
    pronunciation?: SortOrder
    createdAt?: SortOrder
    status?: SortOrder
    rank?: SortOrder
    memoryHook?: SortOrder
    nextTestTime?: SortOrder
    copiedFromId?: SortOrder
  }

  export type FlashcardMinOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    front?: SortOrder
    back?: SortOrder
    frontLanguage?: SortOrder
    backLanguage?: SortOrder
    pronunciation?: SortOrder
    createdAt?: SortOrder
    status?: SortOrder
    rank?: SortOrder
    memoryHook?: SortOrder
    nextTestTime?: SortOrder
    copiedFromId?: SortOrder
  }

  export type FlashcardSumOrderByAggregateInput = {
    rank?: SortOrder
  }

  export type FlashcardScalarRelationFilter = {
    is?: FlashcardWhereInput
    isNot?: FlashcardWhereInput
  }

  export type UserFlashcardActivityCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    flashcardId?: SortOrder
    whenActedUpon?: SortOrder
    actionTaken?: SortOrder
    actionDetails?: SortOrder
  }

  export type UserFlashcardActivityMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    flashcardId?: SortOrder
    whenActedUpon?: SortOrder
    actionTaken?: SortOrder
    actionDetails?: SortOrder
  }

  export type UserFlashcardActivityMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    flashcardId?: SortOrder
    whenActedUpon?: SortOrder
    actionTaken?: SortOrder
    actionDetails?: SortOrder
  }

  export type TagCountOrderByAggregateInput = {
    id?: SortOrder
    abbreviation?: SortOrder
    description?: SortOrder
  }

  export type TagMaxOrderByAggregateInput = {
    id?: SortOrder
    abbreviation?: SortOrder
    description?: SortOrder
  }

  export type TagMinOrderByAggregateInput = {
    id?: SortOrder
    abbreviation?: SortOrder
    description?: SortOrder
  }

  export type TagScalarRelationFilter = {
    is?: TagWhereInput
    isNot?: TagWhereInput
  }

  export type FlashcardTagFlashcardIdTagIdCompoundUniqueInput = {
    flashcardId: string
    tagId: string
  }

  export type FlashcardTagCountOrderByAggregateInput = {
    id?: SortOrder
    flashcardId?: SortOrder
    tagId?: SortOrder
  }

  export type FlashcardTagMaxOrderByAggregateInput = {
    id?: SortOrder
    flashcardId?: SortOrder
    tagId?: SortOrder
  }

  export type FlashcardTagMinOrderByAggregateInput = {
    id?: SortOrder
    flashcardId?: SortOrder
    tagId?: SortOrder
  }

  export type MobileImportCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    mobileImportText?: SortOrder
    whenImported?: SortOrder
  }

  export type MobileImportMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    mobileImportText?: SortOrder
    whenImported?: SortOrder
  }

  export type MobileImportMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    mobileImportText?: SortOrder
    whenImported?: SortOrder
  }

  export type FlashcardCreateNestedManyWithoutOwnerInput = {
    create?: XOR<FlashcardCreateWithoutOwnerInput, FlashcardUncheckedCreateWithoutOwnerInput> | FlashcardCreateWithoutOwnerInput[] | FlashcardUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: FlashcardCreateOrConnectWithoutOwnerInput | FlashcardCreateOrConnectWithoutOwnerInput[]
    createMany?: FlashcardCreateManyOwnerInputEnvelope
    connect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
  }

  export type UserFlashcardActivityCreateNestedManyWithoutUserInput = {
    create?: XOR<UserFlashcardActivityCreateWithoutUserInput, UserFlashcardActivityUncheckedCreateWithoutUserInput> | UserFlashcardActivityCreateWithoutUserInput[] | UserFlashcardActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserFlashcardActivityCreateOrConnectWithoutUserInput | UserFlashcardActivityCreateOrConnectWithoutUserInput[]
    createMany?: UserFlashcardActivityCreateManyUserInputEnvelope
    connect?: UserFlashcardActivityWhereUniqueInput | UserFlashcardActivityWhereUniqueInput[]
  }

  export type VersionItemCreateNestedManyWithoutStartedByUserInput = {
    create?: XOR<VersionItemCreateWithoutStartedByUserInput, VersionItemUncheckedCreateWithoutStartedByUserInput> | VersionItemCreateWithoutStartedByUserInput[] | VersionItemUncheckedCreateWithoutStartedByUserInput[]
    connectOrCreate?: VersionItemCreateOrConnectWithoutStartedByUserInput | VersionItemCreateOrConnectWithoutStartedByUserInput[]
    createMany?: VersionItemCreateManyStartedByUserInputEnvelope
    connect?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
  }

  export type MobileImportCreateNestedManyWithoutUserInput = {
    create?: XOR<MobileImportCreateWithoutUserInput, MobileImportUncheckedCreateWithoutUserInput> | MobileImportCreateWithoutUserInput[] | MobileImportUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MobileImportCreateOrConnectWithoutUserInput | MobileImportCreateOrConnectWithoutUserInput[]
    createMany?: MobileImportCreateManyUserInputEnvelope
    connect?: MobileImportWhereUniqueInput | MobileImportWhereUniqueInput[]
  }

  export type FlashcardUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<FlashcardCreateWithoutOwnerInput, FlashcardUncheckedCreateWithoutOwnerInput> | FlashcardCreateWithoutOwnerInput[] | FlashcardUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: FlashcardCreateOrConnectWithoutOwnerInput | FlashcardCreateOrConnectWithoutOwnerInput[]
    createMany?: FlashcardCreateManyOwnerInputEnvelope
    connect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
  }

  export type UserFlashcardActivityUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserFlashcardActivityCreateWithoutUserInput, UserFlashcardActivityUncheckedCreateWithoutUserInput> | UserFlashcardActivityCreateWithoutUserInput[] | UserFlashcardActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserFlashcardActivityCreateOrConnectWithoutUserInput | UserFlashcardActivityCreateOrConnectWithoutUserInput[]
    createMany?: UserFlashcardActivityCreateManyUserInputEnvelope
    connect?: UserFlashcardActivityWhereUniqueInput | UserFlashcardActivityWhereUniqueInput[]
  }

  export type VersionItemUncheckedCreateNestedManyWithoutStartedByUserInput = {
    create?: XOR<VersionItemCreateWithoutStartedByUserInput, VersionItemUncheckedCreateWithoutStartedByUserInput> | VersionItemCreateWithoutStartedByUserInput[] | VersionItemUncheckedCreateWithoutStartedByUserInput[]
    connectOrCreate?: VersionItemCreateOrConnectWithoutStartedByUserInput | VersionItemCreateOrConnectWithoutStartedByUserInput[]
    createMany?: VersionItemCreateManyStartedByUserInputEnvelope
    connect?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
  }

  export type MobileImportUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<MobileImportCreateWithoutUserInput, MobileImportUncheckedCreateWithoutUserInput> | MobileImportCreateWithoutUserInput[] | MobileImportUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MobileImportCreateOrConnectWithoutUserInput | MobileImportCreateOrConnectWithoutUserInput[]
    createMany?: MobileImportCreateManyUserInputEnvelope
    connect?: MobileImportWhereUniqueInput | MobileImportWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FlashcardUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<FlashcardCreateWithoutOwnerInput, FlashcardUncheckedCreateWithoutOwnerInput> | FlashcardCreateWithoutOwnerInput[] | FlashcardUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: FlashcardCreateOrConnectWithoutOwnerInput | FlashcardCreateOrConnectWithoutOwnerInput[]
    upsert?: FlashcardUpsertWithWhereUniqueWithoutOwnerInput | FlashcardUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: FlashcardCreateManyOwnerInputEnvelope
    set?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    disconnect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    delete?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    connect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    update?: FlashcardUpdateWithWhereUniqueWithoutOwnerInput | FlashcardUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: FlashcardUpdateManyWithWhereWithoutOwnerInput | FlashcardUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: FlashcardScalarWhereInput | FlashcardScalarWhereInput[]
  }

  export type UserFlashcardActivityUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserFlashcardActivityCreateWithoutUserInput, UserFlashcardActivityUncheckedCreateWithoutUserInput> | UserFlashcardActivityCreateWithoutUserInput[] | UserFlashcardActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserFlashcardActivityCreateOrConnectWithoutUserInput | UserFlashcardActivityCreateOrConnectWithoutUserInput[]
    upsert?: UserFlashcardActivityUpsertWithWhereUniqueWithoutUserInput | UserFlashcardActivityUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserFlashcardActivityCreateManyUserInputEnvelope
    set?: UserFlashcardActivityWhereUniqueInput | UserFlashcardActivityWhereUniqueInput[]
    disconnect?: UserFlashcardActivityWhereUniqueInput | UserFlashcardActivityWhereUniqueInput[]
    delete?: UserFlashcardActivityWhereUniqueInput | UserFlashcardActivityWhereUniqueInput[]
    connect?: UserFlashcardActivityWhereUniqueInput | UserFlashcardActivityWhereUniqueInput[]
    update?: UserFlashcardActivityUpdateWithWhereUniqueWithoutUserInput | UserFlashcardActivityUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserFlashcardActivityUpdateManyWithWhereWithoutUserInput | UserFlashcardActivityUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserFlashcardActivityScalarWhereInput | UserFlashcardActivityScalarWhereInput[]
  }

  export type VersionItemUpdateManyWithoutStartedByUserNestedInput = {
    create?: XOR<VersionItemCreateWithoutStartedByUserInput, VersionItemUncheckedCreateWithoutStartedByUserInput> | VersionItemCreateWithoutStartedByUserInput[] | VersionItemUncheckedCreateWithoutStartedByUserInput[]
    connectOrCreate?: VersionItemCreateOrConnectWithoutStartedByUserInput | VersionItemCreateOrConnectWithoutStartedByUserInput[]
    upsert?: VersionItemUpsertWithWhereUniqueWithoutStartedByUserInput | VersionItemUpsertWithWhereUniqueWithoutStartedByUserInput[]
    createMany?: VersionItemCreateManyStartedByUserInputEnvelope
    set?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    disconnect?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    delete?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    connect?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    update?: VersionItemUpdateWithWhereUniqueWithoutStartedByUserInput | VersionItemUpdateWithWhereUniqueWithoutStartedByUserInput[]
    updateMany?: VersionItemUpdateManyWithWhereWithoutStartedByUserInput | VersionItemUpdateManyWithWhereWithoutStartedByUserInput[]
    deleteMany?: VersionItemScalarWhereInput | VersionItemScalarWhereInput[]
  }

  export type MobileImportUpdateManyWithoutUserNestedInput = {
    create?: XOR<MobileImportCreateWithoutUserInput, MobileImportUncheckedCreateWithoutUserInput> | MobileImportCreateWithoutUserInput[] | MobileImportUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MobileImportCreateOrConnectWithoutUserInput | MobileImportCreateOrConnectWithoutUserInput[]
    upsert?: MobileImportUpsertWithWhereUniqueWithoutUserInput | MobileImportUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MobileImportCreateManyUserInputEnvelope
    set?: MobileImportWhereUniqueInput | MobileImportWhereUniqueInput[]
    disconnect?: MobileImportWhereUniqueInput | MobileImportWhereUniqueInput[]
    delete?: MobileImportWhereUniqueInput | MobileImportWhereUniqueInput[]
    connect?: MobileImportWhereUniqueInput | MobileImportWhereUniqueInput[]
    update?: MobileImportUpdateWithWhereUniqueWithoutUserInput | MobileImportUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MobileImportUpdateManyWithWhereWithoutUserInput | MobileImportUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MobileImportScalarWhereInput | MobileImportScalarWhereInput[]
  }

  export type FlashcardUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<FlashcardCreateWithoutOwnerInput, FlashcardUncheckedCreateWithoutOwnerInput> | FlashcardCreateWithoutOwnerInput[] | FlashcardUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: FlashcardCreateOrConnectWithoutOwnerInput | FlashcardCreateOrConnectWithoutOwnerInput[]
    upsert?: FlashcardUpsertWithWhereUniqueWithoutOwnerInput | FlashcardUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: FlashcardCreateManyOwnerInputEnvelope
    set?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    disconnect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    delete?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    connect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    update?: FlashcardUpdateWithWhereUniqueWithoutOwnerInput | FlashcardUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: FlashcardUpdateManyWithWhereWithoutOwnerInput | FlashcardUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: FlashcardScalarWhereInput | FlashcardScalarWhereInput[]
  }

  export type UserFlashcardActivityUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserFlashcardActivityCreateWithoutUserInput, UserFlashcardActivityUncheckedCreateWithoutUserInput> | UserFlashcardActivityCreateWithoutUserInput[] | UserFlashcardActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserFlashcardActivityCreateOrConnectWithoutUserInput | UserFlashcardActivityCreateOrConnectWithoutUserInput[]
    upsert?: UserFlashcardActivityUpsertWithWhereUniqueWithoutUserInput | UserFlashcardActivityUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserFlashcardActivityCreateManyUserInputEnvelope
    set?: UserFlashcardActivityWhereUniqueInput | UserFlashcardActivityWhereUniqueInput[]
    disconnect?: UserFlashcardActivityWhereUniqueInput | UserFlashcardActivityWhereUniqueInput[]
    delete?: UserFlashcardActivityWhereUniqueInput | UserFlashcardActivityWhereUniqueInput[]
    connect?: UserFlashcardActivityWhereUniqueInput | UserFlashcardActivityWhereUniqueInput[]
    update?: UserFlashcardActivityUpdateWithWhereUniqueWithoutUserInput | UserFlashcardActivityUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserFlashcardActivityUpdateManyWithWhereWithoutUserInput | UserFlashcardActivityUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserFlashcardActivityScalarWhereInput | UserFlashcardActivityScalarWhereInput[]
  }

  export type VersionItemUncheckedUpdateManyWithoutStartedByUserNestedInput = {
    create?: XOR<VersionItemCreateWithoutStartedByUserInput, VersionItemUncheckedCreateWithoutStartedByUserInput> | VersionItemCreateWithoutStartedByUserInput[] | VersionItemUncheckedCreateWithoutStartedByUserInput[]
    connectOrCreate?: VersionItemCreateOrConnectWithoutStartedByUserInput | VersionItemCreateOrConnectWithoutStartedByUserInput[]
    upsert?: VersionItemUpsertWithWhereUniqueWithoutStartedByUserInput | VersionItemUpsertWithWhereUniqueWithoutStartedByUserInput[]
    createMany?: VersionItemCreateManyStartedByUserInputEnvelope
    set?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    disconnect?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    delete?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    connect?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    update?: VersionItemUpdateWithWhereUniqueWithoutStartedByUserInput | VersionItemUpdateWithWhereUniqueWithoutStartedByUserInput[]
    updateMany?: VersionItemUpdateManyWithWhereWithoutStartedByUserInput | VersionItemUpdateManyWithWhereWithoutStartedByUserInput[]
    deleteMany?: VersionItemScalarWhereInput | VersionItemScalarWhereInput[]
  }

  export type MobileImportUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<MobileImportCreateWithoutUserInput, MobileImportUncheckedCreateWithoutUserInput> | MobileImportCreateWithoutUserInput[] | MobileImportUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MobileImportCreateOrConnectWithoutUserInput | MobileImportCreateOrConnectWithoutUserInput[]
    upsert?: MobileImportUpsertWithWhereUniqueWithoutUserInput | MobileImportUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MobileImportCreateManyUserInputEnvelope
    set?: MobileImportWhereUniqueInput | MobileImportWhereUniqueInput[]
    disconnect?: MobileImportWhereUniqueInput | MobileImportWhereUniqueInput[]
    delete?: MobileImportWhereUniqueInput | MobileImportWhereUniqueInput[]
    connect?: MobileImportWhereUniqueInput | MobileImportWhereUniqueInput[]
    update?: MobileImportUpdateWithWhereUniqueWithoutUserInput | MobileImportUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MobileImportUpdateManyWithWhereWithoutUserInput | MobileImportUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MobileImportScalarWhereInput | MobileImportScalarWhereInput[]
  }

  export type VersionItemCreateNestedManyWithoutVersionInput = {
    create?: XOR<VersionItemCreateWithoutVersionInput, VersionItemUncheckedCreateWithoutVersionInput> | VersionItemCreateWithoutVersionInput[] | VersionItemUncheckedCreateWithoutVersionInput[]
    connectOrCreate?: VersionItemCreateOrConnectWithoutVersionInput | VersionItemCreateOrConnectWithoutVersionInput[]
    createMany?: VersionItemCreateManyVersionInputEnvelope
    connect?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
  }

  export type VersionItemUncheckedCreateNestedManyWithoutVersionInput = {
    create?: XOR<VersionItemCreateWithoutVersionInput, VersionItemUncheckedCreateWithoutVersionInput> | VersionItemCreateWithoutVersionInput[] | VersionItemUncheckedCreateWithoutVersionInput[]
    connectOrCreate?: VersionItemCreateOrConnectWithoutVersionInput | VersionItemCreateOrConnectWithoutVersionInput[]
    createMany?: VersionItemCreateManyVersionInputEnvelope
    connect?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type VersionItemUpdateManyWithoutVersionNestedInput = {
    create?: XOR<VersionItemCreateWithoutVersionInput, VersionItemUncheckedCreateWithoutVersionInput> | VersionItemCreateWithoutVersionInput[] | VersionItemUncheckedCreateWithoutVersionInput[]
    connectOrCreate?: VersionItemCreateOrConnectWithoutVersionInput | VersionItemCreateOrConnectWithoutVersionInput[]
    upsert?: VersionItemUpsertWithWhereUniqueWithoutVersionInput | VersionItemUpsertWithWhereUniqueWithoutVersionInput[]
    createMany?: VersionItemCreateManyVersionInputEnvelope
    set?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    disconnect?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    delete?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    connect?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    update?: VersionItemUpdateWithWhereUniqueWithoutVersionInput | VersionItemUpdateWithWhereUniqueWithoutVersionInput[]
    updateMany?: VersionItemUpdateManyWithWhereWithoutVersionInput | VersionItemUpdateManyWithWhereWithoutVersionInput[]
    deleteMany?: VersionItemScalarWhereInput | VersionItemScalarWhereInput[]
  }

  export type VersionItemUncheckedUpdateManyWithoutVersionNestedInput = {
    create?: XOR<VersionItemCreateWithoutVersionInput, VersionItemUncheckedCreateWithoutVersionInput> | VersionItemCreateWithoutVersionInput[] | VersionItemUncheckedCreateWithoutVersionInput[]
    connectOrCreate?: VersionItemCreateOrConnectWithoutVersionInput | VersionItemCreateOrConnectWithoutVersionInput[]
    upsert?: VersionItemUpsertWithWhereUniqueWithoutVersionInput | VersionItemUpsertWithWhereUniqueWithoutVersionInput[]
    createMany?: VersionItemCreateManyVersionInputEnvelope
    set?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    disconnect?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    delete?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    connect?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    update?: VersionItemUpdateWithWhereUniqueWithoutVersionInput | VersionItemUpdateWithWhereUniqueWithoutVersionInput[]
    updateMany?: VersionItemUpdateManyWithWhereWithoutVersionInput | VersionItemUpdateManyWithWhereWithoutVersionInput[]
    deleteMany?: VersionItemScalarWhereInput | VersionItemScalarWhereInput[]
  }

  export type VersionCategoryAbbreviationCreateNestedManyWithoutVersionCategoryInput = {
    create?: XOR<VersionCategoryAbbreviationCreateWithoutVersionCategoryInput, VersionCategoryAbbreviationUncheckedCreateWithoutVersionCategoryInput> | VersionCategoryAbbreviationCreateWithoutVersionCategoryInput[] | VersionCategoryAbbreviationUncheckedCreateWithoutVersionCategoryInput[]
    connectOrCreate?: VersionCategoryAbbreviationCreateOrConnectWithoutVersionCategoryInput | VersionCategoryAbbreviationCreateOrConnectWithoutVersionCategoryInput[]
    createMany?: VersionCategoryAbbreviationCreateManyVersionCategoryInputEnvelope
    connect?: VersionCategoryAbbreviationWhereUniqueInput | VersionCategoryAbbreviationWhereUniqueInput[]
  }

  export type VersionItemCreateNestedManyWithoutVersionCategoryInput = {
    create?: XOR<VersionItemCreateWithoutVersionCategoryInput, VersionItemUncheckedCreateWithoutVersionCategoryInput> | VersionItemCreateWithoutVersionCategoryInput[] | VersionItemUncheckedCreateWithoutVersionCategoryInput[]
    connectOrCreate?: VersionItemCreateOrConnectWithoutVersionCategoryInput | VersionItemCreateOrConnectWithoutVersionCategoryInput[]
    createMany?: VersionItemCreateManyVersionCategoryInputEnvelope
    connect?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
  }

  export type VersionCategoryAbbreviationUncheckedCreateNestedManyWithoutVersionCategoryInput = {
    create?: XOR<VersionCategoryAbbreviationCreateWithoutVersionCategoryInput, VersionCategoryAbbreviationUncheckedCreateWithoutVersionCategoryInput> | VersionCategoryAbbreviationCreateWithoutVersionCategoryInput[] | VersionCategoryAbbreviationUncheckedCreateWithoutVersionCategoryInput[]
    connectOrCreate?: VersionCategoryAbbreviationCreateOrConnectWithoutVersionCategoryInput | VersionCategoryAbbreviationCreateOrConnectWithoutVersionCategoryInput[]
    createMany?: VersionCategoryAbbreviationCreateManyVersionCategoryInputEnvelope
    connect?: VersionCategoryAbbreviationWhereUniqueInput | VersionCategoryAbbreviationWhereUniqueInput[]
  }

  export type VersionItemUncheckedCreateNestedManyWithoutVersionCategoryInput = {
    create?: XOR<VersionItemCreateWithoutVersionCategoryInput, VersionItemUncheckedCreateWithoutVersionCategoryInput> | VersionItemCreateWithoutVersionCategoryInput[] | VersionItemUncheckedCreateWithoutVersionCategoryInput[]
    connectOrCreate?: VersionItemCreateOrConnectWithoutVersionCategoryInput | VersionItemCreateOrConnectWithoutVersionCategoryInput[]
    createMany?: VersionItemCreateManyVersionCategoryInputEnvelope
    connect?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type VersionCategoryAbbreviationUpdateManyWithoutVersionCategoryNestedInput = {
    create?: XOR<VersionCategoryAbbreviationCreateWithoutVersionCategoryInput, VersionCategoryAbbreviationUncheckedCreateWithoutVersionCategoryInput> | VersionCategoryAbbreviationCreateWithoutVersionCategoryInput[] | VersionCategoryAbbreviationUncheckedCreateWithoutVersionCategoryInput[]
    connectOrCreate?: VersionCategoryAbbreviationCreateOrConnectWithoutVersionCategoryInput | VersionCategoryAbbreviationCreateOrConnectWithoutVersionCategoryInput[]
    upsert?: VersionCategoryAbbreviationUpsertWithWhereUniqueWithoutVersionCategoryInput | VersionCategoryAbbreviationUpsertWithWhereUniqueWithoutVersionCategoryInput[]
    createMany?: VersionCategoryAbbreviationCreateManyVersionCategoryInputEnvelope
    set?: VersionCategoryAbbreviationWhereUniqueInput | VersionCategoryAbbreviationWhereUniqueInput[]
    disconnect?: VersionCategoryAbbreviationWhereUniqueInput | VersionCategoryAbbreviationWhereUniqueInput[]
    delete?: VersionCategoryAbbreviationWhereUniqueInput | VersionCategoryAbbreviationWhereUniqueInput[]
    connect?: VersionCategoryAbbreviationWhereUniqueInput | VersionCategoryAbbreviationWhereUniqueInput[]
    update?: VersionCategoryAbbreviationUpdateWithWhereUniqueWithoutVersionCategoryInput | VersionCategoryAbbreviationUpdateWithWhereUniqueWithoutVersionCategoryInput[]
    updateMany?: VersionCategoryAbbreviationUpdateManyWithWhereWithoutVersionCategoryInput | VersionCategoryAbbreviationUpdateManyWithWhereWithoutVersionCategoryInput[]
    deleteMany?: VersionCategoryAbbreviationScalarWhereInput | VersionCategoryAbbreviationScalarWhereInput[]
  }

  export type VersionItemUpdateManyWithoutVersionCategoryNestedInput = {
    create?: XOR<VersionItemCreateWithoutVersionCategoryInput, VersionItemUncheckedCreateWithoutVersionCategoryInput> | VersionItemCreateWithoutVersionCategoryInput[] | VersionItemUncheckedCreateWithoutVersionCategoryInput[]
    connectOrCreate?: VersionItemCreateOrConnectWithoutVersionCategoryInput | VersionItemCreateOrConnectWithoutVersionCategoryInput[]
    upsert?: VersionItemUpsertWithWhereUniqueWithoutVersionCategoryInput | VersionItemUpsertWithWhereUniqueWithoutVersionCategoryInput[]
    createMany?: VersionItemCreateManyVersionCategoryInputEnvelope
    set?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    disconnect?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    delete?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    connect?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    update?: VersionItemUpdateWithWhereUniqueWithoutVersionCategoryInput | VersionItemUpdateWithWhereUniqueWithoutVersionCategoryInput[]
    updateMany?: VersionItemUpdateManyWithWhereWithoutVersionCategoryInput | VersionItemUpdateManyWithWhereWithoutVersionCategoryInput[]
    deleteMany?: VersionItemScalarWhereInput | VersionItemScalarWhereInput[]
  }

  export type VersionCategoryAbbreviationUncheckedUpdateManyWithoutVersionCategoryNestedInput = {
    create?: XOR<VersionCategoryAbbreviationCreateWithoutVersionCategoryInput, VersionCategoryAbbreviationUncheckedCreateWithoutVersionCategoryInput> | VersionCategoryAbbreviationCreateWithoutVersionCategoryInput[] | VersionCategoryAbbreviationUncheckedCreateWithoutVersionCategoryInput[]
    connectOrCreate?: VersionCategoryAbbreviationCreateOrConnectWithoutVersionCategoryInput | VersionCategoryAbbreviationCreateOrConnectWithoutVersionCategoryInput[]
    upsert?: VersionCategoryAbbreviationUpsertWithWhereUniqueWithoutVersionCategoryInput | VersionCategoryAbbreviationUpsertWithWhereUniqueWithoutVersionCategoryInput[]
    createMany?: VersionCategoryAbbreviationCreateManyVersionCategoryInputEnvelope
    set?: VersionCategoryAbbreviationWhereUniqueInput | VersionCategoryAbbreviationWhereUniqueInput[]
    disconnect?: VersionCategoryAbbreviationWhereUniqueInput | VersionCategoryAbbreviationWhereUniqueInput[]
    delete?: VersionCategoryAbbreviationWhereUniqueInput | VersionCategoryAbbreviationWhereUniqueInput[]
    connect?: VersionCategoryAbbreviationWhereUniqueInput | VersionCategoryAbbreviationWhereUniqueInput[]
    update?: VersionCategoryAbbreviationUpdateWithWhereUniqueWithoutVersionCategoryInput | VersionCategoryAbbreviationUpdateWithWhereUniqueWithoutVersionCategoryInput[]
    updateMany?: VersionCategoryAbbreviationUpdateManyWithWhereWithoutVersionCategoryInput | VersionCategoryAbbreviationUpdateManyWithWhereWithoutVersionCategoryInput[]
    deleteMany?: VersionCategoryAbbreviationScalarWhereInput | VersionCategoryAbbreviationScalarWhereInput[]
  }

  export type VersionItemUncheckedUpdateManyWithoutVersionCategoryNestedInput = {
    create?: XOR<VersionItemCreateWithoutVersionCategoryInput, VersionItemUncheckedCreateWithoutVersionCategoryInput> | VersionItemCreateWithoutVersionCategoryInput[] | VersionItemUncheckedCreateWithoutVersionCategoryInput[]
    connectOrCreate?: VersionItemCreateOrConnectWithoutVersionCategoryInput | VersionItemCreateOrConnectWithoutVersionCategoryInput[]
    upsert?: VersionItemUpsertWithWhereUniqueWithoutVersionCategoryInput | VersionItemUpsertWithWhereUniqueWithoutVersionCategoryInput[]
    createMany?: VersionItemCreateManyVersionCategoryInputEnvelope
    set?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    disconnect?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    delete?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    connect?: VersionItemWhereUniqueInput | VersionItemWhereUniqueInput[]
    update?: VersionItemUpdateWithWhereUniqueWithoutVersionCategoryInput | VersionItemUpdateWithWhereUniqueWithoutVersionCategoryInput[]
    updateMany?: VersionItemUpdateManyWithWhereWithoutVersionCategoryInput | VersionItemUpdateManyWithWhereWithoutVersionCategoryInput[]
    deleteMany?: VersionItemScalarWhereInput | VersionItemScalarWhereInput[]
  }

  export type VersionCategoryCreateNestedOneWithoutAbbreviationsInput = {
    create?: XOR<VersionCategoryCreateWithoutAbbreviationsInput, VersionCategoryUncheckedCreateWithoutAbbreviationsInput>
    connectOrCreate?: VersionCategoryCreateOrConnectWithoutAbbreviationsInput
    connect?: VersionCategoryWhereUniqueInput
  }

  export type VersionCategoryUpdateOneRequiredWithoutAbbreviationsNestedInput = {
    create?: XOR<VersionCategoryCreateWithoutAbbreviationsInput, VersionCategoryUncheckedCreateWithoutAbbreviationsInput>
    connectOrCreate?: VersionCategoryCreateOrConnectWithoutAbbreviationsInput
    upsert?: VersionCategoryUpsertWithoutAbbreviationsInput
    connect?: VersionCategoryWhereUniqueInput
    update?: XOR<XOR<VersionCategoryUpdateToOneWithWhereWithoutAbbreviationsInput, VersionCategoryUpdateWithoutAbbreviationsInput>, VersionCategoryUncheckedUpdateWithoutAbbreviationsInput>
  }

  export type VersionCreateNestedOneWithoutVersionItemsInput = {
    create?: XOR<VersionCreateWithoutVersionItemsInput, VersionUncheckedCreateWithoutVersionItemsInput>
    connectOrCreate?: VersionCreateOrConnectWithoutVersionItemsInput
    connect?: VersionWhereUniqueInput
  }

  export type VersionCategoryCreateNestedOneWithoutVersionItemsInput = {
    create?: XOR<VersionCategoryCreateWithoutVersionItemsInput, VersionCategoryUncheckedCreateWithoutVersionItemsInput>
    connectOrCreate?: VersionCategoryCreateOrConnectWithoutVersionItemsInput
    connect?: VersionCategoryWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutVersionItemsInput = {
    create?: XOR<UserCreateWithoutVersionItemsInput, UserUncheckedCreateWithoutVersionItemsInput>
    connectOrCreate?: UserCreateOrConnectWithoutVersionItemsInput
    connect?: UserWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type VersionUpdateOneWithoutVersionItemsNestedInput = {
    create?: XOR<VersionCreateWithoutVersionItemsInput, VersionUncheckedCreateWithoutVersionItemsInput>
    connectOrCreate?: VersionCreateOrConnectWithoutVersionItemsInput
    upsert?: VersionUpsertWithoutVersionItemsInput
    disconnect?: VersionWhereInput | boolean
    delete?: VersionWhereInput | boolean
    connect?: VersionWhereUniqueInput
    update?: XOR<XOR<VersionUpdateToOneWithWhereWithoutVersionItemsInput, VersionUpdateWithoutVersionItemsInput>, VersionUncheckedUpdateWithoutVersionItemsInput>
  }

  export type VersionCategoryUpdateOneWithoutVersionItemsNestedInput = {
    create?: XOR<VersionCategoryCreateWithoutVersionItemsInput, VersionCategoryUncheckedCreateWithoutVersionItemsInput>
    connectOrCreate?: VersionCategoryCreateOrConnectWithoutVersionItemsInput
    upsert?: VersionCategoryUpsertWithoutVersionItemsInput
    disconnect?: VersionCategoryWhereInput | boolean
    delete?: VersionCategoryWhereInput | boolean
    connect?: VersionCategoryWhereUniqueInput
    update?: XOR<XOR<VersionCategoryUpdateToOneWithWhereWithoutVersionItemsInput, VersionCategoryUpdateWithoutVersionItemsInput>, VersionCategoryUncheckedUpdateWithoutVersionItemsInput>
  }

  export type UserUpdateOneWithoutVersionItemsNestedInput = {
    create?: XOR<UserCreateWithoutVersionItemsInput, UserUncheckedCreateWithoutVersionItemsInput>
    connectOrCreate?: UserCreateOrConnectWithoutVersionItemsInput
    upsert?: UserUpsertWithoutVersionItemsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutVersionItemsInput, UserUpdateWithoutVersionItemsInput>, UserUncheckedUpdateWithoutVersionItemsInput>
  }

  export type UserCreateNestedOneWithoutFlashcardsInput = {
    create?: XOR<UserCreateWithoutFlashcardsInput, UserUncheckedCreateWithoutFlashcardsInput>
    connectOrCreate?: UserCreateOrConnectWithoutFlashcardsInput
    connect?: UserWhereUniqueInput
  }

  export type FlashcardCreateNestedOneWithoutCopiesInput = {
    create?: XOR<FlashcardCreateWithoutCopiesInput, FlashcardUncheckedCreateWithoutCopiesInput>
    connectOrCreate?: FlashcardCreateOrConnectWithoutCopiesInput
    connect?: FlashcardWhereUniqueInput
  }

  export type FlashcardCreateNestedManyWithoutCopiedFromInput = {
    create?: XOR<FlashcardCreateWithoutCopiedFromInput, FlashcardUncheckedCreateWithoutCopiedFromInput> | FlashcardCreateWithoutCopiedFromInput[] | FlashcardUncheckedCreateWithoutCopiedFromInput[]
    connectOrCreate?: FlashcardCreateOrConnectWithoutCopiedFromInput | FlashcardCreateOrConnectWithoutCopiedFromInput[]
    createMany?: FlashcardCreateManyCopiedFromInputEnvelope
    connect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
  }

  export type UserFlashcardActivityCreateNestedManyWithoutFlashcardInput = {
    create?: XOR<UserFlashcardActivityCreateWithoutFlashcardInput, UserFlashcardActivityUncheckedCreateWithoutFlashcardInput> | UserFlashcardActivityCreateWithoutFlashcardInput[] | UserFlashcardActivityUncheckedCreateWithoutFlashcardInput[]
    connectOrCreate?: UserFlashcardActivityCreateOrConnectWithoutFlashcardInput | UserFlashcardActivityCreateOrConnectWithoutFlashcardInput[]
    createMany?: UserFlashcardActivityCreateManyFlashcardInputEnvelope
    connect?: UserFlashcardActivityWhereUniqueInput | UserFlashcardActivityWhereUniqueInput[]
  }

  export type FlashcardTagCreateNestedManyWithoutFlashcardInput = {
    create?: XOR<FlashcardTagCreateWithoutFlashcardInput, FlashcardTagUncheckedCreateWithoutFlashcardInput> | FlashcardTagCreateWithoutFlashcardInput[] | FlashcardTagUncheckedCreateWithoutFlashcardInput[]
    connectOrCreate?: FlashcardTagCreateOrConnectWithoutFlashcardInput | FlashcardTagCreateOrConnectWithoutFlashcardInput[]
    createMany?: FlashcardTagCreateManyFlashcardInputEnvelope
    connect?: FlashcardTagWhereUniqueInput | FlashcardTagWhereUniqueInput[]
  }

  export type FlashcardUncheckedCreateNestedManyWithoutCopiedFromInput = {
    create?: XOR<FlashcardCreateWithoutCopiedFromInput, FlashcardUncheckedCreateWithoutCopiedFromInput> | FlashcardCreateWithoutCopiedFromInput[] | FlashcardUncheckedCreateWithoutCopiedFromInput[]
    connectOrCreate?: FlashcardCreateOrConnectWithoutCopiedFromInput | FlashcardCreateOrConnectWithoutCopiedFromInput[]
    createMany?: FlashcardCreateManyCopiedFromInputEnvelope
    connect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
  }

  export type UserFlashcardActivityUncheckedCreateNestedManyWithoutFlashcardInput = {
    create?: XOR<UserFlashcardActivityCreateWithoutFlashcardInput, UserFlashcardActivityUncheckedCreateWithoutFlashcardInput> | UserFlashcardActivityCreateWithoutFlashcardInput[] | UserFlashcardActivityUncheckedCreateWithoutFlashcardInput[]
    connectOrCreate?: UserFlashcardActivityCreateOrConnectWithoutFlashcardInput | UserFlashcardActivityCreateOrConnectWithoutFlashcardInput[]
    createMany?: UserFlashcardActivityCreateManyFlashcardInputEnvelope
    connect?: UserFlashcardActivityWhereUniqueInput | UserFlashcardActivityWhereUniqueInput[]
  }

  export type FlashcardTagUncheckedCreateNestedManyWithoutFlashcardInput = {
    create?: XOR<FlashcardTagCreateWithoutFlashcardInput, FlashcardTagUncheckedCreateWithoutFlashcardInput> | FlashcardTagCreateWithoutFlashcardInput[] | FlashcardTagUncheckedCreateWithoutFlashcardInput[]
    connectOrCreate?: FlashcardTagCreateOrConnectWithoutFlashcardInput | FlashcardTagCreateOrConnectWithoutFlashcardInput[]
    createMany?: FlashcardTagCreateManyFlashcardInputEnvelope
    connect?: FlashcardTagWhereUniqueInput | FlashcardTagWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutFlashcardsNestedInput = {
    create?: XOR<UserCreateWithoutFlashcardsInput, UserUncheckedCreateWithoutFlashcardsInput>
    connectOrCreate?: UserCreateOrConnectWithoutFlashcardsInput
    upsert?: UserUpsertWithoutFlashcardsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFlashcardsInput, UserUpdateWithoutFlashcardsInput>, UserUncheckedUpdateWithoutFlashcardsInput>
  }

  export type FlashcardUpdateOneWithoutCopiesNestedInput = {
    create?: XOR<FlashcardCreateWithoutCopiesInput, FlashcardUncheckedCreateWithoutCopiesInput>
    connectOrCreate?: FlashcardCreateOrConnectWithoutCopiesInput
    upsert?: FlashcardUpsertWithoutCopiesInput
    disconnect?: FlashcardWhereInput | boolean
    delete?: FlashcardWhereInput | boolean
    connect?: FlashcardWhereUniqueInput
    update?: XOR<XOR<FlashcardUpdateToOneWithWhereWithoutCopiesInput, FlashcardUpdateWithoutCopiesInput>, FlashcardUncheckedUpdateWithoutCopiesInput>
  }

  export type FlashcardUpdateManyWithoutCopiedFromNestedInput = {
    create?: XOR<FlashcardCreateWithoutCopiedFromInput, FlashcardUncheckedCreateWithoutCopiedFromInput> | FlashcardCreateWithoutCopiedFromInput[] | FlashcardUncheckedCreateWithoutCopiedFromInput[]
    connectOrCreate?: FlashcardCreateOrConnectWithoutCopiedFromInput | FlashcardCreateOrConnectWithoutCopiedFromInput[]
    upsert?: FlashcardUpsertWithWhereUniqueWithoutCopiedFromInput | FlashcardUpsertWithWhereUniqueWithoutCopiedFromInput[]
    createMany?: FlashcardCreateManyCopiedFromInputEnvelope
    set?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    disconnect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    delete?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    connect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    update?: FlashcardUpdateWithWhereUniqueWithoutCopiedFromInput | FlashcardUpdateWithWhereUniqueWithoutCopiedFromInput[]
    updateMany?: FlashcardUpdateManyWithWhereWithoutCopiedFromInput | FlashcardUpdateManyWithWhereWithoutCopiedFromInput[]
    deleteMany?: FlashcardScalarWhereInput | FlashcardScalarWhereInput[]
  }

  export type UserFlashcardActivityUpdateManyWithoutFlashcardNestedInput = {
    create?: XOR<UserFlashcardActivityCreateWithoutFlashcardInput, UserFlashcardActivityUncheckedCreateWithoutFlashcardInput> | UserFlashcardActivityCreateWithoutFlashcardInput[] | UserFlashcardActivityUncheckedCreateWithoutFlashcardInput[]
    connectOrCreate?: UserFlashcardActivityCreateOrConnectWithoutFlashcardInput | UserFlashcardActivityCreateOrConnectWithoutFlashcardInput[]
    upsert?: UserFlashcardActivityUpsertWithWhereUniqueWithoutFlashcardInput | UserFlashcardActivityUpsertWithWhereUniqueWithoutFlashcardInput[]
    createMany?: UserFlashcardActivityCreateManyFlashcardInputEnvelope
    set?: UserFlashcardActivityWhereUniqueInput | UserFlashcardActivityWhereUniqueInput[]
    disconnect?: UserFlashcardActivityWhereUniqueInput | UserFlashcardActivityWhereUniqueInput[]
    delete?: UserFlashcardActivityWhereUniqueInput | UserFlashcardActivityWhereUniqueInput[]
    connect?: UserFlashcardActivityWhereUniqueInput | UserFlashcardActivityWhereUniqueInput[]
    update?: UserFlashcardActivityUpdateWithWhereUniqueWithoutFlashcardInput | UserFlashcardActivityUpdateWithWhereUniqueWithoutFlashcardInput[]
    updateMany?: UserFlashcardActivityUpdateManyWithWhereWithoutFlashcardInput | UserFlashcardActivityUpdateManyWithWhereWithoutFlashcardInput[]
    deleteMany?: UserFlashcardActivityScalarWhereInput | UserFlashcardActivityScalarWhereInput[]
  }

  export type FlashcardTagUpdateManyWithoutFlashcardNestedInput = {
    create?: XOR<FlashcardTagCreateWithoutFlashcardInput, FlashcardTagUncheckedCreateWithoutFlashcardInput> | FlashcardTagCreateWithoutFlashcardInput[] | FlashcardTagUncheckedCreateWithoutFlashcardInput[]
    connectOrCreate?: FlashcardTagCreateOrConnectWithoutFlashcardInput | FlashcardTagCreateOrConnectWithoutFlashcardInput[]
    upsert?: FlashcardTagUpsertWithWhereUniqueWithoutFlashcardInput | FlashcardTagUpsertWithWhereUniqueWithoutFlashcardInput[]
    createMany?: FlashcardTagCreateManyFlashcardInputEnvelope
    set?: FlashcardTagWhereUniqueInput | FlashcardTagWhereUniqueInput[]
    disconnect?: FlashcardTagWhereUniqueInput | FlashcardTagWhereUniqueInput[]
    delete?: FlashcardTagWhereUniqueInput | FlashcardTagWhereUniqueInput[]
    connect?: FlashcardTagWhereUniqueInput | FlashcardTagWhereUniqueInput[]
    update?: FlashcardTagUpdateWithWhereUniqueWithoutFlashcardInput | FlashcardTagUpdateWithWhereUniqueWithoutFlashcardInput[]
    updateMany?: FlashcardTagUpdateManyWithWhereWithoutFlashcardInput | FlashcardTagUpdateManyWithWhereWithoutFlashcardInput[]
    deleteMany?: FlashcardTagScalarWhereInput | FlashcardTagScalarWhereInput[]
  }

  export type FlashcardUncheckedUpdateManyWithoutCopiedFromNestedInput = {
    create?: XOR<FlashcardCreateWithoutCopiedFromInput, FlashcardUncheckedCreateWithoutCopiedFromInput> | FlashcardCreateWithoutCopiedFromInput[] | FlashcardUncheckedCreateWithoutCopiedFromInput[]
    connectOrCreate?: FlashcardCreateOrConnectWithoutCopiedFromInput | FlashcardCreateOrConnectWithoutCopiedFromInput[]
    upsert?: FlashcardUpsertWithWhereUniqueWithoutCopiedFromInput | FlashcardUpsertWithWhereUniqueWithoutCopiedFromInput[]
    createMany?: FlashcardCreateManyCopiedFromInputEnvelope
    set?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    disconnect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    delete?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    connect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    update?: FlashcardUpdateWithWhereUniqueWithoutCopiedFromInput | FlashcardUpdateWithWhereUniqueWithoutCopiedFromInput[]
    updateMany?: FlashcardUpdateManyWithWhereWithoutCopiedFromInput | FlashcardUpdateManyWithWhereWithoutCopiedFromInput[]
    deleteMany?: FlashcardScalarWhereInput | FlashcardScalarWhereInput[]
  }

  export type UserFlashcardActivityUncheckedUpdateManyWithoutFlashcardNestedInput = {
    create?: XOR<UserFlashcardActivityCreateWithoutFlashcardInput, UserFlashcardActivityUncheckedCreateWithoutFlashcardInput> | UserFlashcardActivityCreateWithoutFlashcardInput[] | UserFlashcardActivityUncheckedCreateWithoutFlashcardInput[]
    connectOrCreate?: UserFlashcardActivityCreateOrConnectWithoutFlashcardInput | UserFlashcardActivityCreateOrConnectWithoutFlashcardInput[]
    upsert?: UserFlashcardActivityUpsertWithWhereUniqueWithoutFlashcardInput | UserFlashcardActivityUpsertWithWhereUniqueWithoutFlashcardInput[]
    createMany?: UserFlashcardActivityCreateManyFlashcardInputEnvelope
    set?: UserFlashcardActivityWhereUniqueInput | UserFlashcardActivityWhereUniqueInput[]
    disconnect?: UserFlashcardActivityWhereUniqueInput | UserFlashcardActivityWhereUniqueInput[]
    delete?: UserFlashcardActivityWhereUniqueInput | UserFlashcardActivityWhereUniqueInput[]
    connect?: UserFlashcardActivityWhereUniqueInput | UserFlashcardActivityWhereUniqueInput[]
    update?: UserFlashcardActivityUpdateWithWhereUniqueWithoutFlashcardInput | UserFlashcardActivityUpdateWithWhereUniqueWithoutFlashcardInput[]
    updateMany?: UserFlashcardActivityUpdateManyWithWhereWithoutFlashcardInput | UserFlashcardActivityUpdateManyWithWhereWithoutFlashcardInput[]
    deleteMany?: UserFlashcardActivityScalarWhereInput | UserFlashcardActivityScalarWhereInput[]
  }

  export type FlashcardTagUncheckedUpdateManyWithoutFlashcardNestedInput = {
    create?: XOR<FlashcardTagCreateWithoutFlashcardInput, FlashcardTagUncheckedCreateWithoutFlashcardInput> | FlashcardTagCreateWithoutFlashcardInput[] | FlashcardTagUncheckedCreateWithoutFlashcardInput[]
    connectOrCreate?: FlashcardTagCreateOrConnectWithoutFlashcardInput | FlashcardTagCreateOrConnectWithoutFlashcardInput[]
    upsert?: FlashcardTagUpsertWithWhereUniqueWithoutFlashcardInput | FlashcardTagUpsertWithWhereUniqueWithoutFlashcardInput[]
    createMany?: FlashcardTagCreateManyFlashcardInputEnvelope
    set?: FlashcardTagWhereUniqueInput | FlashcardTagWhereUniqueInput[]
    disconnect?: FlashcardTagWhereUniqueInput | FlashcardTagWhereUniqueInput[]
    delete?: FlashcardTagWhereUniqueInput | FlashcardTagWhereUniqueInput[]
    connect?: FlashcardTagWhereUniqueInput | FlashcardTagWhereUniqueInput[]
    update?: FlashcardTagUpdateWithWhereUniqueWithoutFlashcardInput | FlashcardTagUpdateWithWhereUniqueWithoutFlashcardInput[]
    updateMany?: FlashcardTagUpdateManyWithWhereWithoutFlashcardInput | FlashcardTagUpdateManyWithWhereWithoutFlashcardInput[]
    deleteMany?: FlashcardTagScalarWhereInput | FlashcardTagScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutActivitiesInput = {
    create?: XOR<UserCreateWithoutActivitiesInput, UserUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: UserCreateOrConnectWithoutActivitiesInput
    connect?: UserWhereUniqueInput
  }

  export type FlashcardCreateNestedOneWithoutActivitiesInput = {
    create?: XOR<FlashcardCreateWithoutActivitiesInput, FlashcardUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: FlashcardCreateOrConnectWithoutActivitiesInput
    connect?: FlashcardWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutActivitiesNestedInput = {
    create?: XOR<UserCreateWithoutActivitiesInput, UserUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: UserCreateOrConnectWithoutActivitiesInput
    upsert?: UserUpsertWithoutActivitiesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutActivitiesInput, UserUpdateWithoutActivitiesInput>, UserUncheckedUpdateWithoutActivitiesInput>
  }

  export type FlashcardUpdateOneRequiredWithoutActivitiesNestedInput = {
    create?: XOR<FlashcardCreateWithoutActivitiesInput, FlashcardUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: FlashcardCreateOrConnectWithoutActivitiesInput
    upsert?: FlashcardUpsertWithoutActivitiesInput
    connect?: FlashcardWhereUniqueInput
    update?: XOR<XOR<FlashcardUpdateToOneWithWhereWithoutActivitiesInput, FlashcardUpdateWithoutActivitiesInput>, FlashcardUncheckedUpdateWithoutActivitiesInput>
  }

  export type FlashcardTagCreateNestedManyWithoutTagInput = {
    create?: XOR<FlashcardTagCreateWithoutTagInput, FlashcardTagUncheckedCreateWithoutTagInput> | FlashcardTagCreateWithoutTagInput[] | FlashcardTagUncheckedCreateWithoutTagInput[]
    connectOrCreate?: FlashcardTagCreateOrConnectWithoutTagInput | FlashcardTagCreateOrConnectWithoutTagInput[]
    createMany?: FlashcardTagCreateManyTagInputEnvelope
    connect?: FlashcardTagWhereUniqueInput | FlashcardTagWhereUniqueInput[]
  }

  export type FlashcardTagUncheckedCreateNestedManyWithoutTagInput = {
    create?: XOR<FlashcardTagCreateWithoutTagInput, FlashcardTagUncheckedCreateWithoutTagInput> | FlashcardTagCreateWithoutTagInput[] | FlashcardTagUncheckedCreateWithoutTagInput[]
    connectOrCreate?: FlashcardTagCreateOrConnectWithoutTagInput | FlashcardTagCreateOrConnectWithoutTagInput[]
    createMany?: FlashcardTagCreateManyTagInputEnvelope
    connect?: FlashcardTagWhereUniqueInput | FlashcardTagWhereUniqueInput[]
  }

  export type FlashcardTagUpdateManyWithoutTagNestedInput = {
    create?: XOR<FlashcardTagCreateWithoutTagInput, FlashcardTagUncheckedCreateWithoutTagInput> | FlashcardTagCreateWithoutTagInput[] | FlashcardTagUncheckedCreateWithoutTagInput[]
    connectOrCreate?: FlashcardTagCreateOrConnectWithoutTagInput | FlashcardTagCreateOrConnectWithoutTagInput[]
    upsert?: FlashcardTagUpsertWithWhereUniqueWithoutTagInput | FlashcardTagUpsertWithWhereUniqueWithoutTagInput[]
    createMany?: FlashcardTagCreateManyTagInputEnvelope
    set?: FlashcardTagWhereUniqueInput | FlashcardTagWhereUniqueInput[]
    disconnect?: FlashcardTagWhereUniqueInput | FlashcardTagWhereUniqueInput[]
    delete?: FlashcardTagWhereUniqueInput | FlashcardTagWhereUniqueInput[]
    connect?: FlashcardTagWhereUniqueInput | FlashcardTagWhereUniqueInput[]
    update?: FlashcardTagUpdateWithWhereUniqueWithoutTagInput | FlashcardTagUpdateWithWhereUniqueWithoutTagInput[]
    updateMany?: FlashcardTagUpdateManyWithWhereWithoutTagInput | FlashcardTagUpdateManyWithWhereWithoutTagInput[]
    deleteMany?: FlashcardTagScalarWhereInput | FlashcardTagScalarWhereInput[]
  }

  export type FlashcardTagUncheckedUpdateManyWithoutTagNestedInput = {
    create?: XOR<FlashcardTagCreateWithoutTagInput, FlashcardTagUncheckedCreateWithoutTagInput> | FlashcardTagCreateWithoutTagInput[] | FlashcardTagUncheckedCreateWithoutTagInput[]
    connectOrCreate?: FlashcardTagCreateOrConnectWithoutTagInput | FlashcardTagCreateOrConnectWithoutTagInput[]
    upsert?: FlashcardTagUpsertWithWhereUniqueWithoutTagInput | FlashcardTagUpsertWithWhereUniqueWithoutTagInput[]
    createMany?: FlashcardTagCreateManyTagInputEnvelope
    set?: FlashcardTagWhereUniqueInput | FlashcardTagWhereUniqueInput[]
    disconnect?: FlashcardTagWhereUniqueInput | FlashcardTagWhereUniqueInput[]
    delete?: FlashcardTagWhereUniqueInput | FlashcardTagWhereUniqueInput[]
    connect?: FlashcardTagWhereUniqueInput | FlashcardTagWhereUniqueInput[]
    update?: FlashcardTagUpdateWithWhereUniqueWithoutTagInput | FlashcardTagUpdateWithWhereUniqueWithoutTagInput[]
    updateMany?: FlashcardTagUpdateManyWithWhereWithoutTagInput | FlashcardTagUpdateManyWithWhereWithoutTagInput[]
    deleteMany?: FlashcardTagScalarWhereInput | FlashcardTagScalarWhereInput[]
  }

  export type FlashcardCreateNestedOneWithoutTagsInput = {
    create?: XOR<FlashcardCreateWithoutTagsInput, FlashcardUncheckedCreateWithoutTagsInput>
    connectOrCreate?: FlashcardCreateOrConnectWithoutTagsInput
    connect?: FlashcardWhereUniqueInput
  }

  export type TagCreateNestedOneWithoutFlashcardsInput = {
    create?: XOR<TagCreateWithoutFlashcardsInput, TagUncheckedCreateWithoutFlashcardsInput>
    connectOrCreate?: TagCreateOrConnectWithoutFlashcardsInput
    connect?: TagWhereUniqueInput
  }

  export type FlashcardUpdateOneRequiredWithoutTagsNestedInput = {
    create?: XOR<FlashcardCreateWithoutTagsInput, FlashcardUncheckedCreateWithoutTagsInput>
    connectOrCreate?: FlashcardCreateOrConnectWithoutTagsInput
    upsert?: FlashcardUpsertWithoutTagsInput
    connect?: FlashcardWhereUniqueInput
    update?: XOR<XOR<FlashcardUpdateToOneWithWhereWithoutTagsInput, FlashcardUpdateWithoutTagsInput>, FlashcardUncheckedUpdateWithoutTagsInput>
  }

  export type TagUpdateOneRequiredWithoutFlashcardsNestedInput = {
    create?: XOR<TagCreateWithoutFlashcardsInput, TagUncheckedCreateWithoutFlashcardsInput>
    connectOrCreate?: TagCreateOrConnectWithoutFlashcardsInput
    upsert?: TagUpsertWithoutFlashcardsInput
    connect?: TagWhereUniqueInput
    update?: XOR<XOR<TagUpdateToOneWithWhereWithoutFlashcardsInput, TagUpdateWithoutFlashcardsInput>, TagUncheckedUpdateWithoutFlashcardsInput>
  }

  export type UserCreateNestedOneWithoutMobileImportsInput = {
    create?: XOR<UserCreateWithoutMobileImportsInput, UserUncheckedCreateWithoutMobileImportsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMobileImportsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutMobileImportsNestedInput = {
    create?: XOR<UserCreateWithoutMobileImportsInput, UserUncheckedCreateWithoutMobileImportsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMobileImportsInput
    upsert?: UserUpsertWithoutMobileImportsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMobileImportsInput, UserUpdateWithoutMobileImportsInput>, UserUncheckedUpdateWithoutMobileImportsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type FlashcardCreateWithoutOwnerInput = {
    id?: string
    front: string
    back: string
    frontLanguage: string
    backLanguage: string
    pronunciation?: string | null
    createdAt?: Date | string
    status?: string
    rank?: number
    memoryHook?: string | null
    nextTestTime?: Date | string | null
    copiedFrom?: FlashcardCreateNestedOneWithoutCopiesInput
    copies?: FlashcardCreateNestedManyWithoutCopiedFromInput
    activities?: UserFlashcardActivityCreateNestedManyWithoutFlashcardInput
    tags?: FlashcardTagCreateNestedManyWithoutFlashcardInput
  }

  export type FlashcardUncheckedCreateWithoutOwnerInput = {
    id?: string
    front: string
    back: string
    frontLanguage: string
    backLanguage: string
    pronunciation?: string | null
    createdAt?: Date | string
    status?: string
    rank?: number
    memoryHook?: string | null
    nextTestTime?: Date | string | null
    copiedFromId?: string | null
    copies?: FlashcardUncheckedCreateNestedManyWithoutCopiedFromInput
    activities?: UserFlashcardActivityUncheckedCreateNestedManyWithoutFlashcardInput
    tags?: FlashcardTagUncheckedCreateNestedManyWithoutFlashcardInput
  }

  export type FlashcardCreateOrConnectWithoutOwnerInput = {
    where: FlashcardWhereUniqueInput
    create: XOR<FlashcardCreateWithoutOwnerInput, FlashcardUncheckedCreateWithoutOwnerInput>
  }

  export type FlashcardCreateManyOwnerInputEnvelope = {
    data: FlashcardCreateManyOwnerInput | FlashcardCreateManyOwnerInput[]
  }

  export type UserFlashcardActivityCreateWithoutUserInput = {
    id?: string
    whenActedUpon?: Date | string
    actionTaken: string
    actionDetails?: string | null
    flashcard: FlashcardCreateNestedOneWithoutActivitiesInput
  }

  export type UserFlashcardActivityUncheckedCreateWithoutUserInput = {
    id?: string
    flashcardId: string
    whenActedUpon?: Date | string
    actionTaken: string
    actionDetails?: string | null
  }

  export type UserFlashcardActivityCreateOrConnectWithoutUserInput = {
    where: UserFlashcardActivityWhereUniqueInput
    create: XOR<UserFlashcardActivityCreateWithoutUserInput, UserFlashcardActivityUncheckedCreateWithoutUserInput>
  }

  export type UserFlashcardActivityCreateManyUserInputEnvelope = {
    data: UserFlashcardActivityCreateManyUserInput | UserFlashcardActivityCreateManyUserInput[]
  }

  export type VersionItemCreateWithoutStartedByUserInput = {
    id?: string
    type?: string
    body: string
    rank?: number
    orderWithinVersion?: number
    isTested?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: VersionCreateNestedOneWithoutVersionItemsInput
    versionCategory?: VersionCategoryCreateNestedOneWithoutVersionItemsInput
  }

  export type VersionItemUncheckedCreateWithoutStartedByUserInput = {
    id?: string
    versionId?: string | null
    versionCategoryId?: string | null
    type?: string
    body: string
    rank?: number
    orderWithinVersion?: number
    isTested?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VersionItemCreateOrConnectWithoutStartedByUserInput = {
    where: VersionItemWhereUniqueInput
    create: XOR<VersionItemCreateWithoutStartedByUserInput, VersionItemUncheckedCreateWithoutStartedByUserInput>
  }

  export type VersionItemCreateManyStartedByUserInputEnvelope = {
    data: VersionItemCreateManyStartedByUserInput | VersionItemCreateManyStartedByUserInput[]
  }

  export type MobileImportCreateWithoutUserInput = {
    id?: string
    mobileImportText: string
    whenImported?: Date | string
  }

  export type MobileImportUncheckedCreateWithoutUserInput = {
    id?: string
    mobileImportText: string
    whenImported?: Date | string
  }

  export type MobileImportCreateOrConnectWithoutUserInput = {
    where: MobileImportWhereUniqueInput
    create: XOR<MobileImportCreateWithoutUserInput, MobileImportUncheckedCreateWithoutUserInput>
  }

  export type MobileImportCreateManyUserInputEnvelope = {
    data: MobileImportCreateManyUserInput | MobileImportCreateManyUserInput[]
  }

  export type FlashcardUpsertWithWhereUniqueWithoutOwnerInput = {
    where: FlashcardWhereUniqueInput
    update: XOR<FlashcardUpdateWithoutOwnerInput, FlashcardUncheckedUpdateWithoutOwnerInput>
    create: XOR<FlashcardCreateWithoutOwnerInput, FlashcardUncheckedCreateWithoutOwnerInput>
  }

  export type FlashcardUpdateWithWhereUniqueWithoutOwnerInput = {
    where: FlashcardWhereUniqueInput
    data: XOR<FlashcardUpdateWithoutOwnerInput, FlashcardUncheckedUpdateWithoutOwnerInput>
  }

  export type FlashcardUpdateManyWithWhereWithoutOwnerInput = {
    where: FlashcardScalarWhereInput
    data: XOR<FlashcardUpdateManyMutationInput, FlashcardUncheckedUpdateManyWithoutOwnerInput>
  }

  export type FlashcardScalarWhereInput = {
    AND?: FlashcardScalarWhereInput | FlashcardScalarWhereInput[]
    OR?: FlashcardScalarWhereInput[]
    NOT?: FlashcardScalarWhereInput | FlashcardScalarWhereInput[]
    id?: StringFilter<"Flashcard"> | string
    ownerId?: StringFilter<"Flashcard"> | string
    front?: StringFilter<"Flashcard"> | string
    back?: StringFilter<"Flashcard"> | string
    frontLanguage?: StringFilter<"Flashcard"> | string
    backLanguage?: StringFilter<"Flashcard"> | string
    pronunciation?: StringNullableFilter<"Flashcard"> | string | null
    createdAt?: DateTimeFilter<"Flashcard"> | Date | string
    status?: StringFilter<"Flashcard"> | string
    rank?: FloatFilter<"Flashcard"> | number
    memoryHook?: StringNullableFilter<"Flashcard"> | string | null
    nextTestTime?: DateTimeNullableFilter<"Flashcard"> | Date | string | null
    copiedFromId?: StringNullableFilter<"Flashcard"> | string | null
  }

  export type UserFlashcardActivityUpsertWithWhereUniqueWithoutUserInput = {
    where: UserFlashcardActivityWhereUniqueInput
    update: XOR<UserFlashcardActivityUpdateWithoutUserInput, UserFlashcardActivityUncheckedUpdateWithoutUserInput>
    create: XOR<UserFlashcardActivityCreateWithoutUserInput, UserFlashcardActivityUncheckedCreateWithoutUserInput>
  }

  export type UserFlashcardActivityUpdateWithWhereUniqueWithoutUserInput = {
    where: UserFlashcardActivityWhereUniqueInput
    data: XOR<UserFlashcardActivityUpdateWithoutUserInput, UserFlashcardActivityUncheckedUpdateWithoutUserInput>
  }

  export type UserFlashcardActivityUpdateManyWithWhereWithoutUserInput = {
    where: UserFlashcardActivityScalarWhereInput
    data: XOR<UserFlashcardActivityUpdateManyMutationInput, UserFlashcardActivityUncheckedUpdateManyWithoutUserInput>
  }

  export type UserFlashcardActivityScalarWhereInput = {
    AND?: UserFlashcardActivityScalarWhereInput | UserFlashcardActivityScalarWhereInput[]
    OR?: UserFlashcardActivityScalarWhereInput[]
    NOT?: UserFlashcardActivityScalarWhereInput | UserFlashcardActivityScalarWhereInput[]
    id?: StringFilter<"UserFlashcardActivity"> | string
    userId?: StringFilter<"UserFlashcardActivity"> | string
    flashcardId?: StringFilter<"UserFlashcardActivity"> | string
    whenActedUpon?: DateTimeFilter<"UserFlashcardActivity"> | Date | string
    actionTaken?: StringFilter<"UserFlashcardActivity"> | string
    actionDetails?: StringNullableFilter<"UserFlashcardActivity"> | string | null
  }

  export type VersionItemUpsertWithWhereUniqueWithoutStartedByUserInput = {
    where: VersionItemWhereUniqueInput
    update: XOR<VersionItemUpdateWithoutStartedByUserInput, VersionItemUncheckedUpdateWithoutStartedByUserInput>
    create: XOR<VersionItemCreateWithoutStartedByUserInput, VersionItemUncheckedCreateWithoutStartedByUserInput>
  }

  export type VersionItemUpdateWithWhereUniqueWithoutStartedByUserInput = {
    where: VersionItemWhereUniqueInput
    data: XOR<VersionItemUpdateWithoutStartedByUserInput, VersionItemUncheckedUpdateWithoutStartedByUserInput>
  }

  export type VersionItemUpdateManyWithWhereWithoutStartedByUserInput = {
    where: VersionItemScalarWhereInput
    data: XOR<VersionItemUpdateManyMutationInput, VersionItemUncheckedUpdateManyWithoutStartedByUserInput>
  }

  export type VersionItemScalarWhereInput = {
    AND?: VersionItemScalarWhereInput | VersionItemScalarWhereInput[]
    OR?: VersionItemScalarWhereInput[]
    NOT?: VersionItemScalarWhereInput | VersionItemScalarWhereInput[]
    id?: StringFilter<"VersionItem"> | string
    versionId?: StringNullableFilter<"VersionItem"> | string | null
    versionCategoryId?: StringNullableFilter<"VersionItem"> | string | null
    type?: StringFilter<"VersionItem"> | string
    body?: StringFilter<"VersionItem"> | string
    rank?: FloatFilter<"VersionItem"> | number
    startedByUserId?: StringNullableFilter<"VersionItem"> | string | null
    orderWithinVersion?: IntFilter<"VersionItem"> | number
    isTested?: BoolFilter<"VersionItem"> | boolean
    createdAt?: DateTimeFilter<"VersionItem"> | Date | string
    updatedAt?: DateTimeFilter<"VersionItem"> | Date | string
  }

  export type MobileImportUpsertWithWhereUniqueWithoutUserInput = {
    where: MobileImportWhereUniqueInput
    update: XOR<MobileImportUpdateWithoutUserInput, MobileImportUncheckedUpdateWithoutUserInput>
    create: XOR<MobileImportCreateWithoutUserInput, MobileImportUncheckedCreateWithoutUserInput>
  }

  export type MobileImportUpdateWithWhereUniqueWithoutUserInput = {
    where: MobileImportWhereUniqueInput
    data: XOR<MobileImportUpdateWithoutUserInput, MobileImportUncheckedUpdateWithoutUserInput>
  }

  export type MobileImportUpdateManyWithWhereWithoutUserInput = {
    where: MobileImportScalarWhereInput
    data: XOR<MobileImportUpdateManyMutationInput, MobileImportUncheckedUpdateManyWithoutUserInput>
  }

  export type MobileImportScalarWhereInput = {
    AND?: MobileImportScalarWhereInput | MobileImportScalarWhereInput[]
    OR?: MobileImportScalarWhereInput[]
    NOT?: MobileImportScalarWhereInput | MobileImportScalarWhereInput[]
    id?: StringFilter<"MobileImport"> | string
    userId?: StringFilter<"MobileImport"> | string
    mobileImportText?: StringFilter<"MobileImport"> | string
    whenImported?: DateTimeFilter<"MobileImport"> | Date | string
  }

  export type VersionItemCreateWithoutVersionInput = {
    id?: string
    type?: string
    body: string
    rank?: number
    orderWithinVersion?: number
    isTested?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    versionCategory?: VersionCategoryCreateNestedOneWithoutVersionItemsInput
    startedByUser?: UserCreateNestedOneWithoutVersionItemsInput
  }

  export type VersionItemUncheckedCreateWithoutVersionInput = {
    id?: string
    versionCategoryId?: string | null
    type?: string
    body: string
    rank?: number
    startedByUserId?: string | null
    orderWithinVersion?: number
    isTested?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VersionItemCreateOrConnectWithoutVersionInput = {
    where: VersionItemWhereUniqueInput
    create: XOR<VersionItemCreateWithoutVersionInput, VersionItemUncheckedCreateWithoutVersionInput>
  }

  export type VersionItemCreateManyVersionInputEnvelope = {
    data: VersionItemCreateManyVersionInput | VersionItemCreateManyVersionInput[]
  }

  export type VersionItemUpsertWithWhereUniqueWithoutVersionInput = {
    where: VersionItemWhereUniqueInput
    update: XOR<VersionItemUpdateWithoutVersionInput, VersionItemUncheckedUpdateWithoutVersionInput>
    create: XOR<VersionItemCreateWithoutVersionInput, VersionItemUncheckedCreateWithoutVersionInput>
  }

  export type VersionItemUpdateWithWhereUniqueWithoutVersionInput = {
    where: VersionItemWhereUniqueInput
    data: XOR<VersionItemUpdateWithoutVersionInput, VersionItemUncheckedUpdateWithoutVersionInput>
  }

  export type VersionItemUpdateManyWithWhereWithoutVersionInput = {
    where: VersionItemScalarWhereInput
    data: XOR<VersionItemUpdateManyMutationInput, VersionItemUncheckedUpdateManyWithoutVersionInput>
  }

  export type VersionCategoryAbbreviationCreateWithoutVersionCategoryInput = {
    id?: string
    abbreviationText: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VersionCategoryAbbreviationUncheckedCreateWithoutVersionCategoryInput = {
    id?: string
    abbreviationText: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VersionCategoryAbbreviationCreateOrConnectWithoutVersionCategoryInput = {
    where: VersionCategoryAbbreviationWhereUniqueInput
    create: XOR<VersionCategoryAbbreviationCreateWithoutVersionCategoryInput, VersionCategoryAbbreviationUncheckedCreateWithoutVersionCategoryInput>
  }

  export type VersionCategoryAbbreviationCreateManyVersionCategoryInputEnvelope = {
    data: VersionCategoryAbbreviationCreateManyVersionCategoryInput | VersionCategoryAbbreviationCreateManyVersionCategoryInput[]
  }

  export type VersionItemCreateWithoutVersionCategoryInput = {
    id?: string
    type?: string
    body: string
    rank?: number
    orderWithinVersion?: number
    isTested?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: VersionCreateNestedOneWithoutVersionItemsInput
    startedByUser?: UserCreateNestedOneWithoutVersionItemsInput
  }

  export type VersionItemUncheckedCreateWithoutVersionCategoryInput = {
    id?: string
    versionId?: string | null
    type?: string
    body: string
    rank?: number
    startedByUserId?: string | null
    orderWithinVersion?: number
    isTested?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VersionItemCreateOrConnectWithoutVersionCategoryInput = {
    where: VersionItemWhereUniqueInput
    create: XOR<VersionItemCreateWithoutVersionCategoryInput, VersionItemUncheckedCreateWithoutVersionCategoryInput>
  }

  export type VersionItemCreateManyVersionCategoryInputEnvelope = {
    data: VersionItemCreateManyVersionCategoryInput | VersionItemCreateManyVersionCategoryInput[]
  }

  export type VersionCategoryAbbreviationUpsertWithWhereUniqueWithoutVersionCategoryInput = {
    where: VersionCategoryAbbreviationWhereUniqueInput
    update: XOR<VersionCategoryAbbreviationUpdateWithoutVersionCategoryInput, VersionCategoryAbbreviationUncheckedUpdateWithoutVersionCategoryInput>
    create: XOR<VersionCategoryAbbreviationCreateWithoutVersionCategoryInput, VersionCategoryAbbreviationUncheckedCreateWithoutVersionCategoryInput>
  }

  export type VersionCategoryAbbreviationUpdateWithWhereUniqueWithoutVersionCategoryInput = {
    where: VersionCategoryAbbreviationWhereUniqueInput
    data: XOR<VersionCategoryAbbreviationUpdateWithoutVersionCategoryInput, VersionCategoryAbbreviationUncheckedUpdateWithoutVersionCategoryInput>
  }

  export type VersionCategoryAbbreviationUpdateManyWithWhereWithoutVersionCategoryInput = {
    where: VersionCategoryAbbreviationScalarWhereInput
    data: XOR<VersionCategoryAbbreviationUpdateManyMutationInput, VersionCategoryAbbreviationUncheckedUpdateManyWithoutVersionCategoryInput>
  }

  export type VersionCategoryAbbreviationScalarWhereInput = {
    AND?: VersionCategoryAbbreviationScalarWhereInput | VersionCategoryAbbreviationScalarWhereInput[]
    OR?: VersionCategoryAbbreviationScalarWhereInput[]
    NOT?: VersionCategoryAbbreviationScalarWhereInput | VersionCategoryAbbreviationScalarWhereInput[]
    id?: StringFilter<"VersionCategoryAbbreviation"> | string
    versionCategoryId?: StringFilter<"VersionCategoryAbbreviation"> | string
    abbreviationText?: StringFilter<"VersionCategoryAbbreviation"> | string
    createdAt?: DateTimeFilter<"VersionCategoryAbbreviation"> | Date | string
    updatedAt?: DateTimeFilter<"VersionCategoryAbbreviation"> | Date | string
  }

  export type VersionItemUpsertWithWhereUniqueWithoutVersionCategoryInput = {
    where: VersionItemWhereUniqueInput
    update: XOR<VersionItemUpdateWithoutVersionCategoryInput, VersionItemUncheckedUpdateWithoutVersionCategoryInput>
    create: XOR<VersionItemCreateWithoutVersionCategoryInput, VersionItemUncheckedCreateWithoutVersionCategoryInput>
  }

  export type VersionItemUpdateWithWhereUniqueWithoutVersionCategoryInput = {
    where: VersionItemWhereUniqueInput
    data: XOR<VersionItemUpdateWithoutVersionCategoryInput, VersionItemUncheckedUpdateWithoutVersionCategoryInput>
  }

  export type VersionItemUpdateManyWithWhereWithoutVersionCategoryInput = {
    where: VersionItemScalarWhereInput
    data: XOR<VersionItemUpdateManyMutationInput, VersionItemUncheckedUpdateManyWithoutVersionCategoryInput>
  }

  export type VersionCategoryCreateWithoutAbbreviationsInput = {
    id?: string
    title: string
    rank?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    versionItems?: VersionItemCreateNestedManyWithoutVersionCategoryInput
  }

  export type VersionCategoryUncheckedCreateWithoutAbbreviationsInput = {
    id?: string
    title: string
    rank?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    versionItems?: VersionItemUncheckedCreateNestedManyWithoutVersionCategoryInput
  }

  export type VersionCategoryCreateOrConnectWithoutAbbreviationsInput = {
    where: VersionCategoryWhereUniqueInput
    create: XOR<VersionCategoryCreateWithoutAbbreviationsInput, VersionCategoryUncheckedCreateWithoutAbbreviationsInput>
  }

  export type VersionCategoryUpsertWithoutAbbreviationsInput = {
    update: XOR<VersionCategoryUpdateWithoutAbbreviationsInput, VersionCategoryUncheckedUpdateWithoutAbbreviationsInput>
    create: XOR<VersionCategoryCreateWithoutAbbreviationsInput, VersionCategoryUncheckedCreateWithoutAbbreviationsInput>
    where?: VersionCategoryWhereInput
  }

  export type VersionCategoryUpdateToOneWithWhereWithoutAbbreviationsInput = {
    where?: VersionCategoryWhereInput
    data: XOR<VersionCategoryUpdateWithoutAbbreviationsInput, VersionCategoryUncheckedUpdateWithoutAbbreviationsInput>
  }

  export type VersionCategoryUpdateWithoutAbbreviationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versionItems?: VersionItemUpdateManyWithoutVersionCategoryNestedInput
  }

  export type VersionCategoryUncheckedUpdateWithoutAbbreviationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versionItems?: VersionItemUncheckedUpdateManyWithoutVersionCategoryNestedInput
  }

  export type VersionCreateWithoutVersionItemsInput = {
    id?: string
    versionNumber: string
    title?: string | null
    status?: string
    publishDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VersionUncheckedCreateWithoutVersionItemsInput = {
    id?: string
    versionNumber: string
    title?: string | null
    status?: string
    publishDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VersionCreateOrConnectWithoutVersionItemsInput = {
    where: VersionWhereUniqueInput
    create: XOR<VersionCreateWithoutVersionItemsInput, VersionUncheckedCreateWithoutVersionItemsInput>
  }

  export type VersionCategoryCreateWithoutVersionItemsInput = {
    id?: string
    title: string
    rank?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    abbreviations?: VersionCategoryAbbreviationCreateNestedManyWithoutVersionCategoryInput
  }

  export type VersionCategoryUncheckedCreateWithoutVersionItemsInput = {
    id?: string
    title: string
    rank?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    abbreviations?: VersionCategoryAbbreviationUncheckedCreateNestedManyWithoutVersionCategoryInput
  }

  export type VersionCategoryCreateOrConnectWithoutVersionItemsInput = {
    where: VersionCategoryWhereUniqueInput
    create: XOR<VersionCategoryCreateWithoutVersionItemsInput, VersionCategoryUncheckedCreateWithoutVersionItemsInput>
  }

  export type UserCreateWithoutVersionItemsInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    role?: string
    minutesToTestAgain?: number
    dailyTakeGoal?: number
    flashcards?: FlashcardCreateNestedManyWithoutOwnerInput
    activities?: UserFlashcardActivityCreateNestedManyWithoutUserInput
    mobileImports?: MobileImportCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutVersionItemsInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    role?: string
    minutesToTestAgain?: number
    dailyTakeGoal?: number
    flashcards?: FlashcardUncheckedCreateNestedManyWithoutOwnerInput
    activities?: UserFlashcardActivityUncheckedCreateNestedManyWithoutUserInput
    mobileImports?: MobileImportUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutVersionItemsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutVersionItemsInput, UserUncheckedCreateWithoutVersionItemsInput>
  }

  export type VersionUpsertWithoutVersionItemsInput = {
    update: XOR<VersionUpdateWithoutVersionItemsInput, VersionUncheckedUpdateWithoutVersionItemsInput>
    create: XOR<VersionCreateWithoutVersionItemsInput, VersionUncheckedCreateWithoutVersionItemsInput>
    where?: VersionWhereInput
  }

  export type VersionUpdateToOneWithWhereWithoutVersionItemsInput = {
    where?: VersionWhereInput
    data: XOR<VersionUpdateWithoutVersionItemsInput, VersionUncheckedUpdateWithoutVersionItemsInput>
  }

  export type VersionUpdateWithoutVersionItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionNumber?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    publishDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VersionUncheckedUpdateWithoutVersionItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionNumber?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    publishDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VersionCategoryUpsertWithoutVersionItemsInput = {
    update: XOR<VersionCategoryUpdateWithoutVersionItemsInput, VersionCategoryUncheckedUpdateWithoutVersionItemsInput>
    create: XOR<VersionCategoryCreateWithoutVersionItemsInput, VersionCategoryUncheckedCreateWithoutVersionItemsInput>
    where?: VersionCategoryWhereInput
  }

  export type VersionCategoryUpdateToOneWithWhereWithoutVersionItemsInput = {
    where?: VersionCategoryWhereInput
    data: XOR<VersionCategoryUpdateWithoutVersionItemsInput, VersionCategoryUncheckedUpdateWithoutVersionItemsInput>
  }

  export type VersionCategoryUpdateWithoutVersionItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    abbreviations?: VersionCategoryAbbreviationUpdateManyWithoutVersionCategoryNestedInput
  }

  export type VersionCategoryUncheckedUpdateWithoutVersionItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    abbreviations?: VersionCategoryAbbreviationUncheckedUpdateManyWithoutVersionCategoryNestedInput
  }

  export type UserUpsertWithoutVersionItemsInput = {
    update: XOR<UserUpdateWithoutVersionItemsInput, UserUncheckedUpdateWithoutVersionItemsInput>
    create: XOR<UserCreateWithoutVersionItemsInput, UserUncheckedCreateWithoutVersionItemsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutVersionItemsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutVersionItemsInput, UserUncheckedUpdateWithoutVersionItemsInput>
  }

  export type UserUpdateWithoutVersionItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    minutesToTestAgain?: IntFieldUpdateOperationsInput | number
    dailyTakeGoal?: IntFieldUpdateOperationsInput | number
    flashcards?: FlashcardUpdateManyWithoutOwnerNestedInput
    activities?: UserFlashcardActivityUpdateManyWithoutUserNestedInput
    mobileImports?: MobileImportUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutVersionItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    minutesToTestAgain?: IntFieldUpdateOperationsInput | number
    dailyTakeGoal?: IntFieldUpdateOperationsInput | number
    flashcards?: FlashcardUncheckedUpdateManyWithoutOwnerNestedInput
    activities?: UserFlashcardActivityUncheckedUpdateManyWithoutUserNestedInput
    mobileImports?: MobileImportUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutFlashcardsInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    role?: string
    minutesToTestAgain?: number
    dailyTakeGoal?: number
    activities?: UserFlashcardActivityCreateNestedManyWithoutUserInput
    versionItems?: VersionItemCreateNestedManyWithoutStartedByUserInput
    mobileImports?: MobileImportCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFlashcardsInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    role?: string
    minutesToTestAgain?: number
    dailyTakeGoal?: number
    activities?: UserFlashcardActivityUncheckedCreateNestedManyWithoutUserInput
    versionItems?: VersionItemUncheckedCreateNestedManyWithoutStartedByUserInput
    mobileImports?: MobileImportUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFlashcardsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFlashcardsInput, UserUncheckedCreateWithoutFlashcardsInput>
  }

  export type FlashcardCreateWithoutCopiesInput = {
    id?: string
    front: string
    back: string
    frontLanguage: string
    backLanguage: string
    pronunciation?: string | null
    createdAt?: Date | string
    status?: string
    rank?: number
    memoryHook?: string | null
    nextTestTime?: Date | string | null
    owner: UserCreateNestedOneWithoutFlashcardsInput
    copiedFrom?: FlashcardCreateNestedOneWithoutCopiesInput
    activities?: UserFlashcardActivityCreateNestedManyWithoutFlashcardInput
    tags?: FlashcardTagCreateNestedManyWithoutFlashcardInput
  }

  export type FlashcardUncheckedCreateWithoutCopiesInput = {
    id?: string
    ownerId: string
    front: string
    back: string
    frontLanguage: string
    backLanguage: string
    pronunciation?: string | null
    createdAt?: Date | string
    status?: string
    rank?: number
    memoryHook?: string | null
    nextTestTime?: Date | string | null
    copiedFromId?: string | null
    activities?: UserFlashcardActivityUncheckedCreateNestedManyWithoutFlashcardInput
    tags?: FlashcardTagUncheckedCreateNestedManyWithoutFlashcardInput
  }

  export type FlashcardCreateOrConnectWithoutCopiesInput = {
    where: FlashcardWhereUniqueInput
    create: XOR<FlashcardCreateWithoutCopiesInput, FlashcardUncheckedCreateWithoutCopiesInput>
  }

  export type FlashcardCreateWithoutCopiedFromInput = {
    id?: string
    front: string
    back: string
    frontLanguage: string
    backLanguage: string
    pronunciation?: string | null
    createdAt?: Date | string
    status?: string
    rank?: number
    memoryHook?: string | null
    nextTestTime?: Date | string | null
    owner: UserCreateNestedOneWithoutFlashcardsInput
    copies?: FlashcardCreateNestedManyWithoutCopiedFromInput
    activities?: UserFlashcardActivityCreateNestedManyWithoutFlashcardInput
    tags?: FlashcardTagCreateNestedManyWithoutFlashcardInput
  }

  export type FlashcardUncheckedCreateWithoutCopiedFromInput = {
    id?: string
    ownerId: string
    front: string
    back: string
    frontLanguage: string
    backLanguage: string
    pronunciation?: string | null
    createdAt?: Date | string
    status?: string
    rank?: number
    memoryHook?: string | null
    nextTestTime?: Date | string | null
    copies?: FlashcardUncheckedCreateNestedManyWithoutCopiedFromInput
    activities?: UserFlashcardActivityUncheckedCreateNestedManyWithoutFlashcardInput
    tags?: FlashcardTagUncheckedCreateNestedManyWithoutFlashcardInput
  }

  export type FlashcardCreateOrConnectWithoutCopiedFromInput = {
    where: FlashcardWhereUniqueInput
    create: XOR<FlashcardCreateWithoutCopiedFromInput, FlashcardUncheckedCreateWithoutCopiedFromInput>
  }

  export type FlashcardCreateManyCopiedFromInputEnvelope = {
    data: FlashcardCreateManyCopiedFromInput | FlashcardCreateManyCopiedFromInput[]
  }

  export type UserFlashcardActivityCreateWithoutFlashcardInput = {
    id?: string
    whenActedUpon?: Date | string
    actionTaken: string
    actionDetails?: string | null
    user: UserCreateNestedOneWithoutActivitiesInput
  }

  export type UserFlashcardActivityUncheckedCreateWithoutFlashcardInput = {
    id?: string
    userId: string
    whenActedUpon?: Date | string
    actionTaken: string
    actionDetails?: string | null
  }

  export type UserFlashcardActivityCreateOrConnectWithoutFlashcardInput = {
    where: UserFlashcardActivityWhereUniqueInput
    create: XOR<UserFlashcardActivityCreateWithoutFlashcardInput, UserFlashcardActivityUncheckedCreateWithoutFlashcardInput>
  }

  export type UserFlashcardActivityCreateManyFlashcardInputEnvelope = {
    data: UserFlashcardActivityCreateManyFlashcardInput | UserFlashcardActivityCreateManyFlashcardInput[]
  }

  export type FlashcardTagCreateWithoutFlashcardInput = {
    id?: string
    tag: TagCreateNestedOneWithoutFlashcardsInput
  }

  export type FlashcardTagUncheckedCreateWithoutFlashcardInput = {
    id?: string
    tagId: string
  }

  export type FlashcardTagCreateOrConnectWithoutFlashcardInput = {
    where: FlashcardTagWhereUniqueInput
    create: XOR<FlashcardTagCreateWithoutFlashcardInput, FlashcardTagUncheckedCreateWithoutFlashcardInput>
  }

  export type FlashcardTagCreateManyFlashcardInputEnvelope = {
    data: FlashcardTagCreateManyFlashcardInput | FlashcardTagCreateManyFlashcardInput[]
  }

  export type UserUpsertWithoutFlashcardsInput = {
    update: XOR<UserUpdateWithoutFlashcardsInput, UserUncheckedUpdateWithoutFlashcardsInput>
    create: XOR<UserCreateWithoutFlashcardsInput, UserUncheckedCreateWithoutFlashcardsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFlashcardsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFlashcardsInput, UserUncheckedUpdateWithoutFlashcardsInput>
  }

  export type UserUpdateWithoutFlashcardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    minutesToTestAgain?: IntFieldUpdateOperationsInput | number
    dailyTakeGoal?: IntFieldUpdateOperationsInput | number
    activities?: UserFlashcardActivityUpdateManyWithoutUserNestedInput
    versionItems?: VersionItemUpdateManyWithoutStartedByUserNestedInput
    mobileImports?: MobileImportUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFlashcardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    minutesToTestAgain?: IntFieldUpdateOperationsInput | number
    dailyTakeGoal?: IntFieldUpdateOperationsInput | number
    activities?: UserFlashcardActivityUncheckedUpdateManyWithoutUserNestedInput
    versionItems?: VersionItemUncheckedUpdateManyWithoutStartedByUserNestedInput
    mobileImports?: MobileImportUncheckedUpdateManyWithoutUserNestedInput
  }

  export type FlashcardUpsertWithoutCopiesInput = {
    update: XOR<FlashcardUpdateWithoutCopiesInput, FlashcardUncheckedUpdateWithoutCopiesInput>
    create: XOR<FlashcardCreateWithoutCopiesInput, FlashcardUncheckedCreateWithoutCopiesInput>
    where?: FlashcardWhereInput
  }

  export type FlashcardUpdateToOneWithWhereWithoutCopiesInput = {
    where?: FlashcardWhereInput
    data: XOR<FlashcardUpdateWithoutCopiesInput, FlashcardUncheckedUpdateWithoutCopiesInput>
  }

  export type FlashcardUpdateWithoutCopiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    frontLanguage?: StringFieldUpdateOperationsInput | string
    backLanguage?: StringFieldUpdateOperationsInput | string
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    memoryHook?: NullableStringFieldUpdateOperationsInput | string | null
    nextTestTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    owner?: UserUpdateOneRequiredWithoutFlashcardsNestedInput
    copiedFrom?: FlashcardUpdateOneWithoutCopiesNestedInput
    activities?: UserFlashcardActivityUpdateManyWithoutFlashcardNestedInput
    tags?: FlashcardTagUpdateManyWithoutFlashcardNestedInput
  }

  export type FlashcardUncheckedUpdateWithoutCopiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    frontLanguage?: StringFieldUpdateOperationsInput | string
    backLanguage?: StringFieldUpdateOperationsInput | string
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    memoryHook?: NullableStringFieldUpdateOperationsInput | string | null
    nextTestTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    copiedFromId?: NullableStringFieldUpdateOperationsInput | string | null
    activities?: UserFlashcardActivityUncheckedUpdateManyWithoutFlashcardNestedInput
    tags?: FlashcardTagUncheckedUpdateManyWithoutFlashcardNestedInput
  }

  export type FlashcardUpsertWithWhereUniqueWithoutCopiedFromInput = {
    where: FlashcardWhereUniqueInput
    update: XOR<FlashcardUpdateWithoutCopiedFromInput, FlashcardUncheckedUpdateWithoutCopiedFromInput>
    create: XOR<FlashcardCreateWithoutCopiedFromInput, FlashcardUncheckedCreateWithoutCopiedFromInput>
  }

  export type FlashcardUpdateWithWhereUniqueWithoutCopiedFromInput = {
    where: FlashcardWhereUniqueInput
    data: XOR<FlashcardUpdateWithoutCopiedFromInput, FlashcardUncheckedUpdateWithoutCopiedFromInput>
  }

  export type FlashcardUpdateManyWithWhereWithoutCopiedFromInput = {
    where: FlashcardScalarWhereInput
    data: XOR<FlashcardUpdateManyMutationInput, FlashcardUncheckedUpdateManyWithoutCopiedFromInput>
  }

  export type UserFlashcardActivityUpsertWithWhereUniqueWithoutFlashcardInput = {
    where: UserFlashcardActivityWhereUniqueInput
    update: XOR<UserFlashcardActivityUpdateWithoutFlashcardInput, UserFlashcardActivityUncheckedUpdateWithoutFlashcardInput>
    create: XOR<UserFlashcardActivityCreateWithoutFlashcardInput, UserFlashcardActivityUncheckedCreateWithoutFlashcardInput>
  }

  export type UserFlashcardActivityUpdateWithWhereUniqueWithoutFlashcardInput = {
    where: UserFlashcardActivityWhereUniqueInput
    data: XOR<UserFlashcardActivityUpdateWithoutFlashcardInput, UserFlashcardActivityUncheckedUpdateWithoutFlashcardInput>
  }

  export type UserFlashcardActivityUpdateManyWithWhereWithoutFlashcardInput = {
    where: UserFlashcardActivityScalarWhereInput
    data: XOR<UserFlashcardActivityUpdateManyMutationInput, UserFlashcardActivityUncheckedUpdateManyWithoutFlashcardInput>
  }

  export type FlashcardTagUpsertWithWhereUniqueWithoutFlashcardInput = {
    where: FlashcardTagWhereUniqueInput
    update: XOR<FlashcardTagUpdateWithoutFlashcardInput, FlashcardTagUncheckedUpdateWithoutFlashcardInput>
    create: XOR<FlashcardTagCreateWithoutFlashcardInput, FlashcardTagUncheckedCreateWithoutFlashcardInput>
  }

  export type FlashcardTagUpdateWithWhereUniqueWithoutFlashcardInput = {
    where: FlashcardTagWhereUniqueInput
    data: XOR<FlashcardTagUpdateWithoutFlashcardInput, FlashcardTagUncheckedUpdateWithoutFlashcardInput>
  }

  export type FlashcardTagUpdateManyWithWhereWithoutFlashcardInput = {
    where: FlashcardTagScalarWhereInput
    data: XOR<FlashcardTagUpdateManyMutationInput, FlashcardTagUncheckedUpdateManyWithoutFlashcardInput>
  }

  export type FlashcardTagScalarWhereInput = {
    AND?: FlashcardTagScalarWhereInput | FlashcardTagScalarWhereInput[]
    OR?: FlashcardTagScalarWhereInput[]
    NOT?: FlashcardTagScalarWhereInput | FlashcardTagScalarWhereInput[]
    id?: StringFilter<"FlashcardTag"> | string
    flashcardId?: StringFilter<"FlashcardTag"> | string
    tagId?: StringFilter<"FlashcardTag"> | string
  }

  export type UserCreateWithoutActivitiesInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    role?: string
    minutesToTestAgain?: number
    dailyTakeGoal?: number
    flashcards?: FlashcardCreateNestedManyWithoutOwnerInput
    versionItems?: VersionItemCreateNestedManyWithoutStartedByUserInput
    mobileImports?: MobileImportCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutActivitiesInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    role?: string
    minutesToTestAgain?: number
    dailyTakeGoal?: number
    flashcards?: FlashcardUncheckedCreateNestedManyWithoutOwnerInput
    versionItems?: VersionItemUncheckedCreateNestedManyWithoutStartedByUserInput
    mobileImports?: MobileImportUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutActivitiesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutActivitiesInput, UserUncheckedCreateWithoutActivitiesInput>
  }

  export type FlashcardCreateWithoutActivitiesInput = {
    id?: string
    front: string
    back: string
    frontLanguage: string
    backLanguage: string
    pronunciation?: string | null
    createdAt?: Date | string
    status?: string
    rank?: number
    memoryHook?: string | null
    nextTestTime?: Date | string | null
    owner: UserCreateNestedOneWithoutFlashcardsInput
    copiedFrom?: FlashcardCreateNestedOneWithoutCopiesInput
    copies?: FlashcardCreateNestedManyWithoutCopiedFromInput
    tags?: FlashcardTagCreateNestedManyWithoutFlashcardInput
  }

  export type FlashcardUncheckedCreateWithoutActivitiesInput = {
    id?: string
    ownerId: string
    front: string
    back: string
    frontLanguage: string
    backLanguage: string
    pronunciation?: string | null
    createdAt?: Date | string
    status?: string
    rank?: number
    memoryHook?: string | null
    nextTestTime?: Date | string | null
    copiedFromId?: string | null
    copies?: FlashcardUncheckedCreateNestedManyWithoutCopiedFromInput
    tags?: FlashcardTagUncheckedCreateNestedManyWithoutFlashcardInput
  }

  export type FlashcardCreateOrConnectWithoutActivitiesInput = {
    where: FlashcardWhereUniqueInput
    create: XOR<FlashcardCreateWithoutActivitiesInput, FlashcardUncheckedCreateWithoutActivitiesInput>
  }

  export type UserUpsertWithoutActivitiesInput = {
    update: XOR<UserUpdateWithoutActivitiesInput, UserUncheckedUpdateWithoutActivitiesInput>
    create: XOR<UserCreateWithoutActivitiesInput, UserUncheckedCreateWithoutActivitiesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutActivitiesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutActivitiesInput, UserUncheckedUpdateWithoutActivitiesInput>
  }

  export type UserUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    minutesToTestAgain?: IntFieldUpdateOperationsInput | number
    dailyTakeGoal?: IntFieldUpdateOperationsInput | number
    flashcards?: FlashcardUpdateManyWithoutOwnerNestedInput
    versionItems?: VersionItemUpdateManyWithoutStartedByUserNestedInput
    mobileImports?: MobileImportUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    minutesToTestAgain?: IntFieldUpdateOperationsInput | number
    dailyTakeGoal?: IntFieldUpdateOperationsInput | number
    flashcards?: FlashcardUncheckedUpdateManyWithoutOwnerNestedInput
    versionItems?: VersionItemUncheckedUpdateManyWithoutStartedByUserNestedInput
    mobileImports?: MobileImportUncheckedUpdateManyWithoutUserNestedInput
  }

  export type FlashcardUpsertWithoutActivitiesInput = {
    update: XOR<FlashcardUpdateWithoutActivitiesInput, FlashcardUncheckedUpdateWithoutActivitiesInput>
    create: XOR<FlashcardCreateWithoutActivitiesInput, FlashcardUncheckedCreateWithoutActivitiesInput>
    where?: FlashcardWhereInput
  }

  export type FlashcardUpdateToOneWithWhereWithoutActivitiesInput = {
    where?: FlashcardWhereInput
    data: XOR<FlashcardUpdateWithoutActivitiesInput, FlashcardUncheckedUpdateWithoutActivitiesInput>
  }

  export type FlashcardUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    frontLanguage?: StringFieldUpdateOperationsInput | string
    backLanguage?: StringFieldUpdateOperationsInput | string
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    memoryHook?: NullableStringFieldUpdateOperationsInput | string | null
    nextTestTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    owner?: UserUpdateOneRequiredWithoutFlashcardsNestedInput
    copiedFrom?: FlashcardUpdateOneWithoutCopiesNestedInput
    copies?: FlashcardUpdateManyWithoutCopiedFromNestedInput
    tags?: FlashcardTagUpdateManyWithoutFlashcardNestedInput
  }

  export type FlashcardUncheckedUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    frontLanguage?: StringFieldUpdateOperationsInput | string
    backLanguage?: StringFieldUpdateOperationsInput | string
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    memoryHook?: NullableStringFieldUpdateOperationsInput | string | null
    nextTestTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    copiedFromId?: NullableStringFieldUpdateOperationsInput | string | null
    copies?: FlashcardUncheckedUpdateManyWithoutCopiedFromNestedInput
    tags?: FlashcardTagUncheckedUpdateManyWithoutFlashcardNestedInput
  }

  export type FlashcardTagCreateWithoutTagInput = {
    id?: string
    flashcard: FlashcardCreateNestedOneWithoutTagsInput
  }

  export type FlashcardTagUncheckedCreateWithoutTagInput = {
    id?: string
    flashcardId: string
  }

  export type FlashcardTagCreateOrConnectWithoutTagInput = {
    where: FlashcardTagWhereUniqueInput
    create: XOR<FlashcardTagCreateWithoutTagInput, FlashcardTagUncheckedCreateWithoutTagInput>
  }

  export type FlashcardTagCreateManyTagInputEnvelope = {
    data: FlashcardTagCreateManyTagInput | FlashcardTagCreateManyTagInput[]
  }

  export type FlashcardTagUpsertWithWhereUniqueWithoutTagInput = {
    where: FlashcardTagWhereUniqueInput
    update: XOR<FlashcardTagUpdateWithoutTagInput, FlashcardTagUncheckedUpdateWithoutTagInput>
    create: XOR<FlashcardTagCreateWithoutTagInput, FlashcardTagUncheckedCreateWithoutTagInput>
  }

  export type FlashcardTagUpdateWithWhereUniqueWithoutTagInput = {
    where: FlashcardTagWhereUniqueInput
    data: XOR<FlashcardTagUpdateWithoutTagInput, FlashcardTagUncheckedUpdateWithoutTagInput>
  }

  export type FlashcardTagUpdateManyWithWhereWithoutTagInput = {
    where: FlashcardTagScalarWhereInput
    data: XOR<FlashcardTagUpdateManyMutationInput, FlashcardTagUncheckedUpdateManyWithoutTagInput>
  }

  export type FlashcardCreateWithoutTagsInput = {
    id?: string
    front: string
    back: string
    frontLanguage: string
    backLanguage: string
    pronunciation?: string | null
    createdAt?: Date | string
    status?: string
    rank?: number
    memoryHook?: string | null
    nextTestTime?: Date | string | null
    owner: UserCreateNestedOneWithoutFlashcardsInput
    copiedFrom?: FlashcardCreateNestedOneWithoutCopiesInput
    copies?: FlashcardCreateNestedManyWithoutCopiedFromInput
    activities?: UserFlashcardActivityCreateNestedManyWithoutFlashcardInput
  }

  export type FlashcardUncheckedCreateWithoutTagsInput = {
    id?: string
    ownerId: string
    front: string
    back: string
    frontLanguage: string
    backLanguage: string
    pronunciation?: string | null
    createdAt?: Date | string
    status?: string
    rank?: number
    memoryHook?: string | null
    nextTestTime?: Date | string | null
    copiedFromId?: string | null
    copies?: FlashcardUncheckedCreateNestedManyWithoutCopiedFromInput
    activities?: UserFlashcardActivityUncheckedCreateNestedManyWithoutFlashcardInput
  }

  export type FlashcardCreateOrConnectWithoutTagsInput = {
    where: FlashcardWhereUniqueInput
    create: XOR<FlashcardCreateWithoutTagsInput, FlashcardUncheckedCreateWithoutTagsInput>
  }

  export type TagCreateWithoutFlashcardsInput = {
    id?: string
    abbreviation: string
    description?: string | null
  }

  export type TagUncheckedCreateWithoutFlashcardsInput = {
    id?: string
    abbreviation: string
    description?: string | null
  }

  export type TagCreateOrConnectWithoutFlashcardsInput = {
    where: TagWhereUniqueInput
    create: XOR<TagCreateWithoutFlashcardsInput, TagUncheckedCreateWithoutFlashcardsInput>
  }

  export type FlashcardUpsertWithoutTagsInput = {
    update: XOR<FlashcardUpdateWithoutTagsInput, FlashcardUncheckedUpdateWithoutTagsInput>
    create: XOR<FlashcardCreateWithoutTagsInput, FlashcardUncheckedCreateWithoutTagsInput>
    where?: FlashcardWhereInput
  }

  export type FlashcardUpdateToOneWithWhereWithoutTagsInput = {
    where?: FlashcardWhereInput
    data: XOR<FlashcardUpdateWithoutTagsInput, FlashcardUncheckedUpdateWithoutTagsInput>
  }

  export type FlashcardUpdateWithoutTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    frontLanguage?: StringFieldUpdateOperationsInput | string
    backLanguage?: StringFieldUpdateOperationsInput | string
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    memoryHook?: NullableStringFieldUpdateOperationsInput | string | null
    nextTestTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    owner?: UserUpdateOneRequiredWithoutFlashcardsNestedInput
    copiedFrom?: FlashcardUpdateOneWithoutCopiesNestedInput
    copies?: FlashcardUpdateManyWithoutCopiedFromNestedInput
    activities?: UserFlashcardActivityUpdateManyWithoutFlashcardNestedInput
  }

  export type FlashcardUncheckedUpdateWithoutTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    frontLanguage?: StringFieldUpdateOperationsInput | string
    backLanguage?: StringFieldUpdateOperationsInput | string
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    memoryHook?: NullableStringFieldUpdateOperationsInput | string | null
    nextTestTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    copiedFromId?: NullableStringFieldUpdateOperationsInput | string | null
    copies?: FlashcardUncheckedUpdateManyWithoutCopiedFromNestedInput
    activities?: UserFlashcardActivityUncheckedUpdateManyWithoutFlashcardNestedInput
  }

  export type TagUpsertWithoutFlashcardsInput = {
    update: XOR<TagUpdateWithoutFlashcardsInput, TagUncheckedUpdateWithoutFlashcardsInput>
    create: XOR<TagCreateWithoutFlashcardsInput, TagUncheckedCreateWithoutFlashcardsInput>
    where?: TagWhereInput
  }

  export type TagUpdateToOneWithWhereWithoutFlashcardsInput = {
    where?: TagWhereInput
    data: XOR<TagUpdateWithoutFlashcardsInput, TagUncheckedUpdateWithoutFlashcardsInput>
  }

  export type TagUpdateWithoutFlashcardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TagUncheckedUpdateWithoutFlashcardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    abbreviation?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateWithoutMobileImportsInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    role?: string
    minutesToTestAgain?: number
    dailyTakeGoal?: number
    flashcards?: FlashcardCreateNestedManyWithoutOwnerInput
    activities?: UserFlashcardActivityCreateNestedManyWithoutUserInput
    versionItems?: VersionItemCreateNestedManyWithoutStartedByUserInput
  }

  export type UserUncheckedCreateWithoutMobileImportsInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    role?: string
    minutesToTestAgain?: number
    dailyTakeGoal?: number
    flashcards?: FlashcardUncheckedCreateNestedManyWithoutOwnerInput
    activities?: UserFlashcardActivityUncheckedCreateNestedManyWithoutUserInput
    versionItems?: VersionItemUncheckedCreateNestedManyWithoutStartedByUserInput
  }

  export type UserCreateOrConnectWithoutMobileImportsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMobileImportsInput, UserUncheckedCreateWithoutMobileImportsInput>
  }

  export type UserUpsertWithoutMobileImportsInput = {
    update: XOR<UserUpdateWithoutMobileImportsInput, UserUncheckedUpdateWithoutMobileImportsInput>
    create: XOR<UserCreateWithoutMobileImportsInput, UserUncheckedCreateWithoutMobileImportsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMobileImportsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMobileImportsInput, UserUncheckedUpdateWithoutMobileImportsInput>
  }

  export type UserUpdateWithoutMobileImportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    minutesToTestAgain?: IntFieldUpdateOperationsInput | number
    dailyTakeGoal?: IntFieldUpdateOperationsInput | number
    flashcards?: FlashcardUpdateManyWithoutOwnerNestedInput
    activities?: UserFlashcardActivityUpdateManyWithoutUserNestedInput
    versionItems?: VersionItemUpdateManyWithoutStartedByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMobileImportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    minutesToTestAgain?: IntFieldUpdateOperationsInput | number
    dailyTakeGoal?: IntFieldUpdateOperationsInput | number
    flashcards?: FlashcardUncheckedUpdateManyWithoutOwnerNestedInput
    activities?: UserFlashcardActivityUncheckedUpdateManyWithoutUserNestedInput
    versionItems?: VersionItemUncheckedUpdateManyWithoutStartedByUserNestedInput
  }

  export type FlashcardCreateManyOwnerInput = {
    id?: string
    front: string
    back: string
    frontLanguage: string
    backLanguage: string
    pronunciation?: string | null
    createdAt?: Date | string
    status?: string
    rank?: number
    memoryHook?: string | null
    nextTestTime?: Date | string | null
    copiedFromId?: string | null
  }

  export type UserFlashcardActivityCreateManyUserInput = {
    id?: string
    flashcardId: string
    whenActedUpon?: Date | string
    actionTaken: string
    actionDetails?: string | null
  }

  export type VersionItemCreateManyStartedByUserInput = {
    id?: string
    versionId?: string | null
    versionCategoryId?: string | null
    type?: string
    body: string
    rank?: number
    orderWithinVersion?: number
    isTested?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MobileImportCreateManyUserInput = {
    id?: string
    mobileImportText: string
    whenImported?: Date | string
  }

  export type FlashcardUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    frontLanguage?: StringFieldUpdateOperationsInput | string
    backLanguage?: StringFieldUpdateOperationsInput | string
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    memoryHook?: NullableStringFieldUpdateOperationsInput | string | null
    nextTestTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    copiedFrom?: FlashcardUpdateOneWithoutCopiesNestedInput
    copies?: FlashcardUpdateManyWithoutCopiedFromNestedInput
    activities?: UserFlashcardActivityUpdateManyWithoutFlashcardNestedInput
    tags?: FlashcardTagUpdateManyWithoutFlashcardNestedInput
  }

  export type FlashcardUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    frontLanguage?: StringFieldUpdateOperationsInput | string
    backLanguage?: StringFieldUpdateOperationsInput | string
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    memoryHook?: NullableStringFieldUpdateOperationsInput | string | null
    nextTestTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    copiedFromId?: NullableStringFieldUpdateOperationsInput | string | null
    copies?: FlashcardUncheckedUpdateManyWithoutCopiedFromNestedInput
    activities?: UserFlashcardActivityUncheckedUpdateManyWithoutFlashcardNestedInput
    tags?: FlashcardTagUncheckedUpdateManyWithoutFlashcardNestedInput
  }

  export type FlashcardUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    frontLanguage?: StringFieldUpdateOperationsInput | string
    backLanguage?: StringFieldUpdateOperationsInput | string
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    memoryHook?: NullableStringFieldUpdateOperationsInput | string | null
    nextTestTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    copiedFromId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserFlashcardActivityUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    whenActedUpon?: DateTimeFieldUpdateOperationsInput | Date | string
    actionTaken?: StringFieldUpdateOperationsInput | string
    actionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    flashcard?: FlashcardUpdateOneRequiredWithoutActivitiesNestedInput
  }

  export type UserFlashcardActivityUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    flashcardId?: StringFieldUpdateOperationsInput | string
    whenActedUpon?: DateTimeFieldUpdateOperationsInput | Date | string
    actionTaken?: StringFieldUpdateOperationsInput | string
    actionDetails?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserFlashcardActivityUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    flashcardId?: StringFieldUpdateOperationsInput | string
    whenActedUpon?: DateTimeFieldUpdateOperationsInput | Date | string
    actionTaken?: StringFieldUpdateOperationsInput | string
    actionDetails?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type VersionItemUpdateWithoutStartedByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    orderWithinVersion?: IntFieldUpdateOperationsInput | number
    isTested?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: VersionUpdateOneWithoutVersionItemsNestedInput
    versionCategory?: VersionCategoryUpdateOneWithoutVersionItemsNestedInput
  }

  export type VersionItemUncheckedUpdateWithoutStartedByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionId?: NullableStringFieldUpdateOperationsInput | string | null
    versionCategoryId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    orderWithinVersion?: IntFieldUpdateOperationsInput | number
    isTested?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VersionItemUncheckedUpdateManyWithoutStartedByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionId?: NullableStringFieldUpdateOperationsInput | string | null
    versionCategoryId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    orderWithinVersion?: IntFieldUpdateOperationsInput | number
    isTested?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MobileImportUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mobileImportText?: StringFieldUpdateOperationsInput | string
    whenImported?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MobileImportUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mobileImportText?: StringFieldUpdateOperationsInput | string
    whenImported?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MobileImportUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mobileImportText?: StringFieldUpdateOperationsInput | string
    whenImported?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VersionItemCreateManyVersionInput = {
    id?: string
    versionCategoryId?: string | null
    type?: string
    body: string
    rank?: number
    startedByUserId?: string | null
    orderWithinVersion?: number
    isTested?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VersionItemUpdateWithoutVersionInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    orderWithinVersion?: IntFieldUpdateOperationsInput | number
    isTested?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versionCategory?: VersionCategoryUpdateOneWithoutVersionItemsNestedInput
    startedByUser?: UserUpdateOneWithoutVersionItemsNestedInput
  }

  export type VersionItemUncheckedUpdateWithoutVersionInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionCategoryId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    startedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    orderWithinVersion?: IntFieldUpdateOperationsInput | number
    isTested?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VersionItemUncheckedUpdateManyWithoutVersionInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionCategoryId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    startedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    orderWithinVersion?: IntFieldUpdateOperationsInput | number
    isTested?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VersionCategoryAbbreviationCreateManyVersionCategoryInput = {
    id?: string
    abbreviationText: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VersionItemCreateManyVersionCategoryInput = {
    id?: string
    versionId?: string | null
    type?: string
    body: string
    rank?: number
    startedByUserId?: string | null
    orderWithinVersion?: number
    isTested?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VersionCategoryAbbreviationUpdateWithoutVersionCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    abbreviationText?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VersionCategoryAbbreviationUncheckedUpdateWithoutVersionCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    abbreviationText?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VersionCategoryAbbreviationUncheckedUpdateManyWithoutVersionCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    abbreviationText?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VersionItemUpdateWithoutVersionCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    orderWithinVersion?: IntFieldUpdateOperationsInput | number
    isTested?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: VersionUpdateOneWithoutVersionItemsNestedInput
    startedByUser?: UserUpdateOneWithoutVersionItemsNestedInput
  }

  export type VersionItemUncheckedUpdateWithoutVersionCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    startedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    orderWithinVersion?: IntFieldUpdateOperationsInput | number
    isTested?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VersionItemUncheckedUpdateManyWithoutVersionCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    versionId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    startedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    orderWithinVersion?: IntFieldUpdateOperationsInput | number
    isTested?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlashcardCreateManyCopiedFromInput = {
    id?: string
    ownerId: string
    front: string
    back: string
    frontLanguage: string
    backLanguage: string
    pronunciation?: string | null
    createdAt?: Date | string
    status?: string
    rank?: number
    memoryHook?: string | null
    nextTestTime?: Date | string | null
  }

  export type UserFlashcardActivityCreateManyFlashcardInput = {
    id?: string
    userId: string
    whenActedUpon?: Date | string
    actionTaken: string
    actionDetails?: string | null
  }

  export type FlashcardTagCreateManyFlashcardInput = {
    id?: string
    tagId: string
  }

  export type FlashcardUpdateWithoutCopiedFromInput = {
    id?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    frontLanguage?: StringFieldUpdateOperationsInput | string
    backLanguage?: StringFieldUpdateOperationsInput | string
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    memoryHook?: NullableStringFieldUpdateOperationsInput | string | null
    nextTestTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    owner?: UserUpdateOneRequiredWithoutFlashcardsNestedInput
    copies?: FlashcardUpdateManyWithoutCopiedFromNestedInput
    activities?: UserFlashcardActivityUpdateManyWithoutFlashcardNestedInput
    tags?: FlashcardTagUpdateManyWithoutFlashcardNestedInput
  }

  export type FlashcardUncheckedUpdateWithoutCopiedFromInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    frontLanguage?: StringFieldUpdateOperationsInput | string
    backLanguage?: StringFieldUpdateOperationsInput | string
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    memoryHook?: NullableStringFieldUpdateOperationsInput | string | null
    nextTestTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    copies?: FlashcardUncheckedUpdateManyWithoutCopiedFromNestedInput
    activities?: UserFlashcardActivityUncheckedUpdateManyWithoutFlashcardNestedInput
    tags?: FlashcardTagUncheckedUpdateManyWithoutFlashcardNestedInput
  }

  export type FlashcardUncheckedUpdateManyWithoutCopiedFromInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    front?: StringFieldUpdateOperationsInput | string
    back?: StringFieldUpdateOperationsInput | string
    frontLanguage?: StringFieldUpdateOperationsInput | string
    backLanguage?: StringFieldUpdateOperationsInput | string
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    rank?: FloatFieldUpdateOperationsInput | number
    memoryHook?: NullableStringFieldUpdateOperationsInput | string | null
    nextTestTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserFlashcardActivityUpdateWithoutFlashcardInput = {
    id?: StringFieldUpdateOperationsInput | string
    whenActedUpon?: DateTimeFieldUpdateOperationsInput | Date | string
    actionTaken?: StringFieldUpdateOperationsInput | string
    actionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutActivitiesNestedInput
  }

  export type UserFlashcardActivityUncheckedUpdateWithoutFlashcardInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    whenActedUpon?: DateTimeFieldUpdateOperationsInput | Date | string
    actionTaken?: StringFieldUpdateOperationsInput | string
    actionDetails?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserFlashcardActivityUncheckedUpdateManyWithoutFlashcardInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    whenActedUpon?: DateTimeFieldUpdateOperationsInput | Date | string
    actionTaken?: StringFieldUpdateOperationsInput | string
    actionDetails?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FlashcardTagUpdateWithoutFlashcardInput = {
    id?: StringFieldUpdateOperationsInput | string
    tag?: TagUpdateOneRequiredWithoutFlashcardsNestedInput
  }

  export type FlashcardTagUncheckedUpdateWithoutFlashcardInput = {
    id?: StringFieldUpdateOperationsInput | string
    tagId?: StringFieldUpdateOperationsInput | string
  }

  export type FlashcardTagUncheckedUpdateManyWithoutFlashcardInput = {
    id?: StringFieldUpdateOperationsInput | string
    tagId?: StringFieldUpdateOperationsInput | string
  }

  export type FlashcardTagCreateManyTagInput = {
    id?: string
    flashcardId: string
  }

  export type FlashcardTagUpdateWithoutTagInput = {
    id?: StringFieldUpdateOperationsInput | string
    flashcard?: FlashcardUpdateOneRequiredWithoutTagsNestedInput
  }

  export type FlashcardTagUncheckedUpdateWithoutTagInput = {
    id?: StringFieldUpdateOperationsInput | string
    flashcardId?: StringFieldUpdateOperationsInput | string
  }

  export type FlashcardTagUncheckedUpdateManyWithoutTagInput = {
    id?: StringFieldUpdateOperationsInput | string
    flashcardId?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}