import { onBeforeUnmount } from "@vue/composition-api";

type ParamType<T> = T extends (param: infer P) => any ? P : T;
interface CacheModel<Fn extends VoidFunction> {
  fn: Fn;
  count: number;
  instance: ReturnType<Fn>;
}

const store = new Map<number, any>();
const cacheConfig = {
  keyIndex: 0,
};

export const createModel = <Fn extends (opt?: any) => ReturnType<Fn>>(fn: Fn, option?: ParamType<Fn>) => {
  const _key = ++cacheConfig.keyIndex;

  const removeItem = () => {
    store.delete(_key);
  };

  const listenOnLeave = (item: CacheModel<Fn>) => {
    onBeforeUnmount(() => {
      item.count--;
      if (item.count < 1) {
        removeItem();
      }
    });
  };

  return (_option?: ParamType<Fn>) => {
    if (store.has(_key)) {
      const item: CacheModel<Fn> = store.get(_key);
      item.count++;

      listenOnLeave(item);
      return item.instance;
    }

    const instance = fn(_option || option);

    const item: CacheModel<Fn> = {
      fn,
      instance,
      count: 1,
    };

    store.set(_key, item);
    listenOnLeave(item);

    return instance;
  };
};
