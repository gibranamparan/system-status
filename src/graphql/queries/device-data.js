import { gql } from 'graphql-tag'
import { DEVICE_DATA } from '../fragments/device-data'

const GET_DEVICES_DATA = gql`
  ${DEVICE_DATA}
  query GetDevicesData {
    devices {
      ...device
    }
  }
`
export { GET_DEVICES_DATA }
