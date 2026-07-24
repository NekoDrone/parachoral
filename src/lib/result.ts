// I should really turn this into a library instead of copy pasting it each time I want to do work with results lol.
/* eslint-disable @typescript-eslint/naming-convention */
export type Ok<T> = { readonly ok: true; readonly value: T };
export type Err<E> = { readonly ok: false; readonly error: E };
export type Result<T, E = Error> = Ok<T> | Err<E>;

export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
export const err = <E>(error: E): Err<E> => ({ ok: false, error });

export const isOk = <T, E>(r: Result<T, E>): r is Ok<T> => r.ok;
export const isErr = <T, E>(r: Result<T, E>): r is Err<E> => !r.ok;

/** Maps over success values, leaving errors untouched. */
export const map = <T, U, E>(
    r: Result<T, E>,
    fn: (value: T) => U,
): Result<U, E> => (r.ok ? ok(fn(r.value)) : r);

/** Maps over error values, leaving successes untouched. */
export const mapErr = <T, E, F>(
    r: Result<T, E>,
    fn: (error: E) => F,
): Result<T, F> => (r.ok ? r : err(fn(r.error)));

/** Chain a Result-returning function (a.k.a. flatMap / bind). */
export const andThen = <T, U, E, F>(
    r: Result<T, E>,
    fn: (value: T) => Result<U, F>,
): Result<U, E | F> => (r.ok ? fn(r.value) : r);

/** Extract the value or throw the error. Use only at boundaries. */
export const unwrap = <T, E>(r: Result<T, E>): T => {
    if (r.ok) return r.value;
    throw r.error instanceof Error ? r.error : new Error(String(r.error));
};

/** Extract the value or a fallback. */
export const unwrapOr = <T, E>(r: Result<T, E>, fallback: T): T =>
    r.ok ? r.value : fallback;

/** Collapse both branches into one value. */
export const match = <T, E, U>(
    r: Result<T, E>,
    handlers: { ok: (value: T) => U; err: (error: E) => U },
): U => (r.ok ? handlers.ok(r.value) : handlers.err(r.error));

/** Wrap a synchronous function that might throw. */
export const tryCatch = <T, E = Error>(
    fn: () => T,
    onError: (caught: unknown) => E = (e) => e as E,
): Result<T, E> => {
    try {
        return ok(fn());
    } catch (caught) {
        return err(onError(caught));
    }
};

/** Wrap a Promise that might reject. */
export const fromPromise = async <T, E = Error>(
    promise: Promise<T>,
    onError: (caught: unknown) => E = (e) => e as E,
): Promise<Result<T, E>> => {
    try {
        return ok(await promise);
    } catch (caught) {
        return err(onError(caught));
    }
};
