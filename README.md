# vue-hook-store

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg) [![npm version](https://img.shields.io/npm/v/vue-hook-store.svg?style=flat)](https://www.npmjs.com/package/vue-hook-store)

## 解决的问题:

将 hook 缓存, 多个组件共享

## 安装

`npm install vue-hook-store`

## 开始使用

```js
// hook.ts
import { ref } from "@vue/composition-api";
import { createModel } from "../src";

const testHook = (starNumber = 0) => {
  const count = ref(starNumber);
  const add = () => {
    count.value++;
  };

  return { count, add };
};

export const testHookModel = createModel(testHook, 1);
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
