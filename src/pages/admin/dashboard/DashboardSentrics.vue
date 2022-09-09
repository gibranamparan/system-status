<template>
  <div class="markup-tables flex">
    <va-card>
      <va-card-title>Devices</va-card-title>
      <va-card-content>
        <div class="row">
          <va-input v-model="filter" class="flex mb-2 md6" placeholder="Filter..." />
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
            <template #cell(voltage)="{ source }">
              <span>{{ source.toFixed(3) }} {{ SensorReading.unitsToStandardUnits(Units.volts) }}</span>
            </template>
            <template #cell(otherReadings)="{ source }">
              <template v-for="(sr, idx) in (source as SensorReading[])" :key="idx">
                <span>{{ sr.value.toFixed(3) }}</span> <b>{{ sr.standardUnits }}</b
                ><br />
              </template>
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
  import SensorReading, { Units } from '@/models/sensor-reading'
  import DeviceData, { DevicesDataResults } from '@/models/device-data'
  import { GET_DEVICES_DATA } from '@/graphql/queries/device-data'

  const { result } = useQuery<DevicesDataResults>(GET_DEVICES_DATA, null, {
    fetchPolicy: 'cache-and-network',
  })

  const devicesData = computed(() => {
    const res: Array<DeviceData> = result?.value?.devicesData.map((d) => new DeviceData(d)) || []
    // Generate test data adding some voltage readings.
    res.forEach((dd) => {
      // In case there are no voltage readings, we add one
      if (!dd.sensorReadings.find((sr) => sr.units === Units.volts)) {
        dd.sensorReadings.push(new SensorReading(Units.volts, Math.random() * 5))
      }
    })
    return res
  })
  const columns = [
    { key: 'mac', label: 'MAC', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'voltage', label: 'voltage', sortable: true },
    { key: 'otherReadings', label: 'Other Sensor Readings', sortable: true },
    { key: 'latestTimestamp', label: 'Latest Timestamp', sortable: true },
    { key: 'buttonPressCounts', label: 'Button Press Counts', sortable: true },
    { key: 'lastConnectorMac', label: 'Last Connector Mac', sortable: true },
    { key: 'lifetimeTxCount', label: 'Lifetime Tx Count', sortable: true },
    { key: 'firmwareVersion', label: 'Firmware Version', sortable: true },
    { key: 'hardwareVersion', label: 'Hardware Version', sortable: true },
  ]
  const filter = ref('')
</script>
