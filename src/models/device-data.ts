import SensorReading, { Units } from './sensor-reading'

export interface DevicesDataResults {
  devicesData: DeviceData[]
}
export default class DeviceData {
  constructor(
    obj?: DeviceData,
    public mac: string = '',
    public type: string = '',
    public latestTimestamp: Date = new Date(),
    public sensorReadings: SensorReading[] = [],
    public buttonPressCounts: number[] = [],
    public lifetimeTxCount: number = 0,
    public firmwareVersion: string = '',
    public hardwareVersion: string = '',
    public lastConnectorMac: string = '',
  ) {
    if (!obj) return
    Object.assign(this, obj)
    this.sensorReadings = obj.sensorReadings.map((sr: SensorReading) => new SensorReading(sr.units, sr.value))
  }

  get voltage(): number {
    const sr = this.sensorReadings.find((sr) => sr.units === Units.volts)
    return sr?.value || 0
  }

  get otherReadings(): SensorReading[] {
    return this.sensorReadings.filter((sr) => sr.units !== Units.volts).sort((a, b) => a.units.localeCompare(b.units))
  }
}
