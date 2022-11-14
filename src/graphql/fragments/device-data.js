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
    hardwareInfo {
      deviceType
      hwVersion
      fwVersionMajor
      fwVersionMinor
      button1Presses
      button2Presses
      button3Presses
      lifetimeTxCount
      lastConnector
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
