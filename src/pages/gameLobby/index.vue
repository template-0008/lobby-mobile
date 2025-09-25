<script setup lang="ts">
import { showLoadingToast } from 'vant'
import useIframeOpenFunc from '@/04-kk-component-mobile/hooks/useIframeOpenFunc'
import { useGameStore } from '@/store/modules/game'

defineOptions({
  name: 'GameLobbyPage',
})

const router = useRouter()
const gameStore = useGameStore()
const { onClickClassiGame } = useIframeOpenFunc()

const gameList = ref<Record<string, any>[]>([])
const activeMenuName = ref('')

function onGoBack() {
  router.replace('/')
}

async function init() {
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  gameList.value = await gameStore.getAllSeriesAndGamesList()
  const first = gameList.value[0] || {}
  activeMenuName.value = first.name
  toast.close()
}

onBeforeMount(() => {
  init()
})
</script>

<template>
  <Container :title="$t('web.i18nFront.label.lottGm')" :click-left="onGoBack">
    <div class="h-full flex overflow-hidden bg-#eef2fe text-13px color-#303442">
      <div class="flex-1 overflow-auto px-3 pb-20 pt-4">
        <div v-for="(cate, i) in gameList" :id="`id${i}`" :key="`${i}-cate`" class="rounded-1 bg-white">
          <div class="h-9 flex-center bg-#5a0809 text-16px color-#ffffff font-600">
            {{ cate.name }}
          </div>
          <div class="grid grid-cols-3 mb-5 gap-3 px-2 py-3">
            <div
              v-for="(game, k) in cate.children"
              :key="`${k}-game`"
              class="flex-center rounded-1 bg-#f7efee py-2 text-12px color-#303442"
              @click="onClickClassiGame(game)"
            >
              <span>{{ game.lottoName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<style lang="less" scoped>
</style>
