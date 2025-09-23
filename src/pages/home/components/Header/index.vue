<script setup lang="ts">
import { showLoadingToast } from 'vant'
import useUserStore from '@/store/modules/user'
import useAppStore from '@/store/modules/app'
import { PlatformImageCode } from '@/01-kk-system/allHttp/models/common'
import { localImg } from '@/01-kk-system/allUtils/utils'
import { useChatStore } from '@/store/modules/chat'

defineOptions({
  name: 'HeaderCp',
})

const appStore = useAppStore()
const userStore = useUserStore()
const chatStore = useChatStore()

const logo = ref('')
const showConfirm = ref(false)

async function fetchAppLogo() {
  if (window.location.origin.includes('kk-template')) {
    logo.value = localImg('custom-images/app/logo.png')
    return
  }
  logo.value = await appStore.getAppLogoByCode(PlatformImageCode.H5_LOGO)
}

function onClickServer() {
  chatStore.openChat()
}

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

onBeforeMount(() => {
  fetchAppLogo()
})
</script>

<template>
  <div class="header h-44px w-full flex items-center justify-between px-1 px-3 text-#ffffff">
    <div class="w-100px flex items-center">
      <div class="min-w-40px flex items-center text-14px" @click="onLogout">
        <img class="mr-2 h-4" src="@/assets/images/new/logout-iocn.png" alt="">
        <span>{{ $t("system.i18nSystem.opration.logout") }}</span>
      </div>
    </div>
    <span>{{ $t('web.i18nFront.label.home') }}</span>
    <div class="w-100px flex items-center justify-end">
      <div class="h-8 w-8 flex-center rounded-full bg-#7d4444" @click="onClickServer">
        <img class="h-4" src="@/assets/images/new/server-icon.png" alt="">
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

<style lang="less" scoped>
.header {
  --van-button-primary-background: #f24f4b;
  --van-button-primary-border-color: #f24f4b;
  background: #5a0809;
}
html.dark .header {
  background: #31303a;
}
.header {
  :deep(.van-image__img) {
    width: auto;
  }
}
</style>
