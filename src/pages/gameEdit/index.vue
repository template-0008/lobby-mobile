<script setup lang="ts">
import { showLoadingToast, showToast } from 'vant'
import { useGameStore } from '@/store/modules/game'
import { useGameCollectionStore } from '@/store/modules/gameCollection'

defineOptions({
  name: 'GameLobbyPage',
})

const { t } = useI18n()
const router = useRouter()
const gameStore = useGameStore()
const gameCollectionStore = useGameCollectionStore()

const gameList = ref<Record<string, any>[]>([])
const activeMenuName = ref('')
const activeName = ref<string>('0-cate')

// function onClickMenu(name: string, index: number) {
//   activeMenuName.value = name
//   const gameContent = document.querySelector(`#id${index}`)
//   if (gameContent) {
//     gameContent.scrollIntoView({ behavior: 'smooth' })
//   }
// }

function onGoBack() {
  router.replace('/')
}

const collectGameList = computed(() => gameCollectionStore.favoriteGames ?? [])
const lotteryFavoriteIds = computed(() => gameCollectionStore.lotteryFavoriteIds ?? [])

function onClickGame(game: any) {
  const currKey = getKey(game)
  if (collectGameList.value.length < 10 || lotteryFavoriteIds.value.includes(currKey)) {
    gameCollectionStore.setLocalCollections(game)
  }
  else {
    showToast({
      message: t('web.i18nFront.tips.maxLottery', { num: 10 }),
      duration: 2000,
    })
  }
}

function getKey(game: any) {
  return gameCollectionStore.getLotteryKey(game)
}

function onClickRemove(game: any) {
  gameCollectionStore.setLocalCollections(game)
}

async function init() {
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  gameList.value = await gameStore.getAllSeriesAndGamesList()
  const first = gameList.value[0] || {}
  activeMenuName.value = first.name
  gameCollectionStore.getLocalCollections()
  toast.close()
}

onBeforeMount(() => {
  init()
})
</script>

<template>
  <Container :title="$t('web.i18nFront.label.collectLottery')" :click-left="onGoBack">
    <div class="h-full overflow-hidden overflow-y-auto bg-#eef2fe pb-100px text-13px color-#303442">
      <div class="m-3 min-h-100px bg-white px-3 py-4">
        <div class="flex-center justify-between">
          <span class="text-16px color-#000000 font-600">{{ $t('web.i18nFront.label.collectedLottery') }}</span>
          <span class="text-12px color-#999">{{ $t('web.i18nFront.tips.currentLottery', { num: 10 }) }}</span>
        </div>
        <div class="grid grid-cols-3 mt-3 gap-3">
          <div v-for="(game, k) in collectGameList" :key="`${k}-game`" class="relative cursor-pointer overflow-hidden border border-#fcecd4 rounded-1 border-solid bg-#ffecd4 py-2 text-center text-12px color-#b75a06" @click="onClickRemove(game)">
            <span>{{ game.lottoName }}</span>
            <div class="absolute right-0 top-0 flex-center rounded-lb-1 bg-#ffc17a px-3px py-1px">
              <van-icon size="10" name="cross" />
            </div>
          </div>
        </div>
      </div>

      <div class="mx-3 bg-white py-4">
        <van-collapse v-model="activeName" accordion :border="false">
          <van-collapse-item v-for="(cate, i) in gameList" :key="`${i}-cate`" :title="cate.name" :name="`${i}-cate`">
            <div class="flex flex-wrap gap-3 bg-#f3f7fa p-3 color-#596068">
              <div v-for="(game, k) in cate.children" :key="`${k}-game`" :value="lotteryFavoriteIds.includes(getKey(game))" class="flex items-center gap-1" @click="onClickGame(game)">
                <van-icon v-if="lotteryFavoriteIds.includes(getKey(game))" size="16" name="passed" color="#ef4444" />
                <div v-else class="h-4 w-4 border border-#eab917 rounded-1 rounded-full border-solid bg-#fff" />
                <span>{{ game.lottoName }}</span>
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
  </Container>
</template>

<style lang="less" scoped>
.game-menu::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(@/assets/images/home/tab-bg.png);
  transition: linear 0.25s;
}
.game-menu {
  transition: all 0.3s ease-in;
}
.game-menu.active {
  color: #ffffff;
}
.game-menu.active::after {
  content: '';
  background-image: url(@/assets/images/home/active-tab-bg.png);
}
</style>
