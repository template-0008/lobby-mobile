<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import useIframeOpenFunc from '@/04-kk-component-mobile/hooks/useIframeOpenFunc'
import MyAvatar from '@/pages/mine/components/MyAvatar/index.vue'

defineOptions({
  name: 'HomeToolView',
})

// const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()

const { goToPayment } = useIframeOpenFunc()

const refreshLoading = ref(false)
const isHidden = ref(true)

const balance = computed(() => {
  const money = userStore?.balanceInfo?.balance
    ? userStore.balanceInfo.balance
    : '0.00'
  return isHidden.value ? '****' : money || '0.00'
})

const moneySymbol = computed(() => {
  const symbol = userStore?.currentWalletInfo?.symbol || ''
  return symbol || '¥'
})

async function openPayCenter(type: 'deposit' | 'withdraw') {
  // if (!userStore.token) {
  //   userStore.showLogin = true
  //   return
  // }
  // const toast = showLoadingToast({
  //   message: `${t('web.i18nFront.hint.loading')}...`,
  //   duration: 0,
  //   forbidClick: true,
  // })
  // const hasPwd = await userStore.checkFundPwdExist()
  // toast.close()
  // if (!hasPwd) {
  //   showConfirmDialog({
  //     title: t('system.i18nSystem.label.hint'),
  //     message: t('web.i18nFront.hint.confirmFundPwd'),
  //     confirmButtonText: t('web.i18nFront.operation.goSet'),
  //     cancelButtonText: t('web.i18nFront.operation.cancel'),
  //   })
  //     .then(() => {
  //       router.push({ path: '/userInfo' })
  //     })
  //     .catch(() => {})
  //   return
  // }
  goToPayment(type)
}

async function onRefresh() {
  refreshLoading.value = true
  await userStore.getUserBanlance()
  refreshLoading.value = false
}

function goTransfor() {
  router.push('/transfor')
}
</script>

<template>
  <div class="home-tool-bar relative mx-2 mb-2 mt-2 rounded-tl-2 rounded-tr-2 bg-white px-3 py-3">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <MyAvatar :size="24" />
        <span class="text-sm color-#303442 font-400">
          {{ userStore?.userInfo?.userName }}
        </span>
      </div>
      <div class="flex items-center gap-1">
        <span class="text-12px color-#303442 font-600">{{ moneySymbol }} {{ balance }}</span>
        <van-button icon="replay" :loading="refreshLoading" size="mini" circle @click="onRefresh" />
        <div
          class="h-6 w-6 flex-center cursor-pointer text-#5a0809"
          :class="{ 'eye-icon-close': isHidden, 'eye-icon-open': !isHidden }" @click="isHidden = !isHidden"
        >
          <van-icon v-if="isHidden" name="closed-eye" />
          <van-icon v-else name="eye-o" />
        </div>
      </div>
    </div>
    <div class="mt-3 flex items-center justify-between gap-2 text-sm text-white">
      <div class="h-8 flex-center flex-1 cursor-pointer gap-1 bg-#e6ab4f" @click.prevent="openPayCenter('deposit')">
        <img class="h-4 w-4" src="@/assets/images/new/recharge-icon.png" alt="">
        <span>{{ $t("web.i18nFront.label.recharge") }}</span>
      </div>
      <div class="h-8 flex-center flex-1 cursor-pointer gap-1 bg-#a7ae43" @click.prevent="openPayCenter('withdraw')">
        <img class="h-4 w-4" src="@/assets/images/new/withdraw-icon.png" alt="">
        <span>{{ $t("web.i18nFront.label.withdraw") }}</span>
      </div>
      <div class="h-8 flex-center flex-1 cursor-pointer gap-1 bg-#ee6261" @click.prevent="goTransfor">
        <img class="h-4 w-4" src="@/assets/images/new/exchange-icon.png" alt="">
        <span>{{ $t("web.i18nFront.label.transfor") }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.home-tool-bar::after {
  content: '';
  display: block;
  position: absolute;
  bottom: -3.076923vw;
  width: 100%;
  height: 5.128205vw;
  left: 0;
  border-radius: 0 0 3.333333vw 3.333333vw;
  background-image: url(data:image/png;base64,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);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.eye-icon-close {
  background: url('@/assets/images/new/eye-close-icon.png') no-repeat 50%;
}
.eye-icon-open {
  background: url('@/assets/images/new/eye-icon.png') no-repeat 50%;
}
</style>
