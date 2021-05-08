import { inject, provide } from "@vue/composition-api";
import { ParamType } from "../types";

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
