<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { showLoadingToast, showToast } from 'vant'
import Header from './components/Header/index.vue'
import CellRow from './components/CellRow/index.vue'
import useUserStore from '@/store/modules/user'
import { localImg } from '@/01-kk-system/allUtils/utils'
import useIframeOpenFunc from '@/04-kk-component-mobile/hooks/useIframeOpenFunc'

defineOptions({
  name: 'Mine',
})

const userStore = useUserStore()
const router = useRouter()
const { t } = useI18n()
const { goToPayment } = useIframeOpenFunc()

const activeNames = ref(['0', '1', '2', '3', '4'])
const showConfirm = ref(false)

const collapseList = [
  {
    title: t('web.i18nFront.label.myReport'),
    image: localImg('images/grbb.png'),
    children: [
      {
        title: t('web.i18nFront.label.personCompReport'),
        path: '/my-report-all',
      },
      {
        title: t('web.i18nFront.label.personLotteryReport'),
        path: '/my-report-lottery',
      },
      {
        title: t('web.i18nFront.label.personChaseReport'),
        path: '/my-report-chase',
      },
      {
        title: t('web.i18nFront.label.personOuterpReport'),
        path: '/my-report-other',
      },
    ],
  },
  {
    title: t('web.i18nFront.label.bankInOut'),
    image: localImg('images/new/yhct.png'),
    children: [
      {
        title: t('web.i18nFront.label.recharge'),
        path: 'deposit',
      },
      {
        title: t('web.i18nFront.label.withdraw'),
        path: 'withdraw',
      },
      {
        title: t('web.i18nFront.label.transfor'),
        path: '/transfor',
      },
      {
        title: t('web.i18nFront.label.swapShort'),
        path: '/swap',
      },
    ],
  },
  {
    title: t('web.i18nFront.label.myReport'),
    image: localImg('images/grbb.png'),
    children: [
      {
        title: t('web.i18nFront.label.personCompReport'),
        path: '/my-report-all',
      },
      {
        title: t('web.i18nFront.label.personLotteryReport'),
        path: '/my-report-lottery',
      },
      {
        title: t('web.i18nFront.label.personChaseReport'),
        path: '/my-report-chase',
      },
      {
        title: t('web.i18nFront.label.personOuterpReport'),
        path: '/my-report-other',
      },
    ],
  },
  {
    title: t('web.i18nFront.label.agentShare'),
    image: localImg('images/tg.png'),
    children: [
      {
        title: t('web.i18nFront.label.agentShare'),
        path: '/open-account',
      },
    ],
  },
  {
    title: t('web.i18nFront.label.agentReport'),
    image: localImg('images/dlbb.png'),
    children: [
      {
        title: t('web.i18nFront.label.teamM'),
        path: '/team-manage',
      },
      {
        title: t('web.i18nFront.label.teamSta'),
        path: '/team-statistics',
      },
      {
        title: t('web.i18nFront.label.teamProfit'),
        path: '/team-profit-report',
      },
      {
        title: t('web.i18nFront.label.teamAc'),
        path: '/team-money-change',
      },
      {
        title: t('web.i18nFront.label.teamLottery'),
        path: '/team-report-lottery',
      },
      {
        title: t('web.i18nFront.label.teamLotteryChess'),
        path: '/team-report-chase',
      },
      {
        title: t('web.i18nFront.label.teamOther'),
        path: '/team-report-other',
      },
    ],
  },
]

function onLogout() {
  showConfirm.value = true
}

function logout() {
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  userStore.logout().then(() => {
    userStore.resetToken()
    showConfirm.value = false
  }).finally(() => toast.close())
}

function onClickItem(item: Record<string, any>) {
  const { path } = item || {}
  if (!path) {
    showToast(t('web.i18nFront.hint.noData'))
    return
  }
  if (path === 'deposit') {
    openPayCenter('deposit')
  }
  else if (path === 'withdraw') {
    openPayCenter('withdraw')
  }
  else if (path) {
    router.push({ path })
  }
}

function hasFundPwd() {
  userStore.checkFundPwdExist()
}

async function openPayCenter(type: 'withdraw' | 'deposit') {
  goToPayment(type)
}

onBeforeMount(() => {
  hasFundPwd()
})
</script>

<template>
  <div class="h-full flex flex-col overflow-auto">
    <Header />
    <div class="mx-2 mb-10 mt-2">
      <CellRow :show-bottom-line="false" :title="$t('web.i18nFront.label.myPofile')" @click="router.push('/userInfo')">
        <template #left>
          <img class="h-4 w-4" :src="localImg('images/zl.png')" alt="">
        </template>
      </CellRow>
      <van-collapse v-model="activeNames">
        <van-collapse-item v-for="(item, i) in collapseList" :key="i" :name="i.toString()">
          <template #title>
            <div class="flex items-center gap-2 color-#590809 font-600">
              <img class="h-4 w-4" :src="item.image" alt="">
              <span>{{ item.title }}</span>
            </div>
          </template>
          <div class="grid grid-cols-3 gap-2">
            <div
              v-for="(child, j) in item.children"
              :key="j"
              class="flex-center rounded-1 bg-#f9efee p-2 text-12px text-#341900"
              @click="onClickItem(child)"
            >
              <span>{{ child.title }}</span>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
      <CellRow :title="$t('web.i18nFront.label.myRewards')" @click="router.push('/my-rewards')">
        <template #left>
          <img class="h-4 w-4" :src="localImg('images/fy.png')" alt="">
        </template>
      </CellRow>
      <CellRow :title="$t('web.i18nFront.label.accountDetail')" @click="router.push('/my-bill')">
        <template #left>
          <img class="h-4 w-4" :src="localImg('images/mx.png')" alt="">
        </template>
      </CellRow>
      <CellRow :title="$t('web.i18nFront.label.platNoti')" @click="router.push('/notice')">
        <template #left>
          <img class="h-4 w-4" :src="localImg('images/xx.png')" alt="">
        </template>
      </CellRow>
      <CellRow :title="$t('web.i18nFront.label.helpCenter')" @click="router.push('/help-center')">
        <template #left>
          <IconHelp size="16" />
        </template>
      </CellRow>
      <CellRow :show-bottom-line="false" :title="$t('web.i18nFront.label.aboutUs')" @click="router.push('/about')">
        <template #left>
          <img class="h-4 w-4" :src="localImg('images/wm.png')" alt="">
        </template>
      </CellRow>
    </div>

    <div class="mx-2 mb-12 flex items-stretch justify-center">
      <div class="h-10 w-full flex-center rounded-full bg-#5a0809 text-14px text-#ffff" @click="onLogout">
        {{ $t('web.i18nFront.label.logout') }}
      </div>
    </div>
    <CustomDialog
      v-model:show="showConfirm"
      :close-on-click-overlay="true"
      :desc="$t('system.i18nSystem.hint.cfmLogout')"
      @on-cancel="showConfirm = false"
      @on-confirm="logout"
    />
  </div>
</template>
