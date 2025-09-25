<script setup lang="ts">
import MyAvatar from '../MyAvatar/index.vue'
import useUserStore from '@/store/modules/user'
import useIframeOpenFunc from '@/04-kk-component-mobile/hooks/useIframeOpenFunc'

defineOptions({
  name: 'MineHeaderCp',
})

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const refreshLoading = ref(false)
const isHidden = ref(true)

const userTypes = {
  1: t('web.i18nFront.label.formal'),
  2: t('web.i18nFront.label.test'),
}

const userTypeTxt = computed(() => {
  return userTypes[userStore?.userInfo?.userType] || ''
})

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

async function onRefresh() {
  refreshLoading.value = true
  await userStore.getUserBanlance()
  refreshLoading.value = false
}

const { goToPayment } = useIframeOpenFunc()

function openPayCenter(type: 'deposit' | 'withdraw') {
  goToPayment(type)
}

function goTransfor() {
  router.push('/transfor')
}
</script>

<template>
  <div class="w-full">
    <TopNav :title="$t('web.i18nFront.label.accountM')" />
    <div class="mx-2 mt-2 flex items-center gap-2 bg-#ffffff p-3 text-14px">
      <MyAvatar :size="44" />
      <div class="">
        <p class="flex">
          <span>{{ $t('web.i18nFront.label.account') }}：</span>
          <span class="color-#303442 font-400">
            {{ userStore?.userInfo?.userName }}
          </span>
        </p>
        <p class="flex">
          <span>{{ $t('web.i18nFront.label.nickname2') }}：</span>
          <span>{{ userStore?.userInfo?.nickName }}</span>
          <van-tag v-if="userTypeTxt" class="ml-2" type="primary">
            {{ userTypeTxt }}
          </van-tag>
        </p>
      </div>
    </div>
    <div class="account-card mx-2 bg-white py-3">
      <div class="flex items-center justify-between px-3">
        <div class="text-sm">
          <WalletAndCurrencySelector padding="0 4px 0 0" min-h="20px" :show-label="false" />
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
      <div class="mt-3 flex items-center justify-between gap-2 px-2 text-sm text-white">
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

    <!-- <van-row>
      <van-col span="6">
        <TabItem
          :title="$t('web.i18nFront.label.recharge')" :show-rigth-line="false"
          @click="emit('openWallet', 'deposit')"
        >
          <IconWithdraw />
        </TabItem>
      </van-col>
      <van-col span="6">
        <TabItem
          :title="$t('web.i18nFront.label.withdraw')" :show-rigth-line="false"
          @click="emit('openWallet', 'withdraw')"
        >
          <IconTopup />
        </TabItem>
      </van-col>
      <van-col span="6">
        <TabItem :title="$t('web.i18nFront.label.transfor')" :show-rigth-line="false" @click="router.push('/transfor')">
          <IconWallet />
        </tabitem>
      </van-col>
      <van-col span="6">
        <TabItem :title="$t('web.i18nFront.label.swapShort')" :show-rigth-line="false" @click="router.push('/swap')">
          <IconWallet />
        </tabitem>
      </van-col>
    </van-row> -->
  </div>
</template>

<style lang="less" scoped>
.account-card {
  box-shadow: 0 0 0.2rem rgba(0, 0, 0, 0.1);
}
.eye-icon-close {
  background: url('@/assets/images/new/eye-close-icon.png') no-repeat 50%;
}
.eye-icon-open {
  background: url('@/assets/images/new/eye-icon.png') no-repeat 50%;
}
</style>
