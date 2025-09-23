<script setup lang="ts">
import { PlatformImageCode } from '@/01-kk-system/allHttp/models/common'
import { platformHttp } from '@/01-kk-system/allHttp/userHall/platform'
import { getDomainName, localImg } from '@/01-kk-system/allUtils/utils'
import { getUserLocalInfo, saveUserLocalInfo } from '@/04-kk-component-mobile/hooks/commonUtil'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'

defineOptions({
  name: 'LoginCp',
})

const userStore = useUserStore()
const appStore = useAppStore()
const router = useRouter()

const fromData = ref({
  userName: '',
  password: '',
})
const loading = ref(false)
const showPwd = ref(false)
const rememberPwd = ref(false)
const showTryGames = ref(false)
const regesterLink = ref('')
const showInviteBtn = ref(false)
const logo = ref('')

async function fetchInviteUrl() {
  const res = await platformHttp.inviteUrl()
  if (res?.code === '0') {
    const list = res?.data ?? []
    const currentDomainName = getDomainName()
    const target = list.find((item) => {
      const url = item.invitationURL ?? ''
      if (url && url.includes(currentDomainName)) {
        return url.startsWith('http')
      }
      return undefined
    })
    if (target) {
      regesterLink.value = target.invitationURL
    }
    else {
      regesterLink.value = list[0]?.invitationURL ?? ''
    }
  }
}

async function handleDiffConfig() {
  const diffConfig = await appStore.getDiffConfig()
  if (diffConfig?.SHOW_BUTTON_SHIWAN) {
    showTryGames.value = diffConfig?.SHOW_BUTTON_SHIWAN.value === '1'
  }
  else {
    showTryGames.value = true
  }
  if (diffConfig?.SHOW_BUTTON_ZHUCE) {
    showInviteBtn.value = diffConfig?.SHOW_BUTTON_ZHUCE.value === '1'
  }
  else {
    showInviteBtn.value = false
  }
}

function getLocalLoginInfo() {
  const localInfo = getUserLocalInfo()
  fromData.value.userName = localInfo?.userName ?? ''
  fromData.value.password = localInfo?.password ?? ''
  rememberPwd.value = !!localInfo?.userName
}

// 登录
async function onSubmit() {
  loading.value = true
  userStore
    .login(fromData.value)
    .then(() => {
      // 若记住密码，则本地存储, 否则删除本地信息
      if (rememberPwd.value) {
        saveUserLocalInfo(fromData.value)
      }
      else {
        saveUserLocalInfo(null)
      }
      setTimeout(() => {
        // eventEmitter.emit(REFRESH_AFTER_LOGIN)
        router.replace('/')
      }, 100)
    })
    .finally(() => {
      loading.value = false
    })
}

async function onVisitorLogin() {
  try {
    loading.value = true
    await userStore.guestLogin()
    setTimeout(() => {
      router.replace('/')
    }, 100)
  }
  catch (error) {
    console.error(error)
  }
  finally {
    loading.value = false
  }
}

async function fetchAppLogo() {
  if (window.location.origin.includes('kk-template')) {
    logo.value = localImg('custom-images/app/logo.png')
    return
  }
  logo.value = await appStore.getAppLogoByCode(PlatformImageCode.H5_LOGO)
}

onBeforeMount(() => {
  fetchAppLogo()
  getLocalLoginInfo()
  // 配置查询
  handleDiffConfig()
  // 查询注册链接
  fetchInviteUrl()
})
</script>

<template>
  <div class="login-container flex-center flex-col color-#ffffff">
    <div class="mb-10 flex-center">
      <van-image
        class="min-w-10"
        height="32"
        fit="contain"
        :src="logo"
      />
    </div>
    <van-form class="w-80%" @submit="onSubmit">
      <van-cell-group inset class="border border-#ffffff border-solid">
        <van-field
          v-model="fromData.userName"
          name="userName"
          autocomplete="off"
          left-icon="user"
          :placeholder="$t('system.i18nSystem.label.userName')"
          clearable
          :rules="[{ required: true, message: $t('system.i18nSystem.hint.needUseName') }]"
        />
      </van-cell-group>
      <van-cell-group inset icon="location-o" class="mt-4 border border-#ffffff border-solid">
        <van-field
          v-model="fromData.password"
          :type="showPwd ? 'text' : 'password'"
          name="password"
          autocomplete="off"
          left-icon="lock"
          clearable
          :placeholder="$t('system.i18nSystem.label.password')"
          :right-icon="showPwd ? 'closed-eye' : 'eye'"
          :rules="[{ required: true, message: $t('system.i18nSystem.message.password_required') }]"
          @click-right-icon="showPwd = !showPwd"
        />
      </van-cell-group>
      <div class="flex px-4 pt-3 text-sm color-#ffffff">
        <van-checkbox v-model="rememberPwd" icon-size="14" class="flex-1" style="--van-checkbox-label-color: #ffffff;--van-checkbox-checked-icon-color:#de190e;">
          <span>{{ $t('web.i18nFront.label.keepPwd') }}</span>
        </van-checkbox>
      </div>
      <div style="margin: 16px;">
        <van-button round block type="danger" native-type="submit" :loading="loading">
          {{ $t("system.i18nSystem.opration.login") }}
        </van-button>
        <van-button v-if="showTryGames" class="mt-3" round block :loading="loading" @click="onVisitorLogin">
          {{ $t("web.i18nFront.label.tryPlay") }}
        </van-button>
        <van-button v-if="showInviteBtn && regesterLink" class="mt-3" round block :loading="loading" :url="regesterLink">
          {{ $t("system.i18nSystem.opration.register") }}
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="less" scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  background-attachment: fixed;
  background: url('@/assets/images/new/login-bg.jpg') no-repeat top #fff;
  background-size: cover;
}
</style>
