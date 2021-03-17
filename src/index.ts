import { onBeforeUnmount } from "@vue/composition-api";
const store = new WeakMap();
interface Item<Fn extends VoidFunction> {
  count: number;
  fn?: Fn | null;
  instance?: ReturnType<Fn>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createModel = <Fn extends (opt?: Opt) => ReturnType<Fn>, Opt extends any>(fn: Fn, option?: Opt) => {
  const removeItem = (item: Item<Fn>) => {
    item.fn && store.delete(item.fn);
  };

  const onLeave = (item: Item<Fn>) => {
    onBeforeUnmount(() => {
      item.count--;
      if (item.count < 1) {
        removeItem(item);
      }
    });
  };

  return (_option?: Opt) => {
    if (store.has(fn)) {
      const item = store.get(fn);
      item.count++;

      onLeave(item);
      return item.instance as ReturnType<Fn>;
    }

    const instance = fn(_option || option);

    const item = {
      fn,
      instance,
      count: 1,
    };

    store.set(fn, item);
    onLeave(item);

    return instance as ReturnType<Fn>;
  };
};
