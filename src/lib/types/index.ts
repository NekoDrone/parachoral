export type MapValue<T> = T extends Map<any, infer V> ? V : never;
export type MapKey<T> = T extends Map<infer K, any> ? K : never;
