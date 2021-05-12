import { onBeforeUnmount } from "@vue/composition-api";
import { ParamType } from "../types";

type CacheModelInstance<T extends VoidFunction> = {
  forceRemove?: VoidFunction;
} & ReturnType<T>;

interface CacheModel<Fn extends VoidFunction> {
  fn: Fn;
  count: number;
  instance: CacheModelInstance<Fn>;
}

const STORE: Record<number, CacheModel<any>> = {};
const CACHE_CONFIG = {
  keyIndex: 0,
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
    delete STORE[_key];
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
    if (STORE[_key]) {
      const item: CacheModel<Fn> = STORE[_key];
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

    STORE[_key] = item;
    onBeforeUnmount(onLeave(item));

    return instance;
  };
};
