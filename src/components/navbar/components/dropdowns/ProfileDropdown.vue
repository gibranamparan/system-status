<template>
  <va-dropdown v-model="isShown" class="profile-dropdown" stick-to-edges placement="bottom" :offset="[13, 0]">
    <template #anchor>
      <span class="profile-dropdown__anchor">
        <slot />
        <va-icon class="px-2" :name="isShown ? 'angle_up' : 'angle_down'" :color="theme.secondary" />
      </span>
    </template>
    <va-dropdown-content class="profile-dropdown__content">
      <va-list-item v-for="option in options" :key="option.name" class="pa-2">
        <!-- <router-link :to="{ name: option.redirectTo }" class="profile-dropdown__item">
          {{ t(`user.${option.name}`) }}
        </router-link> -->
        <div class="profile-dropdown__item" @click="logout">
          {{ t(`user.${option.name}`) }}
        </div>
      </va-list-item>
    </va-dropdown-content>
  </va-dropdown>
</template>

<script setup lang="ts">
  import { computed, ref, inject } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useGlobalConfig } from 'vuestic-ui'
  import { useRouter } from 'vue-router'
  import AuthService from '@/services/auth-service'

  const authService = inject<AuthService>('auth-service')
  const router = useRouter()

  const { t } = useI18n()

  withDefaults(
    defineProps<{
      options?: { name: string; redirectTo: string }[]
    }>(),
    {
      options: () => [
        // {
        //   name: 'profile',
        //   redirectTo: '',
        // },
        {
          name: 'logout',
          redirectTo: 'login',
        },
      ],
    },
  )

  const isShown = ref(false)
  const theme = computed(() => useGlobalConfig().getGlobalConfig().colors!)

  const logout = () => {
    authService?.logout()
    router.push({ name: 'login' })
  }
</script>

<style lang="scss" scoped>
  .profile-dropdown {
    cursor: pointer;

    &__anchor {
      display: inline-block;
    }

    &__item {
      display: block;
      color: var(--va-gray);

      &:hover,
      &:active {
        color: var(--va-primary);
      }
    }
  }
</style>
