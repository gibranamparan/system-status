<template>
  <va-card>
    <va-card-content>
      <div class="row">
        <va-input v-model="filter" class="flex mb-2 md6" placeholder="Filter device by name or mac..." />
      </div>
    </va-card-content>
  </va-card>
  <div class="row">
    <div v-for="device in devicesData" :key="device.id || undefined" class="flex md2">
      <DeviceCard class="item" :model-value="device" />
    </div>
  </div>
  <!-- <div class="markup-tables flex">
    <va-card>
      <va-card-content>
        <div class="table-wrapper">
          <va-data-table
            :items="devicesData"
            :columns="columns"
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
  </div> -->
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
    pollInterval: 2000,
  })

  const devicesData = computed((): DeviceData[] => {
    return (
      result?.value?.devices
        ?.map((d) => new DeviceData(d))
        .filter(
          (d) =>
            d.sensorsReadings &&
            (d.name?.toLowerCase().includes(filter.value.toLowerCase()) ||
              d.mac?.toLowerCase().includes(filter.value.toLowerCase())),
        )
        .sort((a, b) => a.name?.toLowerCase().localeCompare(b.name?.toLowerCase() || '') || 0) || []
    )
  })
  const columns = [
    { key: 'name', label: 'Device', sortable: true },
    { key: 'mac', label: 'MAC', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'voltage', label: 'voltage', sortable: true },
    { key: 'sensorsReadings', label: 'Other Sensor Readings' },
    { key: 'lastUpdateAtStr', label: 'Latest Timestamp', sortable: true },
  ]
  const filter = ref('')
</script>
