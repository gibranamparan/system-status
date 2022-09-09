import { gql } from 'graphql-tag'

const DEVICE_DATA = gql`
  fragment deviceData on DeviceData {
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
`

export { DEVICE_DATA }
