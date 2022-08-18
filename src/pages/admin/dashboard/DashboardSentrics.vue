<template>
  <div class="markup-tables flex">
    <va-card class="flex mb-4">
      <va-card-title>ZigBee Active List</va-card-title>
      <va-card-content>
        <div class="table-wrapper">
          <table class="va-table">
            <thead>
              <tr>
                <th>Hostname</th>
                <th>ZigBee MAC</th>
                <th>Node ID</th>
                <th>Interface</th>
                <th>Interface Address</th>
                <th>Wifi SSID</th>
                <th>Wifi Signal</th>
                <th>Age</th>
                <th>Uptime</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="device in activeDevices" :key="device.id">
                <td>{{ device.hostname }}</td>
                <td>{{ device.mac }}</td>
                <td>{{ device.nodeId }}</td>
                <td>{{ device.interface }}</td>
                <td>{{ device.address }}</td>
                <td>{{ device.ssid }}</td>
                <td>{{ device.signal }}</td>
                <td>{{ device.age }}</td>
                <td>{{ device.uptime }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </va-card-content>
    </va-card>

    <va-card>
      <va-card-title>ZigBee Inactive List</va-card-title>
      <va-card-content>
        <div class="table-wrapper">
          <table class="va-table va-table--striped va-table--hoverable">
            <thead>
              <tr>
                <th>Hostname</th>
                <th>ZigBee MAC</th>
                <th>Node ID</th>
                <th>Interface</th>
                <th>Interface Address</th>
                <th>Wifi SSID</th>
                <th>Wifi Signal</th>
                <th>Age</th>
                <th>Uptime</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="device in inactiveDevices" :key="device.id">
                <td>{{ device.hostname }}</td>
                <td>{{ device.mac }}</td>
                <td>{{ device.nodeId }}</td>
                <td>{{ device.interface }}</td>
                <td>{{ device.address }}</td>
                <td>{{ device.ssid }}</td>
                <td>{{ device.signal }}</td>
                <td>{{ device.age }}</td>
                <td>{{ device.uptime }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </va-card-content>
    </va-card>

    <!-- PIE GRAPHIC FOR TYPES OF ALARMS -->
    <!-- PIE GRAPHIC ALARMS CLOSED, CREATED, ETC -->
    <div class="row">
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
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useChartData } from '@/data/charts/composables/useChartData'
  import VaChart from '@/components/va-charts/VaChart.vue'

  // tables demo
  const activeDevicesData = [
    {
      id: 1,
      hostname: 'device-1',
      mac: '00:00:00:00:00:01',
      nodeId: '1',
      interface: 'wlan0',
      address: '192.168.101.10',
      ssid: 'ssid-1',
      signal: '-80',
      age: '1d',
      uptime: '1d',
    },
    {
      id: 2,
      hostname: 'device-2',
      mac: '00:00:00:00:00:02',
      nodeId: '2',
      interface: 'wlan0',
      address: '192.168.101.11',
      ssid: 'ssid-2',
      signal: '-80',
      age: '1d',
      uptime: '1d',
    },
    {
      id: 3,
      hostname: 'device-3',
      mac: '00:00:00:00:00:03',
      nodeId: '3',
      interface: 'wlan0',
      address: '192.168.101.12',
      ssid: 'ssid-3',
      signal: '-80',
      age: '1d',
      uptime: '1d',
    },
    {
      id: 4,
      hostname: 'device-4',
      mac: '00:00:00:00:00:04',
      nodeId: '4',
      interface: 'wlan0',
      address: '192.168.101.13',
      ssid: 'ssid-4',
      signal: '-80',
      age: '1d',
      uptime: '1d',
    },
    {
      id: 5,
      hostname: 'device-5',
      mac: '00:00:00:00:00:05',
      nodeId: '5',
      interface: 'wlan0',
      address: '192.168.101.14',
      ssid: 'ssid-5',
      signal: '-80',
      age: '1d',
      uptime: '1d',
    },
  ]
  const inactiveDevicesData = [
    {
      id: 6,
      hostname: 'device-6',
      mac: '00:00:00:00:00:06',
      nodeId: '6',
      interface: 'n/a',
      address: '192.168.101.15',
      ssid: 'ssid-6',
      signal: '-80',
      age: '1d',
      uptime: '1d',
    },
    {
      id: 7,
      hostname: 'device-7',
      mac: '00:00:00:00:00:07',
      nodeId: '7',
      interface: 'wlan0',
      address: '192.168.101.16',
      ssid: 'ssid-7',
      signal: '-80',
      age: '1d',
      uptime: '1d',
    },
    {
      id: 8,
      hostname: 'device-8',
      mac: '00:00:00:00:00:08',
      nodeId: '8',
      interface: 'wlan0',
      address: '192.168.101.17',
      ssid: 'ssid-8',
      signal: '-80',
      age: '1d',
      uptime: '1d',
    },
  ]
  const activeDevices = ref(activeDevicesData)
  const inactiveDevices = ref(inactiveDevicesData)

  // charts demo
  const supervisionsData = {
    labels: [
      'TX_TYPE_SUPERVISION',
      'SW_SUPERVISION_MISSED',
      'TX_TYPE_LOW_BATTERY',
      'TX_TYPE_LOW_BATTERY',
      'TX_TYPE_DRY_CONTACT_OPEN_1',
      'TX_TYPE_DRY_CONTACT_CLOSE_1',
    ],
    datasets: [
      {
        label: 'Types of Alarms',
        backgroundColor: ['primary', 'info', 'danger', 'success', 'warning', '#000000'],
        data: [144372, 6238, 4294, 21400, 19000, 12000],
      },
    ],
  }
  const alarmsData = {
    labels: ['Created', 'Opened', 'Closed', 'Conditions Cleared', 'Accepted', 'Disposition Added', 'Declined'],
    datasets: [
      {
        label: 'Events',
        backgroundColor: ['danger', 'info', 'primary', 'success', 'warning'],
        data: [1430, 1430, 1427, 991, 187, 14, 3],
      },
    ],
  }
  const supervisionsDataGenerated = useChartData(supervisionsData)
  const alarmsDataGenerated = useChartData(alarmsData)
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
