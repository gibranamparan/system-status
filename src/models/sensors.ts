export enum Units {
  adc12bit = 'adc12bit',
  celcius = 'ºC',
  g = 'g',
  gauss = 'G',
  hPa = 'hPa',
  kelvin = 'K',
  lux = 'lux',
  percentRH = '%RH',
  volts = 'V',
}
export class SensorsValues {
  voltage: number | null = null
  temperature: number | null = null
  humidity: number | null = null
  pressure: number | null = null
  luminosity: number | null = null
  updatedAt: string | null = null
}
export class SensorReading {
  constructor(public value: number, public units: Units) {}

  toString(decimals = 3) {
    return `${this.value.toFixed(decimals)} ${this.units}`
  }
}
export default class Sensors {
  constructor(
    obj?: SensorsValues | null,
    public voltage: SensorReading | null = null,
    public temperature: SensorReading | null = null,
    public humidity: SensorReading | null = null,
    public pressure: SensorReading | null = null,
    public luminosity: SensorReading | null = null,
    public updatedAt: Date | null = null,
  ) {
    if (!obj) return
    Object.assign(this, obj)
    this.voltage = obj.voltage === null || isNaN(obj.voltage) ? null : new SensorReading(obj.voltage, Units.volts)
    this.temperature =
      obj.temperature === null || isNaN(obj.temperature) ? null : new SensorReading(obj.temperature, Units.kelvin)
    this.humidity =
      obj.humidity === null || isNaN(obj.humidity) ? null : new SensorReading(obj.humidity, Units.percentRH)
    this.pressure = obj.pressure === null || isNaN(obj.pressure) ? null : new SensorReading(obj.pressure, Units.hPa)
    this.luminosity =
      obj.luminosity === null || isNaN(obj.luminosity) ? null : new SensorReading(obj.luminosity, Units.lux)
    this.updatedAt = obj.updatedAt ? new Date(obj.updatedAt) : null
  }

  get updatedAtString(): string {
    return this.updatedAt ? `${this.updatedAt?.toDateString()}, ${this.updatedAt?.toLocaleTimeString()}` : ''
  }

  get timeSinceLastUpdate(): number {
    return this.updatedAt ? new Date().getTime() - this.updatedAt.getTime() : 0
  }

  get timeSinceLastUpdateStr(): string {
    const ms = this.timeSinceLastUpdate
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const years = Math.floor(days / 365)
    const s = seconds % 60
    const m = minutes % 60
    const h = hours % 24
    const d = days % 365
    const y = years

    let res = `${s}s`
    res = (m ? `${m}m ` : '') + res
    res = (h ? `${h}h ` : '') + res
    res = (d ? `${d}d ` : '') + res
    res = (y ? `${y}y ` : '') + res

    return res
  }

  get isOtherSensorsAvailable(): boolean {
    return this.temperature !== null || this.humidity !== null || this.pressure !== null || this.luminosity !== null
  }
}
