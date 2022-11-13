<template>
  <va-card class="device-card">
    <va-card-title>
      <div>
        <h1 class="display-6">{{ device.name || device.mac }}</h1>
        <span v-if="device.name"></span>{{ device.mac }} - {{ device.type }}
      </div>
    </va-card-title>
    <va-card-content>
      <va-divider> </va-divider>
      <span>{{ device.voltage }}</span
      ><br />
      <span>{{ device.sensorsReadings?.temperature }}</span
      ><br />
      <span>{{ device.sensorsReadings?.humidity }}</span
      ><br />
      <span>{{ device.sensorsReadings?.pressure }}</span
      ><br />
      <span>{{ device.sensorsReadings?.luminosity }}</span
      ><br />
    </va-card-content>
  </va-card>
</template>
<script setup lang="ts">
  import DeviceData from '@/models/device-data'
  import { computed } from 'vue'

  const props = defineProps(['modelValue'])
  const device = computed<DeviceData>(() => props.modelValue)
</script>
<style scoped lang="scss">
  .device-card {
    .va-card__title {
      padding: 0.8rem 0.8rem 0;
    }
    .va-card__content {
      padding: 0 0.8rem 0.8rem;
    }
  }
</style>
