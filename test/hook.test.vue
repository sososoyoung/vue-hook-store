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
