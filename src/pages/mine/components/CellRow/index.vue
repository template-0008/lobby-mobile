<script setup lang="ts">
defineOptions({
  name: 'CellRow',
})

defineProps({
  image: String,
  title: String,
  icon: String,
  showBottomLine: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <div class="h-11 flex items-center gap-3 bg-white px-4 text-sm" :class="{ 'border-bottom': showBottomLine }">
    <div class="flex items-center">
      <img v-if="icon" class="w-5 object-contain" :src="icon" alt="">
      <slot name="left" />
      <span class="pl-3 color-#590809 font-600">{{ title }}</span>
    </div>
    <div class="flex flex-1 items-center justify-end">
      <slot name="right">
        <van-icon color="#969799" name="arrow" />
      </slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.border-bottom {
  border-bottom: 1px dotted #e1e1e1c2;
}
html.dark .border-bottom {
  border-bottom: 1px dotted #ffffff1a;
}
</style>
