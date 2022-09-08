<template>
  <div class="markup-tables flex">
    <va-card>
      <va-card-title>Devices</va-card-title>
      <va-card-content>
        <div class="row">
          <va-input v-model="filter" class="flex mb-2 md6" placeholder="Filter..." />
        </div>
        <div class="table-wrapper">
          <va-data-table :items="devicesData" :columns="columns" :filter="filter" items-track-by="mac" stripped>
            <template #cell(voltage)="{ source }">
              <span>{{ source.toFixed(3) }} V</span>
            </template>
            <!-- <template #cell(voltage)="{source, rowData}">
              <va-popover placement="right">
                <span>{{ source.toFixed(3) }} V</span>
                <template #title>
                  Other Readings
                </template>
                <template #body>
                  <template v-for="sr in rowData.otherReadings">
                    <span>{{sr.value.toFixed(3)}}</span> <b>{{sr.units}}</b><br>
                  </template>
                </template>
              </va-popover>
            </template> -->
            <template #cell(otherReadings)="{ source }">
              <template v-for="(sr, idx) in source" :key="idx">
                <span>{{ sr.value.toFixed(3) }}</span> <b>{{ sr.units }}</b
                ><br />
              </template>
            </template>
          </va-data-table>
        </div>
      </va-card-content>
    </va-card>
    <!-- <div class="row">
      <div class="flex md6 xs12">
        <va-card v-if="supervisionsDataGenerated" class="chart-widget">
          <va-card-title>Supervisions</va-card-title>
          <va-card-content>
            <va-chart :data="supervisionsDataGenerated" type="pie" />
          </va-card-content>
        </va-card>
      </div>

      <div class="flex md6 xs12">
        <va-card v-if="alarmsDataGenerated" class="chart-widget">
          <va-card-title>Alarm Events</va-card-title>
          <va-card-content>
            <va-chart :data="alarmsDataGenerated" type="doughnut" />
          </va-card-content>
        </va-card>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
  // import VaChart from '@/components/va-charts/VaChart.vue'
  import { ref, computed } from 'vue'
  // import { useChartData } from '@/data/charts/composables/useChartData'
  import { useQuery } from '@vue/apollo-composable'
  import gql from 'graphql-tag'
  import DeviceData from '@/models/device-data'

  const { result } = useQuery(
    gql`
      query getDevicesData {
        devicesData {
          mac
          latestTimestamp
          type
          sensorReadings {
            units
            value
          }
          buttonPressCounts
          lifetimeTxCount
          firmwareVersion
          hardwareVersion
          lastConnectorMac
        }
      }
    `,
    null,
    {
      fetchPolicy: 'cache-and-network',
    },
  )

  const devicesData = computed(() => result?.value?.devicesData.map((d: DeviceData) => new DeviceData(d)) || [])
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
  const filter = ref()

  /******************CHARTS DEMO*********************** */
  // const supervisionsData = {
  //   labels: [
  //     'TX_TYPE_SUPERVISION',
  //     'SW_SUPERVISION_MISSED',
  //     'TX_TYPE_LOW_BATTERY',
  //     'TX_TYPE_LOW_BATTERY',
  //     'TX_TYPE_DRY_CONTACT_OPEN_1',
  //     'TX_TYPE_DRY_CONTACT_CLOSE_1',
  //   ],
  //   datasets: [
  //     {
  //       label: 'Types of Alarms',
  //       backgroundColor: ['primary', 'info', 'danger', 'success', 'warning', '#000000'],
  //       data: [144372, 6238, 4294, 21400, 19000, 12000],
  //     },
  //   ],
  // }
  // const alarmsData = {
  //   labels: ['Created', 'Opened', 'Closed', 'Conditions Cleared', 'Accepted', 'Disposition Added', 'Declined'],
  //   datasets: [
  //     {
  //       label: 'Events',
  //       backgroundColor: ['danger', 'info', 'primary', 'success', 'warning'],
  //       data: [1430, 1430, 1427, 991, 187, 14, 3],
  //     },
  //   ],
  // }
  // const supervisionsDataGenerated = useChartData(supervisionsData)
  // const alarmsDataGenerated = useChartData(alarmsData)
</script>

<style lang="scss">
  .markup-tables {
    .table-wrapper {
      overflow: auto;
    }

    .va-table {
      width: 100%;
    }
  }
  .chart-widget {
    .va-card__content {
      height: 450px;
    }
  }
</style>
