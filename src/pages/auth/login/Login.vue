<template>
  <form @submit.prevent="onsubmit">
    <va-input
      v-model="email"
      class="mb-3"
      label="Username"
      :error="!!usernameErrors.length"
      :error-messages="usernameErrors"
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
  import { computed, ref, inject } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useGlobalStore } from '@/stores/global-store'
  import AuthService from '@/services/auth-service'

  const { t } = useI18n()
  const router = useRouter()
  const authService = inject<AuthService>('auth-service')

  // const keepLoggedIn = ref(false)
  const email = ref('')
  const password = ref('')
  const usernameErrors = ref<string[]>([])
  const passwordErrors = ref<string[]>([])
  const showLoginError = ref(false)
  const errorLoginMessage = ref('')

  const formReady = computed(() => !usernameErrors.value.length && !passwordErrors.value.length)

  async function onsubmit() {
    usernameErrors.value = email.value ? [] : ['Username is required']
    passwordErrors.value = password.value ? [] : ['Password is required']

    if (!formReady.value) return
    // If form is ready, send request to server
    if (email.value && password.value && authService) {
      const errorMsg = 'Something went wrong. Please try again, if persists, contact technical support.'
      const res = await authService.login(email.value, password.value)

      if (res.token) {
        // Authenticatation was successful
        showLoginError.value = false
        errorLoginMessage.value = ''

        //redirect to main page
        router.push({ name: 'devices' })
      } else {
        // other error
        showLoginError.value = true
        errorLoginMessage.value = res.message ?? errorMsg
        console.error(res)
      }
    }
  }
</script>
