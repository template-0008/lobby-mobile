<script setup lang="ts">
import type { SwipeInstance } from 'vant'
import { usePlatformNotice } from './usePlatformNotice'
import SafeRichText from '@/04-kk-component-mobile/SafeRichText/index.vue'

defineOptions({
  name: 'NoticeDialog',
})

// const showModel = defineModel<boolean>('show')

const swipeRef = ref<SwipeInstance>()
const { noticeList } = usePlatformNotice()
</script>

<template>
  <van-dialog v-bind="$attrs" teleport="body" width="80%">
    <div class="relative h-[70vh]">
      <div class="bg-#5a0809 py-2 text-center text-16px text-#fff font-bold">
        {{ $t('web.i18nFront.label.noticeTitle') }}
      </div>
      <van-swipe ref="swipeRef" :autoplay="30000" lazy-render class="min-h-170px" :show-indicators="false">
        <van-swipe-item v-for="notice in noticeList" :key="notice.pressID" class="">
          <div class="h-[60vh] overflow-hidden overflow-y-auto">
            <p class="p-6 text-16px color-#5a0809 font-bold">
              {{ notice.title }}
            </p>
            <div class="p-6 text-14px">
              <SafeRichText :content="`${notice.content ?? ''}`" />
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
      <div class="absolute left-0 top-1/2 h-8 w-5 flex-center cursor-pointer bg-#5a0809 -translate-y-1/2" @click="swipeRef?.prev()">
        <van-icon name="arrow-left" size="20" color="#fff" />
      </div>
      <div class="absolute right-0 top-1/2 h-8 w-5 flex-center cursor-pointer bg-#5a0809 -translate-y-1/2" @click="swipeRef?.next()">
        <van-icon name="arrow" size="20" color="#fff" />
      </div>
    </div>
  </van-dialog>
</template>

<style lang="less" scoped></style>
