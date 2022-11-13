<template>
  <div class="markup-tables flex">
    <va-card>
      <va-card-title>Devices</va-card-title>
      <va-card-content>
        <div class="row">
          <va-input v-model="filter" class="flex mb-2 md6" placeholder="Filter..." />
        </div>
        <div class="row">
          <DeviceCard
            v-for="device in devicesData"
            :key="device.id || undefined"
            class="flex md"
            :model-value="device"
          />
        </div>
        <div class="table-wrapper">
          <va-data-table
            :items="devicesData"
            :columns="columns"
            :filter="filter"
            items-track-by="mac"
            hoverable
            striped
          >
            <template #cell(voltage)="{ source: voltage }">
              <span>{{ voltage }}</span>
            </template>
            <template #cell(sensorsReadings)="{ source: sensors }">
              <span>{{ sensors.temperature }}</span
              ><br />
              <span>{{ sensors.humidity }}</span
              ><br />
              <span>{{ sensors.pressure }}</span
              ><br />
              <span>{{ sensors.luminosity }}</span
              ><br />
            </template>
          </va-data-table>
        </div>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useQuery } from '@vue/apollo-composable'
  import SensorReading, { Units } from '@/models/sensors'
  import DeviceData, { DevicesDataResults } from '@/models/device-data'
  import { GET_DEVICES_DATA } from '@/graphql/queries/device-data'

  import DeviceCard from '@/components/device/device-card.vue'

  const { result } = useQuery<DevicesDataResults>(GET_DEVICES_DATA, null, {
    fetchPolicy: 'cache-and-network',
    // pollInterval: 1000
  })

  const devicesData = computed((): DeviceData[] => {
    return result?.value?.devices?.map((d) => new DeviceData(d)).filter((d) => d.sensorsReadings) || []
  })
  const columns = [
    { key: 'name', label: 'Device', sortable: true },
    { key: 'mac', label: 'MAC', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'voltage', label: 'voltage', sortable: true },
    { key: 'sensorsReadings', label: 'Other Sensor Readings' },
    { key: 'latestTimestamp', label: 'Latest Timestamp', sortable: true },
    // { key: 'buttonPressCounts', label: 'Button Press Counts', sortable: true },
    // { key: 'lastConnectorMac', label: 'Last Connector Mac', sortable: true },
    // { key: 'lifetimeTxCount', label: 'Lifetime Tx Count', sortable: true },
    // { key: 'firmwareVersion', label: 'Firmware Version', sortable: true },
    // { key: 'hardwareVersion', label: 'Hardware Version', sortable: true },
  ]
  const filter = ref('')
</script>
