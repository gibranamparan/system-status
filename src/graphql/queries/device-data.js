import { gql } from 'graphql-tag'
import { DEVICE_DATA } from '../fragments/device-data'

const GET_DEVICES_DATA = gql`
  ${DEVICE_DATA}
  query GetDevicesData {
    devicesData {
      ...deviceData
    }
  }
`
export { GET_DEVICES_DATA }
