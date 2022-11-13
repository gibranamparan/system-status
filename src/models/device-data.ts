import Sensors, { SensorReading, SensorsValues, Units } from './sensors'
export interface DevicesDataResults {
  devices: DeviceData[]
}
export default class DeviceData {
  private sensorValues: SensorsValues | null = null
  constructor(
    obj?: DeviceData,
    public id: string | null = null,
    public name: string | null = null,
    public mac: string | null = null,
    public type: string | null = null,
    public sensorsReadings: Sensors | null = null,
    public buttonPressCounts: number[] = [],
    public lifetimeTxCount: number = 0,
    public firmwareVersion: string | null = null,
    public hardwareVersion: string | null = null,
    public lastConnectorMac: string | null = null,
  ) {
    if (!obj) return
    Object.assign(this, obj)
    this.sensorsReadings = obj.sensorValues ? new Sensors(obj.sensorValues) : null
  }

  get voltage(): SensorReading | null {
    return this.sensorsReadings?.voltage ?? null
  }

  get latestTimestamp(): string {
    return this.sensorsReadings?.updatedAtString ?? 'n/a'
  }
}
