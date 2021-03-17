import { onBeforeUnmount, inject, provide } from "@vue/composition-api";

type ParamType<T> = T extends (option: infer P) => any ? P : T;
type CacheModelInstance<T extends VoidFunction> = {
  forceRemove?: VoidFunction;
} & ReturnType<T>;

interface CacheModel<Fn extends VoidFunction> {
  fn: Fn;
  count: number;
  instance: CacheModelInstance<Fn>;
}

const STORE = new Map<number, any>();
const CACHE_CONFIG = {
  keyIndex: 0,
};

const NOT_FOUND = {};
function resolveInject(provideKey: string) {
  return inject(provideKey, NOT_FOUND);
}

/**
 * Hook 共享 基于 provide
 *
 * 优点: 父组件销毁即销毁
 *
 * 缺点: 同级(兄弟)兄弟组件不能可以共享
 */
export const createProvideModel = <Fn extends (opt?: any) => ReturnType<Fn>>(fn: Fn, option?: ParamType<Fn>) => {
  ++CACHE_CONFIG.keyIndex;
  const _key = "_hook_store_" + CACHE_CONFIG.keyIndex;

  return (_option?: ParamType<Fn>) => {
    const val = resolveInject(_key);
    if (val && val !== NOT_FOUND) {
      return val as ReturnType<Fn>;
    }

    const instance = fn(_option || option);
    provide(_key, instance);
    return instance;
  };
};

/**
 * Hook 共享, hook内请勿使用生命周期钩子
 *
 * 优点: 同级(兄弟)兄弟组件可以共享
 *
 * 缺点: 1. 页面跳转时两个页面都有引用时不会销毁; 2, 由1引发的声明周期异常
 */
export const createModel = <Fn extends (opt?: any) => ReturnType<Fn>>(fn: Fn, option?: ParamType<Fn>) => {
  const _key = ++CACHE_CONFIG.keyIndex;

  const removeItem = () => {
    STORE.delete(_key);
  };

  const onLeave = (item: CacheModel<Fn>) => {
    return () => {
      item.count--;
      if (item.count < 1) {
        removeItem();
      }
    };
  };

  return (_option?: ParamType<Fn>) => {
    if (STORE.has(_key)) {
      const item: CacheModel<Fn> = STORE.get(_key);
      item.count++;

      onBeforeUnmount(onLeave(item));
      return item.instance;
    }

    const instance: CacheModelInstance<Fn> = fn(_option || option);
    instance.forceRemove = removeItem;

    const item: CacheModel<Fn> = {
      fn,
      instance,
      count: 1,
    };

    STORE.set(_key, item);
    onBeforeUnmount(onLeave(item));

    return instance;
  };
};
