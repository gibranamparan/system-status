import Sensors, { SensorReading, SensorsValues, Units } from './sensors'
import HardwareInfo from './hardware-info'
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
    public hardwareInfo: HardwareInfo | null = null,
  ) {
    if (!obj) return
    Object.assign(this, obj)
    this.sensorsReadings = obj.sensorValues ? new Sensors(obj.sensorValues) : null
    this.hardwareInfo = obj.hardwareInfo ? new HardwareInfo(obj.hardwareInfo) : null
  }

  get voltage(): SensorReading | null {
    return this.sensorsReadings?.voltage ?? null
  }

  get temperatureCelcius(): SensorReading | null {
    if (!this.sensorsReadings) return null
    return new SensorReading((this.sensorsReadings.temperature?.value ?? 0) - 275.15, Units.celcius)
  }

  get isActive(): boolean {
    if (!this.sensorsReadings) return false

    // const MAX_ACTIVE_TIME = 4*60*60*1000 // 4 hours
    const MAX_ACTIVE_TIME = 32 * 60 * 1000 // 28 minutes
    return this.sensorsReadings.timeSinceLastUpdate < MAX_ACTIVE_TIME
  }
}
