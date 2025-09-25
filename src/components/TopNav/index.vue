<script setup lang="ts">
import { useChatStore } from '@/store/modules/chat'

defineOptions({
  name: 'TopNav',
})

const props = defineProps({
  clickLeft: Function,
})

const chatStore = useChatStore()
const router = useRouter()
// const route = useRoute()

function onClickLeft() {
  if (props.clickLeft) {
    props.clickLeft()
  }
  else {
    router.back()
  }
}

function onClickServer() {
  chatStore.openChat()
}
</script>

<template>
  <van-nav-bar
    v-bind="$attrs"
    left-arrow
    class="bg-#5a0809 !h-44px"
    style="--van-nav-bar-title-text-color: #ffffff; --van-nav-bar-icon-color: #ffffff;"
    @click-left="onClickLeft"
  >
    <template #right>
      <div class="h-8 w-8 flex-center rounded-full bg-#7d4444" @click="onClickServer">
        <img class="h-4" src="@/assets/images/new/server-icon.png" alt="">
      </div>
    </template>
  </van-nav-bar>
</template>

<style lang="less" scoped></style>
