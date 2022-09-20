<template>
  <form @submit.prevent="onsubmit">
    <va-input
      v-model="email"
      class="mb-3"
      type="email"
      :label="t('auth.email')"
      :error="!!emailErrors.length"
      :error-messages="emailErrors"
      @keydown="showLoginError = false"
    />

    <va-input
      v-model="password"
      class="mb-3"
      type="password"
      :label="t('auth.password')"
      :error="!!passwordErrors.length"
      :error-messages="passwordErrors"
      @keydown="showLoginError = false"
    />
    <!-- 
    <div class="auth-layout__options d-flex align--center justify--space-between">
      <va-checkbox v-model="keepLoggedIn" class="mb-0" :label="t('auth.keep_logged_in')" />
      <router-link class="ml-1 link" :to="{ name: 'recover-password' }">{{ t('auth.recover_password') }}</router-link>
    </div> -->
    <div v-if="showLoginError" style="color: var(--va-danger)">{{ errorLoginMessage }}</div>

    <div class="d-flex justify--center mt-3">
      <va-button class="my-0" @click="onsubmit">{{ t('auth.login') }}</va-button>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAxios } from '@vueuse/integrations/useAxios'
  import { useCookies } from '@vueuse/integrations/useCookies'
  import { useI18n } from 'vue-i18n'
  import { useGlobalStore } from '@/stores/global-store'

  const GlobalStore = useGlobalStore()
  const { t } = useI18n()
  const router = useRouter()

  const { set: setUserCookies } = useCookies()

  // const keepLoggedIn = ref(false)
  const email = ref('testone')
  const password = ref('password')
  const emailErrors = ref<string[]>([])
  const passwordErrors = ref<string[]>([])
  const showLoginError = ref(false)
  const errorLoginMessage = ref('')

  const formReady = computed(() => !emailErrors.value.length && !passwordErrors.value.length)

  async function onsubmit() {
    if (!formReady.value) return

    emailErrors.value = email.value ? [] : ['Email is required']
    passwordErrors.value = password.value ? [] : ['Password is required']

    // If form is ready, send request to server
    if (email.value && password.value) {
      const auth_server_base = 'http://192.168.100.77:1234/192.168.100.77:8081/realms/sentrics'
      const { execute: getCheckToken } = useAxios(
        `${auth_server_base}/protocol/openid-connect/userinfo`,
        { method: 'GET' },
        { immediate: false },
      )
      const params = new URLSearchParams()
      params.append('username', email.value)
      params.append('password', password.value)
      params.append('grant_type', 'password')
      params.append('client_id', 'system-dashboard')

      const errorMsg = 'Something went wrong. Please try again, if persists, contact technical support.'
      const res = await useAxios(`/protocol/openid-connect/token`, {
        baseURL: auth_server_base,
        data: params,
        method: 'POST',
      })

      if (res.response.value?.status === 200) {
        // success
        showLoginError.value = false
        errorLoginMessage.value = ''

        //set user cookies
        const expiresIn = res.response.value?.data.expires_in
        const newToken = res.response.value?.data.access_token
        setUserCookies('access_token', newToken, { expires: expiresIn })

        // get user info from auth server and store it in global store
        const userInfoResponse = await getCheckToken({ headers: { Authorization: `Bearer ${newToken}` } })
        if (userInfoResponse.response.value?.status === 200) {
          const userName = userInfoResponse.response.value.data.name
          GlobalStore.changeUserName(userName)
        }

        //redirect to main page
        router.push({ name: 'devices' })
      } else if (res.error.value?.response?.status === 401) {
        // unauthorized
        showLoginError.value = true
        errorLoginMessage.value = res.error.value?.response?.data?.error_description || errorMsg
      } else {
        // other error
        showLoginError.value = true
        errorLoginMessage.value = errorMsg
        console.error(res)
      }
    }
  }
</script>
