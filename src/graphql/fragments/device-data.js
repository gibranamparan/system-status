import { gql } from 'graphql-tag'

const DEVICE_DATA = gql`
  fragment device on Device {
    id
    name
    mac
    type: flavor
    sensorValues: sensors {
      voltage
      temperature
      humidity
      pressure
      luminosity
      updatedAt
    }
  }
`

// ** Pending to ADD
// latestTimestamp
// buttonPressCounts
// lifetimeTxCount
// firmwareVersion
// hardwareVersion
// lastConnectorMac

export { DEVICE_DATA }
