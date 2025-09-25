import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { noticeHttp } from '@/01-kk-system/allHttp/userHall/notice'

export function usePlatformNotice() {
  const loading = ref(false)
  const noticeList = ref<IObject[]>([])
  const currentNotice = ref<IObject>({})

  async function getNoticeList() {
    try {
      loading.value = true
      const res = await noticeHttp.getAllList('3').catch(() => null)
      const { code, data } = res || {}
      if (code === '0') {
        noticeList.value = data || []
        currentNotice.value = noticeList.value[0] || {}
      }
      loading.value = false
    }
    catch (error) {
      console.log(error)
    }
    finally {
      loading.value = false
    }
  }

  function onClickNotice(item: IObject) {
    currentNotice.value = item
  }

  onBeforeMount(() => {
    getNoticeList()
  })

  return {
    loading,
    noticeList,
    onClickNotice,
    currentNotice,
    getNoticeList,
  }
}
