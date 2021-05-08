export type ParamType<T> = T extends (option: infer P) => any ? P : T;
