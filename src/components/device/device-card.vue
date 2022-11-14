<template>
  <va-card class="device-card">
    <va-card-title>
      <div>
        <h1>{{ device.name || device.mac }}</h1>
        <span>{{ device.type }}</span>
        <span v-if="device.name" style="color: var(--va-secondary)"> - {{ device.mac }}</span>
      </div>
    </va-card-title>
    <va-card-content>
      <!-- Hardware data -->
      <div class="row mt-1 hardware-data">
        <div class="flex md6">
          <b>Buttons: </b><br /><span>{{ device.hardwareInfo?.buttonPresses }}</span
          ><br />
          <b>LifetimeTx: </b><br /><span>{{ device.hardwareInfo?.lifetimeTxCount }}</span>
        </div>
        <div class="flex md6 text--center">
          <div class="led" :class="{ 'led-green': device.isActive }" :title="activeIndicatorMessage"></div>
          <va-icon :color="voltageAlertStyle.color" :name="voltageAlertStyle.icon" size="large"></va-icon>
          <div>{{ device.voltage }}</div>
        </div>
      </div>
      <template v-if="device.sensorsReadings?.isOtherSensorsAvailable">
        <div>
          <va-divider class="mt-3">
            <span>OTHER SENSORS</span>
          </va-divider>
          <div class="row">
            <div class="flex md6">
              <span>{{ device.temperatureCelcius }}</span> <br />
              <span>{{ device.sensorsReadings?.humidity }}</span> <br />
            </div>
            <div class="flex md6">
              <span>{{ device.sensorsReadings?.pressure }}</span> <br />
              <span>{{ device.sensorsReadings?.luminosity }}</span> <br />
            </div>
          </div>
        </div>
      </template>
      <div class="text--right device-versions mt-1 mb-2 mr-2">
        <span v-if="device.sensorsReadings?.timeSinceLastUpdateStr">
          {{ device.sensorsReadings?.timeSinceLastUpdateStr || 'n/a' }} ago
        </span>
        <br />
        <span>HW v{{ device.hardwareInfo?.hwVersion }}, FW v{{ device.hardwareInfo?.fwVersion }}</span>
      </div>
    </va-card-content>
  </va-card>
</template>
<script setup lang="ts">
  import DeviceData from '@/models/device-data'
  import { defaultInterpolate } from '@amcharts/amcharts5/.internal/core/util/Animation'
  import { computed } from 'vue'

  const props = defineProps(['modelValue'])
  const device = computed<DeviceData>(() => props.modelValue)
  const voltageAlertStyle = computed(() => {
    if (!device.value.voltage || device.value.voltage.value < 2)
      return {
        color: 'danger',
        icon: 'fa-battery-quarter',
      }
    else if (device.value.voltage.value < 3)
      return {
        color: 'warning',
        icon: 'fa-battery-half',
      }
    else
      return {
        color: 'success',
        icon: 'fa-battery-full',
      }
  })
  const activeIndicatorMessage = computed(() => {
    if (!device.value.isActive) return 'Device is inactive'

    return 'Last update: ' + device.value.sensorsReadings?.timeSinceLastUpdateStr
  })
</script>
<style scoped lang="scss">
  .va-card {
    height: 100%;
    min-height: 262px;
  }
  .va-card__title {
    padding: 0.8rem 0.8rem 0;
    h1 {
      color: var(--va-primary);
    }
  }
  .va-card__content {
    padding: 0 0.8rem 0.8rem;
    font-size: 0.8rem;
    .hardware-data {
      font-size: 0.95rem;
      .va-progress-circle {
        // width: 100%;
        // height: 60px;
        .va-progress-circle__content {
          font-size: 0.75rem;
        }
      }
    }
    .device-versions {
      position: absolute;
      bottom: 0;
      right: 0;
      color: var(--va-gray);
    }
  }

  .va-divider {
    font-weight: bold;
    color: var(--va-primary);
  }
  .led {
    margin: 10px auto;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    // box-shadow: #000 0 -1px 6px 1px;
  }
  .led-green {
    background-color: #80ff00;
    box-shadow: #000 0 -1px 6px 1px, inset #460 0 -1px 8px, #80ff00 0 3px 11px;
  }
</style>
