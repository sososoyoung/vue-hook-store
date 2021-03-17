# vue-hook-store

将 hook 缓存, 多个组件共享

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg) [![npm version](https://img.shields.io/npm/v/vue-hook-store.svg?style=flat)](https://www.npmjs.com/package/vue-hook-store)

## 解决的问题:

兄弟或父子组件间 hook 数据共享

## 安装

`npm install vue-hook-store`

## 开始使用

```js
// hook.ts
import { ref } from "@vue/composition-api";
import { createModel, createProvideModel } from "../src";

const testHook = (starNumber = 0) => {
  const count = ref(starNumber);
  const add = () => {
    count.value++;
  };

  return { count, add };
};

export const testHookModel = createProvideModel(testHook);
// or
// export const testHookModel = createModel(testHook);
```

```vue
// test.vue
<template>
  <div class="test">
    {{ count }}
  </div>
</template>

<script lang="ts">
import { testHookModel } from "./hook";
export default {
  setup() {
    const { count, add } = testHookModel();

    return { count, add };
  },
};
</script>
```

## 注意事项

1. createProvideModel: 基于 provide 的 Hook 共享
   - 限制: 必须有个父组件先引用
   - 优点: 父组件销毁即销毁
   - 缺点: 同级(兄弟)兄弟组件不能可以共享

1. createModel: Hook 共享
   - 限制: hook 内请勿使用生命周期钩子
   - 优点: 同级(兄弟)兄弟组件可以共享
   - 缺点: 1. 页面跳转时两个页面都有引用时不会销毁; 2, 由 1 引发的声明周期异常
